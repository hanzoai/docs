import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DOCUMENT,
  isInternal,
  loadDocument,
  release,
  secretKey,
  type Document,
  type Operation,
} from './openapi-doc';
import { toolOperations } from './openapi-surfaces';
import { load, MCP_DOOR, ops as doorOps, readOp, type McpCatalog, type McpTool } from './sync-mcp-tools';
import { code, fence, firstSentence, prose, text, yamlString } from './mdx';

// THE MCP REFERENCE, generated from the door.
//
// `POST /v1/mcp` is the agent-facing surface of the cloud: a JSON-RPC 2.0
// endpoint whose `tools/list` names every tool an MCP client can call. This
// script renders one page per tool — the door's own description, its whole
// declared argument schema as a table, the operation it dispatches to, and a
// `tools/call` envelope built from that same schema.
//
// Nothing here is written about a tool. Every sentence on a tool page came off
// the wire in `tools/list`, exactly as the API reference comes off the document.
// The one authored page is `index.mdx`, which explains what the door IS and how
// to point a client at it — a concept, not a signature.
//
// The tool list is VENDORED (openapi-specs/mcp-tools.json) by sync-mcp-tools,
// so this render never touches the network. A build with no egress produces the
// same pages from the committed copy, and says so.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
// This reference joins a LIVE door against a PINNED document, so the two can
// legitimately disagree — a route the door has renamed since the pin resolves
// to no operation. Pages that report such a tool name the release, so the
// reader can tell "the document does not describe this" from "the copy we hold
// does not describe this yet". The release is `.spec-lock`'s, the cloud commit
// the document was taken at; it used to be a pin on the projection this
// reference stopped reading.
const rel = release();
const pinned = rel ? ` (pinned at \`${rel}\`)` : '';
const OUT_DIR = path.join(APP_ROOT, 'content/docs/mcp-tools');

/** The client command that registers the door, over its streamable HTTP transport. */
const ADD_COMMAND = `claude mcp add --transport http hanzo-cloud ${MCP_DOOR}`;

/** Slugs this section spends on its own pages, so no product folder may take them. */
const RESERVED = new Set(['index', 'all-tools']);

/** Slugs a product folder spends on its own files, so no tool page may take them. */
const RESERVED_PAGE = new Set(['index', 'meta']);

/**
 * What a name is published as when it is one a container has already spent.
 * Two halves of one rule: the RESERVED sets say which slugs are taken, this says
 * what to publish instead — so the next collision is a line of data, not a
 * change to the code below.
 *
 * `index` is both a product and the tool that covers it, and `index` is what a
 * section and a folder each call their own landing page. It manages indexes
 * (`/v1/index/indexes`), so the plural is the product's own noun and not a
 * suffix invented to dodge the clash.
 */
const SLUG = new Map([['index', 'indexes']]);

/** The slug a product or tool is published under. */
export const slugOf = (name: string): string => SLUG.get(name) ?? name;

/** The one place that knows the shape of a URL in this section. */
const productHref = (product: string): string => `/docs/mcp-tools/${slugOf(product)}`;
const toolHref = (product: string, tool: string): string => `${productHref(product)}/${slugOf(tool)}`;

// ------------------------------------------------------------------ schema

/** A `$ref` into the tool's own `$defs`, as the door writes them. */
const refName = (r: unknown): string =>
  typeof r === 'string' && r.startsWith('#/$defs/') ? r.slice('#/$defs/'.length) : '';

/**
 * A field's type as the door declares it — and only as the door declares it.
 * A node with no `type` is printed as such rather than guessed at.
 */
function typeOf(node: any): string {
  if (!node || typeof node !== 'object') return '—';
  const ref = refName(node.$ref);
  if (ref) return ref;
  const t = Array.isArray(node.type) ? node.type.join(' \\| ') : node.type;
  if (t === 'array') {
    const inner = node.items ? typeOf(node.items) : '';
    return inner && inner !== '—' ? `${inner}[]` : 'array';
  }
  if (t === 'object' || (!t && node.properties)) return 'object';
  if (!t) return 'any';
  return String(t);
}

// ------------------------------------------------------- the two declarations
//
// A tool argument is declared TWICE, and neither declaration is complete.
//
//   the door      names the field, gives it a type and usually a description,
//                 and says nothing else — measured across the whole catalogue,
//                 not one tool marks a field required, carries a default, or
//                 enumerates a value set.
//   the document  declares the same field on the operation the tool dispatches
//                 to, WITH whether it is required, its enumerated values, its
//                 default and its format — because that is what the REST API
//                 validates against.
//
// A reference that prints only the door's half leaves an empty Required column
// on every field the API will reject the call without — hundreds of them. So
// the two are joined here: shape from the door, constraints from the document,
// and every page states which column came from which. Nothing is inferred — a
// field with no answer in either source prints `—`.

/** `a, b and c` — a list read as a sentence, since these lists are computed. */
const conjoin = (xs: string[]): string =>
  xs.length < 2 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

/** What the operation declares about one argument, over and above the door. */
interface Constraint {
  required: boolean;
  /** The declared value set, verbatim. */
  enum: string[];
  /** The declared default, JSON-rendered; empty when there is none. */
  def: string;
  /** `date-time`, `uuid`, … — a shape the type alone does not carry. */
  format: string;
  /** The operation's own prose for the field, used only where the door has none. */
  description: string;
}

/**
 * One operation's half, keyed by field name.
 *
 * A tool's flat `arguments` object is the operation's path, query and body
 * parameters merged — the door erases the distinction — so both are read into
 * one map, body last because a body property is the more specific declaration
 * where a name appears in both.
 */
