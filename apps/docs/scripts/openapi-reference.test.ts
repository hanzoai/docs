import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { DOCUMENT, isInternal, loadDocument, publicDocument } from './openapi-doc';
import { genOpenapiPages } from './gen-openapi-pages';

// THE API REFERENCE, held to its own claims.
//
// Checked against pages the generator really writes from the really-vendored
// document, not against a fixture — a fixture agrees with a broken generator.
//
//   scannable   a heading is the endpoint, so the right rail is a list of
//               endpoints and not a column of wrapped sentences
//   unique      no two headings on a page collide, so no contents link lands on
//               the wrong section
//   said once   the summary is the description's first sentence far more often
//               than not; it is published once, never twice
//   complete    every operation the document serves has an entry, and every
//               sentence the document wrote for it survives onto the page

const doc = loadDocument(DOCUMENT);
/** What public/openapi/hanzo.yaml is written from — cloned once, it is 3.8 MB. */
const shipped = publicDocument(doc);

let pageOf: Map<string, string>;
let internalOf: Map<string, string>;

const read = (dir: string, products: { name: string }[]) => {
  const m = new Map<string, string>();
  for (const p of products) {
    const f = p.name === 'index' ? path.join(dir, p.name, 'index.mdx') : path.join(dir, `${p.name}.mdx`);
    m.set(p.name, fs.readFileSync(f, 'utf8'));
  }
  return m;
};

beforeAll(async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-ref-'));
  const internal = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-internal-'));
  await genOpenapiPages(out, internal);
  pageOf = read(out, doc.products);
  internalOf = read(internal, doc.internal);
}, 180_000);

/** `### ` headings, in page order. `## ` is the tag, a section within a page. */
const headings = (src: string): string[] =>
  src.split('\n').filter((l) => l.startsWith('### ')).map((l) => l.slice(4).trim());

/**
 * One operation's entry: its heading, and everything under it up to the next.
 *
 * The unit every claim below is really about. Counting a sentence across a whole
 * PAGE cannot tell "printed twice for one operation" from "two operations that
 * share a doc comment, each printing it once" — `GET` and `POST
 * /v1/iam/oauth/logout` are one Go function's comment on two routes, and there
 * are twelve more pairs like them.
 */
const sections = (src: string): Map<string, string> => {
  const out = new Map<string, string>();
  let heading = '';
  let body: string[] = [];
  // The entry INCLUDES its heading. Keying by it and storing only what follows
  // hid the very defect this file exists for: a summary printed as the heading
  // and again in the prose is two occurrences, and a body-only count sees one.
  const flush = () => {
    if (heading) out.set(heading, [heading, ...body].join('\n'));
  };
  for (const line of src.split('\n')) {
    if (line.startsWith('### ')) {
      flush();
      heading = line.slice(4).trim();
      body = [];
    } else if (line.startsWith('## ')) {
      flush();
      heading = '';
      body = [];
    } else body.push(line);
  }
  flush();
  return out;
};

/**
 * Strict on purpose. Returning '' for an entry that is not there would let every
 * claim below pass by asking questions of an empty string — a green suite that
 * proves the headings changed shape and nothing else.
 */
const sectionOf = (src: string, op: { method: string; path: string }): string => {
  const heading = `\`${op.method.toUpperCase()} ${op.path}\``;
  const found = sections(src).get(heading);
  if (found === undefined) throw new Error(`no entry headed ${heading}`);
  return found;
};

const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * A page back in the document's own characters.
 *
 * `prose()` escapes `{`, `}`, `<` and `>` because each is syntax to MDX, so a
 * summary carrying any of them would never be found in the rendered page and
 * every assertion below would pass by matching nothing — a clean result that
 * means the test never ran. Undoing the escape compares like with like.
 */
const spoken = (src: string) =>
  src
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

