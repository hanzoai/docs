import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { deref, type Document, type Operation, type Param } from './openapi-doc';
import type { CliCommand } from './sync-cli-commands';

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
export function cli(op: Operation, doc: Document, table: Map<string, CliCommand>): string | null {
  const cmd = table.get(`${op.method.toUpperCase()} ${op.path}`);
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
  /** Fence language for syntax highlighting. */
  lang: string;
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
    label: 'TypeScript',
    lang: 'ts',
    render(op, doc) {
      const cls = `${pascalTag(op.tag)}Api`;
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
    label: 'Python',
    lang: 'python',
    render(op, doc) {
      const cls = `${pascalTag(op.tag)}Api`;
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
    label: 'Go',
    lang: 'go',
    render(op, doc) {
      const svc = `${pascalTag(op.tag)}API`;
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
    label: 'Rust',
    lang: 'rust',
    render(op, doc) {
      const mod = `${snakeId(pascalTag(op.tag))}_api`;
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
    label: 'Java / Kotlin',
    lang: 'java',
    render(op, doc) {
      const cls = `${pascalTag(op.tag)}Api`;
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
 * THE TOOL-NAME RULE, in one place and read in both directions.
 *
 * The door names a tool for the operation's `operationId`, and the document
 * publishes that id bare — `get_tools` is `get_tools`. That is the primary
 * key.
 *
 * Where an operationId spells a path parameter differently from the door
 * (`delete_projects_by_slug` against the door's `delete_projects_slug`)
 * the name misses, so the operation's method and path are a second key.
 * Measured against the live door: the name key resolves 802 of 833 tools and
 * the method+path key the rest.
 *
 * Both directions use these keys, so "which operation is this tool?" and "does
 * this operation have a tool?" can never disagree.
 */
export const toolKeys = (op: Operation): [name: string, route: string] => [
  op.name,
  `${op.method}_${op.path.replace(/[{}]/g, '').split('/').filter(Boolean).join('_')}`.toLowerCase(),
];

/**
 * Every tool the door lists, resolved to the operations it can name. A tool
 * absent from the map is one the document does not describe; a tool with more
 * than one operation is a name the document uses twice, and the door does not
 * say which it dispatches to.
 */
export function toolOperations(doc: Document, tools: Iterable<{ name: string }>): Map<string, Operation[]> {
  const byName = new Map<string, Operation[]>();
  const byRoute = new Map<string, Operation[]>();
  for (const op of doc.operations) {
    const [name, route] = toolKeys(op);
    (byName.get(name) ?? byName.set(name, []).get(name)!).push(op);
    (byRoute.get(route) ?? byRoute.set(route, []).get(route)!).push(op);
  }
  const out = new Map<string, Operation[]>();
  for (const t of tools) {
    const hit = byName.get(t.name) ?? byRoute.get(t.name.toLowerCase());
    if (hit) out.set(t.name, hit);
  }
  return out;
}

/**
 * The door exposes a SUBSET of the document, so whether a given operation has a
 * tool is a question only the door answers. We look it up in the vendored list
 * and return null when it is absent, rather than printing a call that would
 * come back "unknown tool".
 *
 * A `tools/call` carries every argument in ONE FLAT object — neither path nor
 * query binds — so there is no path/query/body split to model here.
 */
export function mcp(
  op: Operation,
  doc: Document,
  tools: Map<string, { name: string }>,
): { tool: string; call: string } | null {
  const tool = toolKeys(op).find((k) => tools.has(k));
  if (!tool) return null;
  const argsObj: Record<string, any> = {};
  for (const p of op.parameters.filter((x) => x.required)) argsObj[p.name] = placeholder(p);
  Object.assign(argsObj, exampleBody(op, doc) ?? {});
  return {
    tool,
    call: JSON.stringify(
      { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool, arguments: argsObj } },
      null,
      2,
    ),
  };
}