function declaredBy(op: Operation): Map<string, Constraint> {
  const out = new Map<string, Constraint>();
  const put = (name: string, required: boolean, schema: any, description: string) => {
    out.set(name, {
      required,
      enum: Array.isArray(schema?.enum) ? schema.enum.map((v: any) => JSON.stringify(v)) : [],
      def: schema?.default === undefined ? '' : JSON.stringify(schema.default),
      format: String(schema?.format ?? ''),
      description: String(description ?? '').trim(),
    });
  };
  for (const p of op.parameters) put(p.name, p.required, p.schema, p.description);
  const body = op.body?.schema;
  const bodyRequired = new Set<string>(Array.isArray(body?.required) ? body.required : []);
  for (const [name, p] of Object.entries<any>(body?.properties ?? {}))
    put(name, bodyRequired.has(name), p, p?.description ?? '');
  return out;
}

/**
 * The document's half — what EVERY operation the tool could be agrees on.
 *
 * A handful of tool names resolve to two operations, and the door does not say
 * which it dispatches to. Reading the first would attribute one route's rules to
 * a call that might take the other's, so a constraint survives here only if
 * every candidate declares it, identically. Where they differ the field falls
 * back to `—`, which is the true answer: the document does not settle it.
 */
export function constraintsOf(ops: Operation[] | undefined): Map<string, Constraint> {
  if (!ops?.length) return new Map();
  const [first, ...rest] = ops.map(declaredBy);
  if (!rest.length) return first;
  const out = new Map<string, Constraint>();
  for (const [name, c] of first) {
    const others = rest.map((m) => m.get(name));
    if (others.some((o) => !o)) continue;
    const same = <T>(pick: (c: Constraint) => T): boolean =>
      others.every((o) => JSON.stringify(pick(o!)) === JSON.stringify(pick(c)));
    out.set(name, {
      required: same((x) => x.required) ? c.required : false,
      enum: same((x) => x.enum) ? c.enum : [],
      def: same((x) => x.def) ? c.def : '',
      format: same((x) => x.format) ? c.format : '',
      description: same((x) => x.description) ? c.description : '',
    });
  }
  return out;
}

/**
 * Arguments the operation requires that the door's schema never names.
 *
 * `GET /v1/webhooks/{id}` cannot address a webhook without `id`, and the door
 * publishes `{"properties":{}}` for the tool that calls it. The reference cannot
 * say how to supply the value, so it says that, rather than printing "call it
 * with an empty object" and teaching a call that cannot resolve a resource.
 */
const undeclaredRequired = (schema: any, con: Map<string, Constraint>): string[] => {
  const props: Record<string, any> = schema?.properties ?? {};
  return [...con.entries()].filter(([n, c]) => c.required && !(n in props)).map(([n]) => n);
};

interface Field {
  name: string;
  type: string;
  required: boolean;
  /** The declared default, rendered; empty when neither source declares one. */
  def: string;
  /** The enumerated value set, else the declared format, else empty. */
  values: string;
  description: string;
}

const fieldsOf = (schema: any, con: Map<string, Constraint> = new Map()): Field[] => {
  const props: Record<string, any> = schema?.properties ?? {};
  const doorRequired = new Set<string>(Array.isArray(schema?.required) ? schema.required : []);
  return Object.keys(props)
    .sort()
    .map((name) => {
      const p = props[name] ?? {};
      const c = con.get(name);
      return {
        name,
        type: typeOf(p),
        required: doorRequired.has(name) || Boolean(c?.required),
        def: p.default !== undefined ? JSON.stringify(p.default) : (c?.def ?? ''),
        // A string's quotes are noise beside a Type column that already says
        // `string`; a number's or a boolean's JSON form is the value itself.
        values: c?.enum.length
          ? c.enum.map((v) => `\`${code(v.startsWith('"') ? v.slice(1, -1) : v)}\``).join(', ')
          : c?.format
            ? `\`${code(c.format)}\``
            : '',
        // The door's prose wins; the operation's is the fallback, never a
        // second copy of the same sentence.
        description: String(p.description ?? '') || (c?.description ?? ''),
      };
    });
};

function fieldTable(fields: Field[]): string[] {
  return [
    '| Field | Type | Required | Default | Values | Description |',
    '|---|---|---|---|---|---|',
    ...fields.map(
      (f) =>
        `| \`${code(f.name)}\` | \`${code(f.type)}\` | ${f.required ? '**yes**' : '—'} | ${
          f.def ? `\`${code(f.def)}\`` : '—'
        } | ${f.values || '—'} | ${text(f.description) || '—'} |`,
    ),
  ];
}

/**
 * Which source filled which column, said out loud on every page that has one.
 *
 * The Required, Default and Values columns are almost never the door's — it
 * publishes a type and a description and stops. Printing them without saying
 * where they came from would imply the door declares them; leaving them empty
 * would imply the answer is "none". Both are computed from the schemas in hand,
 * so the sentence narrows on its own the day the door starts publishing more.
 */
function sourceNotice(
  schema: any,
  fields: Field[],
  ops: Operation[] | undefined,
  con: Map<string, Constraint>,
): string[] {
  if (!fields.length) return [];
  const props: Record<string, any> = schema?.properties ?? {};
  const doorHas = (k: string) => Object.values(props).some((p: any) => p?.[k] !== undefined);
  const doorSays: string[] = ['a type'];
  if (Object.values(props).some((p: any) => p?.description)) doorSays.push('a description');
  if (Array.isArray(schema?.required) && schema.required.length) doorSays.push('which fields are required');
  if (doorHas('default')) doorSays.push('a default');
  if (doorHas('enum')) doorSays.push('an enumerated value set');

  const filled: string[] = [];
  if (fields.some((f) => f.required)) filled.push('**Required**');
  if (fields.some((f) => f.def)) filled.push('**Default**');
  if (fields.some((f) => f.values)) filled.push('**Values**');

  const L = [''];
  if (!ops?.length) {
    L.push(
      `\`tools/list\` declares ${conjoin(doorSays)} for each field and nothing further, and the ` +
        'OpenAPI document describes no operation for this tool. A `—` above means neither source ' +
        'constrains the field, not that it is unconstrained in practice.',
    );
    return L;
  }
  // Whether the document contributed anything HERE, rather than whether it could.
  // A subsystem tool's own fields are `op` and `input`; the operations declare
  // the fields that go INSIDE `input`, so their names do not meet and every
  // column on such a page is the door's. Claiming otherwise credited routes for
  // a Required column they had no part in.
  const joined = fields.some((f) => con.has(f.name));
  const routes = ops.map((o) => `\`${o.method.toUpperCase()} ${code(o.path)}\``);
  if (!joined) {
    L.push(
      `\`tools/list\` declares ${conjoin(doorSays)} for each field and nothing further, and every column ` +
        "above is the door's own. This tool takes an operation name and that operation's arguments, so what " +
        'the document constrains is what goes inside `input`, field by field, on the operation you name — ' +
        'ask `describe` for that. A `—` means the door does not constrain the field.',
    );
    return L;
  }
  L.push(
    `\`tools/list\` declares ${conjoin(doorSays)} for each field and nothing further. ` +
      (filled.length
        ? `The ${conjoin(filled)} column${filled.length > 1 ? 's are' : ' is'} taken from ` +
          (routes.length === 1
            ? `${routes[0]}, the operation this tool dispatches to — the same declaration the REST API validates against. `
            : `${conjoin(routes)} — the ${routes.length} operations the document names for this tool — and carries only what they agree on. `)
        : '') +
      `A \`—\` means neither the door nor ${routes.length === 1 ? 'that operation' : 'those operations'} constrains the field.`,
  );
  return L;
}

