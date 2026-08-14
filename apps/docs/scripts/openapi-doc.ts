import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// THE DOCUMENT.
//
// hanzoai/cloud `openapi.yaml` is the one description of the Hanzo API. The
// reference, the flow pages, the SDKs, the CLI and the MCP tools are all
// PROJECTIONS of it. Nothing about the API is written twice: if a page states
// an endpoint's behaviour, that prose came from here.
//
// This module is the only reader. It resolves the document into products and
// operations; every generator downstream consumes those values and never
// re-parses YAML or re-invents the product rule.

/**
 * Where the document is, and the release it is at — read from here, never
 * spelled again.
 *
 * Seven callers each carried their own `openapi-specs/<name>.yaml` literal.
 * When the reference stopped rendering hanzoai/openapi's projection and started
 * rendering cloud's document, one of those seven was edited; the other six kept
 * naming a file that no longer exists, and the build's own guard — "no page may
 * state an endpoint the document does not have" — was among them, so it threw
 * ENOENT instead of checking anything. A path that is a value has one place to
 * change; a path repeated is six chances to miss one.
 */
const SPECS = path.join(path.dirname(fileURLToPath(import.meta.url)), '../openapi-specs');
export const DOCUMENT = path.join(SPECS, 'openapi.yaml');

/** The cloud release the document was taken at, from `.spec-lock`. */
export const release = (): string => {
  try {
    const lock = fs.readFileSync(path.join(SPECS, '.spec-lock'), 'utf8');
    return (lock.match(/^ref=(.+)$/m)?.[1] ?? '').trim().slice(0, 9);
  } catch {
    return '';
  }
};

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
  /** Full operationId, e.g. `get_v1_tools`. */
  id: string;
  /**
   * The MCP door's tool name for this operation, which is the operationId
   * itself — see the note where it is computed.
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

/**
 * One class of API key, as the document states it at `/v1/keys`.
 *
 * The class name is the product's own noun — it is the literal a caller sends
 * as `{"type": …}` — and the prefix is what a key of that class is spelled
 * with. `publishable` is not a judgement made here; it is the class the product
 * NAMES publishable, which is the same word cloud's `PublishablePrefix` is
 * named after.
 */
export interface KeyType {
  /** The class as a caller names it: `secret`, `publishable`. */
  name: string;
  /** The spelling a key of this class carries: `sk-`, `pk-`. */
  prefix: string;
  /** What the document says the class is, verbatim from inside the parens. */
  note: string;
  /** True for the class the product calls publishable — the browser-safe one. */
  publishable: boolean;
}

export interface Document {
  title: string;
  version: string;
  description: string;
  server: string;
  securitySchemes: Record<string, any>;
  /** Every class of API key the document says `/v1/keys` mints — see keyTypes. */
  keys: KeyType[];
  /** Products docs.hanzo.ai publishes. Excludes `internal` — see isInternal. */
  products: Product[];
  /** The operator surface, grouped the same way. Never published publicly. */
  internal: Product[];
  /** EVERY operation the document serves, internal ones included. */
  operations: Operation[];
  byId: Map<string, Operation>;
  /** Operations whose product could not be resolved from the document. */
  unresolved: Operation[];
  /** Products with operations but no declared tag — nothing to write an intro from. */
  undeclared: Set<string>;
  raw: any;
}

/**
 * The operator surface: what a public docs site does not publish.
 *
 * The document declares one `admin` tag, and tag, product and `/v1/admin` path
 * prefix select the SAME 86 operations — so there is no heuristic here and no
 * substring matching. The product IS the predicate.
 *
 * One operation outside that product belongs with it, and it is named rather
 * than matched. `GET /v1/commerce/admin/catalog` is the catalogue projection
 * carrying upstream cost and margin, and its own description says PLATFORM
 * admin only: an org-level admin is refused 403 precisely so those economics
 * stay in. The tempting rule — hide any path containing `admin` — would also
 * have hidden `/v1/iam/admin/applications/upsert`, `/v1/iam/admin/provision`
 * and `/v1/iam/admin/users/upsert`, which are the ORG administrator's own API:
 * their prose is written in the second person ("a deployment can declare the
 * applications it needs", "driven by one of your own services"), they are how a
 * customer provisions declaratively, and they are customer-facing by design.
 * Hiding a customer's provisioning API to hide one margin report is a worse
 * error than the one being fixed.
 *
 * The real fix is upstream: an `x-internal` marker on the Go op would carry
 * this decision in the same place the endpoint is written. The document has no
 * such marker today — its only extension is `x-app`, on all 2305 operations —
 * so until it does, the one exception is spelled out here with its reason.
 */
