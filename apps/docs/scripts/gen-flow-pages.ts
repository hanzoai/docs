import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { DOCUMENT, loadDocument, secretKey, publishableKey, type Document, type Operation } from './openapi-doc';
import { SDKS, door, mcp, surfaces, type Door } from './openapi-surfaces';
import { MCP_DOOR, load } from './sync-mcp-tools';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { prose, text } from './mdx';

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
const FLOWS = path.join(APP_ROOT, 'openapi-specs/flows.yaml');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/start');

/**
 * flows.yaml's shape: a map of flow id to a summary, the operationIds in CALL
 * ORDER, and any notes a caller needs. Data only — which routes a journey calls,
 * never what they do.
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


/**
 * The MCP door is real and undeclared.
 *
 * `POST /v1/mcp` answers JSON-RPC `tools/list` — verified on the wire, and the
 * count is passed in rather than written here, because it has already moved
 * twice (833 flat tools, then 109 subsystem tools reaching 1384 operations) and
 * a number in a sentence does not move with it.
 * hanzo.yaml declares only `/v1/mcp/servers`, so the spec lane recorded
 * the door as "not routed": a true statement about the document and a false one
 * about the fleet. The docs must describe what actually answers, and must say
 * out loud that the document does not, so it gets declared instead of quietly
 * forgotten.
 *
 * This notice is computed, not written: the moment hanzo.yaml declares the
 * path, `doc.raw.paths` contains it and the warning disappears on its own. It
 * cannot outlive the gap it describes.
 */
function doorNotice(doc: Document, reach: number): string[] {
  const declared = Object.keys(doc.raw.paths ?? {}).includes('/v1/mcp');
  if (declared) return [];
  return [
    `> **The MCP door is not in the OpenAPI document.** \`POST ${MCP_DOOR}\` answers` +
      ` JSON-RPC 2.0 \`tools/list\` and \`tools/call\`, reaching ${reach} operations —` +
      ' it is live and is what the MCP column below calls. The document declares' +
      ' only `/v1/mcp/servers`, so this route is undeclared and needs adding to' +
      ' hanzoai/cloud. Any note below that calls it unrouted was written from the' +
      ' document, not the wire, and is out of date. This notice is generated from' +
      ' the gap itself and will vanish once the route is declared.',
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

function renderFlow(
  flow: Flow,
  ops: Operation[],
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
  reach: number,
): string {
  const L: string[] = [];
  L.push('---');
  L.push(`title: ${JSON.stringify(flow.title)}`);
  L.push(`description: ${JSON.stringify(flow.summary)}`);
  L.push('---');
  L.push('');
  L.push("import { Tab, Tabs } from '@hanzo/docs-base-ui/components/tabs'");
  L.push('');
  L.push(`**${text(flow.summary)}**`);
  L.push('');
  L.push(...doorNotice(doc, reach));
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
    L.push(...surfaces(op, doc, table, d));
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
      `One task per page, each written four ways: a CLI command, an SDK call, an HTTP request and an MCP tool.`,
    )}`,
  );
  L.push('icon: Rocket');
  L.push('---');
  L.push('');
  L.push("import { Cards, Card } from '@hanzo/docs-base-ui/components/card'");
  L.push('');
  L.push('# Start');
  L.push('');
  // No counts in the prose. A number here is a fact about today's document that
  // reads as a claim about the product, and it is wrong the next time the
  // document moves. What does not go stale is what the surfaces ARE.
  const pk = publishableKey(doc);
  L.push(
    'One key authenticates every request. `' +
      secretKey(doc).prefix +
      '` keys resolve to a user and belong on a server' +
      (pk
        ? '; `' + pk.prefix + '` keys resolve only to an organisation and are safe in a browser.'
        : '.'),
  );
  L.push('');
  L.push('```bash');
  L.push(`export HANZO_API_KEY=${secretKey(doc).prefix}...     # console.hanzo.ai`);
  L.push('hanzo auth login                # or sign in through Hanzo IAM');
  L.push('```');
  L.push('');
  L.push('## Four surfaces, one contract');
  L.push('');
  L.push(
    'The CLI, the SDKs, the HTTP API and the MCP tools are generated from the same OpenAPI document. A command, a method, a path and a tool that do the same thing are the same operation under four names, so what you learn on one surface holds on the others.',
  );
  L.push('');
  L.push('| Surface | Address |');
  L.push('| --- | --- |');
  L.push('| CLI | `hanzo <capability> <verb>` |');
  L.push('| SDK | a method per operation, in your language |');
  L.push('| HTTP | `https://api.hanzo.ai/v1/<capability>` |');
  L.push('| MCP | one tool per capability, dispatched by operation |');
  L.push('');
  L.push('## Tasks');
  L.push('');
  L.push('Each page below does one thing, and does it on all four surfaces.');
  L.push('');
  L.push('<Cards>');
  for (const f of flows) {
    L.push(`  <Card title=${JSON.stringify(f.title)} href="/docs/start/${f.id}">`);
    L.push(`    ${text(f.summary)}`);
    L.push('  </Card>');
  }
  L.push('</Cards>');
  L.push('');
  L.push(
    'Every capability the API serves is in the [reference](/docs/openapi), and the same key reaches all of it.',
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
  const cat = load();
  const d = door(cat.tools);
  const table = loadCliTable();

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
      if (mcp(op, doc, d)) withMcp++;
    }
    fs.writeFileSync(path.join(OUT_DIR, `${flow.id}.mdx`), renderFlow(flow, ops, doc, table, d, cat.meta.reach));
  }
  fs.writeFileSync(path.join(OUT_DIR, 'index.mdx'), renderIndex(flows, doc));
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'Start',
        description: 'One task per page, each written as CLI, SDK, HTTP and MCP.',
        // Not led by `index` — this folder's own `index.mdx` is its landing
        // page already, and naming it publishes `Start > Start`.
        pages: flows.map((f) => f.id),
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