/**
 * Every object a tool's fields are made of, enumerated.
 *
 * The door writes a nested object two ways: as a named `$defs` entry a field
 * `$ref`s, and INLINE on the field itself. Both are objects with fields, so both
 * get a table — an inline one used to collapse to the word `object` in the Type
 * column and its fields went unpublished, which is the same page failing to
 * enumerate as a page that omits a flag.
 */
function defsTables(schema: any): string[] {
  const defs: Record<string, any> = schema?.$defs ?? {};
  const props: Record<string, any> = schema?.properties ?? {};
  /** An inline object is the field itself, or the item type of an array field. */
  const inline = Object.keys(props)
    .sort()
    .map((n) => [n, props[n]?.properties ? props[n] : props[n]?.items?.properties ? props[n].items : null] as const)
    .filter(([, s]) => s) as [string, any][];
  const names = Object.keys(defs).sort();
  if (!names.length && !inline.length) return [];

  const L: string[] = ['', '## Object types', ''];
  const shown = [...names.map((n) => `\`${code(n)}\``), ...inline.map(([n]) => `\`${code(n)}\``)];
  L.push(
    shown.length === 1
      ? `${shown[0]} is an object this tool's fields are made of, declared inside the tool's own schema and enumerated in full below.`
      : `${conjoin(shown)} are objects this tool's fields are made of. Each is declared inside the tool's own schema, and each is enumerated in full below.`,
  );
  for (const n of names) {
    L.push('', `### ${text(n)}`, '');
    const f = fieldsOf(defs[n]);
    if (!f.length) {
      L.push(`\`${code(n)}\` declares no fields of its own.`);
      continue;
    }
    L.push(...fieldTable(f));
  }
  for (const [n, s] of inline) {
    L.push('', `### ${text(n)}`, '');
    const f = fieldsOf(s);
    L.push(
      `\`${code(n)}\` is declared inline on the field of the same name` +
        (props[n]?.items ? ', as the item type of an array' : '') +
        '.',
    );
    L.push('');
    if (!f.length) L.push(`\`${code(n)}\` declares no fields of its own.`);
    else L.push(...fieldTable(f));
  }
  return L;
}

// ----------------------------------------------------------------- example

/**
 * A value for one field, and a note of every value the reference had to invent.
 *
 * A REAL one wherever a source declares one — the operation's default, or the
 * first member of its enumerated set, which is a value the API accepts rather
 * than one we made up. Only where neither source declares a value does this
 * fall back to a stand-in.
 *
 * A stand-in is written `<name>` so it is visibly one — but only a string can
 * be spelled that way. A number, a boolean and a timestamp have no placeholder
 * form that is still valid JSON of their own type, so those are pushed onto
 * `invented` by their dotted path, and the page names them under the call.
 * Otherwise `"limit": 0` reads exactly like a declared default, which measured
 * across this catalogue would be 249 fabricated values passed off as the API's
 * own — the page would be inventing, quietly, on 149 of its pages.
 */
function sample(
  node: any,
  name: string,
  defs: Record<string, any>,
  con: Constraint | undefined,
  invented: string[],
  at: string,
  depth = 0,
): any {
  if (node?.default !== undefined) return node.default;
  if (con?.def) return JSON.parse(con.def);
  if (con?.enum.length) return JSON.parse(con.enum[0]);
  const ref = refName(node?.$ref);
  if (ref && depth < 3) return sample(defs[ref] ?? {}, name, defs, undefined, invented, at, depth + 1);
  const t = Array.isArray(node?.type) ? node.type[0] : node?.type;
  switch (t) {
    case 'integer':
    case 'number':
      invented.push(at);
      return 0;
    case 'boolean':
      invented.push(at);
      return false;
    case 'array': {
      if (depth >= 3) return [];
      const inner = sample(node.items ?? {}, name, defs, undefined, invented, `${at}[]`, depth + 1);
      return inner === null ? [] : [inner];
    }
    case 'object': {
      if (depth >= 3 || !node.properties) return {};
      const out: Record<string, any> = {};
      for (const k of Object.keys(node.properties).sort())
        out[k] = sample(node.properties[k], k, defs, undefined, invented, `${at}.${k}`, depth + 1);
      return out;
    }
    case 'string':
      if (con?.format !== 'date-time') return `<${name}>`;
      invented.push(at);
      return '2026-01-01T00:00:00Z';
    default:
      // The door declared no type. Say so in the value rather than picking one.
      return node?.properties ? {} : `<${name}>`;
  }
}

