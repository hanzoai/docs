import fs from 'node:fs';
import path from 'node:path';

/**
 * Turn public/_redirects into pages the static export actually serves.
 *
 * That file is Cloudflare Pages format and was the single source of truth for
 * docs.hanzo.ai's redirects — while the site was on Pages. It is served by
 * hanzoai/static now, which never reads it, so all 47 rules were inert:
 * /docs/api, /api-reference and the rest answered 404, and /api answered a 301
 * to /api/ that was the server's own trailing-slash rule rather than anything
 * from the file.
 *
 * So the file stays the one place a redirect is written, and this emits it into
 * the export. A page, not a 301 — a static export cannot set a status — so it
 * carries `rel=canonical` for crawlers, a meta refresh for anyone with script
 * off, and a location.replace so the address does not enter history. When the
 * serving side can read a redirects file, delete this and keep the file.
 */

const APP = path.resolve(import.meta.dirname, '..');
const OUT = path.join(APP, 'out');
const FILE = path.join(APP, 'public/_redirects');

type Rule = { from: string; to: string };

/** Exact rules only. A wildcard cannot be expanded without knowing every path it would match. */
export function parse(src: string): { exact: Rule[]; wildcards: Rule[] } {
  const exact: Rule[] = [];
  const wildcards: Rule[] = [];
  for (const line of src.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to] = t.split(/\s+/);
    if (!from?.startsWith('/') || !to) continue;
    (from.includes('*') || to.includes(':splat') ? wildcards : exact).push({ from, to });
  }
  return { exact, wildcards };
}

// Marks a page as OURS. A page we wrote must be rewritten when its target
// moves, and a page the app wrote must never be replaced by a redirect — on a
// re-run the two are otherwise indistinguishable, and the first run makes every
// alias look like a real page to the second.
const MARK = '<meta name="generator" content="emit-redirects">';

const page = (to: string) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
  `<title>Moved</title>${MARK}<link rel="canonical" href="${to}">` +
  `<meta name="robots" content="noindex,follow">` +
  `<meta http-equiv="refresh" content="0; url=${to}">` +
  `<script>location.replace(${JSON.stringify(to)})</script></head>` +
  `<body><a href="${to}">${to}</a></body></html>\n`;

export function emit(): void {
  if (!fs.existsSync(OUT)) return; // not an export build
  const { exact, wildcards } = parse(fs.readFileSync(FILE, 'utf8'));

  // trailingSlash: true, so a page lives at <path>/index.html and is served at <path>/.
  const at = (p: string) => path.join(OUT, p.replace(/\/+$/, ''), 'index.html');
  const ours = (p: string) =>
    fs.existsSync(at(p)) && fs.readFileSync(at(p), 'utf8').includes(MARK);
  // A page the APP produced. One we produced is not a destination.
  const served = (p: string) => fs.existsSync(at(p)) && !ours(p);

  let wrote = 0;
  const kept: string[] = [];
  const dangling: string[] = [];

  for (const { from, to } of exact) {
    // Never shadow a real page with a redirect to somewhere else.
    if (served(from)) {
      kept.push(from);
      continue;
    }
    // A redirect onto a 404 is worse than the 404 it replaces: the reader is
    // moved somewhere before being told nothing is there. Report and skip.
    if (to.startsWith('/') && !served(to)) {
      dangling.push(`${from} -> ${to}`);
      continue;
    }
    const dest = to.startsWith('/') ? `${to.replace(/\/+$/, '')}/` : to;
    fs.mkdirSync(path.dirname(at(from)), { recursive: true });
    fs.writeFileSync(at(from), page(dest));
    wrote++;
  }

  console.log(
    `[redirects] ${wrote} emitted, ${kept.length} already a real page, ` +
      `${dangling.length} pointing nowhere, ${wildcards.length} wildcards not expandable`,
  );
  for (const d of dangling) console.warn(`[redirects] target does not exist: ${d}`);
  for (const w of wildcards) console.warn(`[redirects] needs a serving-side rule: ${w.from}`);
}
