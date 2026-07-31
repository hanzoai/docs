import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The MCP door's tool list, taken from the MCP door.
//
// `POST https://api.hanzo.ai/v1/mcp` speaks JSON-RPC 2.0 and answers
// `tools/list` with the tools this fleet actually exposes — 730 of the
// document's ~2,400 operations, not all of them. So "is there an MCP tool for
// this operation?" is a question only the door can answer, and the docs ask it
// rather than assuming.
//
// The NAME rule is verified against that answer: a tool is its operationId with
// the `<product>_` prefix removed (729/730 exact; see mcp-tools.json meta).
//
// Snapshot, like the document and the CLI table: fetched when reachable, and
// the committed copy when not, so a builder with no egress still renders a
// truthful MCP column.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT = path.join(APP_ROOT, 'openapi-specs/mcp-tools.json');

/** The live JSON-RPC door. It is NOT declared in hanzo.yaml — see DOOR_UNDECLARED. */
export const MCP_DOOR = 'https://api.hanzo.ai/v1/mcp';

export interface McpTool {
  name: string;
  description: string;
}

export async function syncMcpTools(): Promise<void> {
  let tools: McpTool[] | null = null;
  try {
    const r = await fetch(MCP_DOOR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      signal: AbortSignal.timeout(30_000),
    });
    if (r.ok) {
      const body: any = await r.json();
      const list = body?.result?.tools;
      if (Array.isArray(list) && list.length) {
        tools = list.map((t: any) => ({
          name: String(t.name),
          description: String(t.description ?? '').split('\n')[0].trim(),
        }));
      }
    }
  } catch {
    /* fall through to the snapshot */
  }

  if (!tools) {
    if (fs.existsSync(OUT)) {
      console.log('[mcp] door unreachable; keeping the committed tool list');
      return;
    }
    throw new Error(`[mcp] no tool list available and no snapshot at ${OUT}`);
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(OUT, JSON.stringify({ door: MCP_DOOR, tools }, null, 0) + '\n');
  console.log(`[mcp] ${tools.length} tools exposed by ${MCP_DOOR}`);
}

export function loadMcpTools(): Map<string, McpTool> {
  if (!fs.existsSync(OUT)) return new Map();
  const { tools } = JSON.parse(fs.readFileSync(OUT, 'utf8')) as { tools: McpTool[] };
  return new Map(tools.map((t) => [t.name, t]));
}

if (import.meta.main) {
  syncMcpTools().catch((e) => {
    console.error('[mcp] failed', e);
    process.exit(1);
  });
}
