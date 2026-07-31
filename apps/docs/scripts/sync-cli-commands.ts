import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The CLI's command table, taken from the CLI.
//
// `hanzo` has no `api` passthrough — every capability is a real subcommand,
// folded from the document's method+path by hanzoai/cli's `genproduct` and
// committed as pure data in src/commands/product/generated.rs. The docs must
// print the command the CLI actually has, so they read the CLI's own answer
// instead of re-deriving the fold and drifting from it.
//
// Pinned by commit, exactly like hanzo.yaml. hanzoai/cli is public, so no token
// is needed.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const PIN_FILE = path.join(APP_ROOT, 'openapi-specs/cli.pin');
const OUT = path.join(APP_ROOT, 'openapi-specs/cli-commands.json');
const SIBLING = path.resolve(APP_ROOT, '../../../cli/src/commands/product/generated.rs');
const RAW = (pin: string) =>
  `https://raw.githubusercontent.com/hanzoai/cli/${pin}/src/commands/product/generated.rs`;

export interface CliCommand {
  /** `GET /v1/tools` — the join key onto the OpenAPI document. */
  key: string;
  product: string;
  nodes: string[];
  verb: string;
  /** Path parameters, in order — required positionals. */
  params: string[];
  /** Required `--flags`, kebab-cased as the CLI spells them. */
  required: string[];
}

const list = (s: string): string[] => [...s.matchAll(/"([^"]*)"/g)].map((m) => m[1]);

/** Parse the generated coordinates. The file is machine-written and diff-gated
 *  by `cargo test`, so its shape is stable. */
export function parseGenerated(src: string): CliCommand[] {
  const out: CliCommand[] = [];
  for (const line of src.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('Op {')) continue;
    const get = (k: string) => t.match(new RegExp(`\\b${k}: "([^"]*)"`))?.[1] ?? '';
    const arr = (k: string) => {
      const m = t.match(new RegExp(`\\b${k}: &\\[([^\\]]*)\\]`));
      return m ? list(m[1]) : [];
    };
    const method = get('method');
    const p = get('path');
    if (!method || !p) continue;

    const fieldsRaw = t.slice(t.indexOf('fields: &['));
    const required = [...fieldsRaw.matchAll(/Field \{[^}]*?flag: "([^"]*)"[^}]*?required: (true|false)/g)]
      .filter((m) => m[2] === 'true')
      .map((m) => m[1]);

    out.push({
      key: `${method} ${p}`,
      product: get('product'),
      nodes: arr('nodes'),
      verb: get('verb'),
      params: arr('params'),
      required,
    });
  }
  return out;
}

async function source(): Promise<string> {
  if (fs.existsSync(PIN_FILE)) {
    const pin = fs.readFileSync(PIN_FILE, 'utf8').trim();
    try {
      const r = await fetch(RAW(pin));
      if (r.ok) {
        console.log(`[cli] fetched generated.rs @ ${pin.slice(0, 9)}`);
        return await r.text();
      }
    } catch {
      /* fall through */
    }
  }
  if (fs.existsSync(SIBLING)) {
    console.log('[cli] using the sibling checkout');
    return fs.readFileSync(SIBLING, 'utf8');
  }
  return '';
}

export async function syncCliCommands(): Promise<void> {
  const src = await source();
  if (!src) {
    if (fs.existsSync(OUT)) {
      console.log('[cli] unreachable; keeping the committed command table');
      return;
    }
    throw new Error('[cli] no command table available from any source');
  }
  const cmds = parseGenerated(src);
  if (cmds.length < 100) throw new Error(`[cli] parsed only ${cmds.length} commands — the format moved`);
  fs.writeFileSync(OUT, JSON.stringify(cmds, null, 0) + '\n');
  console.log(
    `[cli] ${cmds.length} commands across ${new Set(cmds.map((c) => c.product)).size} products`,
  );
}

if (import.meta.main) {
  syncCliCommands().catch((e) => {
    console.error('[cli] failed', e);
    process.exit(1);
  });
}
