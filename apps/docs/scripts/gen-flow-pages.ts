import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { loadDocument, type Document, type Operation } from './openapi-doc';
import { SDKS, cli, http, mcp } from './openapi-surfaces';
import { MCP_DOOR, loadMcpTools } from './sync-mcp-tools';
import type { CliCommand } from './sync-cli-commands';

// SIX FLOWS, FOUR SURFACES.
//
// The same six journeys — hello, chat, money, store, agent, tools — rendered as
// the CLI, an SDK, raw HTTP and an MCP tool. Four columns, one journey.
//
// This is the whole product story in one page set, and it is true by
// construction: the four surfaces are projections of ONE doc comment. As
// hanzoai/cli puts it, "the prose IS the help ... the same sentence the OpenAPI
// description, the MCP tool and the SDK docstring carry, because all four are
// projections of one doc comment." So the four columns cannot disagree — none
// of them is written here.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCUMENT = path.join(APP_ROOT, 'openapi-specs/hanzo.yaml');
const FLOWS = path.join(APP_ROOT, 'openapi-specs/flows.yaml');
const CLI_TABLE = path.join(APP_ROOT, 'openapi-specs/cli-commands.json');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/start');

/**
 * Upstream's shape (hanzoai/openapi flows.yaml): a map of flow id to a summary,
 * the operationIds in CALL ORDER, and any notes a caller needs. Data only —
 * which routes a journey calls, never what they do.
 */
interface Flow {
  id: string;
  title: string;
  summary: string;
  notes: string;
  operations: string[];
}

const titleOf = (id: string): string => id[0].toUpperCase() + id.slice(1);

function readFlows(file: string): Flow[] {
  const raw = parseYaml(fs.readFileSync(file, 'utf8'))?.flows;
  if (!raw || typeof raw !== 'object') return [];
  return Object.entries<any>(raw).map(([id, f]) => ({
    id,
    title: titleOf(id),
    summary: String(f.summary ?? '').trim(),
    notes: String(f.notes ?? '').trim(),
    operations: f.operations ?? [],
  }));
}

const text = (s: unknown): string =>
  String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'));

function prose(s: string): string {
  if (!s) return '';
  return String(s)
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'))
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'),
    )
    .join('')
    .trim();
}

const fence = (lang: string, body: string): string[] => ['```' + lang, body, '```'];

/**
 * The MCP door is real and undeclared.
 *
 * `POST /v1/mcp` answers JSON-RPC `tools/list` with 730 tools — verified on the
 * wire. hanzo.yaml declares only `/v1/mcp/servers`, so the spec lane recorded
 * the door as "not routed": a true statement about the document and a false one
 * about the fleet. The docs must describe what actually answers, and must say
 * out loud that the document does not, so it gets declared instead of quietly
 * forgotten.
 *
 * This notice is computed, not written: the moment hanzo.yaml declares the
 * path, `doc.raw.paths` contains it and the warning disappears on its own. It
 * cannot outlive the gap it describes.
 */
function doorNotice(doc: Document): string[] {
  const declared = Object.keys(doc.raw.paths ?? {}).includes('/v1/mcp');
  if (declared) return [];
  return [
    `> **The MCP door is not in the OpenAPI document.** \`POST ${MCP_DOOR}\` answers` +
      ' JSON-RPC 2.0 `tools/list` and `tools/call` — it is live and is what the MCP' +
      ' column below calls. The document declares only `/v1/mcp/servers`, so this' +
      ' route is undeclared and needs adding to hanzoai/openapi. Any note below' +
      ' that calls it unrouted was written from the document, not the wire, and' +
      ' is out of date. This notice is generated from the gap itself and will' +
      ' vanish once the route is declared.',
    '',
  ];
}

/**
 * The operation's signature — parameters and body fields, optional ones
 * included.
 *
 * The four surfaces show a MINIMAL call, which by construction carries only
 * what is required; that hid the part of an operation a reader most needs. A
 * time window is the case in point: `GET /v1/billing/usage` takes `start` and
 * `end`, both optional, so every column rendered a bare URL and the ledger
 * looked unwindowed. Same document, same fields as the reference — printed here
 * so the journey shows what the call actually accepts.
 */