/**
 * The runnable call.
 *
 * A minimal one where the operation says what is minimal: exactly the arguments
 * it requires, which is a call a reader can send. Where the operation requires
 * nothing — or the document does not describe the tool at all — there is no
 * minimum to show, so every declared argument is included instead, because
 * dropping fields there would be teaching a guess about which matter.
 */
export function callEnvelope(
  tool: McpTool,
  con: Map<string, Constraint>,
): { body: string; minimal: boolean; invented: string[] } {
  const schema = tool.inputSchema ?? {};
  const defs: Record<string, any> = schema.$defs ?? {};
  const declared = Object.keys(schema.properties ?? {}).sort();
  const required = declared.filter((n) => con.get(n)?.required || (schema.required ?? []).includes(n));
  const minimal = required.length > 0;
  const args: Record<string, any> = {};
  const invented: string[] = [];
  for (const name of minimal ? required : declared) {
    args[name] = sample(schema.properties![name], name, defs, con.get(name), invented, name);
  }
  // A subsystem tool's `op` is the one argument the door itself enumerates, and
  // the sample above never looked there — so the call a reader was invited to
  // paste said `"op": "<op>"`, which the door answers `unknown tool: <op>` to.
  // Print an operation the door names, and a READ, so the invitation is safe.
  const read = readOp(tool);
  if (read && read !== tool.name && 'op' in args) args.op = read;
  const body = JSON.stringify(
    { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.name, arguments: args } },
    null,
    2,
  );
  return { body, minimal, invented };
}

const curl = (body: string): string =>
  `curl -X POST ${MCP_DOOR} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${body.split('\n').join('\n     ')}'`;

// ------------------------------------------------------------------- pages

/**
 * The product a tool is filed under, and the slug of its folder.
 *
 * A tool RESOLVES to an operation and still has no product when the operation
 * is one the document serves outside `/v1/<product>` — `POST /collaborator/rpc/
 * {documentid}` is idded `post_collaborator_rpc_by_documentid`, whose prefix is
 * the verb, so the product rule refuses it rather than minting a product called
 * Post. Reading "has an operation" as "has a product" wrote that page to the
 * section's root instead of a folder: on disk, in no product, linked from no
 * index, and invisible to every count that walks the folders.
 */
/**
 * The product a tool belongs under: the one MOST of its operations belong to.
 *
 * This took the FIRST operation's product, which was exact while a tool was one
 * operation. A subsystem tool is many, and they do not all share a product —
 * `provisioning` reaches kv, sql, s3 and vector — so the first one alphabetically
 * decided the whole tool's home. The mode is the honest answer, and ties break on
 * the name so the choice is stable between builds.
 */
