import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument, opHref, type Document, type Operation } from './openapi-doc';
import { cli } from './openapi-surfaces';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { domains, icon } from './capabilities';
import { firstSentence, text, yamlString } from './mdx';

// THE CLI, one page per capability.
//
// `openapi-specs/cli-commands.json` is the CLI's own command table — 2,356
// commands, folded from the document by hanzoai/cli's `genproduct` and committed
// there as data. It has been synced on every build and rendered on no page: a
// reader who wanted to know what `hanzo` can do had to run `hanzo --help` 185
// times.
//
// The operation pages already print the ONE command that calls that route. What
// they cannot show is the shape of the tool itself — which groups exist, how
// deep a group goes, what a group can do end to end. That is what this section
// is, and it is the whole of the CLI rather than a selection.
//
// FILED BY OWNER, PRINTED AS INVOKED. A command is grouped here under the
// capability that SERVES its route — the tag — so the CLI section, the sidebar,
// the reference and the taxonomy all cut the estate the same way. The command
// itself is printed exactly as `hanzo` spells it, `cmd.product` and all, which
// is not always the same word: the CLI's grouping came from the address. Filing
// by one and printing the other is the only way both stay true.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/cli');

interface Group {
  /** The capability that serves these routes. */
  name: string;
  title: string;
  description: string;
  rows: Array<{ op: Operation; command: string }>;
}

function groups(doc: Document, table: Map<string, CliCommand>): Group[] {
  const out = new Map<string, Group>();
  for (const p of doc.products) {
    for (const op of p.operations) {
      const command = cli(op, doc, table);
      if (!command) continue;
      let g = out.get(p.name);
      if (!g) {
        g = { name: p.name, title: p.title, description: p.description, rows: [] };
        out.set(p.name, g);
      }
      g.rows.push({ op, command });
    }
  }
  return [...out.values()];
}

function renderGroup(g: Group): string {
  const L: string[] = [];
  L.push('---');
  L.push(`title: ${yamlString(g.title)}`);
  L.push(
    `description: ${yamlString(
      `${g.rows.length} \`hanzo\` commands for ${g.title}, each calling one operation on api.hanzo.ai.`,
    )}`,
  );
  L.push('---');
  L.push('');
  if (g.description) {
    L.push(text(firstSentence(g.description, 400)));
    L.push('');
  }
  L.push(
    `\`${g.rows.length}\` command${g.rows.length === 1 ? '' : 's'} · ` +
      `[API reference →](/docs/openapi/${g.name})`,
  );
  L.push('');
  L.push('| Command | Calls | What it does |');
  L.push('|---|---|---|');
  for (const { op, command } of g.rows) {
    // The multi-flag form breaks a command across lines for a code block; a
    // table cell needs the one-line spelling.
    const one = command.replace(/\s*\\\n\s*/g, ' ');
    L.push(
      `| \`${one.replace(/\|/g, '\\|')}\` | [\`${op.method.toUpperCase()} ${op.path.replace(
        /\|/g,
        '\\|',
      )}\`](${opHref(op)}) | ${text(firstSentence(op.summary || op.description, 120))} |`,
    );
  }
  L.push('');
  return L.join('\n');
}

function renderIndex(gs: Group[], commands: number, covered: number): string {
  const total = gs.reduce((n, g) => n + g.rows.length, 0);
  const L: string[] = [];
  L.push('---');
  L.push('title: CLI');
  L.push(
    `description: ${yamlString(
      `The \`hanzo\` command line — ${total} commands across ${gs.length} capabilities, generated from the CLI's own command table.`,
    )}`,
  );
  L.push('icon: SquareTerminal');
  L.push('---');
  L.push('');
  L.push('# The `hanzo` command line');
  L.push('');
  L.push(
    'Every Hanzo capability is a real subcommand — there is no `hanzo api` passthrough. ' +
      'The command tree is folded from the same OpenAPI document the SDKs and the MCP tools ' +
      'come from, so a command exists exactly where an operation does.',
  );
  L.push('');
  L.push('```bash');
  L.push('curl -fsSL https://hanzo.ai/install | sh');
  L.push('hanzo auth login');
  L.push('```');
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Commands** | ${total} |`);
  L.push(`| **Capabilities** | ${gs.length} |`);
  L.push('');
  // The gap is stated, not hidden: the CLI is pinned to its own commit, and a
  // command whose route the public contract does not carry has no page to link
  // to. Saying how many keeps the number honest as both sides move.
  if (commands > total) {
    L.push(
      `> ${commands - total} of the CLI's ${commands} commands call an address the public ` +
        'API document does not carry — the operator surface, and routes the CLI\'s own pin ' +
        'is ahead of or behind on. They are omitted here rather than linked to a page that ' +
        'does not exist.',
    );
    L.push('');
  }
  if (covered > gs.length) {
    L.push(
      `> ${covered - gs.length} capabilities have no \`hanzo\` command yet. Their operations ` +
        'are reachable over HTTP, from the SDKs and through MCP.',
    );
    L.push('');
  }
  L.push('## Command groups');
  L.push('');
  L.push('| Group | Commands | What it is |');
  L.push('|---|---|---|');
  for (const g of gs) {
    L.push(
      `| [\`hanzo ${g.name}\`](/docs/cli/${g.name}) | ${g.rows.length} | ${text(
        firstSentence(g.description, 110),
      )} |`,
    );
  }
  L.push('');
  return L.join('\n');
}

/** The same nine domains the reference is grouped by — one taxonomy, not two. */
function sidebar(gs: Group[]): string[] {
  const have = new Set(gs.map((g) => g.name));
  const out: string[] = [];
  for (const d of domains()) {
    const names = d.tags.filter((t) => have.has(t));
    if (!names.length) continue;
    const mark = icon(d.id);
    out.push(`---${mark ? `[${mark}]` : ''}${d.title}---`);
    out.push(...names);
  }
  return out;
}

export async function genCliPages(): Promise<void> {
  const doc = loadDocument(DOCUMENT);
  const table = loadCliTable();
  const gs = groups(doc, table);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Every group is a FOLDER — `<name>/index.mdx` — for the reason the reference
  // is: one capability is called `index` (Hanzo Index, full-text search), and
  // flat files put its page at the same filename as this section's own. One
  // shape for all of them retires the special case.
  for (const g of gs) {
    const folder = path.join(OUT_DIR, g.name);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.mdx'), renderGroup(g));
    fs.writeFileSync(
      path.join(folder, 'meta.json'),
      JSON.stringify({ title: g.title, pages: ['index'] }, null, 2) + '\n',
    );
  }
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.mdx'),
    renderIndex(gs, table.size, doc.products.length),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'CLI',
        description: "The `hanzo` command line, one page per capability.",
        pages: ['index', ...sidebar(gs)],
      },
      null,
      2,
    ) + '\n',
  );

  const total = gs.reduce((n, g) => n + g.rows.length, 0);
  console.log(
    `[cli-ref] ${gs.length} command groups, ${total} of the CLI's ${table.size} commands ` +
      `call a public operation`,
  );
}

if (import.meta.main) {
  genCliPages().catch((e) => {
    console.error('[cli-ref] failed', e);
    process.exit(1);
  });
}
