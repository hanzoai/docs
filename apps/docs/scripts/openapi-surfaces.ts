import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { aliases, deref, spellings, type Document, type Operation, type Param, type Product } from './openapi-doc';
import type { CliCommand } from './sync-cli-commands';
import { MCP_DOOR, ops, readOp, type McpTool } from './sync-mcp-tools';
import { load as loadClients } from './sync-sdk-clients';
import { fence, text } from './mdx';

// THE FOUR SURFACES.
//
// One operation in the document, rendered four ways: raw HTTP, the CLI, an SDK,
// and an MCP tool. Every surface is a pure function of the operation — none of
// them is a hand-written example that can drift from the API it describes.
//
// The SDK names are not invented here. openapi-generator derives a client's
// class and method names from the document's `tags` and `operationId`, so the
// rules below reproduce that derivation exactly; `openapi-surfaces.test.ts`
// pins them against the checked-in generated clients.

/** `OpenAI Compatible API` -> `OpenAICompatibleAPI`; `Key-Value` -> `KeyValue`. */
export const pascalTag = (tag: string): string =>
  tag
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('');

/**
 * `gateway_createChatCompletion` -> `gatewayCreateChatCompletion`, and
 * `cloud_AgentsController.Create` -> `cloudAgentsControllerCreate`: `_` and `.`
 * are both word separators, which is how openapi-generator sanitises them.
 */
export const camelId = (id: string): string => {
  const [head, ...rest] = id.split(/[_.]/).filter(Boolean);
  return (
    (head ? head[0].toLowerCase() + head.slice(1) : '') +
    rest.map((w) => w[0].toUpperCase() + w.slice(1)).join('')
  );
};

/** `gateway_createChatCompletion` -> `GatewayCreateChatCompletion`. */
export const pascalId = (id: string): string => {
  const c = camelId(id);
  return c ? c[0].toUpperCase() + c.slice(1) : c;
};

/** `gateway_createChatCompletion` -> `gateway_create_chat_completion`. */
export const snakeId = (id: string): string =>
  camelId(id)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();

/** A readable stand-in for a path/query value, derived from the parameter. */
export function placeholder(p: Param): string {
  const t = p.schema?.type;
  if (t === 'integer' || t === 'number') return '1';
  if (t === 'boolean') return 'true';
  const ex = p.schema?.example ?? p.schema?.default;
  if (ex != null && typeof ex !== 'object') return String(ex);
  const first = p.schema?.enum?.[0];
  if (first != null) return String(first);
  return `<${p.name}>`;
}

/** Fill `{id}` segments so the printed URL is a real one. */
export const concretePath = (op: Operation): string =>
  op.path.replace(/\{([^}]+)\}/g, (_m, name) => {
    const p = op.parameters.find((x) => x.name === name && x.in === 'path');
    return p ? placeholder(p) : `<${name}>`;
  });

const requiredQuery = (op: Operation): Param[] =>
  op.parameters.filter((p) => p.in === 'query' && p.required);

/**
 * A minimal example body: the schema's required properties only, so the sample
 * is something a reader can actually send rather than a wall of optionals.
 */
export function exampleBody(op: Operation, doc: Document, limit = 6): any {
  const s = op.body?.schema;
  if (!s || typeof s !== 'object') return undefined;
  const props = s.properties ?? {};
  const required: string[] = Array.isArray(s.required) ? s.required : [];
  const keys = required.length ? required : Object.keys(props).slice(0, 2);
  const out: Record<string, any> = {};
  for (const k of keys.slice(0, limit)) out[k] = sampleOf(doc.raw, props[k], doc, k);
  return Object.keys(out).length ? out : undefined;
}

function sampleOf(raw: any, schema: any, doc: Document, name = '', depth = 0): any {
  const s = deref(raw, schema);
  if (!s || typeof s !== 'object' || depth > 3) return null;
  if (s.example !== undefined) return s.example;
  if (s.default !== undefined) return s.default;
  if (s.enum?.length) return s.enum[0];
  const of = s.oneOf ?? s.anyOf ?? s.allOf;
  if (Array.isArray(of) && of.length) return sampleOf(raw, of[0], doc, name, depth + 1);
  const type = Array.isArray(s.type) ? s.type[0] : s.type;
  if (type === 'array' || s.items) return [sampleOf(raw, s.items, doc, name, depth + 1)];
  if (type === 'object' || s.properties) {
    const out: Record<string, any> = {};
    const required: string[] = Array.isArray(s.required) ? s.required : [];
    const keys = (required.length ? required : Object.keys(s.properties ?? {})).slice(0, 4);
    for (const k of keys) out[k] = sampleOf(raw, s.properties?.[k], doc, k, depth + 1);
    return out;
  }
  if (type === 'integer' || type === 'number') return 0;
  if (type === 'boolean') return false;
  if (s.format === 'date-time') return '2026-01-01T00:00:00Z';
  return `<${name || type || 'value'}>`;
}

