import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument } from './openapi-doc';

// No page may state an endpoint the document does not have.
//
// The generated pages cannot drift — they ARE the document. Authored prose can:
// somebody writes `/v1/kv/put` in a guide, cloud never serves it, and the docs
// now teach a 404. This walks every MDX page, pulls out every `/v1/...` it
// mentions, and checks it against the document.
//
// Matching is by path TEMPLATE: a page may write a concrete id where the
// document has `{id}`, so `/v1/iam/users/alice` matches `/v1/iam/users/{id}`.
//
// This FAILS the build wherever it finds one. It used to fail only on generated
// pages and merely print the rest, which read as leniency towards prose and was
// the opposite: a generated page cannot be wrong, so the strict half of the rule
// covered the half that could not break it, and the half that could accumulated
// 74 invented routes — `/v1/paas/apps`, `/v1/visor/machines`, `/v1/mpc/sign`,
// `/v1/db/query` — each with a curl a reader would run and get a 404 from.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT = path.join(APP_ROOT, 'content/docs');

// Ported upstream docs describe other people's APIs; they are mirrored, not
// authored here, so they are not ours to hold to our document.
const SKIP = ['projects/'];

// What the guard governs: a route a page tells a reader to CALL on the API host.
//
// So the mention must be anchored to `api.hanzo.ai`. A bare `/v1/iam/acs` in a
// SAML guide, or `/v1/batch` in a table of Base's own routes, is a path on
// somebody else's host — Hanzo IAM as an IdP, a Base deployment — and holding
// those to the API's description is a category error, not strictness. What is
// caught is the thing that actually breaks a reader's day: a curl against
// api.hanzo.ai for a route that answers 404.
//
// `<id>` counts as a path segment: pages write `releases/rel_<id>/activate` and
// stopping at the `<` left the truncated `releases/rel_` to be reported as an
// unknown route, which is a complaint about punctuation, not about the API.
const ENDPOINT = /https?:\/\/api\.hanzo\.ai(\/v1\/[A-Za-z0-9_\-{}<>/.]*)/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    // Regular files only: an unchecked-out submodule leaves symlinks pointing
    // at nothing, and a walk that took them crashed the guard on open().
    else if (e.isFile() && (e.name.endsWith('.mdx') || e.name.endsWith('.md'))) out.push(p);
  }
  return out;
}

/**
 * A path as segments, with every placeholder collapsed to one token.
 *
 * The document writes `{id}` and a page writes `<id>`; both stand for "some one
 * segment", so both become `*`. A `{wildcard…}` parameter stands for the REST of
 * the path — that is what a wildcard IS — and becomes `**`. Comparing segments
 * rather than regexes lets both sides carry placeholders, which they do: pages
 * legitimately write `/v1/<service>` when the sentence is about every product.
 */
const ANY = '*';
const REST = '**';
const segments = (p: string): string[] =>
  p
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean)
    .map((s) => (/^\{wildcard/.test(s) ? REST : /^[{<].*[}>]$/.test(s) ? ANY : s));

/** Does `a` name `b`, or a prefix of it? Placeholders match any one segment. */
const names = (a: string[], b: string[]): boolean => {
  if (a.length > b.length && b.at(-1) !== REST) return false;
  for (const [i, seg] of b.entries()) {
    if (seg === REST) return true;
    if (i >= a.length) return true; // `a` ran out: it is a prefix of `b`
    if (a[i] !== seg && a[i] !== ANY && seg !== ANY) return false;
  }
  return a.length <= b.length;
};

/**
 * Addresses cloud SERVES but cannot declare, so the public contract omits them.
 *
 * A handful of apps are mounted as one catch-all relay -- `app.All("/v1/bot/*")`
 * and friends -- so cloud's own document describes them as a single path with a
 * `{wildcard1}` segment and no typed operation beneath it. `public.yaml` drops
 * those, because a wildcard is not a contract: there is nothing to state about
 * parameters, request or response. The routes are still live, and a HIP that
 * specifies one writes real examples against it -- HIP-0074 documents
 * `GET /v1/sbom/{ref}` and shows a filled-in call -- which this guard then read
 * as an invented address on a generated page.
 *
 * Listed as prefixes, read off cloud's internal document at the pinned ref, so
 * the set is a fact about the fleet rather than a hole someone widened to make a
 * build pass. `/v1/admin/...` is deliberately absent: the operator surface is
 * not published, so a page naming it is a real finding.
 *
 * Each entry disappears when cloud gives that app a typed route. That is the
 * fix -- a wildcard relay is undocumentable by construction, and every one of
 * these is a product whose API cannot be generated, described or called from a
 * client until it has one.
 */
const RELAYS = [
  '/v1/bot/',
  '/v1/catalog/entries/',
  '/v1/cloudflare/ai/run/',
  '/v1/deploy/account/can-i/',
  '/v1/dns/',
  '/v1/download/',
  '/v1/kms/secrets/',
  '/v1/sbom/',
  '/v1/sentinel/',
  '/v1/tasks/',
  '/v1/team/billing/ui/',
];

export function checkEndpoints(): { checked: number; unknown: Array<[string, string]> } {
  const doc = loadDocument(DOCUMENT);
  // Only `/v1` routes, because only those are what a page's `/v1/...` can mean.
  // The document also serves the forge at `/{org}/{repo}/…`, whose first segment
  // is a parameter and so names any path with enough segments: left in, that one
  // template alone accepted every route on this site, invented ones included.
  const paths = Object.keys(doc.raw.paths)
    .filter((p) => p.startsWith('/v1/'))
    .map(segments);

  const unknown: Array<[string, string]> = [];
  let checked = 0;

  for (const file of walk(CONTENT)) {
    const rel = path.relative(CONTENT, file);
    if (SKIP.some((s) => rel.startsWith(s))) continue;
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(ENDPOINT)) {
      const raw = (m[1] ?? '').replace(/[.,;:]+$/, '');
      if (!raw || raw.replace(/\/$/, '') === '/v1' || raw.includes('...')) continue;
      checked++;
      const mention = segments(raw);
      if (paths.some((p) => names(mention, p))) continue;
      if (RELAYS.some((prefix) => raw.startsWith(prefix))) continue;
      unknown.push([rel, raw]);
    }
  }
  return { checked, unknown };
}

/** Report every unknown mention, grouped by page. */
export function report(unknown: Array<[string, string]>): void {
  const byFile = new Map<string, string[]>();
  for (const [f, p] of unknown) byFile.set(f, [...(byFile.get(f) ?? []), p]);
  for (const [f, ps] of byFile) console.error(`   ${f}: ${[...new Set(ps)].join(', ')}`);
}

if (import.meta.main) {
  const { checked, unknown } = checkEndpoints();
  console.log(`[endpoints] ${checked} endpoint mentions checked against the document`);
  if (unknown.length) {
    console.error(`[endpoints] FAIL — ${unknown.length} mentions the document does not have:`);
    report(unknown);
    process.exit(1);
  }
  console.log('[endpoints] every mention resolves to the document');
}
