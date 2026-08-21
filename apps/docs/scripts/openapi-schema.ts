import { deref } from './openapi-doc';

// ENUMERATING A SCHEMA.
//
// A reference states every field, not a selection of them: name, type, whether
// it is required, its default, its enum values, its prose. This module is the
// one place that turns an OpenAPI schema into that list, so the request table,
// the response table and anything downstream all count the same fields the same
// way — and a nested object is enumerated rather than summarised as "object".
//
// Nesting is expressed in the NAME, not in a second table: `messages[].role` is
// one row. That keeps the page a flat, greppable list at every depth, which is
// what a reader scanning for one field actually needs.

export interface Field {
  /** Dotted path from the schema root — `messages[].role`, `metadata.*`. */
  name: string;
  /** Rendered type: `string`, `integer (int64)`, `Message[]`, `string | null`. */
  type: string;
  required: boolean;
  /** The declared default, JSON-encoded; empty when the document declares none. */
  default: string;
  /** Every declared enum value, JSON-encoded. Never truncated. */
  enum: string[];
  description: string;
  /** Nesting depth, 0 for a root-level field. Renderers may indent by it. */
  depth: number;
}

/**
 * A guard, not a policy.
 *
 * Recursion already terminates on its own: `walk` carries the schema nodes on
 * the current path and refuses to re-enter one, so a `$ref` cycle unrolls
 * exactly once. This cap only stops a pathological document from running the
 * build out of memory, and it is set well clear of the real one — nothing in
 * hanzo.yaml nests past five, which `openapi-reference.test.ts` asserts, so a
 * document that ever reaches the cap fails a test rather than quietly
 * summarising the fields past it.
 */
export const MAX_DEPTH = 12;

const scalar = (v: unknown): string =>
  typeof v === 'string' ? v : JSON.stringify(v ?? null);

/**
 * The rendered type of a schema node, `$ref` name preserved.
 *
 * `deref` resolves a `$ref` to its target, which loses the name a reader
 * recognises (`Message`, not `object`), so the ref is read BEFORE resolving.
 */
export function typeName(raw: any, node: any, depth = 0): string {
  if (!node || typeof node !== 'object' || depth > MAX_DEPTH) return '';
  if (typeof node.$ref === 'string') {
    const name = node.$ref.split('/').pop() ?? '';
    // A `$ref` to a plain box (`type: string`) reads better as its type.
    const target = deref(raw, node);
    const t = Array.isArray(target?.type) ? target.type[0] : target?.type;
    if (t && t !== 'object' && t !== 'array' && !target?.properties) {
      return typeName(raw, target, depth + 1);
    }
    return name;
  }
  const s = node;
  const of = s.oneOf ?? s.anyOf;
  if (Array.isArray(of) && of.length) {
    return of.map((b: any) => typeName(raw, b, depth + 1) || 'object').join(' | ');
  }
  if (Array.isArray(s.allOf) && s.allOf.length) {
    return s.allOf.map((b: any) => typeName(raw, b, depth + 1)).find(Boolean) || 'object';
  }
  const t = Array.isArray(s.type) ? s.type.join(' | ') : s.type;
  if (t === 'array' || s.items) return `${typeName(raw, s.items, depth + 1) || 'any'}[]`;
  const base = t || (s.properties || s.additionalProperties ? 'object' : '');
  const withFormat = base && s.format ? `${base} (${s.format})` : base;
  return s.nullable && withFormat ? `${withFormat} | null` : withFormat;
}

interface Ctx {
  raw: any;
  out: Field[];
  /** Schema nodes on the current path — a `$ref` cycle must not recurse forever. */
  seen: Set<any>;
}

function push(ctx: Ctx, name: string, node: any, required: boolean, depth: number): void {
  const s = deref(ctx.raw, node) ?? {};
  const enumValues: unknown[] = Array.isArray(s.enum)
    ? s.enum
    : Array.isArray(s.items?.enum)
      ? s.items.enum
      : [];
  ctx.out.push({
    name,
    type: typeName(ctx.raw, node) || 'any',
    required,
    default: s.default === undefined ? '' : scalar(s.default),
    enum: enumValues.map(scalar),
    description: String(s.description ?? s.title ?? '').replace(/\s+/g, ' ').trim(),
    depth,
  });
}

/**
 * Walk INTO a node, emitting a row per field beneath it.
 *
 * `allOf` is a merge, so its branches contribute their fields to the same path.
 * `oneOf`/`anyOf` are alternatives: every branch's fields are emitted at the
 * same path — a reader has to see all of them to know what may be sent — and
 * duplicate rows are dropped so a shared field appears once.
 */
function walk(ctx: Ctx, node: any, prefix: string, depth: number): void {
  const s = deref(ctx.raw, node);
  if (!s || typeof s !== 'object' || depth > MAX_DEPTH || ctx.seen.has(s)) return;
  ctx.seen.add(s);
  try {
    for (const branch of [...(s.allOf ?? []), ...(s.oneOf ?? []), ...(s.anyOf ?? [])]) {
      walk(ctx, branch, prefix, depth);
    }
    if (s.items) {
      walk(ctx, s.items, `${prefix}[]`, depth);
      return;
    }
    const required = new Set<string>(Array.isArray(s.required) ? s.required : []);
    for (const [key, child] of Object.entries<any>(s.properties ?? {})) {
      const name = prefix ? `${prefix}.${key}` : key;
      push(ctx, name, child, required.has(key), depth);
      walk(ctx, child, name, depth + 1);
    }
    const extra = s.additionalProperties;
    if (extra && extra !== true && typeof extra === 'object') {
      const name = prefix ? `${prefix}.*` : '*';
      push(ctx, name, extra, false, depth);
      walk(ctx, extra, name, depth + 1);
    } else if (extra === true) {
      ctx.out.push({
        name: prefix ? `${prefix}.*` : '*',
        type: 'any',
        required: false,
        default: '',
        enum: [],
        description: 'Free-form keys — the document declares no schema for them.',
        depth,
      });
    }
  } finally {
    ctx.seen.delete(s);
  }
}

/**
 * Every field of a schema, in document order, nesting flattened into the name.
 *
 * A schema that is not an object — a bare string, or an array of them — has no
 * fields to list; it is returned as a single row named `rootName` so the page
 * still states its type instead of printing an empty table.
 */
export function fields(raw: any, schema: any, rootName = '(body)'): Field[] {
  const s = deref(raw, schema);
  if (!s || typeof s !== 'object') return [];
  const ctx: Ctx = { raw, out: [], seen: new Set() };
  walk(ctx, schema, '', 0);
  // Same field reached twice (a `oneOf` where both branches declare it, an
  // `allOf` that repeats a base property): keep the first, which is the one the
  // document declares first.
  const seen = new Set<string>();
  const rows = ctx.out.filter((f) => (seen.has(f.name) ? false : (seen.add(f.name), true)));
  if (rows.length) return rows;
  return [
    {
      name: rootName,
      type: typeName(raw, schema) || 'any',
      required: true,
      default: s.default === undefined ? '' : scalar(s.default),
      enum: Array.isArray(s.enum) ? s.enum.map(scalar) : [],
      description: String(s.description ?? '').replace(/\s+/g, ' ').trim(),
      depth: 0,
    },
  ];
}