// ---------------------------------------------------------------- raw HTTP

export function http(op: Operation, doc: Document): string {
  const q = requiredQuery(op)
    .map((p) => `${p.name}=${encodeURIComponent(placeholder(p))}`)
    .join('&');
  const url = `${doc.server}${concretePath(op)}${q ? `?${q}` : ''}`;
  const lines = [`curl ${op.method === 'get' ? '' : `-X ${op.method.toUpperCase()} `}${url} \\`];
  lines.push(`  -H "Authorization: Bearer $HANZO_API_KEY"`);
  const body = exampleBody(op, doc);
  if (body) {
    lines[lines.length - 1] += ' \\';
    lines.push(`  -H "Content-Type: ${op.body!.contentType}" \\`);
    lines.push(`  -d '${JSON.stringify(body, null, 2).split('\n').join('\n     ')}'`);
  }
  return lines.join('\n');
}

// -------------------------------------------------------------------- CLI

/**
 * The CLI has NO `hanzo api` passthrough and no raw-path escape: every
 * capability is a first-class subcommand, folded from the document's
 * method+path by hanzoai/cli and committed as data. So the command is looked up
 * in the CLI's own table rather than re-derived here — if the CLI does not
 * serve an operation, this returns null and the page says so instead of
 * printing a command that would not run.
 */
export function command(op: Operation, table: Map<string, CliCommand>): CliCommand | undefined {
  const verb = op.method.toUpperCase();
  for (const p of [op.path, ...aliases(op.path)]) {
    const hit = table.get(`${verb} ${p}`);
    if (hit) return hit;
  }
  return undefined;
}

export function cli(op: Operation, doc: Document, table: Map<string, CliCommand>): string | null {
  const cmd = command(op, table);
  if (!cmd) return null;
  const words = ['hanzo', cmd.product, ...cmd.nodes, cmd.verb];
  for (const name of cmd.params) {
    const p = op.parameters.find((x) => x.name === name && x.in === 'path');
    words.push(p ? placeholder(p) : `<${name}>`);
  }
  const body = exampleBody(op, doc);
  const flags = cmd.required.map((flag) => {
    const key = flag.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    const v = body?.[key];
    const s = v === undefined ? `<${flag}>` : typeof v === 'string' ? v : JSON.stringify(v);
    return `--${flag} ${/[\s'"{[]/.test(s) ? `'${s}'` : s}`;
  });
  return [words.join(' '), ...flags].join(flags.length > 1 ? ' \\\n  ' : ' ');
}

// -------------------------------------------------------------------- SDK

export interface SdkLang {
  id: string;
  label: string;
  /** The tab strip shows this — a file extension fits a chip; the name does not. */
  ext: string;
  /** Fence language for syntax highlighting. */
  lang: string;
  /**
   * The method this column will print for an operation, so a caller can ask
   * whether a PUBLISHED client has it without re-deriving the name and drifting
   * from what `render` actually writes.
   */
  method(op: Operation): string;
  render(op: Operation, doc: Document): string;
}

/**
 * Package names come from the SDK matrix (`openapi-specs/sdks.yaml`), which is
 * what drives the generator that publishes them — never from a copy here.
 * `@hanzo/sdk` became `hanzoai` in one commit; a hardcoded name would have gone
 * stale that day and taught an install that fails.
 */
const SDK_MATRIX: Record<string, any> = (() => {
  const f = new URL('../openapi-specs/sdks.yaml', import.meta.url).pathname;
  try {
    return parseYaml(readFileSync(f, 'utf8'))?.sdks ?? {};
  } catch {
    return {};
  }
})();

const pkg = (lang: string, prop: string, fallback: string): string =>
  String(SDK_MATRIX[lang]?.properties?.[prop] ?? fallback);

const args = (op: Operation, doc: Document): { keys: string[]; body?: any } => {
  const body = exampleBody(op, doc);
  const keys = op.parameters.filter((p) => p.required).map((p) => p.name);
  return { keys, body };
};

