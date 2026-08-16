import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument, type KeyType } from './openapi-doc';

// No page may spell a Hanzo API key a way cloud does not mint.
//
// This is check-endpoints' rule applied to the other half of a first call. That
// guard stops a page naming a route the API does not serve; this one stops a
// page naming a CREDENTIAL the API does not issue, which fails a reader one step
// earlier — they cannot even ask for the key the page tells them to get.
//
// It was written because docs.hanzo.ai documented three key types and cloud has
// two. `hk-` and `hz-` appeared on 148 pages, including the authentication page,
// and neither has ever existed: cloud's door takes `pk-` and `sk-` and refuses
// everything else. Prose cannot be trusted to remember that, so it is checked.
//
// BOTH directions, which is what makes the pages underivable-from-memory:
//
//   unknown  a page spells a prefix the document does not carry -> fail
//   missing  the authentication page omits a class the document DOES carry -> fail
//
// So renaming a class in cloud fails the build, adding one fails the build until
// it is documented, and removing one fails the build while a page still teaches
// it. A prefix on these pages is therefore a projection of cloud with a checked
// arrow back to it, not a value someone typed and nobody re-read.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT = path.join(APP_ROOT, 'content/docs');

/** Where the key classes are taught. The `missing` half of the rule applies here. */
const AUTHORITY = 'api-keys.mdx';

// Ported upstream docs describe other people's credentials — Stripe's `sk_`,
// GitHub's `ghp_` — mirrored, not authored here. Same exemption check-endpoints
// makes, for the same reason: they are not ours to hold to our document.
const SKIP = ['projects/'];

/**
 * What a credential looks like, and where one appears. Both halves are needed,
 * and the first half is read off the document rather than chosen.
 *
 * SHAPE. A prefix is some lowercase letters and a hyphen, and how many letters
 * is not this file's opinion — it is measured from the prefixes the document
 * carries. `sk-` and `pk-` are two letters, so two letters is what a Hanzo key
 * prefix is today, and the day cloud mints a longer one the guard widens with
 * it. That one derived number is what separates `hk-your-api-key` from a bare
 * `your-api-key`: the first wears a prefix, the second IS the placeholder.
 *
 * POSITION. Shape alone separates nothing — `us-east-1` and `do-sfo3` are two
 * letters and a hyphen too. A credential appears in exactly three places, and
 * none of them holds a region or a model:
 *
 *   PRESENTED   Bearer hk-…                      the header a reader will send
 *   ASSIGNED    api_key="hk-…", HANZO_API_KEY=…  an identifier ending in key or
 *                                                token, given a prefixed value
 *   NAMED       `hk-`   `hk-*`   `hk-...`        the prefix as its own code span
 *
 * This is check-endpoints' anchor argument applied to credentials: that guard
 * only reads a path written against `api.hanzo.ai`, because a bare `/v1/acs` is
 * on somebody else's host. A bare hyphenated word is somebody else's noun.
 *
 * NAMED deliberately does NOT admit a body that says the word key. It looks like
 * it should — `hk-your-api-key` is plainly a credential — but every literal of
 * that form on this site is already in a Bearer or an assignment, while the
 * shape by itself sweeps up `iam-secrets`, `oidc-client-secret`, `data-api-key`
 * and every other Kubernetes Secret named on these pages. It bought nothing and
 * cost fourteen wrong findings.
 *
 * One thing this cannot tell apart, and does not pretend to: an upstream
 * provider's key that happens to share a spelling. `OPENAI_API_KEY=sk-…` reads
 * as `sk-`, which is also Hanzo's secret prefix, so it passes. It would only
 * ever pass — a shared spelling cannot produce a wrong refusal — so the
 * ambiguity costs a reader nothing.
 */
const PRESENTED = (n: string) => new RegExp(String.raw`\bBearer\s+["'\`]?([a-z]{${n}}-)`, 'gi');
const ASSIGNED = (n: string) =>
  new RegExp(
    String.raw`[A-Za-z_][A-Za-z0-9_-]*(?:key|token)["'\`]?\s*(?:[:=]\s*["'\`]?|\(\s*["'\`])([a-z]{${n}}-)`,
    'gi',
  );
const NAMED = (n: string) =>
  new RegExp(String.raw`(?:\`|")([a-z]{${n}}-)(\*|\.\.\.)?(?:\`|")`, 'g');

