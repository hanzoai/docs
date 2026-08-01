import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDocument, type Document, type Operation } from './openapi-doc';
import { toolOperations } from './openapi-surfaces';
import { load, MCP_DOOR, type McpCatalog, type McpTool } from './sync-mcp-tools';
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
// the wire in `tools/list`, exactly as the API reference comes off hanzo.yaml.
// The one authored page is `index.mdx`, which explains what the door IS and how
// to point a client at it — a concept, not a signature.
//
// The tool list is VENDORED (openapi-specs/mcp-tools.json) by sync-mcp-tools,
// so this render never touches the network. A build with no egress produces the
// same pages from the committed copy, and says so.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCUMENT = path.join(APP_ROOT, 'openapi-specs/hanzo.yaml');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/mcp-tools');

/** The client command that registers the door, over its streamable HTTP transport. */
const ADD_COMMAND = `claude mcp add --transport http hanzo-cloud ${MCP_DOOR}`;

/** Slugs this section spends on its own pages, so no product folder may take them. */
const RESERVED = new Set(['index', 'all-tools']);

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

interface Field {
  name: string;
  type: string;
  required: boolean;
  /** The declared default, rendered; empty when the door declares none. */
  def: string;
  description: string;
}

const fieldsOf = (schema: any): Field[] => {
  const props: Record<string, any> = schema?.properties ?? {};
  const required = new Set<string>(Array.isArray(schema?.required) ? schema.required : []);
  return Object.keys(props)
    .sort()
    .map((name) => ({
      name,
      type: typeOf(props[name]),
      required: required.has(name),
      def: props[name]?.default === undefined ? '' : JSON.stringify(props[name].default),
      description: String(props[name]?.description ?? ''),
    }));
};

function fieldTable(fields: Field[]): string[] {
  return [
    '| Field | Type | Required | Default | Description |',
    '|---|---|---|---|---|',
    ...fields.map(
      (f) =>
        `| \`${code(f.name)}\` | \`${code(f.type)}\` | ${f.required ? 'yes' : '—'} | ${
          f.def ? `\`${code(f.def)}\`` : '—'
        } | ${text(f.description) || '—'} |`,
    ),
  ];
}

/**
 * What the door does NOT say about these fields, said out loud.
 *
 * `tools/list` publishes `type` and `description` and, for these tools, neither
 * `required` nor `default` nor `enum`. A reference that quietly prints an empty
 * column implies the answer is "none"; the honest reading is "the door does not
 * declare it". This notice is computed from the schema, so the moment the door
 * starts publishing a constraint the sentence narrows or disappears on its own.
 */
function undeclaredNotice(schema: any, fields: Field[]): string[] {
  if (!fields.length) return [];
  const missing: string[] = [];
  if (!Array.isArray(schema?.required) || !schema.required.length) missing.push('which fields are required');
  if (!fields.some((f) => f.def)) missing.push('any default');
  const props: Record<string, any> = schema?.properties ?? {};
  if (!Object.values(props).some((p: any) => Array.isArray(p?.enum) && p.enum.length))
    missing.push('any enumerated value set');
  if (!missing.length) return [];
  return [
    '',
    `This tool's schema does not declare ${missing.join(', nor ')}. The columns above are ` +
      'empty because the door publishes nothing there, not because the answer is "none" — ' +
      "where a field is constrained, the constraint is stated in that field's own description.",
  ];
}

/** Nested object types the tool references, each enumerated in full. */
function defsTables(schema: any): string[] {
  const defs: Record<string, any> = schema?.$defs ?? {};
  const names = Object.keys(defs).sort();
  if (!names.length) return [];
  const L: string[] = ['', '## Object types', ''];
  L.push(
    `\`${code(names.join('`, `'))}\` are objects this tool's fields refer to. Each is declared inside the tool's own schema.`,
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
  return L;
}

// ----------------------------------------------------------------- example

/** A placeholder for one field, derived from its declared type. */
function sample(node: any, name: string, defs: Record<string, any>, depth = 0): any {
  if (node?.default !== undefined) return node.default;
  const ref = refName(node?.$ref);
  if (ref && depth < 3) return sample(defs[ref] ?? {}, name, defs, depth + 1);
  const t = Array.isArray(node?.type) ? node.type[0] : node?.type;
  switch (t) {
    case 'integer':
      return 0;
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'array': {
      if (depth >= 3) return [];
      const inner = sample(node.items ?? {}, name, defs, depth + 1);
      return inner === null ? [] : [inner];
    }
    case 'object':
      return {};
    case 'string':
      return `<${name}>`;
    default:
      // The door declared no type. Say so in the value rather than picking one.
      return node?.properties ? {} : `<${name}>`;
  }
}

/**
 * The runnable call.
 *
 * Every declared argument is included: the door marks none of them required, so
 * a reader has no way to know which to send, and an example that drops fields
 * would be teaching a guess. Values are derived from each field's declared
 * type — a placeholder is honest about being one.
 */
function callEnvelope(tool: McpTool): string {
  const schema = tool.inputSchema ?? {};
  const defs: Record<string, any> = schema.$defs ?? {};
  const args: Record<string, any> = {};
  for (const name of Object.keys(schema.properties ?? {}).sort()) {
    args[name] = sample(schema.properties![name], name, defs);
  }
  return JSON.stringify(
    { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.name, arguments: args } },
    null,
    2,
  );
}

