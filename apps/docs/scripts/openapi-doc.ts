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

const lock = (field: string): string => {
  try {
    const text = fs.readFileSync(path.join(SPECS, '.spec-lock'), 'utf8');
    return (text.match(new RegExp(`^${field}=(.+)$`, 'm'))?.[1] ?? '').trim();
  } catch {
    return '';
  }
};

/**
 * The lock names WHICH document, so the snapshot is called what it is.
 *
 * cloud emits two: `openapi.yaml`, everything the fleet serves, and
 * `public.yaml`, the customer contract. The lock's `path=` chose between them
 * for the fetch while the local copy stayed named `openapi.yaml` whatever it
 * held — a file whose name contradicts its contents, in the one place a reader
 * checks which document a page was built from. The name is read from the same
 * line the fetch reads, so there is one answer and no way to have two.
 */
export const DOCUMENT = path.join(SPECS, lock('path') || 'openapi.yaml');

/** The cloud release the document was taken at, from `.spec-lock`. */
export const release = (): string => lock('ref').slice(0, 9);

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
  /** The capability that serves this operation — its tag. See `capabilityOf`. */
  product: string;
  /** Full operationId, e.g. `get_v1_tools`. */
  id: string;
  /**
   * The MCP door's tool name for this operation, which is the operationId
   * itself — see the note where it is computed.
   */
  name: string;
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

/**
 * Named by ROUTE, not by operationId.
 *
 * This was `get_v1_commerce_admin_catalog`, and cloud then dropped the default
 * version from its ids — `_v1_` left 2011 of them in one release. The exception
 * stopped matching, and the one operation the estate holds back for carrying
 * upstream cost and margin went back to being published, quietly, on the next
 * pin bump. A route is the thing that exists; an id is a naming convention over
 * it, and conventions move.
 */
const INTERNAL_ROUTES = new Set(['get /v1/commerce/admin/catalog']);

export const isInternal = (op: Operation): boolean =>
  op.product === INTERNAL_PRODUCT || INTERNAL_ROUTES.has(`${op.method} ${op.path}`);

/**
 * WHERE AN OPERATION'S PAGE LIVES: its operationId, whole.
 *
 * The id is unique across the document — cloud mints one per route — so this
 * rule cannot collide, and it needs to know nothing about the capability the
 * page sits under.
 *
 * It used to drop the capability infix, so `get_ads_campaigns_by_id` under
 * `ads` became `get-campaigns-by-id`, on the reasoning that the URL already
 * spells `ads` once. That reasoning quietly assumed the id CONTAINS the
 * capability, which was true only while the capability was being derived from
 * the id. It is now the tag — the app that OWNS the route, which is not always
 * the word the address starts with — and the two differ on 485 of 2,284
 * operations. Dropping a segment that means something else merged `post_messages`
 * and `post_ai_messages` onto one page under `ai`, which is a lost page, not a
 * tidier URL.
 */