export const SDKS: SdkLang[] = [
  {
    id: 'typescript',
    method: (op) => camelId(op.id),
    label: 'TypeScript',
    ext: '.ts',
    lang: 'ts',
    render(op, doc) {
      const cls = `${pascalTag(op.product)}Api`;
      const { keys, body } = args(op, doc);
      const params = [
        ...keys.map((k) => `${k}: '${k}'`),
        ...(body ? Object.entries(body).map(([k, v]) => `${k}: ${JSON.stringify(v)}`) : []),
      ];
      return [
        `import { Configuration, ${cls} } from '${pkg('typescript', 'npmName', 'hanzoai')}';`,
        ``,
        `const api = new ${cls}(new Configuration({ accessToken: process.env.HANZO_API_KEY }));`,
        `const { data } = await api.${camelId(op.id)}(${params.length ? `{ ${params.join(', ')} }` : ''});`,
      ].join('\n');
    },
  },
  {
    id: 'python',
    method: (op) => snakeId(op.id),
    label: 'Python',
    ext: '.py',
    lang: 'python',
    render(op, doc) {
      const cls = `${pascalTag(op.product)}Api`;
      const py_pkg = pkg('python', 'packageName', 'hanzoai.cloud');
      const { keys, body } = args(op, doc);
      const params = [
        ...keys.map((k) => `${snakeId(k)}='${k}'`),
        ...(body ? Object.entries(body).map(([k, v]) => `${snakeId(k)}=${py(v)}`) : []),
      ];
      return [
        `from ${py_pkg} import ApiClient, Configuration`,
        `from ${py_pkg}.api import ${cls}`,
        ``,
        `client = ApiClient(Configuration(access_token=os.environ["HANZO_API_KEY"]))`,
        `result = ${cls}(client).${snakeId(op.id)}(${params.join(', ')})`,
      ].join('\n');
    },
  },
  {
    id: 'go',
    method: (op) => pascalId(op.id),
    label: 'Go',
    ext: '.go',
    lang: 'go',
    render(op, doc) {
      const svc = `${pascalTag(op.product)}API`;
      const go_pkg = pkg('go', 'packageName', 'cloud');
      return [
        `cfg := ${go_pkg}.NewConfiguration()`,
        `cfg.AddDefaultHeader("Authorization", "Bearer "+os.Getenv("HANZO_API_KEY"))`,
        `client := ${go_pkg}.NewAPIClient(cfg)`,
        ``,
        `resp, _, err := client.${svc}.${pascalId(op.id)}(context.Background()).Execute()`,
        `if err != nil {`,
        `\treturn err`,
        `}`,
      ].join('\n');
    },
  },
  {
    id: 'rust',
    method: (op) => snakeId(op.id),
    label: 'Rust',
    ext: '.rs',
    lang: 'rust',
    render(op, doc) {
      const mod = `${snakeId(pascalTag(op.product))}_api`;
      const crate = pkg('rust', 'packageName', 'hanzo-cloud').replace(/-/g, '_');
      return [
        `use ${crate}::apis::{configuration::Configuration, ${mod}};`,
        ``,
        `let mut cfg = Configuration::new();`,
        `cfg.bearer_access_token = std::env::var("HANZO_API_KEY").ok();`,
        ``,
        `let result = ${mod}::${snakeId(op.id)}(&cfg, Default::default()).await?;`,
      ].join('\n');
    },
  },
  {
    id: 'java',
    method: (op) => camelId(op.id),
    label: 'Java / Kotlin',
    ext: '.java',
    lang: 'java',
    render(op, doc) {
      const cls = `${pascalTag(op.product)}Api`;
      const jpkg = pkg('java', 'invokerPackage', 'ai.hanzo.cloud');
      return [
        `import ${jpkg}.ApiClient;`,
        `import ${jpkg}.api.${cls};`,
        ``,
        `ApiClient client = new ApiClient();`,
        `client.setRequestInterceptor(b -> b.header("Authorization", "Bearer " + System.getenv("HANZO_API_KEY")));`,
        ``,
        `var result = new ${cls}(client).${camelId(op.id)}();`,
      ].join('\n');
    },
  },
];

const py = (v: any): string =>
  v === null
    ? 'None'
    : typeof v === 'boolean'
      ? v
        ? 'True'
        : 'False'
      : JSON.stringify(v);

// -------------------------------------------------------------------- MCP

