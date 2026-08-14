import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The MCP door's tool list, taken from the MCP door.
//
// `POST https://api.hanzo.ai/v1/mcp` speaks JSON-RPC 2.0 and answers
// `tools/list` with the tools this fleet actually exposes — a subset of the
// document's operations, not all of them. So "is there an MCP tool for this
// operation?" is a question only the door can answer, and the docs ask it
// rather than assuming.
//
// The WHOLE answer is kept, `inputSchema` included: the tool reference renders
// one page per tool straight from this file, so what the door declares is what
// the page prints. A summary would drift from the door; a verbatim copy cannot.
//
// Snapshot, like the document and the CLI table: fetched when reachable, and
// the committed copy when not, so a builder with no egress still renders a
// truthful reference. `meta.captured` records when the copy on disk was taken,
// which is what a page's provenance line states instead of implying it is live.
//
// The door names operations TWO ways and both are here, because it changed
// shape. It used to answer one flat tool per operation (833 of them). It now
// answers 109 SUBSYSTEM tools — `agents`, `billing`, `iam` — each declaring an
// `op` enum of the operations it dispatches to, 1383 in all. `ops()` reads
// either shape, so nothing downstream has to know which one answered.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT = path.join(APP_ROOT, 'openapi-specs/mcp-tools.json');

/** The live JSON-RPC door. It is NOT declared in hanzo.yaml — see doorNotice. */
export const MCP_DOOR = 'https://api.hanzo.ai/v1/mcp';

export interface McpTool {
  name: string;
  /** The tool's description, verbatim — the door's own prose. */
  description: string;
  /** The tool's declared arguments, verbatim: a JSON Schema object. */
  inputSchema?: Record<string, any>;
}

/**
 * The operations a tool dispatches to, as the tool itself declares them.
 *
 * A subsystem tool names them in its `op` enum; a flat tool IS one operation and
 * names itself. One function so no caller has to ask which door answered, and so
 * "how many operations does this door reach?" has a single meaning across a
 * shape change — which is exactly what the count below needs.
 */
export const ops = (t: McpTool): string[] => {
  const e = t.inputSchema?.properties?.op?.enum;
  return Array.isArray(e) && e.length ? e.map(String) : [t.name];
};

/** Every operation this door reaches, across every tool. */
export const reach = (tools: McpTool[]): number =>
  tools.reduce((n, t) => n + ops(t).length, 0);

/**
 * A read among a tool's operations, in the DOOR'S vocabulary.
 *
 * `get_`/`list_` is how the door spells a read, so this is its judgement and not
 * ours. Two callers want it and it is stated once: the sync probes a read when
 * it asks the door what an uncredentialed call is refused with, and the tool
 * reference prints a read in the example call it invites people to paste.
 */
export const readOp = (t: McpTool): string | undefined =>
  ops(t).find((o) => /^(get|list)_/.test(o));

/** What the door answered `initialize` with — its own account of itself. */
export interface McpHandshake {
  protocolVersion: string;
  serverName: string;
  serverVersion: string;
  /** Capabilities the door advertises, verbatim. */
  capabilities: Record<string, any>;
  /**
   * What ONE `tools/call` answers with NO credential. The door replies 200 with
   * a JSON-RPC result whose `isError` is set, so the docs can state the auth
   * rule from the door's own words instead of asserting it.
   *
   * The message is the probed tool's, not a universal one — each tool refuses
   * in its own terms — so `anonymousProbe` records which tool was asked and
   * every page that quotes the message attributes it.
   */
  anonymousProbe: string;
  anonymousCall: string;
}

export interface McpCatalog {
  door: string;
  meta: {
    /** Tools in this file. */
    count: number;
    /** Operations those tools reach — see reach(). Stable across a regroup. */
    reach: number;
    /** ISO date the list on disk was taken from the door. */
    captured: string;
  };
  handshake?: McpHandshake;
  tools: McpTool[];
}

/** One JSON-RPC round trip to the door, with no credential attached. */
async function rpc(method: string, params?: Record<string, any>): Promise<any | null> {
  try {
    const r = await fetch(MCP_DOOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, ...(params ? { params } : {}) }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!r.ok) {
      console.warn(`[mcp] door answered ${r.status} to ${method}`);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.warn(`[mcp] door unreachable for ${method}: ${(e as Error).message}`);
    return null;
  }
}

/** Ask the door for its tools. Null when it does not answer with a usable list. */
async function fetchTools(): Promise<McpTool[] | null> {
  const list = (await rpc('tools/list'))?.result?.tools;
  if (!Array.isArray(list) || !list.length) return null;
  return list.map((t: any) => ({
    name: String(t.name),
    description: String(t.description ?? ''),
    ...(t.inputSchema && typeof t.inputSchema === 'object' ? { inputSchema: t.inputSchema } : {}),
  }));
}

/**
 * Ask the door to describe itself, and ask it once WITHOUT a credential so the
 * docs can quote its own refusal rather than assert an auth rule.
 * `tools/list` is answered anonymously — this file is the proof — but a
 * `tools/call` is not, and the difference matters to anyone wiring a client up.
 */