const INTERNAL_PRODUCT = 'admin';
const INTERNAL_IDS = new Set(['get_v1_commerce_admin_catalog']);

export const isInternal = (op: Operation): boolean =>
  op.product === INTERNAL_PRODUCT || INTERNAL_IDS.has(op.id);

/**
 * The key a server presents: the one class that is NOT publishable.
 *
 * Every generated page that shows a curl or an env var shows this one, and each
 * used to spell it as a literal — three copies of a value the document states,
 * which is how three generated pages came to teach a prefix cloud has never
 * minted. Asking the document is one expression and cannot drift.
 */
export const secretKey = (doc: Document): KeyType =>
  doc.keys.find((k) => !k.publishable) ?? doc.keys[0];

/**
 * The document with the operator surface taken out, for publishing.
 *
 * `public/openapi/hanzo.yaml` ships in the static export and is what the
 * interactive reference at /reference renders, so filtering the generated pages
 * while copying the document whole would have left all 86 operations one URL
 * away — the pages hidden and the surface still public.
 */
export function publicDocument(doc: Document): any {
  const raw = structuredClone(doc.raw);
  const hidden = new Set(doc.internal.flatMap((p) => p.operations).map((o) => `${o.method} ${o.path}`));
  for (const [path, item] of Object.entries<any>(raw.paths ?? {})) {
    for (const method of METHODS) {
      if (item?.[method] && hidden.has(`${method} ${path}`)) delete item[method];
    }
    if (!METHODS.some((m) => item?.[m])) delete raw.paths[path];
  }
  // Only a product with nothing left to publish loses its tag. `commerce` has
  // one internal operation and 40-odd public ones, so its synopsis stays.
  const published = new Set(doc.products.map((p) => p.name));
  const gone = new Set(doc.internal.map((p) => p.name).filter((n) => !published.has(n)));
  if (Array.isArray(raw.tags)) {
    raw.tags = raw.tags.filter((t: any) => !gone.has(squash(String(t?.name ?? ''))));
  }
  return raw;
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

/**
 * The classes of API key, read out of the document rather than restated.
 *
 * `/v1/keys` IS the key resource: one endpoint, and the class is a field on it.
 * Its Go source spells each class beside its prefix — `"secret" (sk-, …)`,
 * `"publishable" (pk-, …)` — zipdoc lifts those doc comments into this
 * document, and this reads them back. So a page saying `sk-` is saying what the
 * handler says, one hop away, instead of what someone remembered.
 *
 * The pairs are read from EVERY description the key resource carries and the
 * readings must AGREE. Two doc comments state them today — the `type` field a
 * caller sends and the `type` field they read back — written in different words
 * at different places in cloud. Requiring agreement means a rename that lands in
 * one of them and not the other stops the build here rather than publishing two
 * answers.
 *
 * Refusing is the whole point of the exercise: an empty or contradictory reading
 * throws, because a docs build that quietly published no key types would be the
 * same failure — a reader who cannot learn which credential to ask for — wearing
 * a green checkmark.
 */
const KEY_CLASS = /"?\b([a-z][a-z-]{2,20})"?\s*\((([a-z]{2,6})-)([,)][^)]*)?\)/g;