function productOf(ops: Operation[] | undefined): string {
  if (!ops?.length) return 'unmapped';
  const n = new Map<string, number>();
  for (const o of ops) n.set(o.product, (n.get(o.product) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0] || 'unmapped';
}

/**
 * The tools this reference publishes: the door's answer, less the operator
 * surface.
 *
 * A tool whose operations are ALL internal is internal. Without this the
 * /v1/admin routes were printed in full on 78 tool pages, again in the catalogue
 * and again in the section nav — the same leak the REST reference had, through a
 * different door. The door still answers them to whoever is authorised to call
 * them; what changes is only what docs.hanzo.ai publishes.
 *
 * `some` was right while a tool was one operation and is wrong now that a tool is
 * a subsystem: one operator operation among thirty would have withdrawn the whole
 * subsystem's page. `every` withholds exactly the tool that is nothing but the
 * operator surface — which on this door is the one named `admin`, all 56 of it.
 */
export function published(cat: McpCatalog, mapped: Map<string, Operation[]>): McpTool[] {
  return cat.tools.filter((t) => {
    const ops = mapped.get(t.name) ?? [];
    return !ops.length || !ops.every(isInternal);
  });
}

// `meta.count` is what the DOOR answered and stays that; `tools.length` is what
// this reference documents. Where they differ the stamp says so, so a reader
// who counts the pages and compares is not left thinking one of them is wrong.
const provenance = (cat: McpCatalog): string =>
  `Generated from \`tools/list\` on \`${cat.door}\` — ${cat.meta.count} tools captured ${cat.meta.captured}` +
  (cat.meta.count > cat.tools.length
    ? `, of which ${cat.tools.length} are documented here (the operator surface is not published)`
    : '') +
  '.';

function renderTool(tool: McpTool, ops: Operation[] | undefined, cat: McpCatalog, doc: Document): string {
  const schema = tool.inputSchema ?? {};
  const con = constraintsOf(ops);
  const fields = fieldsOf(schema, con);
  const absent = undeclaredRequired(schema, con);
  const L: string[] = [];

  L.push('---');
  L.push(`title: ${yamlString(tool.name)}`);
  L.push(
    `description: ${yamlString(
      firstSentence(tool.description) || `An MCP tool on the Hanzo cloud door.`,
    )}`,
  );
  L.push('---');
  L.push('');

  // 1. What it is — the door's own prose, verbatim.
  L.push(prose(tool.description));
  L.push('');

  // 2. The same facts as a table, so every page answers the same questions in
  //    the same place.
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Tool** | \`${code(tool.name)}\` |`);
  L.push(`| **Door** | \`${code(cat.door)}\` |`);
  L.push('| **Method** | `tools/call` (JSON-RPC 2.0) |');
  L.push(
    `| **Arguments** | ${fields.length}${
      fields.filter((f) => f.required).length ? `, ${fields.filter((f) => f.required).length} required` : ''
    } |`,
  );
  L.push(
    `| **Operation** | ${
      ops?.length
        ? ops.map((o) => `\`${o.method.toUpperCase()} ${code(o.path)}\``).join(' · ')
        : 'none in the OpenAPI document'
    } |`,
  );
  L.push(`| **Product** | ${ops?.length ? `[${text(ops[0].product)}](/docs/openapi/${ops[0].product})` : '—'} |`);
  L.push('');

  // 3. Arguments — every declared field, always in this section, always this
  //    table, even when there are none.
  L.push('## Arguments');
  L.push('');
  if (!fields.length) {
    L.push(
      absent.length
        ? 'The door declares no arguments for this tool.'
        : 'This tool declares no arguments. Call it with an empty `arguments` object.',
    );
  } else {
    L.push(...fieldTable(fields));
    L.push(...sourceNotice(schema, fields, ops, con));
  }
  // The gap, stated where a reader would otherwise be misled into an empty
  // object: the operation cannot run without these, and the door never names
  // them, so this reference cannot say where they go.
  if (absent.length) {
    L.push('');
    L.push(
      `\`${code(ops![0].method.toUpperCase())} ${code(ops![0].path)}\` requires ` +
        `${absent.map((n) => `\`${code(n)}\``).join(', ')}, which \`tools/list\` does not declare on this tool. ` +
        'Where that value goes in a `tools/call` is not something the door publishes, so this page does not ' +
        'guess — the same capability over plain HTTP is fully specified in the API reference below.',
    );
  }
  L.push(...defsTables(schema));
  L.push('');

  // 4. The call, built from the schema above.
  const { body, minimal, invented } = callEnvelope(tool, con);
  L.push('## Call it');
  L.push('');
  L.push(
    fields.length
      ? 'A `tools/call` carries every argument in one flat object — nothing binds to a path or a query string. ' +
        (minimal
          ? 'This call carries exactly the arguments the operation requires, so it is the smallest one that can run.'
          : 'Nothing above is required, so every declared argument is shown rather than a guess at which matter.')
      : 'A `tools/call` carries its arguments in one flat object. This tool declares none, so the object is empty' +
        (absent.length
          ? ` — though the operation behind it requires ${conjoin(absent.map((n) => `\`${code(n)}\``))}, so this envelope is the shape of the call, not one that can name a resource.`
          : '.'),
  );
  L.push('');
  L.push(...fence('bash', curl(body)));
  L.push('');
  // Which values are the API's own and which this page had to invent, named
  // field by field. A `<placeholder>` announces itself; `0`, `false` and a
  // timestamp cannot, and an unannounced one reads as a declared default.
  L.push(
    (fields.length
      ? 'Values are the operation\'s own defaults and enumerated values where it declares them, and a ' +
        '`<placeholder>` where neither source declares one. '
      : '') +
      (invented.length
        ? `${conjoin(invented.map((n) => `\`${code(n)}\``))} ${invented.length === 1 ? 'holds a stand-in' : 'hold stand-ins'} that cannot be spelled that way — ` +
          'JSON gives a number, a boolean and a timestamp no placeholder form — so ' +
          `${invented.length === 1 ? 'that value is' : 'those values are'} this page's, not the API's. ` +
          'Neither the door nor the operation declares one. '
        : '') +
      '`tools/list` needs no credential; `tools/call` does — called without one the door answers HTTP 200 ' +
      'with a JSON-RPC result whose `isError` is set and whose text says what was missing. ' +
      '[How to get a key →](/docs/mcp-tools#credentials)',
  );
  L.push('');

  // 5. Where it goes. A tool the document does not describe is stated as such.
  L.push('## The operation behind it');
  L.push('');
  if (!ops?.length) {
    L.push(
      `The door exposes \`${code(tool.name)}\`, but the copy of the OpenAPI document this build holds${pinned} ` +
        'describes no operation for it — neither under that name nor at the route the name implies. That is ' +
        'either a route the document has yet to declare, or one the door has renamed since the pin. Everything ' +
        'on this page comes from `tools/list`; there is no REST reference to link to until the two agree.',
    );
  } else {
    // What the tool reaches, and what this page can name. The door dispatches a
    // whole subsystem — `agents` reaches 25 operations — and names most of them
    // with its own verb (`list_agents` for `get_agents`), which is not derivable
    // from the document; only `describe` resolves those. So the table below is
    // the ones the door names EXACTLY as the document ids them, and the sentence
    // says how many it is out of. Before the door regrouped, a tool WAS one
    // operation, and this said "the document uses this name for N operations and
    // the door does not say which it dispatches to" — a sentence about a name
    // collision, printed on a page about a subsystem, where it is simply untrue.
    const reachable = doorOps(tool).length;
    if (reachable > ops.length) {
      L.push(
        `\`${code(tool.name)}\` dispatches to ${reachable} operations. ${ops.length} of them the door names exactly as the document ids ` +
          `${ops.length === 1 ? 'it' : 'them'}, and ${ops.length === 1 ? 'that one is' : 'those are'} below; for the rest the door has its own verb, which \`describe\` resolves.`,
      );
      L.push('');
    } else if (ops.length > 1) {
      L.push(`\`${code(tool.name)}\` dispatches to ${ops.length} operations.`);
      L.push('');
    }
    L.push('| Operation | Route | Product | Summary |');
    L.push('|---|---|---|---|');
    for (const o of ops) {
      L.push(
        `| \`${code(o.id)}\` | \`${o.method.toUpperCase()} ${code(o.path)}\` | [${text(o.product)}](/docs/openapi/${o.product}) | ${
          text(firstSentence(o.summary || o.description, 90)) || '—'
        } |`,
      );
    }
    L.push('');
    L.push(
      `The same capability over plain HTTP is in the [${text(ops[0].product)} API reference](/docs/openapi/${ops[0].product}), on \`${code(doc.server)}\`.`,
    );
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push(
    `[All ${cat.tools.length} tools](/docs/mcp-tools/all-tools) · [The door](/docs/mcp-tools) · [API reference](/docs/openapi)`,
  );
  L.push('');
  L.push(provenance(cat));
  L.push('');
  return L.join('\n');
}

