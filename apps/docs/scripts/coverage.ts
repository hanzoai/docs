import { DOCUMENT, loadDocument, type Document } from './openapi-doc';
import { behind, command, door, server, type Door } from './openapi-surfaces';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { load as loadDoor, ops } from './sync-mcp-tools';
import { doors } from './capabilities';

// WHAT IS REACHABLE FROM WHERE, MEASURED.
//
// Every capability page carries a "Four surfaces" table, and for three of the
// four that table used to ASSERT rather than measure: REST and SDK were printed
// as the operation count, on the assumption that a published client declares a
// method for every operation the document describes. It does not — the clients
// are generated at their own release and lag it — and a table that says `N
// methods` when the installed client has fewer teaches a call that does not
// compile.
//
// So each surface is asked its own question, of its own artefact:
//
//   REST  the document. The one surface that is true by construction: a
//         capability IS its operations, so the count is the count.
//   CLI   hanzoai/cli's generated command table, joined on method+path.
//   SDK   the methods the PUBLISHED clients declare, joined on the id each
//         language spells the operation with.
//   MCP   the server's `tools/list`, joined on tool name and on operationId.
//
// Three of those four joins cross a CLOCK. The CLI table, the tool list and the
// clients are each generated from cloud at their own lock, so each may spell a
// capability the way cloud spelled it then — and cloud answers at BOTH spellings
// of a name while publishing one (manifest.Normalize). A join keyed on the exact
// string therefore reports a gap where there is none, which is a worse answer
// than no table: it tells a reader to reach for HTTP when `hanzo eval run`
// already works. Every join here follows the alias for that reason.
//
// The gaps this leaves are the REAL ones, and they are the point. A capability
// that no CLI command reaches and no tool names is a capability whose generated
// projections are incomplete, and the page says so in those words rather than
// printing a surface that is not there.

export interface Coverage {
  name: string;
  /** Operations the document describes. 0 for a capability that is not REST. */
  rest: number;
  /** The `doors:` line, where this capability answers somewhere other than /v1. */
  offRest?: string;
  /** Operations a `hanzo` subcommand reaches, and the word it reaches them by. */
  cli: number;
  cliGroup?: string;
  /** Operations the published clients BOTH declare a method for. */
  sdk: number;
  /** The tool that serves this capability, and the operations it names. */
  tool?: string;
  toolOps: number;
  /** Of this capability's operations, those the server names by the document's id. */
  mcp: number;
}

export function coverage(doc: Document, table: Map<string, CliCommand>, d: Door): Coverage[] {
  const off = doors();

  const out: Coverage[] = [];
  for (const p of doc.products) {
    const hits = p.operations.map((o) => command(o, table)).filter(Boolean) as CliCommand[];
    const s = server(p, d);
    out.push({
      name: p.name,
      rest: p.operations.length,
      offRest: off.get(p.name),
      cli: hits.length,
      cliGroup: hits[0]?.product,
      sdk: p.operations.filter((o) => behind(o).length === 0).length,
      tool: s?.tool.name,
      toolOps: s ? ops(s.tool).length : 0,
      mcp: s?.named ?? 0,
    });
  }
  // The capabilities that answer somewhere other than /v1 and so appear in no
  // document. They are not gaps in the projections — they are addresses an
  // OpenAPI document cannot describe — so they are listed apart, never counted
  // as a capability the CLI or the SDK failed to reach.
  const served = new Set(doc.products.map((p) => p.name));
  for (const [name, line] of off) {
    if (served.has(name)) continue;
    const t = d.byProduct.get(name);
    out.push({ name, rest: 0, offRest: line, cli: 0, sdk: 0, tool: t?.name, toolOps: t ? ops(t).length : 0, mcp: 0 });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

export function load(): Coverage[] {
  return coverage(loadDocument(DOCUMENT), loadCliTable(), door(loadDoor().tools));
}

/**
 * The capabilities a surface does not reach, as a reader needs them: named, and
 * only where the answer is NONE. A partial count belongs on the capability's own
 * page, which prints it; a list of every partial here would be the same wall of
 * numbers the grouped index exists to avoid.
 */
export interface Gaps {
  noCli: string[];
  noMcp: string[];
  noSdk: string[];
}

export const gaps = (rows: Coverage[]): Gaps => {
  const rest = rows.filter((r) => r.rest > 0);
  return {
    noCli: rest.filter((r) => !r.cli).map((r) => r.name),
    noMcp: rest.filter((r) => !r.tool).map((r) => r.name),
    noSdk: rest.filter((r) => !r.sdk).map((r) => r.name),
  };
};

if (import.meta.main) {
  const rows = load();
  const rest = rows.filter((r) => r.rest > 0);
  const say = (label: string, names: string[]) =>
    console.log(`\n${label} (${names.length})\n  ${names.join(', ') || '—'}`);

  console.log(`capabilities: ${rows.length}  (${rest.length} at /v1, ${rows.length - rest.length} at another address)`);
  console.log(`operations:   ${rest.reduce((n, r) => n + r.rest, 0)}`);
  console.log(
    `full:         ${rest.filter((r) => r.cli === r.rest && r.sdk === r.rest && r.mcp === r.rest).length} capabilities where all four surfaces reach every operation`,
  );
  say('no CLI command at all', rest.filter((r) => !r.cli).map((r) => r.name));
  say('CLI reaches only some', rest.filter((r) => r.cli && r.cli < r.rest).map((r) => `${r.name} ${r.cli}/${r.rest}`));
  say('no MCP tool at all', rest.filter((r) => !r.tool).map((r) => r.name));
  say('MCP tool names only some', rest.filter((r) => r.tool && r.mcp < r.rest).map((r) => `${r.name} ${r.mcp}/${r.rest}`));
  say('SDK declares only some', rest.filter((r) => r.sdk < r.rest).map((r) => `${r.name} ${r.sdk}/${r.rest}`));
  say('not a /v1 address', rows.filter((r) => !r.rest).map((r) => r.name));
}