function signature(op: Operation): string[] {
  const rows = [
    ...op.parameters.map((p) => [p.name, p.in, p.required, p.description] as const),
    ...Object.entries<any>(op.body?.schema?.properties ?? {})
      .slice(0, 12)
      .map(
        ([n, s]) =>
          [
            n,
            'body',
            (op.body?.schema?.required ?? []).includes(n),
            String(s?.description ?? ''),
          ] as const,
      ),
  ];
  if (!rows.length) return [];
  return [
    '| Parameter | In | Required | Description |',
    '|---|---|---|---|',
    ...rows.map(
      ([n, where, req, desc]) =>
        `| \`${n}\` | ${where} | ${req ? 'yes' : '—'} | ${text(String(desc).slice(0, 110))} |`,
    ),
    '',
  ];
}

/** One operation, four ways. */
function surfaces(
  op: Operation,
  doc: Document,
  table: Map<string, CliCommand>,
  tools: Map<string, { name: string }>,
): string[] {
  const L: string[] = [];
  const command = cli(op, doc, table);
  const tool = mcp(op, doc, tools);

  L.push('<Tabs items={[\'CLI\', \'SDK\', \'HTTP\', \'MCP\']}>');

  L.push('<Tab value="CLI">');
  if (command) {
    L.push(...fence('bash', command));
  } else {
    L.push(
      `\`hanzo\` has no subcommand for this operation — the CLI serves only what cloud's live route table confirms. Use HTTP or an SDK.`,
    );
  }
  L.push('</Tab>');

  L.push('<Tab value="SDK">');
  L.push(`<Tabs items={[${SDKS.map((s) => `'${s.label}'`).join(', ')}]}>`);
  for (const sdk of SDKS) {
    L.push(`<Tab value="${sdk.label}">`);
    L.push(...fence(sdk.lang, sdk.render(op, doc)));
    L.push('</Tab>');
  }
  L.push('</Tabs>');
  L.push('</Tab>');

  L.push('<Tab value="HTTP">');
  L.push(...fence('bash', http(op, doc)));
  L.push('</Tab>');

  L.push('<Tab value="MCP">');
  if (tool) {
    L.push(`Tool \`${tool.tool}\` — POST the JSON-RPC envelope to \`${MCP_DOOR}\`.`);
    L.push('');
    L.push(...fence('bash', `curl -X POST ${MCP_DOOR} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${tool.call.split('\n').join('\n     ')}'`));
  } else {
    L.push(
      `The MCP door does not expose this operation as a tool. It answers \`tools/list\` at \`${MCP_DOOR}\` with the ones it does.`,
    );
  }
  L.push('</Tab>');

  L.push('</Tabs>');
  return L;
}

function renderFlow(
  flow: Flow,
  ops: Operation[],
  doc: Document,
  table: Map<string, CliCommand>,
  tools: Map<string, { name: string }>,
): string {
  const L: string[] = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(flow.title)}`);
  L.push(`description: ${JSON.stringify(flow.summary)}`);
  L.push('---');
  L.push('');
  L.push("import { Tab, Tabs } from '@hanzo/docs-ui/components/tabs'");
  L.push('');
  L.push(`**${text(flow.summary)}**`);
  L.push('');
  L.push(...doorNotice(doc));
  if (flow.notes) {
    L.push(`> ${prose(flow.notes)}`);
    L.push('');
  }

  for (const op of ops) {
    L.push(`## ${text(op.summary || op.name)}`);
    L.push('');
    L.push(`\`${op.method.toUpperCase()} ${op.path}\` · [reference →](/docs/openapi/${op.product})`);
    L.push('');
    if (op.description) {
      L.push(prose(op.description));
      L.push('');
    }
    L.push(...signature(op));
    L.push(...surfaces(op, doc, table, tools));
    L.push('');
  }

  L.push('---');
  L.push('');
  L.push(
    'Every command, call and tool above is generated from the same OpenAPI document that generates the SDKs themselves — the four surfaces are projections of one doc comment, so they cannot disagree.',
  );
  L.push('');
  return L.join('\n');
}

