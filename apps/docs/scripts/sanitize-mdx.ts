import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pre-parse MDX sanitizer for ported/upstream docs.
//
// remarkPassthroughUnknownJsx (source.config.ts) already neutralises foreign JSX
// in content/docs/projects/** and content/docs/services/**, but it runs AFTER the
// MDX parser. Angle-bracket autolinks — `<https://x>`, `<mailto:a@b>` — break the
// parser ITSELF (MDX reads `<h` as the start of a JSX tag, then chokes on `:` /
// `/`), so the whole page is dropped and renders only the error-boundary fallback.
//
// This rewrites those autolinks to bare text (GFM re-links bare URLs) everywhere,
// skipping fenced code blocks. It is idempotent and runs in pre-build after the
// project sync.
//
// The second construct is the same failure with a different cause: MDX ends an
// ESM block at a BLANK LINE, so `import X from 'y'` with the page's `# Title` on
// the very next line hands acorn `import X from 'y'\n# Title` and it dies with
// "Could not parse import/exports with acorn". One missing newline silently
// blanked ten of this site's most-linked pages — getting-started, iam, llm, sql,
// pubsub, o11y, gateway, commerce, chat, cli — each shipping a full <article>
// shell with no body. A page that renders empty passes every link checker, which
// is why nothing caught it. `terminateImportHeader` closes that header.
//
// It runs ONLY over the import header — the run of `import … from '…'` lines
// directly after the frontmatter — and stops at the first line that is anything
// else. Deeper in a page an unterminated ``` fence can leave Python's `import
// json` looking like flow content, and inserting a blank line there would split
// somebody's code sample. The bug is a header bug; so is the fix.
//
// NOTE: we deliberately do NOT strip standalone JSX wrapper tags here. Doing so
// orphans the many inline `</Tab>` / `</Card>` / `</Step>` closes that ported docs
// use, which turns healthy pages into parse failures — a net regression.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(SCRIPT_DIR, '..', 'content', 'docs');

const AUTOLINK = /<((?:https?|ftp|mailto):[^\s<>]+)>/g;

/** One whole ESM import with a module specifier — the only header line we touch. */
const IMPORT = /^import\s.*\sfrom\s+['"][^'"]+['"];?\s*$/;

/** Blank line after the last import of the header, if markdown starts right on it. */
function terminateImportHeader(lines: string[]): void {
  let i = lines[0] === '---' ? lines.indexOf('---', 1) + 1 : 0;
  while (lines[i]?.trim() === '') i++;
  let last = -1;
  for (; IMPORT.test(lines[i] ?? ''); i++) last = i;
  if (last >= 0 && (lines[last + 1] ?? '').trim() !== '') lines.splice(last + 1, 0, '');
}

function sanitize(src: string): string {
  const lines = src.split('\n');
  let inFence = false;
  let fence = '';
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    if (!inFence && (trimmed.startsWith('```') || trimmed.startsWith('~~~'))) {
      inFence = true;
      fence = trimmed.slice(0, 3);
      continue;
    }
    if (inFence) {
      if (trimmed.startsWith(fence)) inFence = false;
      continue;
    }
    if (AUTOLINK.test(lines[i])) lines[i] = lines[i].replace(AUTOLINK, '$1');
  }
  terminateImportHeader(lines);
  return lines.join('\n');
}

export function sanitizeMdx(): void {
  if (!fs.existsSync(CONTENT_DIR)) return;
  let scanned = 0;
  let fixed = 0;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fp);
      } else if (entry.name.endsWith('.mdx')) {
        scanned++;
        const orig = fs.readFileSync(fp, 'utf8');
        const out = sanitize(orig);
        if (out !== orig) {
          fs.writeFileSync(fp, out);
          fixed++;
        }
      }
    }
  };
  walk(CONTENT_DIR);
  console.log(`[sanitize-mdx] scanned ${scanned} mdx, rewrote ${fixed} (autolinks, ESM blocks)`);
}

if (import.meta.main) sanitizeMdx();
