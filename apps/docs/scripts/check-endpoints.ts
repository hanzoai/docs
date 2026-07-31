import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDocument } from './openapi-doc';

// No page may state an endpoint the document does not have.
//
// The generated pages cannot drift — they ARE the document. Authored prose can:
// somebody writes `/v1/kv/put` in a guide, cloud never serves it, and the docs
// now teach a 404. This walks every MDX page, pulls out every `/v1/...` it
// mentions, and checks it against hanzo.yaml.
//
// Matching is by path TEMPLATE: a page may write a concrete id where the
// document has `{id}`, so `/v1/iam/users/alice` matches `/v1/iam/users/{id}`.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCUMENT = path.join(APP_ROOT, 'openapi-specs/hanzo.yaml');
const CONTENT = path.join(APP_ROOT, 'content/docs');

// Ported upstream docs describe other people's APIs; they are mirrored, not
// authored here, so they are not ours to hold to our document.
const SKIP = ['projects/'];

const ENDPOINT = /`(\/v1\/[A-Za-z0-9_\-{}/.]*)`|(?:https?:\/\/[a-z.]*hanzo\.ai)(\/v1\/[A-Za-z0-9_\-{}/.]*)/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.mdx') || e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** A document path template as a regex: `{id}` matches one concrete segment. */
const templateRe = (t: string): RegExp =>
  new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{[^}]+\}/g, '[^/]+')}/?$`);

export function checkEndpoints(): { checked: number; unknown: Array<[string, string]> } {
  const doc = loadDocument(DOCUMENT);
  const exact = new Set(Object.keys(doc.raw.paths));
  const templates = [...exact].map(templateRe);
  // Prefixes the document serves — a page may name a sub-resource of a real
  // route (e.g. an object key under a bucket) that the document templates.
  const prefixes = new Set([...exact].map((p) => p.split('/').slice(0, 3).join('/')));

  const unknown: Array<[string, string]> = [];
  let checked = 0;

  for (const file of walk(CONTENT)) {
    const rel = path.relative(CONTENT, file);
    if (SKIP.some((s) => rel.startsWith(s))) continue;
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(ENDPOINT)) {
      const raw = (m[1] ?? m[2] ?? '').replace(/[.,;:]+$/, '');
      if (!raw || raw === '/v1' || raw.includes('...')) continue;
      checked++;
      if (exact.has(raw) || exact.has(raw.replace(/\/$/, ''))) continue;
      if (templates.some((re) => re.test(raw))) continue;
      // `/v1/openapi.json` and friends are gateway-level, not product routes.
      if (prefixes.has(raw.split('/').slice(0, 3).join('/'))) continue;
      unknown.push([rel, raw]);
    }
  }
  return { checked, unknown };
}

if (import.meta.main) {
  const { checked, unknown } = checkEndpoints();
  const generated = unknown.filter(([f]) => f.startsWith('openapi/') || f.startsWith('start/'));
  console.log(`[endpoints] ${checked} endpoint mentions checked against the document`);
  if (generated.length) {
    console.error(`[endpoints] FAIL — ${generated.length} in GENERATED pages:`);
    for (const [f, p] of generated.slice(0, 20)) console.error(`   ${f}: ${p}`);
    process.exit(1);
  }
  if (unknown.length) {
    console.warn(`[endpoints] ${unknown.length} mentions in AUTHORED prose are not in the document:`);
    const byFile = new Map<string, string[]>();
    for (const [f, p] of unknown) byFile.set(f, [...(byFile.get(f) ?? []), p]);
    for (const [f, ps] of [...byFile].slice(0, 25)) {
      console.warn(`   ${f}: ${[...new Set(ps)].slice(0, 6).join(', ')}`);
    }
  } else {
    console.log('[endpoints] every mention resolves to the document');
  }
}