/** The prefix lengths the document uses, as a regex quantifier: `2`, or `2,4`. */
export function prefixShape(keys: KeyType[]): string {
  const lens = [...new Set(keys.map((k) => k.prefix.replace(/[-_]/, '').length))].sort((a, b) => a - b);
  return lens.length === 1 ? String(lens[0]) : `${lens[0]},${lens.at(-1)}`;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && (e.name.endsWith('.mdx') || e.name.endsWith('.md'))) out.push(p);
  }
  return out;
}

/**
 * A page as the build compiles it, with `<include>` spliced in.
 *
 * The key-type table is generated from the document and included, so reading the
 * raw source would find no prefixes on the very page whose job is to teach them
 * — and the `missing` half of the rule would fail on the page that is most
 * right. remarkInclude resolves relative to the including file; so does this.
 *
 * A target that is not there THROWS, and that is not defensiveness. The first
 * version returned the unresolved tag instead, and an include written one
 * directory short passed every check while the page it was on rendered nothing
 * at all — the body silently empty, frontmatter and chrome intact, so the page
 * still had its title in the sidebar and its description in the search index.
 * A guard that tolerates a broken include is checking a page nobody can read.
 */
const INCLUDE = /<include>\s*([^<\s#]+)[^<]*<\/include>/g;

function compiled(file: string, depth = 0): string {
  const src = fs.readFileSync(file, 'utf8');
  if (depth > 3) return src;
  return src.replace(INCLUDE, (_whole, rel: string) => {
    const target = path.resolve(path.dirname(file), rel);
    if (!fs.existsSync(target)) {
      throw new Error(`${file} includes ${rel}, which does not exist — the page renders empty`);
    }
    return compiled(target, depth + 1);
  });
}

/** Every credential prefix a page spells, deduplicated and lowercased. */
export function prefixesIn(src: string, shape: string): Set<string> {
  const found = new Set<string>();
  for (const re of [PRESENTED(shape), ASSIGNED(shape), NAMED(shape)]) {
    for (const m of src.matchAll(re)) found.add(m[1].toLowerCase());
  }
  return found;
}

export interface KeyCheck {
  /** How many credential literals were read across the content tree. */
  checked: number;
  /** The classes the document carries — what the pages are checked against. */
  keys: KeyType[];
  /** Page, and the prefix it spells that cloud does not mint. */
  unknown: Array<[string, string]>;
  /** Classes the document carries that the authority page never teaches. */
  missing: string[];
}

export function checkKeys(): KeyCheck {
  const doc = loadDocument(DOCUMENT);
  const known = new Set(doc.keys.map((k) => k.prefix));
  const shape = prefixShape(doc.keys);

  const unknown: Array<[string, string]> = [];
  let checked = 0;
  let taught = new Set<string>();

  for (const file of walk(CONTENT)) {
    const rel = path.relative(CONTENT, file);
    if (SKIP.some((s) => rel.startsWith(s))) continue;
    const found = prefixesIn(compiled(file), shape);
    checked += found.size;
    if (rel === AUTHORITY) taught = found;
    for (const p of found) if (!known.has(p)) unknown.push([rel, p]);
  }

  return {
    checked,
    keys: doc.keys,
    unknown,
    missing: doc.keys.filter((k) => !taught.has(k.prefix)).map((k) => `${k.name} (${k.prefix})`),
  };
}

/** Report every page that spells a prefix cloud does not mint. */
export function report(unknown: Array<[string, string]>): void {
  const byFile = new Map<string, string[]>();
  for (const [f, p] of unknown) byFile.set(f, [...(byFile.get(f) ?? []), p]);
  for (const [f, ps] of byFile) console.error(`   ${f}: ${[...new Set(ps)].join(', ')}`);
}

if (import.meta.main) {
  const { checked, keys, unknown, missing } = checkKeys();
  console.log(
    `[keys] the document mints ${keys.map((k) => `${k.name} ${k.prefix}`).join(', ')}; ` +
      `${checked} credential literals read`,
  );
  if (unknown.length) {
    console.error(`[keys] FAIL — ${unknown.length} spell a prefix cloud does not mint:`);
    report(unknown);
  }
  if (missing.length) {
    console.error(`[keys] FAIL — ${AUTHORITY} never teaches: ${missing.join(', ')}`);
  }
  if (unknown.length || missing.length) process.exit(1);
  console.log('[keys] every prefix on every page is one the document carries');
}
