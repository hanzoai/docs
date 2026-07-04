import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pre-parse MDX sanitizer for ported/upstream docs.
//
// remarkPassthroughUnknownJsx (source.config.ts) already neutralises foreign JSX
// in content/docs/projects/** and content/docs/services/**, BUT it runs after the
// MDX parser. Two upstream-doc patterns break the parser itself — before any
// remark plugin can help — so the page is dropped and renders only the
// error-boundary fallback:
//
//   1. Angle-bracket autolinks — `<https://x>`, `<mailto:a@b>`. MDX reads `<h`
//      as the start of a JSX tag, then chokes on `:` / `/`.
//   2. Mis-nested block callout wrappers — e.g. a `<Banner>` whose children
//      include a top-level markdown list, so the parser never finds the close
//      tag (`Expected the closing tag </Banner> …`).
//
// Fix (idempotent, deterministic, no compiler dependency), skipping code fences:
//   - EVERYWHERE: rewrite `<scheme:...>` autolinks to bare text (GFM re-links them).
//   - PORTED dirs only: drop standalone-line block-callout wrapper tags
//     (Banner/Callout/Note/…). These are ALWAYS reduced to a fragment by
//     passthrough, so removing the tag while keeping its children renders
//     identically — it just also removes the parser's nesting trap.
//
// First-party docs (outside projects/ + services/) are never touched, so their
// callouts keep rendering.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(SCRIPT_DIR, '..', 'content', 'docs');

const AUTOLINK = /<((?:https?|ftp|mailto):[^\s<>]+)>/g;
// Block-callout wrappers used by Mintlify / Docusaurus / GitBook / Nextra ports.
const CALLOUT =
  '(?:Banner|Callout|Aside|Admonition|Note|Info|Tip|Tips|Warning|Caution|Danger|Success|Check|Important|Question|Card|Cards|CardGroup|Columns|Column|Frame|Steps|Step|Tabs|Tab|TabItem|Accordion|AccordionGroup|Expandable|CodeGroup)';
const CALLOUT_TAG = new RegExp(`^\\s*</?${CALLOUT}(?:\\s[^>]*?)?/?>\\s*$`);

function sanitize(src: string, ported: boolean): string {
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
    let line = lines[i];
    if (AUTOLINK.test(line)) line = line.replace(AUTOLINK, '$1');
    if (ported && CALLOUT_TAG.test(line)) line = '';
    lines[i] = line;
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
        const rel = path.relative(CONTENT_DIR, fp).split(path.sep).join('/');
        const ported = rel.startsWith('projects/') || rel.startsWith('services/');
        const orig = fs.readFileSync(fp, 'utf8');
        const out = sanitize(orig, ported);
        if (out !== orig) {
          fs.writeFileSync(fp, out);
          fixed++;
        }
      }
    }
  };
  walk(CONTENT_DIR);
  console.log(`[sanitize-mdx] scanned ${scanned} mdx, rewrote ${fixed}`);
}

if (import.meta.main) sanitizeMdx();
