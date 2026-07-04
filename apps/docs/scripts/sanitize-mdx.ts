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
// NOTE: we deliberately do NOT strip standalone JSX wrapper tags here. Doing so
// orphans the many inline `</Tab>` / `</Card>` / `</Step>` closes that ported docs
// use, which turns healthy pages into parse failures — a net regression.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(SCRIPT_DIR, '..', 'content', 'docs');

const AUTOLINK = /<((?:https?|ftp|mailto):[^\s<>]+)>/g;

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
  console.log(`[sanitize-mdx] scanned ${scanned} mdx, rewrote ${fixed} (autolinks)`);
}

if (import.meta.main) sanitizeMdx();