/** One page per product folder, so no tool page is more than one click deep. */
function renderProductIndex(product: string, tools: McpTool[], cat: McpCatalog, mapped: Map<string, Operation[]>): string {
  const L: string[] = [];
  const known = product !== 'unmapped';
  L.push('---');
  L.push(`title: ${yamlString(product)}`);
  L.push(
    `description: ${yamlString(
      known
        ? `${tools.length} MCP tools on the Hanzo cloud door that call the ${product} API.`
        : `${tools.length} MCP tools the door exposes that the OpenAPI document does not describe.`,
    )}`,
  );
  L.push('---');
  L.push('');
  L.push(
    known
      ? `The ${tools.length} tool${tools.length === 1 ? '' : 's'} \`tools/list\` names for **${text(product)}**. Each dispatches to an operation in the [${text(product)} API reference](/docs/openapi/${product}).`
      : `The door lists ${tools.length} tool${tools.length === 1 ? '' : 's'} that resolve to no operation in the copy of the OpenAPI document this build holds${pinned}. Each is either a route the document has yet to declare or one the door has renamed since the pin; both are documented from \`tools/list\` alone rather than left out.`,
  );
  L.push('');
  L.push('| Tool | Route | Arguments | Required | Description |');
  L.push('|---|---|---|---|---|');
  for (const t of tools) {
    const ops = mapped.get(t.name);
    const req = fieldsOf(t.inputSchema ?? {}, constraintsOf(ops)).filter((f) => f.required);
    L.push(
      `| [\`${code(t.name)}\`](${toolHref(product, t.name)}) | ${
        ops?.length ? `\`${ops[0].method.toUpperCase()} ${code(ops[0].path)}\`` : '—'
      } | ${Object.keys(t.inputSchema?.properties ?? {}).length} | ${
        req.length ? req.map((f) => `\`${code(f.name)}\``).join(', ') : '—'
      } | ${text(firstSentence(t.description, 100))} |`,
    );
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push(`[All ${cat.tools.length} tools](/docs/mcp-tools/all-tools) · [The door](/docs/mcp-tools)`);
  L.push('');
  L.push(provenance(cat));
  L.push('');
  return L.join('\n');
}

/** Every tool, grouped, linked. The reachability guarantee for the whole set. */
function renderCatalog(groups: Map<string, McpTool[]>, cat: McpCatalog, mapped: Map<string, Operation[]>): string {
  const L: string[] = [];
  const products = [...groups.keys()];
  L.push('---');
  L.push('title: Tool catalogue');
  L.push(
    `description: ${yamlString(
      `Every one of the ${cat.tools.length} tools documented here, grouped by the product it calls.`,
    )}`,
  );
  L.push('---');
  L.push('');
  const unmapped = groups.get('unmapped')?.length ?? 0;
  L.push(
    `This reference documents **${cat.tools.length} tools** from \`tools/list\` on \`${code(cat.door)}\`, across **${
      products.length - (unmapped ? 1 : 0)
    } products**` +
      (unmapped ? `, plus ${unmapped} the OpenAPI document does not describe` : '') +
      '. Every one has a page; every page is linked from here.',
  );
  L.push('');
  L.push('| Product | Tools | |');
  L.push('|---|---|---|');
  for (const p of products) {
    L.push(
      `| [${text(p)}](${productHref(p)}) | ${groups.get(p)!.length} | ${
        p === 'unmapped' ? 'not described by the OpenAPI document' : `[API reference](/docs/openapi/${p})`
      } |`,
    );
  }
  L.push('');
  for (const p of products) {
    L.push(`## ${text(p)}`);
    L.push('');
    L.push('| Tool | Route | Description |');
    L.push('|---|---|---|');
    for (const t of groups.get(p)!) {
      const ops = mapped.get(t.name);
      L.push(
        `| [\`${code(t.name)}\`](${toolHref(p, t.name)}) | ${
          ops?.length ? `\`${ops[0].method.toUpperCase()} ${code(ops[0].path)}\`` : '—'
        } | ${text(firstSentence(t.description, 110))} |`,
      );
    }
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push(provenance(cat));
  L.push('');
  return L.join('\n');
}

/**
 * The one conceptual page: what the door is and how to reach it.
 *
 * Prose here explains a concept. It states no signature — every count, every
 * protocol version and every route on it is interpolated from the vendored
 * handshake or the document, so it cannot drift from either.
 */
function renderIndex(cat: McpCatalog, doc: Document, groups: Map<string, McpTool[]>, unmapped: number): string {
  const h = cat.handshake;
  const servers = doc.operations
    .filter((o) => o.path.startsWith('/v1/mcp/servers'))
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
  const L: string[] = [];

  L.push('---');
  L.push('title: Cloud MCP');
  L.push(
    `description: ${yamlString(
      `One JSON-RPC endpoint that gives any MCP client ${cat.meta.count} tools over the Hanzo cloud, plus the external servers your org registers.`,
    )}`,
  );
  L.push('icon: Plug');
  L.push('---');
  L.push('');
  L.push(
    `**\`POST ${code(cat.door)}\`** is the agent-facing surface of the Hanzo cloud: one JSON-RPC 2.0 endpoint that answers \`tools/list\` with **${cat.meta.count} tools** and \`tools/call\` to run them. It is the same cloud the REST API serves — a tool here is an operation there, so an agent and a program reach identical behaviour.`,
  );
  L.push('');
  L.push(`> [Browse the tool catalogue →](/docs/mcp-tools/all-tools) · [REST reference →](/docs/openapi) · [Six flows, four surfaces →](/docs/start)`);
  L.push('');

  L.push('## Point a client at it');
  L.push('');
  L.push('The door speaks streamable HTTP, so a client needs the URL and nothing else:');
  L.push('');
  L.push(...fence('bash', ADD_COMMAND));
  L.push('');
  L.push('Any client that reads an MCP config file takes the same two facts:');
  L.push('');
  L.push(
    ...fence(
      'json',
      JSON.stringify({ mcpServers: { 'hanzo-cloud': { type: 'http', url: cat.door } } }, null, 2),
    ),
  );
  L.push('');
  if (h) {
    L.push(`The door answers \`initialize\` with protocol \`${code(h.protocolVersion)}\`, naming itself \`${code(h.serverName)}\`${h.serverVersion ? ` version \`${code(h.serverVersion)}\`` : ' with no version string'}, and advertises \`${code(JSON.stringify(h.capabilities))}\`.`);
    L.push('');
  }

  L.push('## Credentials');
  L.push('');
  L.push(
    '`tools/list` is answered without a credential — that is how this reference is generated. `tools/call` is not: ' +
      'the door replies HTTP 200 with a JSON-RPC result whose `isError` is set, and whose text names what was missing' +
      (h?.anonymousCall
        ? ` — asked for \`${code(h.anonymousProbe)}\` with no credential it answered \`${code(h.anonymousCall)}\`. Each tool refuses in its own terms, so treat that as the shape of the answer, not the wording.`
        : '.'),
  );
  L.push('');
  // Which credential, in the document's words. Naming the accepted key formats
  // in a sentence here would be a second copy of the security scheme's own
  // description — the REST reference prints that one, and two copies drift.
  const bearer = Object.entries<any>(doc.securitySchemes).find(
    ([, s]) => s?.type === 'http' && s?.scheme === 'bearer' && s?.description,
  );
  L.push(
    'The door takes the same bearer credential as the REST API' +
      (bearer
        ? ` — the document's \`${code(bearer[0])}\` scheme: ${text(bearer[1].description).replace(/\.$/, '')}`
        : '') +
      '. Send it in an `Authorization` header on the request:',
  );
  L.push('');
  L.push(
    ...fence(
      'bash',
      `export HANZO_API_KEY=${secretKey(doc).prefix}...\ncurl -X POST ${cat.door} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
    ),
  );
  L.push('');
  L.push(
    'Set that header however your client sets request headers for an HTTP MCP server. One credential ' +
      'reaches every tool, because one credential reaches every product — ' +
      '[where keys come from →](/docs/api-keys)',
  );
  L.push('');

  L.push('## What is behind the tools');
  L.push('');
  L.push(
    'Every tool is a projection of the same OpenAPI document that generates the REST reference, the SDKs and the CLI. ' +
      (unmapped
        ? `${cat.tools.length - unmapped} of the ${cat.tools.length} tools resolve to an operation in it, across ${groups.size - 1} products; ${unmapped} do not, and are [listed as such](/docs/mcp-tools/unmapped) rather than left out.`
        : `Every one of the ${cat.tools.length} tools resolves to an operation in it, across ${groups.size} products.`),
  );
  L.push('');
  L.push(
    `The door exposes a subset of the document, not all of it: ${cat.meta.count} tools against ${doc.operations.length} operations. Whether an operation has a tool is a question only the door answers, so every page here asks it rather than assuming.`,
  );
  L.push('');
  L.push('### How a tool page is built');
  L.push('');
  L.push(
    'Each argument is declared twice, and neither declaration is whole. `tools/list` names a field and gives ' +
      'it a type and usually a description — across the whole catalogue it marks nothing required, carries no ' +
      'default and enumerates no value set. The operation the tool dispatches to declares the rest, because ' +
      'that is what the API validates against. So a tool page takes its **shape** from the door and its ' +
      '**constraints** from the document, and says on every table which column came from which. A `—` means ' +
      'neither source constrains the field; it is never a guess, and where the two cannot be joined the page ' +
      'says that instead.',
  );
  L.push('');
  L.push(
    `The door is read live at build time; the document is a pinned snapshot${pinned}. They can disagree, and where they do the page reports it rather than smoothing it over.`,
  );
  L.push('');

  L.push('## Add your org\'s own servers');
  L.push('');
  if (!servers.length) {
    L.push(
      'The OpenAPI document declares no route for registering external MCP servers, so there is nothing to document here yet.',
    );
  } else {
    L.push(
      "An org is not limited to the tools above. Register an external MCP server and its tools join the same surface for everyone in the org — one connection for a client, whatever it is wired to behind the door.",
    );
    L.push('');
    L.push('| Route | Operation | What it does |');
    L.push('|---|---|---|');
    for (const o of servers) {
      L.push(
        `| \`${o.method.toUpperCase()} ${code(o.path)}\` | \`${code(o.id)}\` | ${text(firstSentence(o.summary || o.description, 120)) || '—'} |`,
      );
    }
    L.push('');
    const post = servers.find((o) => o.method === 'post');
    const props: Record<string, any> = post?.body?.schema?.properties ?? {};
    if (post && Object.keys(props).length) {
      // Registering a server is the one write on this page, so its body is
      // enumerated here in full rather than left to a link — same table as
      // every tool page, filled from the document instead of the door.
      //
      // The catalog route is NOT named in prose: the `listing` field's own
      // description names it, and that description is the document's. A
      // sentence here would be a second copy of it, free to drift.
      L.push(...fieldTable(fieldsOf(post.body!.schema, declaredBy(post))));
      L.push('');
      const catalog = doc.operations.find(
        (o) => o.method === 'get' && /catalog/.test(o.path) && /mcp server/i.test(o.summary || ''),
      );
      if (catalog) {
        // The summary whole, not a first sentence: these summaries carry dotted
        // hostnames, and a sentence-splitter cuts them at the first full stop.
        L.push(
          `Registering by \`url\` wires up a server the org runs or trusts. The other source is \`${code(catalog.method.toUpperCase())} ${code(catalog.path)}\` — ${text(catalog.summary || firstSentence(catalog.description))} Its entries are enabled by id through the \`listing\` field above, and either way the server's tools appear on this door.`,
        );
        L.push('');
      }
      // The registering call, under the same rule the tool pages use: the
      // fields the operation requires, and where it requires none — as here —
      // every declared field, because picking a subset would be a guess about
      // which matter. (The reference's compact HTTP examples fall back to the
      // first two instead, which on this body would drop `name` and `url`.)
      const required: string[] = Array.isArray(post.body?.schema?.required) ? post.body!.schema.required : [];
      const send = required.length ? required : Object.keys(props).sort();
      const body = Object.fromEntries(
        send.map((k) => [k, props[k]?.enum?.[0] ?? props[k]?.default ?? props[k]?.example ?? `<${k}>`]),
      );
      L.push(
        ...fence(
          'bash',
          `curl -X POST ${doc.server}${post.path} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(body, null, 2).split('\n').join('\n     ')}'`,
        ),
      );
      L.push('');
      L.push(
        `${
          required.length
            ? `Those are the fields \`${code(post.path)}\` requires.`
            : 'The operation marks no field required, so every declared field is shown.'
        } Responses and error codes for all three routes are in the [${text(servers[0].product)} API reference](/docs/openapi/${servers[0].product}).`,
      );
      L.push('');
    }
  }

  L.push('## The local server is a different thing');
  L.push('');
  L.push(
    'This page is the **cloud** door — a URL, no install, your org\'s data. The [Hanzo MCP server](/docs/mcp) is the one that runs beside your editor and reaches your filesystem, shell and git. They compose: a client can hold both connections at once.',
  );
  L.push('');
  L.push('---');
  L.push('');
  L.push(provenance(cat));
  L.push('');
  return L.join('\n');
}

// -------------------------------------------------------------------- main

/**
 * Render the whole reference into `outDir`. The path is a parameter so the
 * tests can generate the real pages from the real vendored catalogue and assert
 * on what a build would actually publish, rather than on a fixture.
 */
export async function genMcpPages(outDir: string = OUT_DIR): Promise<{ pages: number; tools: number; unmapped: number }> {
  const cat = load();
  if (!cat.tools.length) throw new Error('[mcp-ref] the vendored tool list is empty');
  const doc = loadDocument(DOCUMENT);
  const mapped = toolOperations(doc, cat.tools);
  cat.tools = published(cat, mapped);

  // Group by the product the tool calls; tools the document does not describe
  // get their own group rather than being dropped or filed under a guess.
  const groups = new Map<string, McpTool[]>();
  for (const t of cat.tools) {
    const p = productOf(mapped.get(t.name));
    (groups.get(p) ?? groups.set(p, []).get(p)!).push(t);
  }
  const ordered = new Map(
    [...groups.entries()].sort((a, b) =>
      a[0] === 'unmapped' ? 1 : b[0] === 'unmapped' ? -1 : b[1].length - a[1].length || a[0].localeCompare(b[0]),
    ),
  );
  const unmapped = groups.get('unmapped')?.length ?? 0;

  // A product folder and one of this section's own pages would answer the same
  // URL, and one would silently win. `catalog` is a real product in the
  // document, which is why the tool listing is not called that. Fail loudly if
  // a future product takes one of the two names this section reserves.
  const clash = [...ordered.keys()].filter((p) => RESERVED.has(slugOf(p)));
  if (clash.length) {
    throw new Error(
      `[mcp-ref] product ${clash.join(', ')} still resolves to a slug this section reserves — give it one in SLUG`,
    );
  }
  // Same hazard one level down: a tool named `index` would be written over its
  // own product's index page, and the folder would lose a tool without a word.
  const shadow = cat.tools.filter((t) => RESERVED_PAGE.has(slugOf(t.name)));
  if (shadow.length) {
    throw new Error(
      `[mcp-ref] tool ${shadow.map((t) => t.name).join(', ')} still resolves to a slug its folder reserves — give it one in SLUG`,
    );
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  let pages = 0;
  for (const [product, tools] of ordered) {
    const dir = path.join(outDir, slugOf(product));
    fs.mkdirSync(dir, { recursive: true });
    for (const t of tools) {
      fs.writeFileSync(path.join(dir, `${slugOf(t.name)}.mdx`), renderTool(t, mapped.get(t.name), cat, doc));
      pages++;
    }
    fs.writeFileSync(path.join(dir, 'index.mdx'), renderProductIndex(product, tools, cat, mapped));
    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify({ title: slugOf(product), pages: ['index', ...tools.map((t) => slugOf(t.name))] }, null, 2) + '\n',
    );
    pages++;
  }

  fs.writeFileSync(path.join(outDir, 'all-tools.mdx'), renderCatalog(ordered, cat, mapped));
  fs.writeFileSync(path.join(outDir, 'index.mdx'), renderIndex(cat, doc, ordered, unmapped));
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(
      {
        title: 'Cloud MCP',
        description: `The ${cat.tools.length} tools documented here, generated from tools/list.`,
        icon: 'Plug',
        pages: ['index', 'all-tools', ...[...ordered.keys()].map(slugOf)],
      },
      null,
      2,
    ) + '\n',
  );

  // Every tool got a page, and every page is reachable from the catalogue: the
  // two properties this reference claims, checked rather than asserted.
  const written = new Set<string>();
  for (const [product, tools] of ordered) for (const t of tools) written.add(`${slugOf(product)}/${slugOf(t.name)}`);
  if (written.size !== cat.tools.length) {
    throw new Error(
      `[mcp-ref] ${cat.tools.length} tools collapsed onto ${written.size} pages — two tools share a path`,
    );
  }
  const catalogSrc = fs.readFileSync(path.join(outDir, 'all-tools.mdx'), 'utf8');
  const orphans = [...written].filter((p) => !catalogSrc.includes(`(/docs/mcp-tools/${p})`));
  if (orphans.length) {
    throw new Error(`[mcp-ref] ${orphans.length} tool pages are not linked from the catalogue: ${orphans.slice(0, 5)}`);
  }

  const withArgs = cat.tools.filter((t) => Object.keys(t.inputSchema?.properties ?? {}).length).length;
  console.log(
    `[mcp-ref] ${pages + 2} pages — ${cat.tools.length} tools across ${ordered.size} products, ` +
      `${withArgs} declaring arguments, ${cat.tools.length - unmapped} filed under a product` +
      (unmapped ? `, ${unmapped} under none — the document gives their route no product` : ''),
  );
  console.log(`[mcp-ref] tool list captured ${cat.meta.captured}, 0 orphans`);
  return { pages: pages + 2, tools: cat.tools.length, unmapped };
}

if (import.meta.main) {
  genMcpPages().catch((e) => {
    console.error('[mcp-ref] failed', e);
    process.exit(1);
  });
}