export const opSlug = (op: Operation): string =>
  op.id
    .replace(/_/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();

/** The operation's own page, under its product. */
export const opHref = (op: Operation): string => `/docs/openapi/${op.product}/${opSlug(op)}`;

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
    raw.tags = raw.tags.filter((t: any) => !gone.has(String(t?.name ?? '')));
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
 * The key resource is one endpoint and the class is a field on it.
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

/**
 * WHERE THE KEY RESOURCE IS: found, not spelled.
 *
 * This read `/v1/keys` literally, and cloud folded the address under the
 * capability that owns it — `/v1/account/keys` — so the whole build stopped on
 * a document that states the key classes perfectly well, one segment over. An
 * address is not an identity; that is the same lesson the capability rule
 * learned, and this was the last place still spelling one.
 *
 * The resource is identified by what it IS: a collection called `keys`, at the
 * root or one capability deep, whose own prose names the classes. Candidates are
 * read in order and the first that names a publishable class and at least two
 * classes wins — which is a property of the answer, so a neighbour like
 * `/v1/o11y/gateway/ingestion_keys` cannot be mistaken for it.
 */
const KEY_RESOURCE = /^\/v1\/(?:[a-z0-9-]+\/)?keys$/;

export function keyTypes(raw: any): KeyType[] {
  const candidates = Object.keys(raw?.paths ?? {}).filter((p) => KEY_RESOURCE.test(p)).sort();
  if (!candidates.length) {
    // Every generated page prints a bearer credential, so none of them can be
    // written without knowing how one is spelled. Stopping here is the honest
    // failure; the alternative is a whole site of curls with a blank key.
    throw new Error('the document serves no `keys` collection — no page can state how a key is spelled');
  }
  for (const at of candidates) {
    const found = readKeyTypes(raw, raw.paths[at]);
    if (found.length >= 2 && found.some((k) => k.publishable)) return found;
  }
  throw new Error(
    `none of ${candidates.join(', ')} names a publishable key class and a second one — ` +
      'the document stopped stating them, so no page can',
  );
}

function readKeyTypes(raw: any, item: any): KeyType[] {
  if (!item) return [];

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

  // Publishable last: a reader meets the default before the exception.
  // Whether this is ENOUGH — two classes, one of them publishable — is the
  // caller's question, because it is what decides which candidate is the key
  // resource at all.
  return [...seen.values()].sort((a, b) => Number(a.publishable) - Number(b.publishable));
}

/**
 * HOW A PRODUCT'S NAME IS WRITTEN.
 *
 * Capitalising the first letter is right for a word (`agents` -> `Agents`) and
 * wrong for an initialism: it published `Kms`, `Iam`, `Ai`, `Mq` and `O11y` as
 * the titles of the five products most often searched for by their initials.
 * Whether a name is a word or an initialism is not a property of its letters,
 * so it cannot be derived — it has to be stated.
 *
 * Its real home is the document: an OpenAPI tag may carry `x-displayName`, and
 * none of hanzo.yaml's 182 tags does. Until cloud writes them there, this is
 * the one place that knows, and every generator reads it through `Product.title`
 * rather than spelling a name of its own.
 */
const WRITTEN: Record<string, string> = {
  ai: 'AI',
  amqp: 'AMQP',
  api: 'API',
  cli: 'CLI',
  crm: 'CRM',
  csrf: 'CSRF',
  dns: 'DNS',
  gpus: 'GPUs',
  iam: 'IAM',
  k8s: 'K8s',
  kb: 'KB',
  kms: 'KMS',
  kv: 'KV',
  llm: 'LLM',
  mcp: 'MCP',
  ml: 'ML',
  mpc: 'MPC',
  mq: 'MQ',
  o11y: 'O11y',
  rag: 'RAG',
  rpc: 'RPC',
  s3: 'S3',
  sbom: 'SBOM',
  sdk: 'SDK',
  seo: 'SEO',
  seso: 'SESO',
  sql: 'SQL',
  ssh: 'SSH',
  x402: 'x402',
  zt: 'ZT',
};

/**
 * The other ways a capability's name can be spelled.
 *
 * cloud aliases a capability's singular and plural at the router, so both reach
 * it; only the canonical one is published. A projection pinned before a sweep
 * holds the other, so anything joining a projection to the document has to try
 * them — and has to try them CORRECTLY: `sandbox` pluralises to `sandboxes`,
 * not `sandboxs`, and getting that wrong reports a gap that does not exist,
 * which is a worse answer than no answer.
 *
 * Candidates, not one string, because which direction the sweep went is not
 * knowable here and does not need to be: the caller keeps whichever candidate
 * the document actually carries.
 */
export function spellings(name: string): string[] {
  const sibilant = /(?:s|x|z|ch|sh)$/.test(name);
  const out = [
    name.endsWith('es') ? name.slice(0, -2) : '',
    name.endsWith('s') ? name.slice(0, -1) : '',
    sibilant ? `${name}es` : `${name}s`,
  ];
  return out.filter((v) => v && v !== name);
}

/**
 * A PROJECTION'S name for a capability, resolved to the DOCUMENT'S name.
 *
 * The CLI's command table and the MCP door's tool list are each generated from
 * cloud at their own lock, so each can spell a capability the way cloud spelled
 * it then. When cloud swept its addresses to the singular, `hanzo sandboxes`
 * and the `sandboxes` tool went on saying `sandboxes` while the document said
 * `sandbox` — and every "API reference →" link those pages emit pointed at a
 * page that no longer exists.
 *
 * cloud answers at BOTH spellings, so the projections are not wrong, they are
 * early. What is wrong is publishing a link to a page nobody wrote. A name that
 * resolves to nothing returns undefined, and the caller says where the operation
 * lives instead of linking into a 404.
 *
 * This is a resolver, not a rename table: it holds no list of names and needs no
 * edit when the next sweep lands.
 */
export function canonical(doc: Document, name: string): string | undefined {
  const served = new Set(doc.products.map((p) => p.name));
  if (served.has(name)) return name;
  return spellings(name).find((v) => served.has(v));
}

/** The same address under the capability's other spellings. Only the capability
 *  segment moves; everything after it is that capability's own address space. */
export function aliases(p: string): string[] {
  const m = /^\/v1\/([a-z0-9]+)(\/.*)?$/.exec(p);
  if (!m) return [];
  const [, name, rest = ''] = m;
  return spellings(name).map((n) => `/v1/${n}${rest}`);
}

/** `agents` -> `Agents`; `kms` -> `KMS`; `Roles & Permissions` passes through. */
export const titleCase = (name: string): string =>
  WRITTEN[name.toLowerCase()] ??
  (/^[a-z]/.test(name) ? name[0].toUpperCase() + name.slice(1) : name);

const firstSentence = (s: string): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  const m = t.match(/^(.{0,220}?[.!?])(\s|$)/);
  return (m ? m[1] : t.slice(0, 220)).trim();
};