function renderIndex(flows: Flow[], doc: Document): string {
  const L: string[] = [];
  L.push('---');
  L.push('title: Start');
  L.push(
    `description: ${JSON.stringify(
      `Six journeys through Hanzo — hello, chat, money, store, agent, tools — each shown as the CLI, an SDK, raw HTTP and an MCP tool.`,
    )}`,
  );
  L.push('icon: Rocket');
  L.push('---');
  L.push('');
  L.push("import { Cards, Card } from '@hanzo/docs-ui/components/card'");
  L.push('');
  L.push('# Six flows, four surfaces');
  L.push('');
  L.push(
    'Hanzo is a full AI cloud: inference, identity, data, money, agents and tools behind one API key. These six journeys are the whole product in miniature — and each one is shown four ways, because the CLI, the SDKs, the REST API and the MCP tools are all projections of the same OpenAPI document.',
  );
  L.push('');
  L.push('Learn a flow once and you know it on every surface.');
  L.push('');
  L.push('<Cards>');
  for (const f of flows) {
    L.push(`  <Card title=${JSON.stringify(f.title)} href="/docs/start/${f.id}">`);
    L.push(`    ${text(f.summary)}`);
    L.push('  </Card>');
  }
  L.push('</Cards>');
  L.push('');
  L.push('## One credential');
  L.push('');
  L.push('```bash');
  L.push('export HANZO_API_KEY=hk-...            # console.hanzo.ai');
  L.push('hanzo auth login                       # or sign in through Hanzo IAM');
  L.push('```');
  L.push('');
  L.push(
    `The same key reaches every one of the [${doc.products.length} products in the API reference](/docs/openapi).`,
  );
  L.push('');
  return L.join('\n');
}

export async function genFlowPages(): Promise<void> {
  if (!fs.existsSync(FLOWS)) {
    console.warn('[flows] no flows.yaml; skipping');
    return;
  }
  const doc = loadDocument(DOCUMENT);
  const flows = readFlows(FLOWS);
  const tools = loadMcpTools();
  const table = new Map<string, CliCommand>(
    (fs.existsSync(CLI_TABLE)
      ? (JSON.parse(fs.readFileSync(CLI_TABLE, 'utf8')) as CliCommand[])
      : []
    ).map((c) => [c.key, c]),
  );

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let withCli = 0;
  let withMcp = 0;
  let total = 0;
  for (const flow of flows) {
    const ops = flow.operations.map((id) => {
      const op = doc.byId.get(id);
      // A flow may never name an operation the document does not have: that is
      // exactly the hand-written drift this pipeline exists to prevent.
      if (!op) throw new Error(`[flows] ${flow.id}: "${id}" is not an operationId in the document`);
      return op;
    });
    total += ops.length;
    for (const op of ops) {
      if (table.has(`${op.method.toUpperCase()} ${op.path}`)) withCli++;
      if (mcp(op, doc, tools)) withMcp++;
    }
    fs.writeFileSync(path.join(OUT_DIR, `${flow.id}.mdx`), renderFlow(flow, ops, doc, table, tools));
  }
  fs.writeFileSync(path.join(OUT_DIR, 'index.mdx'), renderIndex(flows, doc));
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'Start',
        description: 'Six journeys, each shown as CLI, SDK, HTTP and MCP.',
        pages: ['index', ...flows.map((f) => f.id)],
      },
      null,
      2,
    ) + '\n',
  );

  console.log(
    `[flows] ${flows.length} flows, ${total} operations — ${withCli} with a CLI command, ` +
      `${withMcp} with an MCP tool, ${total} with HTTP and ${SDKS.length} SDK languages`,
  );
}

if (import.meta.main) {
  genFlowPages().catch((e) => {
    console.error('[flows] failed', e);
    process.exit(1);
  });
}