/**
 * THE TOOL RULE, in one place and read in both directions.
 *
 * MCP is a SUBSYSTEM server: `tools/list` answers 109 tools — `agents`,
 * `billing`, `iam` — and each declares an `op` enum naming the operations it
 * dispatches to. So the unit a caller names is a pair, `{name: <subsystem>,
 * arguments: {op, input}}`, not a tool per operation.
 *
 * A tool OWNS an operation when its enum names that operation's `operationId`
 * VERBATIM. Exact, nothing else — and measured on the live server: 470 of the
 * document's 2480 operations are named that way, and not one is claimed by two
 * tools, so the map needs no tie-break.
 *
 * MCP also names many operations by its OWN verb — `list_agents` where the
 * document says `get_agents` — and those aliases are not derivable from the
 * document (they are not a transformation of the id; MCP's `describe` is
 * the only thing that resolves them). We do not guess: an operation the enums do
 * not name verbatim gets no call printed, and the page says to ask `describe`,
 * which resolves an operationId whichever verb MCP prefers for it.
 *
 * The rule this replaces keyed a tool by the operationId AND by a method+path
 * slug. Under the flat shape both were true; under this one the second key still
 * matches — against tool names MCP stopped serving twelve days ago — so it
 * printed `get_v1_agents` as a tool for an operation MCP now answers
 * "unknown tool" to. A key that keeps matching after the thing it names is gone
 * is worse than no key.
 */
export interface Door {
  /** operationId -> the tool whose enum names it, where one does. */
  index: Map<string, string>;
  /** product name -> the tool of that name, where MCP has one. */
  byProduct: Map<string, McpTool>;
}

export const door = (tools: Iterable<McpTool>): Door => {
  const index = new Map<string, string>();
  const byProduct = new Map<string, McpTool>();
  for (const t of tools) {
    byProduct.set(t.name, t);
    for (const op of ops(t)) if (!index.has(op)) index.set(op, t.name);
  }
  return { index, byProduct };
};

/**
 * THE TOOL THAT SERVES A CAPABILITY — asked of MCP, not of the name.
 *
 * MCP groups its tools its own way, and the obvious join — look for a tool
 * CALLED `s3` — answers "there is none" for a capability MCP serves
 * perfectly well under another word. Measured against the vendored list, `s3` is
 * served by `storage` and `network` by `zt`; a name lookup reports both as
 * unreachable from MCP and sends the reader to HTTP for a call MCP already
 * takes.
 *
 * So the name is the FIRST question and never the only one. What settles it is
 * the operationId index: whichever tool names this capability's operations IS
 * the tool that serves it, whatever it is called. That join is exact, needs no
 * alias, and survives any renaming on either side — the two vocabularies meet at
 * the operation, which is the one thing both of them spell the same way.
 *
 * `named` is the count under the DOCUMENT's own ids. An MCP server may serve an
 * operation under a verb of its own, so `named` is a floor on what is reachable
 * and never a ceiling, and a page that prints it says which it is.
 */
export interface Server {
  tool: McpTool;
  /**
   * Of this capability's operations, those MCP names by the DOCUMENT's own
   * id — through any tool, because a caller who has the id can call it wherever
   * MCP filed it. This is the reachability number; `tool` is the separate
   * question of who to address, and the two are kept apart on purpose.
   */
  named: number;
}

export function server(p: Product, d: Door): Server | undefined {
  const named = p.operations.filter((o) => d.index.has(o.id)).length;
  const mine = (t: McpTool): number =>
    p.operations.filter((o) => d.index.get(o.id) === t.name).length;
  const byName = d.byProduct.get(p.name) ?? spellings(p.name).map((n) => d.byProduct.get(n)).find(Boolean);
  if (byName) return { tool: byName, named };
  // Nothing is called this. Ask which tool answers for it instead.
  let best: McpTool | undefined;
  let most = 0;
  for (const t of d.byProduct.values()) {
    const n = mine(t);
    if (n > most) [best, most] = [t, n];
  }
  return best ? { tool: best, named } : undefined;
}

/**
 * Every tool MCP lists, resolved to the operations it names. A tool absent
 * from the map names none the document describes.
 */
export function toolOperations(doc: Document, tools: Iterable<McpTool>): Map<string, Operation[]> {
  const out = new Map<string, Operation[]>();
  for (const t of tools) {
    const hit = ops(t)
      .map((o) => doc.byId.get(o))
      .filter((o): o is Operation => Boolean(o));
    if (hit.length) out.set(t.name, hit);
  }
  return out;
}