export function keyTypes(raw: any): KeyType[] {
  const item = raw?.paths?.['/v1/keys'];
  if (!item) {
    // Every generated page prints a bearer credential, so none of them can be
    // written without knowing how one is spelled. Stopping here is the honest
    // failure; the alternative is a whole site of curls with a blank key.
    throw new Error('the document does not serve /v1/keys — no page can state how a key is spelled');
  }

  // Every sentence the key resource carries: its operations, their parameters,
  // and the schemas they send and return. Naming one schema would tie this to a
  // Go type name; walking what the path item reaches ties it to the resource.
  const said: string[] = [];
  const collect = (node: any, depth = 0) => {
    if (!node || typeof node !== 'object' || depth > 6) return;
    const d = deref(raw, node, 0);
    if (typeof d?.description === 'string') said.push(d.description);
    for (const v of Object.values(d)) if (v && typeof v === 'object') collect(v, depth + 1);
  };
  collect(item);

  // class -> prefix, and every reading of a class must give the same prefix.
  const seen = new Map<string, KeyType>();
  for (const text of said) {
    for (const m of text.replace(/\s+/g, ' ').matchAll(KEY_CLASS)) {
      const name = m[1];
      const prefix = `${m[3]}-`;
      const note = (m[4] ?? '').replace(/^[,)]\s*/, '').trim();
      const prior = seen.get(name);
      if (prior && prior.prefix !== prefix) {
        throw new Error(
          `the document spells the ${name} key both ${prior.prefix} and ${prefix} — cloud says it two ways`,
        );
      }
      // Keep the longest note: the same pair is stated tersely in one place and
      // with its reason in another, and the reason is the half worth publishing.
      if (!prior || note.length > prior.note.length) {
        seen.set(name, { name, prefix, note, publishable: name === 'publishable' });
      }
    }
  }

  const found = [...seen.values()];
  if (found.length < 2) {
    throw new Error(
      `/v1/keys names ${found.length} key class(es) — the document stopped stating them, so no page can`,
    );
  }
  if (!found.some((k) => k.publishable)) {
    throw new Error('no key class is named publishable — nothing may be shipped in a browser');
  }
  // Publishable last: a reader meets the default before the exception.
  return found.sort((a, b) => Number(a.publishable) - Number(b.publishable));
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
 *
 * AN HTTP METHOD IS NEVER A PRODUCT, and saying so is what this rule was missing.
 * A route outside `/v1/<product>` — `/.well-known/jwks`, `/{org}/{repo}/git-upload-pack`,
 * `/_/commerce/healthz` — is idded `get_well_known_jwks`, so its prefix is the
 * word `get`. The final fallback returned that prefix whether or not it named
 * anything, which minted six products called Get, Post, Put, Patch, Delete and
 * Options, each with a synopsis-less page and dozens of unrelated routes filed
 * under the verb they happen to use. The comment above already said the rule
 * does not invent a product; the code did, and only for the operations no tag
 * covers, which is exactly where nobody was looking.
 *
 * Refusing them sends those routes to `unresolved`, where the generator prints
 * them — one honest line naming what hanzoai/cloud must tag, instead of six
 * pages that look like products and are not.
 */
function resolveProduct(id: string, path: string, known: (s: string) => boolean): string | null {
  const prefix = id.includes('_') ? id.slice(0, id.indexOf('_')) : '';
  if (prefix && known(prefix)) return prefix;
  const seg = path.split('/').filter(Boolean);
  if (seg[0] === 'v1' && seg[1] && known(seg[1])) return seg[1];
  if (!prefix || (METHODS as readonly string[]).includes(prefix)) return null;
  return prefix;
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
        // The door's tool name IS the operationId. It was the id minus its own
        // first segment while hanzoai/openapi prefixed every id with the spec it
        // came from (`cloud_get_v1_tools`); one document needs no such
        // disambiguator and that prefix is gone, so the ids are bare. Measured
        // against the door's own tools/list: 802 of 833 names are the
        // operationId exactly, where stripping a segment resolves 89.
        name: id,
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

  /** The products, carrying only the operations that satisfy `keep`. */
  const group = (keep: (o: Operation) => boolean): Product[] =>
    [...byName.values()]
      .map((p) => ({ ...p, operations: p.operations.filter(keep) }))
      .filter((p) => p.operations.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

  const info = raw.info ?? {};
  return {
    title: String(info.title ?? 'Hanzo API'),
    version: String(info.version ?? ''),
    description: firstSentence(info.description ?? ''),
    server: raw.servers?.[0]?.url ?? 'https://api.hanzo.ai',
    securitySchemes: raw.components?.securitySchemes ?? {},
    keys: keyTypes(raw),
    // Only products the document actually serves operations for. A tag with no
    // operations is not a product page — it is a tag we have not filled in yet.
    //
    // The same grouping, read twice through one predicate: what a public site
    // publishes, and what it does not. `operations`, `byId` and `raw` stay
    // COMPLETE — an operation being unpublishable is not the same as it not
    // existing, and check-endpoints validates authored prose against `raw`.
    products: group((o) => !isInternal(o)),
    internal: group(isInternal),
    operations,
    byId,
    unresolved,
    undeclared,
    raw,
  };
}