const curl = (body: string): string =>
  `curl -X POST ${MCP_DOOR} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${body.split('\n').join('\n     ')}'`;

// ------------------------------------------------------------------- pages

/** The product a tool is filed under, and the slug of its folder. */
const productOf = (ops: Operation[] | undefined): string => (ops?.length ? ops[0].product : 'unmapped');

const provenance = (cat: McpCatalog): string =>
  `Generated from \`tools/list\` on \`${cat.door}\` — ${cat.meta.count} tools captured ${cat.meta.captured}` +
  (cat.meta.source === 'snapshot' ? ' (this build read the vendored copy; the door was unreachable).' : '.');

function renderTool(tool: McpTool, ops: Operation[] | undefined, cat: McpCatalog, doc: Document): string {
  const schema = tool.inputSchema ?? {};
  const fields = fieldsOf(schema);
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
  L.push(`| **Arguments** | ${fields.length} |`);
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
    L.push('This tool declares no arguments. Call it with an empty `arguments` object.');
  } else {
    L.push(...fieldTable(fields));
    L.push(...undeclaredNotice(schema, fields));
  }
  L.push(...defsTables(schema));
  L.push('');

  // 4. The call, built from the schema above.
  L.push('## Call it');
  L.push('');
  L.push(
    fields.length
      ? 'A `tools/call` carries every argument in one flat object — nothing binds to a path or a query string. Every declared argument is shown, because the door marks none of them required.'
      : 'A `tools/call` carries its arguments in one flat object. This tool declares none, so the object is empty.',
  );
  L.push('');
  L.push(...fence('bash', curl(callEnvelope(tool))));
  L.push('');
  L.push(
    (fields.length ? "Values are placeholders derived from each field's declared type. " : '') +
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
      `The door exposes \`${code(tool.name)}\`, but the OpenAPI document describes no operation for it — ` +
        'neither under that name nor at the route the name implies. Everything on this page comes from ' +
        '`tools/list`; there is no REST reference to link to until the route is declared in the document.',
    );
  } else {
    if (ops.length > 1) {
      L.push(
        `The document uses this name for ${ops.length} operations and the door does not say which it ` +
          'dispatches to. Both are listed.',
      );
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
    `[All ${cat.meta.count} tools](/docs/mcp-tools/all-tools) · [The door](/docs/mcp-tools) · [API reference](/docs/openapi)`,
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
      : `The door lists ${tools.length} tool${tools.length === 1 ? '' : 's'} that resolve to no operation in the OpenAPI document. They are documented from \`tools/list\` alone, and want declaring in hanzoai/openapi.`,
  );
  L.push('');
  L.push('| Tool | Route | Arguments | Description |');
  L.push('|---|---|---|---|');
  for (const t of tools) {
    const ops = mapped.get(t.name);
    L.push(
      `| [\`${code(t.name)}\`](/docs/mcp-tools/${product}/${t.name}) | ${
        ops?.length ? `\`${ops[0].method.toUpperCase()} ${code(ops[0].path)}\`` : '—'
      } | ${Object.keys(t.inputSchema?.properties ?? {}).length} | ${text(firstSentence(t.description, 100))} |`,
    );
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push(`[All ${cat.meta.count} tools](/docs/mcp-tools/all-tools) · [The door](/docs/mcp-tools)`);
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
      `Every one of the ${cat.meta.count} tools the Hanzo MCP door exposes, grouped by the product it calls.`,
    )}`,
  );
  L.push('---');
  L.push('');
  const unmapped = groups.get('unmapped')?.length ?? 0;
  L.push(
    `\`tools/list\` on \`${code(cat.door)}\` names **${cat.meta.count} tools** across **${
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
      `| [${text(p)}](/docs/mcp-tools/${p}) | ${groups.get(p)!.length} | ${
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
        `| [\`${code(t.name)}\`](/docs/mcp-tools/${p}/${t.name}) | ${
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
  L.push(
    'The door takes the same bearer credential as the REST API — a Hanzo IAM JWT or an `hk-` key from ' +
      '[console.hanzo.ai](https://console.hanzo.ai) — in an `Authorization` header on the request:',
  );
  L.push('');
  L.push(
    ...fence(
      'bash',
      `export HANZO_API_KEY=hk-...\ncurl -X POST ${cat.door} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`,
    ),
  );
  L.push('');
  L.push(
    'Set that header however your client sets request headers for an HTTP MCP server. One credential ' +
      'reaches every tool, because one credential reaches every product.',
  );
  L.push('');

  L.push('## What is behind the tools');
  L.push('');
  L.push(
    `Every tool is a projection of the same OpenAPI document that generates the REST reference, the SDKs and the CLI. ${cat.meta.count - unmapped} of the ${cat.meta.count} tools resolve to an operation in it, across ${groups.size - (unmapped ? 1 : 0)} products` +
      (unmapped
        ? `; ${unmapped} do not, and are [listed as such](/docs/mcp-tools/unmapped) rather than left out.`
        : '.'),
  );
  L.push('');
  L.push(
    `The door exposes a subset of the document, not all of it: ${cat.meta.count} tools against ${doc.operations.length} operations. Whether an operation has a tool is a question only the door answers, so every page here asks it rather than assuming.`,
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
    if (post) {
      const body = Object.keys(post.body?.schema?.properties ?? {});
      if (body.length) {
        L.push(
          ...fence(
            'bash',
            `curl -X POST ${doc.server}${post.path} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(
              Object.fromEntries(body.map((k) => [k, `<${k}>`])),
              null,
              2,
            )
              .split('\n')
              .join('\n     ')}'`,
          ),
        );
        L.push('');
        L.push(
          `Fields, types and prose for these routes are enumerated in the [${text(servers[0].product)} API reference](/docs/openapi/${servers[0].product}).`,
        );
        L.push('');
      }
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
  const clash = [...ordered.keys()].filter((p) => RESERVED.has(p));
  if (clash.length) {
    throw new Error(
      `[mcp-ref] product ${clash.join(', ')} collides with this section's own page — rename the page, not the product`,
    );
  }
  // Same hazard one level down: a tool named `index` would be written over its
  // own product's index page, and the folder would lose a tool without a word.
  const shadow = cat.tools.filter((t) => t.name === 'index' || t.name === 'meta');
  if (shadow.length) {
    throw new Error(`[mcp-ref] tool ${shadow.map((t) => t.name).join(', ')} would overwrite a folder page`);
  }

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  let pages = 0;
  for (const [product, tools] of ordered) {
    const dir = path.join(outDir, product);
    fs.mkdirSync(dir, { recursive: true });
    for (const t of tools) {
      fs.writeFileSync(path.join(dir, `${t.name}.mdx`), renderTool(t, mapped.get(t.name), cat, doc));
      pages++;
    }
    fs.writeFileSync(path.join(dir, 'index.mdx'), renderProductIndex(product, tools, cat, mapped));
    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify({ title: product, pages: ['index', ...tools.map((t) => t.name)] }, null, 2) + '\n',
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
        description: `The ${cat.meta.count} tools the Hanzo MCP door exposes, generated from tools/list.`,
        icon: 'Plug',
        pages: ['index', 'all-tools', ...ordered.keys()],
      },
      null,
      2,
    ) + '\n',
  );

  // Every tool got a page, and every page is reachable from the catalogue: the
  // two properties this reference claims, checked rather than asserted.
  const written = new Set<string>();
  for (const [product, tools] of ordered) for (const t of tools) written.add(`${product}/${t.name}`);
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
      `${withArgs} declaring arguments, ${cat.tools.length - unmapped} mapped to an operation` +
      (unmapped ? `, ${unmapped} the document does not describe` : ''),
  );
  console.log(`[mcp-ref] tool list captured ${cat.meta.captured} (${cat.meta.source}), 0 orphans`);
  return { pages: pages + 2, tools: cat.tools.length, unmapped };
}

if (import.meta.main) {
  genMcpPages().catch((e) => {
    console.error('[mcp-ref] failed', e);
    process.exit(1);
  });
}