/**
 * MCP exposes a SUBSET of the document, so whether a given operation can be
 * called by name is a question only MCP answers. We look it up in the
 * vendored index and return null when it is absent, rather than printing a call
 * that would come back "unknown tool".
 *
 * A `tools/call` carries every argument in ONE FLAT `input` object — neither
 * path nor query binds — so there is no path/query/body split to model here.
 */
export function mcp(
  op: Operation,
  doc: Document,
  d: Door,
): { tool: string; op: string; call: string } | null {
  const tool = d.index.get(op.id);
  if (!tool) return null;
  const input: Record<string, any> = {};
  for (const p of op.parameters.filter((x) => x.required)) input[p.name] = placeholder(p);
  Object.assign(input, exampleBody(op, doc) ?? {});
  return {
    tool,
    op: op.id,
    call: JSON.stringify(
      { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: { op: op.id, input } } },
      null,
      2,
    ),
  };
}

/** Ask MCP what an operation IT NAMES does, and what it takes. */
export const describeCall = (op: string): string =>
  JSON.stringify(
    { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'describe', arguments: { op } } },
    null,
    2,
  );

// ------------------------------------------------------------- first call

/**
 * What a caller runs FIRST against a product, chosen by the document.
 *
 * A newcomer holds one thing: a key. So the first call is the operation that
 * needs nothing else — a read, no path parameter, no required query, no body —
 * and among those the shortest path, which is the collection at the product's
 * root. `GET /v1/agents` before `GET /v1/agents/sessions/{id}/tree`.
 *
 * Ranked, never hand-picked, so a product added to the document arrives with a
 * first call already chosen and nothing to remember. Measured on the document:
 * 152 of 188 products have one that runs on a key alone; the other 36 lead with
 * a POST or an id because that is genuinely their entry point, and the page says
 * so rather than pretending otherwise — see `runnable`.
 */
/**
 * The path's OWN placeholders, not the declared parameter list.
 *
 * `GET /v1/videos/{id}` declares no `id` parameter, so counting declared path
 * parameters scored it as needing nothing and the page taught it as a call that
 * runs on a key alone — against a URL still carrying a brace. Probed live, it
 * 404s, which is exactly what the reader would have got. What a URL needs filling
 * in is a fact about the URL.
 */
const holes = (o: Operation): number => (o.path.match(/\{[^}]+\}/g) ?? []).length;

const cost = (o: Operation): number =>
  Math.max(holes(o), o.parameters.filter((p) => p.in === 'path').length) * 100 +
  o.parameters.filter((p) => p.required && p.in !== 'path').length * 10 +
  (o.body?.required ? 5 : 0);

/** True when a key is the only thing this call needs. */
export const runnable = (o: Operation): boolean => o.method === 'get' && cost(o) === 0;

