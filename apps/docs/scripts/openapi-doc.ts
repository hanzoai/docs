import fs from 'node:fs';
import { parse as parseYaml } from 'yaml';

// THE DOCUMENT.
//
// hanzoai/openapi `hanzo.yaml` is the one description of the Hanzo API. The
// reference, the flow pages, the SDKs, the CLI and the MCP tools are all
// PROJECTIONS of it. Nothing about the API is written twice: if a page states
// an endpoint's behaviour, that prose came from here.
//
// This module is the only reader. It resolves the document into products and
// operations; every generator downstream consumes those values and never
// re-parses YAML or re-invents the product rule.

export const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'] as const;
export type Method = (typeof METHODS)[number];

export interface Param {
  name: string;
  in: string;
  required: boolean;
  description: string;
  schema: any;
}

export interface Body {
  required: boolean;
  contentType: string;
  schema: any;
}

export interface Operation {
  /** Product this page groups the operation under: its tag, else `/v1/<seg>`. */
  product: string;
  /** Full operationId, e.g. `ai_createChatCompletion`. */
  id: string;
  /**
   * operationId minus its OWN first segment, e.g. `createChatCompletion` from
   * `ai_createChatCompletion`. This is the MCP door's tool-naming rule, and it
   * is not always `product`-relative — see the note where it is computed.
   */
  name: string;
  /** The operation's own tag — a section heading within its product. */
  tag: string;
  method: Method;
  path: string;
  summary: string;
  description: string;
  parameters: Param[];
  body?: Body;
  /** Success response schema, `$ref`s resolved one level. */
  success?: { status: string; description: string; schema?: any };
  deprecated: boolean;
}

export interface Product {
  /** Slug used in URLs and as the operationId prefix. */
  name: string;
  /** Human title — the tag's `x-displayName`, else its name title-cased. */
  title: string;
  /**
   * The owning package's doc synopsis, straight from the document's tag —
   * empty when the document serves the product but declares no tag for it.
   */
  description: string;
  operations: Operation[];
}

export interface Document {
  title: string;
  version: string;
  description: string;
  server: string;
  securitySchemes: Record<string, any>;
  products: Product[];
  operations: Operation[];
  byId: Map<string, Operation>;
  /** Operations whose product could not be resolved from the document. */
  unresolved: Operation[];
  /** Products with operations but no declared tag — nothing to write an intro from. */
  undeclared: Set<string>;
  raw: any;
}

/** Resolve a `$ref` against the document. Non-refs pass through. */
export function deref(raw: any, node: any, depth = 0): any {
  if (!node || typeof node !== 'object' || depth > 8) return node;
  const ref = node.$ref;
  if (typeof ref !== 'string' || !ref.startsWith('#/')) return node;
  let cur: any = raw;
  for (const seg of ref.slice(2).split('/')) {
    cur = cur?.[seg.replace(/~1/g, '/').replace(/~0/g, '~')];
    if (cur == null) return node;
  }
  return deref(raw, cur, depth + 1);
}

/** `agents` -> `Agents`; `Roles & Permissions` and `MFA` pass through. */
const titleCase = (name: string): string =>
  /^[a-z]/.test(name) ? name[0].toUpperCase() + name.slice(1) : name;

const firstSentence = (s: string): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(.{0,220}?[.!?])(\s|$)/);
  return (m ? m[1] : t.slice(0, 220)).trim();
};

/**
 * The product rule, in exactly one place.
 *
 * Every operation in the document is `<product>_<name>`, and every prefix is a
 * top-level tag carrying that product's synopsis. Where an operationId is
 * malformed we fall back to the `/v1/<product>` path segment rather than
 * inventing a product — and if neither resolves, the operation is reported as
 * unresolved instead of being silently dropped.
 */
function resolveProduct(id: string, path: string, known: (s: string) => boolean): string | null {
  const prefix = id.includes('_') ? id.slice(0, id.indexOf('_')) : '';
  if (prefix && known(prefix)) return prefix;
  const seg = path.split('/').filter(Boolean);
  if (seg[0] === 'v1' && seg[1] && known(seg[1])) return seg[1];
  return prefix || null;
}

/**
 * Product slugs are lowercase (`webhooks`, `pubsub`) because they come from an
 * operationId prefix or a path segment; tag names are prose-cased (`Webhooks`,
 * `Pub/Sub`). Matching them exactly stranded 16 packages' synopses on tags no
 * page was keyed by. Compare on the squashed form so the prose finds its page,
 * while the slug — and therefore the URL — stays the lowercase one.
 */