async function fetchHandshake(tool: string, op?: string): Promise<McpHandshake | null> {
  const init = (
    await rpc('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'docs.hanzo.ai', version: '1' },
    })
  )?.result;
  if (!init) return null;
  const call = await rpc('tools/call', { name: tool, arguments: op ? { op, input: {} } : {} });
  const said = call?.result?.content?.find((c: any) => c?.type === 'text')?.text;
  return {
    protocolVersion: String(init.protocolVersion ?? ''),
    serverName: String(init.serverInfo?.name ?? ''),
    serverVersion: String(init.serverInfo?.version ?? ''),
    capabilities: init.capabilities ?? {},
    anonymousProbe: op ? `${tool} op=${op}` : tool,
    anonymousCall: call?.result?.isError ? String(said ?? '') : '',
  };
}

/**
 * A read the door itself names as a read: a `get_`/`list_` operation on a tool
 * that is not the operator surface. Reading, so a probe that really dispatches
 * cannot change anything; named by the door, so it survives the door renaming
 * everything.
 */
function pickRead(tools: McpTool[]): { tool: string; op?: string } | null {
  for (const t of tools) {
    if (/admin/i.test(t.name)) continue;
    const read = readOp(t);
    if (read) return read === t.name ? { tool: t.name } : { tool: t.name, op: read };
  }
  return null;
}

export async function syncMcpTools(): Promise<void> {
  const tools = await fetchTools();
  const have = fs.existsSync(OUT) ? load() : null;

  // Say it in the build log, loudly: this build's tool pages describe the door
  // as it was, not as it is. And say it ONLY there. Stamping `source:
  // "snapshot"` back into the vendored file rewrote a TRACKED 1.1 MB artefact
  // on every offline build, so a developer with no network produced a one-flag
  // diff that the next online build flipped straight back — churn that says
  // nothing about the door and buries the changes that do.
  const keep = (why: string): void =>
    console.log(`[mcp] ${why} — falling back to the vendored list: ${have!.meta.count} tools captured ${have!.meta.captured}`);

  if (!tools) {
    if (!have) throw new Error(`[mcp] no tool list available and no snapshot at ${OUT}`);
    keep('door unreachable');
    return;
  }

  // A door answering with a fraction of what it had is a door mid-deploy, not a
  // door that lost tools. Keep the copy rather than publishing a reference that
  // silently drops hundreds of pages.
  //
  // MEASURE THE REACH, NOT THE TOOL COUNT. The door regrouped 833 flat per-operation
  // tools into 109 subsystem tools reaching 1383 operations — it gained 550 and this
  // guard read it as losing 724, so it held the pre-regroup list and every rebuild
  // held it again. Twelve days of tool pages named tools the door answers "unknown
  // tool" to, and the guard could never unstick itself because the number it compared
  // was a fact about the door's SHAPE. Reach is a fact about what the door can do,
  // which is what "mid-deploy" was always trying to ask about.
  if (have && have.meta.reach && reach(tools) < have.meta.reach * 0.8) {
    keep(`door reaches only ${reach(tools)} operations, down from ${have.meta.reach}`);
    return;
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));
  // Probe a READ, never a write. This call really is dispatched at the door, so
  // the operation it names must be one that cannot change anything even if the
  // credential rule ever loosens — and not an `admin` one, whose refusal is
  // narrower than the general "you sent no principal" we want to quote.
  //
  // The read is chosen in the DOOR'S vocabulary, not ours. This looked for a
  // tool named `get*`, which every flat tool was and no subsystem tool is, so
  // the probe silently stopped happening and the vendored handshake kept quoting
  // a refusal from `get_v1_ads_campaigns` — a tool the door had stopped serving.
  // A probe that cannot find a subject must say so, not keep the last answer.
  const probe = pickRead(tools);
  const handshake = probe ? await fetchHandshake(probe.tool, probe.op) : null;
  if (!probe) console.warn('[mcp] no read-only operation to probe — the door states no auth rule this build can quote');
  const catalog: McpCatalog = {
    door: MCP_DOOR,
    meta: { count: tools.length, reach: reach(tools), captured: new Date().toISOString().slice(0, 10) },
    ...(handshake ?? have?.handshake ? { handshake: handshake ?? have!.handshake } : {}),
    tools,
  };
  fs.writeFileSync(OUT, JSON.stringify(catalog, null, 0) + '\n');
  const withArgs = tools.filter((t) => Object.keys(t.inputSchema?.properties ?? {}).length).length;
  console.log(
    `[mcp] ${tools.length} tools from ${MCP_DOOR} reaching ${reach(tools)} operations, ` +
      `${withArgs} declaring arguments` +
      (handshake ? `, protocol ${handshake.protocolVersion}` : ''),
  );
}

/** The vendored catalogue. Throws when the build never vendored one. */
export function load(): McpCatalog {
  if (!fs.existsSync(OUT)) throw new Error(`[mcp] no vendored tool list at ${OUT}`);
  const raw = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const tools: McpTool[] = raw.tools ?? [];
  return {
    door: raw.door ?? MCP_DOOR,
    meta: {
      count: raw.meta?.count ?? tools.length,
      reach: raw.meta?.reach ?? reach(tools),
      captured: raw.meta?.captured ?? 'an unrecorded date',
    },
    ...(raw.handshake ? { handshake: raw.handshake as McpHandshake } : {}),
    tools,
  };
}

export function loadMcpTools(): Map<string, McpTool> {
  if (!fs.existsSync(OUT)) return new Map();
  return new Map(load().tools.map((t) => [t.name, t]));
}

if (import.meta.main) {
  syncMcpTools().catch((e) => {
    console.error('[mcp] failed', e);
    process.exit(1);
  });
}