export function firstCall(p: Product): Operation {
  const rank = (o: Operation) => [
    o.deprecated ? 1 : 0,
    o.method === 'get' ? 0 : 1,
    cost(o),
    o.path.split('/').length,
    o.path.length,
  ];
  return [...p.operations].sort((a, b) => {
    const x = rank(a);
    const y = rank(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
    return a.id.localeCompare(b.id);
  })[0];
}

// ----------------------------------------------------------- client lag

/**
 * Said only when it is true of THIS operation: the published client does not
 * carry the method the column above prints.
 *
 * A sample is a projection of the document; a published client is a projection
 * of the document at ITS OWN lock, and cloud dropping the default version from
 * its operationIds moved every name at once. So the column prints the method at
 * the current release — which is the one that agrees with the endpoint, the
 * operation id and the MCP server — and this line names the client that does not
 * have it yet. It is computed from the two, so it cannot outlive the gap: the
 * release that regenerates the clients deletes this sentence by itself.
 */
/**
 * The published clients that do NOT declare a method for this operation.
 *
 * Two readers, one definition: the note under an operation's SDK tab that says
 * which client lags, and the capability table's SDK column, which counts the
 * operations every client can already call. They were never allowed to disagree
 * — the note said `hanzoai@8.5.89` is behind on an operation while the table
 * above it printed that same operation as a method the reader has.
 *
 * A client declaring NO methods is a registry that had a bad day, not a client
 * that lost them, so it is not counted as behind — the same rule the sync uses
 * when it keeps the vendored copy.
 */
const declared = new WeakMap<object, Set<string>>();

export function behind(op: Operation): { pkg: string; version: string; registry: string }[] {
  return loadClients().clients.filter((c) => {
    const sdk = SDKS.find((s) => s.id === c.lang);
    if (!sdk || !c.methods.length) return false;
    let have = declared.get(c);
    if (!have) declared.set(c, (have = new Set(c.methods)));
    return !have.has(sdk.method(op));
  });
}

function clientLag(op: Operation): string {
  const lagging = behind(op);
  if (!lagging.length) return '';
  const named = lagging
    .map((c) => `\`${c.pkg}@${c.version}\` (${c.registry})`)
    .join(' and ');
  return (
    `The method above is the one at the current release of the document. ${named} ` +
    `${lagging.length > 1 ? 'were' : 'was'} generated from an earlier release, where this operation carried a ` +
    'different id, so it spells the method differently — regenerating the clients is what makes the two agree. ' +
    '[SDKs →](/docs/sdks)'
  );
}

// ---------------------------------------------------------------- surfaces

/**
 * ONE operation, four ways — the block itself, not just the strings in it.
 *
 * The flow pages and every product's quickstart show the same thing, so they
 * render through the same function. Two callers of a copy is two renderers the
 * day one of them learns something: when MCP regrouped, a copy would have
 * been fixed on the flows and left lying on 188 product pages.
 */
export function surfaces(
  op: Operation,
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
): string[] {
  const L: string[] = [];
  const command = cli(op, doc, table);
  const tool = mcp(op, doc, d);

  L.push("<Tabs items={['CLI', 'SDK', 'HTTP', 'MCP']}>");

  L.push('<Tab value="CLI">');
  if (command) {
    L.push(...fence('bash', command));
  } else {
    L.push(
      '`hanzo` has no subcommand for this operation — the CLI serves only what cloud\'s live route table confirms. Use HTTP or an SDK.',
    );
  }
  L.push('</Tab>');

  L.push('<Tab value="SDK">');
  L.push(`<Tabs items={[${SDKS.map((s) => `'${s.ext}'`).join(', ')}]}>`);
  for (const sdk of SDKS) {
    L.push(`<Tab value="${sdk.ext}">`);
    L.push(...fence(sdk.lang, sdk.render(op, doc)));
    L.push('</Tab>');
  }
  L.push('</Tabs>');
  const lag = clientLag(op);
  if (lag) {
    L.push('');
    L.push(lag);
  }
  L.push('</Tab>');

  L.push('<Tab value="HTTP">');
  L.push(...fence('bash', http(op, doc)));
  L.push('</Tab>');

  L.push('<Tab value="MCP">');
  if (tool) {
    L.push(`Tool \`${tool.tool}\`, op \`${tool.op}\` — POST the JSON-RPC envelope to \`${MCP_DOOR}\`.`);
    L.push('');
    L.push(
      ...fence(
        'bash',
        `curl -X POST ${MCP_DOOR} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${tool.call.split('\n').join('\n     ')}'`,
      ),
    );
  } else {
    // MCP has its own verb for most operations, and only MCP knows
    // which. `describe` was printed here for the operation itself, on the
    // strength of two ids that happened to resolve — probed across five
    // products, `get_kv`, `get_audit` and `get_agents` resolve while
    // `get_models` and `get_billing_tier` answer `unknown tool`. So describing
    // an id MCP has not declared is a call that fails, and offering it
    // taught two of five readers a dead end.
    //
    // What IS known is the tool that serves this product and the operations that
    // tool declares. So the page teaches MCP's own discovery — a real tool,
    // a real op it names, a call that runs — instead of guessing at this one.
    const own = doc.products.find((p) => p.name === op.product);
    const serving = own && server(own, d);
    const read = serving && readOp(serving.tool);
    if (serving && read) {
      L.push(
        `MCP reaches **${text(op.product)}** through the \`${serving.tool.name}\` tool, which names its ${ops(serving.tool).length} operations ` +
          `with its own verbs — this one among them, under a name only MCP declares. \`describe\` explains any of them:`,
      );
      L.push('');
      L.push(
        ...fence(
          'bash',
          `curl -X POST ${MCP_DOOR} \\\n  -H "Content-Type: application/json" \\\n  -d '${describeCall(read)
            .split('\n')
            .join('\n     ')}'`,
        ),
      );
    } else {
      L.push(
        `MCP declares no tool for **${text(op.product)}** — \`tools/list\` on \`${MCP_DOOR}\` names the products it does reach. Use HTTP or an SDK.`,
      );
    }
  }
  L.push('</Tab>');

  L.push('</Tabs>');
  return L;
}