describe('scannable — a heading is the endpoint', () => {
  it('every operation is headed by its own method and path', () => {
    const missing: string[] = [];
    for (const p of doc.products) {
      const found = new Set(headings(pageOf.get(p.name)!));
      for (const op of p.operations) {
        if (!found.has(`\`${op.method.toUpperCase()} ${op.path}\``)) {
          missing.push(`${p.name}: ${op.method.toUpperCase()} ${op.path}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  // The rail wraps a heading it cannot fit, and a wrapped heading is a
  // paragraph. The longest path the document serves is 84 characters; the
  // summaries this replaced ran to 417.
  it('no heading is longer than a line', () => {
    const long = [...pageOf.values()].flatMap(headings).filter((h) => h.length > 100);
    expect(long).toEqual([]);
  });
});

describe('unique — no contents link is ambiguous', () => {
  it('no page repeats a heading', () => {
    const dupes: string[] = [];
    for (const [name, src] of pageOf) {
      const seen = new Set<string>();
      for (const h of headings(src)) {
        if (seen.has(h)) dupes.push(`${name}: ${h}`);
        seen.add(h);
      }
    }
    expect(dupes).toEqual([]);
  });
});

describe('said once — the summary is not published twice', () => {
  it('never prints a summary the description already opens with', () => {
    const twice: string[] = [];
    for (const p of doc.products) {
      const src = spoken(pageOf.get(p.name)!);
      for (const op of p.operations) {
        const summary = flat(op.summary);
        if (!summary || !flat(op.description).startsWith(summary)) continue;
        // The sentence lives in this operation's description, so it may appear
        // once in this operation's entry. Twice means it was printed as a
        // heading or a lead as well — which is what the reference did.
        //
        // Flattened, because the description keeps the source's line wrapping
        // while a heading and a lead are written on one line: comparing raw,
        // only the one-line copies could ever match and the assertion would
        // count 1 where the entry really says it twice.
        const occurrences = flat(sectionOf(src, op)).split(summary).length - 1;
        if (occurrences > 1) twice.push(`${p.name}: ${op.method.toUpperCase()} ${op.path}`);
      }
    }
    expect(twice).toEqual([]);
  });
});

describe('complete — the document survives onto the page', () => {
  it('keeps the summary where the description does not carry it', () => {
    const lost: string[] = [];
    for (const p of doc.products) {
      const src = spoken(pageOf.get(p.name)!);
      for (const op of p.operations) {
        const summary = flat(op.summary);
        if (!summary || flat(op.description).startsWith(summary)) continue;
        if (!flat(sectionOf(src, op)).includes(summary)) {
          lost.push(`${p.name}: ${op.method.toUpperCase()} ${op.path}`);
        }
      }
    }
    expect(lost).toEqual([]);
  });

  it('prints every operation that has one page to be on', () => {
    const counted = doc.products.reduce((n, p) => n + p.operations.length, 0);
    const rendered = [...pageOf.values()].reduce((n, src) => n + headings(src).length, 0);
    expect(rendered).toBe(counted);
  });
});

// The operator surface. z: "HIDE the admin shit? that is private only? don't
// have that in our public docs?" — so no published page names one of these
// routes, and no published document carries one.
describe('withheld — the operator surface is not published', () => {
  // "Documented here" means an entry: a heading, or a row in a parameter or
  // body table. It deliberately does not mean "the characters appear on the
  // page" — two public referrals operations CROSS-REFERENCE the sweep job in
  // their own prose ("the sweep job (POST /v1/admin/referrals/sweep)"), and
  // that sentence was written next to the Go handler. This generator authors
  // nothing and rewrites nothing; editing it here would mean the page no longer
  // says what the document says. That one belongs upstream, in the doc comment.
  const documented = (src: string): string[] =>
    spoken(src)
      .split('\n')
      .filter((l) => l.startsWith('### ') || l.startsWith('|'));

  it('no published page gives a /v1/admin route an entry', () => {
    const leaked: string[] = [];
    for (const [name, src] of pageOf) {
      for (const l of documented(src)) {
        if (l.includes('/v1/admin')) leaked.push(`${name}: ${l.trim().slice(0, 90)}`);
      }
    }
    expect(leaked).toEqual([]);
  });

  it('no published page gives an entry to an operation held back by name', () => {
    const held = doc.operations.filter(isInternal);
    const leaked: string[] = [];
    for (const [name, src] of pageOf) {
      const entries = documented(src);
      for (const op of held) {
        if (entries.some((l) => l.includes(op.path))) leaked.push(`${name}: ${op.path}`);
      }
    }
    expect(leaked).toEqual([]);
  });

  // public/openapi/hanzo.yaml ships in the static export and is what /reference
  // renders. Filtering the pages and copying the document whole would leave the
  // whole surface one URL away.
  // public/openapi/hanzo.yaml ships in the static export and is what /reference
  // renders. Filtering the pages and copying the document whole would leave the
  // whole surface one URL away.
  it('the published document carries none of them', () => {
    const paths = Object.keys(shipped.paths);
    expect(paths.filter((p) => p.startsWith('/v1/admin'))).toEqual([]);
    expect(paths).not.toContain('/v1/commerce/admin/catalog');
    expect(shipped.tags.map((t: any) => t.name)).not.toContain('admin');
    // Everything else survives — this is a projection, not a rewrite. 80 paths
    // are wholly `/v1/admin`; the 81st is the one commerce route, whose only
    // method was the held-back one.
    expect(paths.length).toBe(Object.keys(doc.raw.paths).length - 81);
  });
});

// The predicate is the `admin` PRODUCT plus one named operation, never a path
// substring — `/v1/iam/admin/*` is the org administrator's own API and a
// customer-facing one. This is the assertion that stops it being "simplified"
// into a substring match later.
describe('withheld — but only what is really the operator surface', () => {
  it.each([
    '/v1/iam/admin/applications/upsert',
    '/v1/iam/admin/provision',
    '/v1/iam/admin/users/upsert',
  ])('still publishes %s', (route) => {
    expect(Object.keys(shipped.paths)).toContain(route);
    expect(spoken(pageOf.get('iam')!)).toContain(route);
  });
});

describe('kept — the operator surface is documented, just not here', () => {
  it('renders every held-back operation onto an internal page', () => {
    const missing: string[] = [];
    for (const p of doc.internal) {
      const found = new Set(headings(internalOf.get(p.name)!));
      for (const op of p.operations) {
        if (!found.has(`\`${op.method.toUpperCase()} ${op.path}\``)) {
          missing.push(`${p.name}: ${op.method.toUpperCase()} ${op.path}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('holds back every operation the document has and nothing more', () => {
    const held = doc.internal.reduce((n, p) => n + p.operations.length, 0);
    expect(held).toBe(doc.operations.filter(isInternal).length);
    expect(held).toBe(87);
  });
});