/**
 * The capability rule: THE TAG.
 *
 * An operation's tag is the capability that serves it — the app, one word, the
 * same word that names its Go package, its plugin binary, its client class, its
 * tool, its command group, its page and its HIP (HIP-0139). cloud states it
 * twice, as the tag and as `x-app`, and the two agree on all 2,284 operations.
 *
 * This used to be derived instead: the operationId's first segment, else the
 * `/v1/<seg>` path segment. Both are guesses about an ADDRESS, and an address is
 * not an owner — an app may answer at a route not named for it, which cloud
 * tracks in its own `openapi/misfiled.txt`. Measured on this document the guess
 * disagrees with the owner on 485 of 2,284 operations: 385 resolved to nothing
 * and were dropped from the site entirely, the rest filed under a neighbour's
 * name. The id branch never even fired — every id reads `<verb>_<app>_<rest>`,
 * so its first segment is `get` or `post`, which is why a rule had to be written
 * saying an HTTP method is not a product.
 *
 * Reading the tag deletes all of that: no parsing, no fallback, no verb
 * exception, no squash-matching a slug to a prose-cased name. A capability with
 * no page is now impossible, because the page is keyed by the thing the document
 * groups by.
 */
const capabilityOf = (op: any): string =>
  (Array.isArray(op?.tags) && typeof op.tags[0] === 'string' ? op.tags[0] : '').trim();

export function loadDocument(file: string): Document {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'));
  if (!raw?.paths) throw new Error(`${file}: not an OpenAPI document (no paths)`);

  /** Products the document serves but declares no tag for (so: no synopsis). */
  const undeclared = new Set<string>();

  const tags: any[] = Array.isArray(raw.tags) ? raw.tags : [];
  // ONE index. The tag name IS the slug — cloud emits capability names, which
  // are single lowercase words by construction (HIP-0139) — so there is nothing
  // to normalise and no second spelling for a page to be keyed by.
  const tagByName = new Map<string, any>(tags.map((t) => [t.name, t]));

  const byName = new Map<string, Product>();
  const product = (slug: string): Product => {
    let p = byName.get(slug);
    if (p) return p;
    const t = tagByName.get(slug);
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
      const product_ = capabilityOf(op);

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
        product: product_,
        id,
        // The door's tool name IS the operationId. It was the id minus its own
        // first segment while hanzoai/openapi prefixed every id with the spec it
        // came from (`cloud_get_v1_tools`); one document needs no such
        // disambiguator and that prefix is gone, so the ids are bare. Measured
        // against the door's own tools/list: 802 of 833 names are the
        // operationId exactly, where stripping a segment resolves 89.
        name: id,
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

  // \0 as the separator, written as the ESCAPE and not as the byte: a literal
  // NUL in the source makes the whole file read as binary, so `grep` skips it
  // silently and a diff shows "Binary files differ" instead of the change.
  // Same value at run time, and the file stays text.
  const order = (o: Operation) => `${o.tag}\0${o.path}\0${METHODS.indexOf(o.method)}`;
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