const squash = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function loadDocument(file: string): Document {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  if (!raw?.paths) throw new Error(`${file}: not an OpenAPI document (no paths)`);

  /** Products the document serves but declares no tag for (so: no synopsis). */
  const undeclared = new Set<string>();

  const tags: any[] = Array.isArray(raw.tags) ? raw.tags : [];
  // TWO indexes, deliberately not one. Resolution matches tag names EXACTLY;
  // squash-matching there would let the woven document's `cloud_` prefix claim
  // a `Cloud` tag and swallow every path-derived product with it (132 products
  // collapsed to 29). Squashing is only for finding a slug's prose.
  const tagByName = new Map<string, any>(tags.map((t) => [t.name, t]));
  const tagBySquash = new Map<string, any>();
  for (const t of tags) if (!tagBySquash.has(squash(t.name))) tagBySquash.set(squash(t.name), t);
  const known = (s: string) => tagByName.has(s);

  // Products are created on demand, keyed by SLUG. Pre-seeding one per tag
  // would mint a second page for every tag whose name only squash-matches a
  // slug (`Webhooks` beside `webhooks`).
  const byName = new Map<string, Product>();
  const product = (slug: string): Product => {
    let p = byName.get(slug);
    if (p) return p;
    const t = tagByName.get(slug) ?? tagBySquash.get(squash(slug));
    if (!t) undeclared.add(slug);
    p = {
      name: slug,
      // The tag NAME is the product's identity; its description is a synopsis,
      // not a heading ("Package agents is autonomous agents for your org: …").
      // Using the description's first line as a title turned whole sentences
      // into page titles once the document gained product-voice prose.
      title: String(t?.['x-displayName'] ?? '').trim() || titleCase(t?.name ?? slug),
      description: String(t?.description ?? '').trim(),
      operations: [],
    };
    byName.set(slug, p);
    return p;
  };

  const operations: Operation[] = [];
  const unresolved: Operation[] = [];
  const byId = new Map<string, Operation>();

  for (const [path, item] of Object.entries<any>(raw.paths)) {
    if (!item || typeof item !== 'object') continue;
    const shared = Array.isArray(item.parameters) ? item.parameters : [];
    for (const method of METHODS) {
      const op = item[method];
      if (!op || typeof op !== 'object') continue;

      const id = String(op.operationId ?? '');
      const product_ = resolveProduct(id, path, known);

      const parameters: Param[] = [...shared, ...(op.parameters ?? [])]
        .map((p) => deref(raw, p))
        .filter((p) => p?.name)
        .map((p) => ({
          name: p.name,
          in: p.in ?? 'query',
          required: Boolean(p.required),
          description: String(p.description ?? '').trim(),
          schema: deref(raw, p.schema),
        }));

      const rb = deref(raw, op.requestBody);
      const contentType = rb?.content ? Object.keys(rb.content)[0] : undefined;
      const body: Body | undefined = contentType
        ? {
            required: Boolean(rb.required),
            contentType,
            schema: deref(raw, rb.content[contentType]?.schema),
          }
        : undefined;

      const okStatus = Object.keys(op.responses ?? {}).find((s) => s.startsWith('2'));
      const okRaw = okStatus ? deref(raw, op.responses[okStatus]) : undefined;
      const okCt = okRaw?.content ? Object.keys(okRaw.content)[0] : undefined;

      const resolved: Operation = {
        product: product_ ?? '',
        id,
        // The id's OWN prefix, not the product it is grouped under. These
        // differ: `cloud_get_v1_tools` is grouped under `tools` (its path) but
        // its name is `get_v1_tools`. The MCP door names tools by this rule —
        // 729 of its 730 names are exactly it — so it must not be conflated
        // with page grouping.
        name: id.includes('_') ? id.slice(id.indexOf('_') + 1) : id,
        tag: (Array.isArray(op.tags) && op.tags[0]) || product_ || 'General',
        method,
        path,
        summary: String(op.summary ?? '').replace(/\s+/g, ' ').trim(),
        description: String(op.description ?? '').trim(),
        parameters,
        body,
        success: okStatus
          ? {
              status: okStatus,
              description: String(okRaw?.description ?? '').trim(),
              schema: okCt ? deref(raw, okRaw.content[okCt]?.schema) : undefined,
            }
          : undefined,
        deprecated: Boolean(op.deprecated),
      };

      operations.push(resolved);
      if (id) byId.set(id, resolved);

      if (product_) product(product_).operations.push(resolved);
      else unresolved.push(resolved);
    }
  }

  const order = (o: Operation) => `${o.tag} ${o.path} ${METHODS.indexOf(o.method)}`;
  for (const p of byName.values()) p.operations.sort((a, b) => order(a).localeCompare(order(b)));

  const info = raw.info ?? {};
  return {
    title: String(info.title ?? 'Hanzo API'),
    version: String(info.version ?? ''),
    description: firstSentence(info.description ?? ''),
    server: raw.servers?.[0]?.url ?? 'https://api.hanzo.ai',
    securitySchemes: raw.components?.securitySchemes ?? {},
    // Only products the document actually serves operations for. A tag with no
    // operations is not a product page — it is a tag we have not filled in yet.
    products: [...byName.values()]
      .filter((p) => p.operations.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name)),
    operations,
    byId,
    unresolved,
    undeclared,
    raw,
  };
}
