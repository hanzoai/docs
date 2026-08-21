import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  DOCUMENT,
  isInternal,
  loadDocument,
  opSlug,
  publicDocument,
  type Operation,
  type Product,
} from './openapi-doc';
import { fields } from './openapi-schema';
import { genOpenapiPages } from './gen-openapi-pages';

// THE API REFERENCE, held to its own claims.
//
// Checked against pages the generator really writes from the really-vendored
// document, not against a fixture — a fixture agrees with a broken generator.
//
//   addressable  every operation has a page of its own, at a URL that can be
//                sent to someone, so no route is buried in a sibling's page
//   said once    prose the document wrote appears at ONE address, never on both
//                the operation's page and its product's index
//   complete     every parameter, every body field at every depth and every
//                declared response reaches the page — a reference that stops at
//                forty fields sends the reader to the raw document
//   withheld     the operator surface is on none of it, and on no document we
//                publish

const doc = loadDocument(DOCUMENT);
/** What public/openapi/hanzo.yaml is written from — cloned once, it is 3.8 MB. */
const shipped = publicDocument(doc);

/** Every page the generator wrote, keyed by its path under the out dir. */
let page: Map<string, string>;
let internal: Map<string, string>;

const readTree = (dir: string): Map<string, string> => {
  const m = new Map<string, string>();
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith('.mdx')) m.set(path.relative(dir, f), fs.readFileSync(f, 'utf8'));
    }
  };
  walk(dir);
  return m;
};

beforeAll(async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-ref-'));
  const held = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-internal-'));
  await genOpenapiPages(out, held);
  page = readTree(out);
  internal = readTree(held);
}, 300_000);

const at = (p: Product, op: Operation) => `${p.name}/${opSlug(op)}.mdx`;
const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * MDX escapes, undone.
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

/** The frontmatter title, unquoted. */
const titleOf = (src: string) =>
  (src.match(/^title:\s*(.*)$/m)?.[1] ?? '').replace(/^"(.*)"$/, '$1').trim();

/** One `## Section` of a page, up to the next one. */
const section = (src: string, name: string) =>
  spoken(src).split(`\n## ${name}\n`)[1]?.split('\n## ')[0] ?? '';

describe('addressable — every operation has a page of its own', () => {
  it('writes one page per operation, at the slug the href points to', () => {
    const missing: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) if (!page.has(at(p, op))) missing.push(`${p.name}: ${op.id}`);
    }
    expect(missing).toEqual([]);
  });

  it('writes exactly one page per operation and one index per product', () => {
    const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
    expect(page.size).toBe(ops + doc.products.length + 1); // + the section's own index
  });

  it('states the address on the page, as the reader typed it', () => {
    const wrong: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) {
        const want = `\`${op.method.toUpperCase()} ${op.path}\``;
        if (!spoken(page.get(at(p, op))!).includes(want)) wrong.push(`${p.name}: ${op.id}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('gives no two pages in a product the same title', () => {
    const dupes: string[] = [];
    for (const p of doc.products) {
      const seen = new Map<string, string>();
      for (const op of p.operations) {
        const t = titleOf(page.get(at(p, op))!);
        expect(t).not.toBe('');
        if (seen.has(t)) dupes.push(`${p.name}: ${seen.get(t)} and ${op.id} are both "${t}"`);
        seen.set(t, op.id);
      }
    }
    expect(dupes).toEqual([]);
  });
});

describe('said once — the product index is an index, not a copy', () => {
  it('links every operation it owns, and links nothing else', () => {
    const wrong: string[] = [];
    for (const p of doc.products) {
      const src = page.get(`${p.name}/index.mdx`)!;
      const linked = new Set(
        [...src.matchAll(/\]\(\/docs\/openapi\/[^/)]+\/([^)]+)\)/g)].map((m) => m[1]),
      );
      const owned = new Set(p.operations.map(opSlug));
      for (const s of owned) if (!linked.has(s)) wrong.push(`${p.name}: ${s} is on no index`);
      for (const s of linked) if (!owned.has(s)) wrong.push(`${p.name}: ${s} is not this product's`);
    }
    expect(wrong).toEqual([]);
  });

  // The index used to carry each operation's whole description. Two addresses
  // serving the same paragraph is one a reader lands on by chance and one a
  // search engine picks between; the index states the summary and links out.
  it('does not repeat an operation description onto the index', () => {
    const copied: string[] = [];
    for (const p of doc.products) {
      const index = flat(spoken(page.get(`${p.name}/index.mdx`)!));
      for (const op of p.operations) {
        const tail = flat(op.description).slice(200, 320);
        if (tail.length > 80 && index.includes(tail)) copied.push(`${p.name}: ${op.id}`);
      }
    }
    expect(copied).toEqual([]);
  });
});

describe('complete — the document survives onto the page', () => {
  it('keeps every sentence the document wrote for the operation', () => {
    const lost: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) {
        const said = flat(op.description || op.summary);
        if (!said) continue;
        const body = flat(spoken(page.get(at(p, op))!));
        // The first 160 characters are enough to prove the prose landed and are
        // short enough to survive the line-wrapping `prose()` applies.
        if (!body.includes(said.slice(0, 160))) lost.push(`${p.name}: ${op.id}`);
      }
    }
    expect(lost).toEqual([]);
  });

  it('lists every parameter the document declares', () => {
    const missing: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) {
        if (!op.parameters.length) continue;
        const req = section(page.get(at(p, op))!, 'Request');
        for (const par of op.parameters) {
          if (!req.includes(`\`${par.name}\``)) missing.push(`${p.name}/${op.id}: ${par.name}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  // No cap. `UpdateChannelByID` declares 1,698 body fields at every depth and
  // the page carries all of them; the rule that stopped at forty published a
  // reference whose silence about field 41 read exactly like absence.
  it('lists every body field, at every depth, uncapped', () => {
    const missing: string[] = [];
    let deepest = 0;
    for (const p of doc.products) {
      for (const op of p.operations) {
        if (!op.body?.schema) continue;
        const req = section(page.get(at(p, op))!, 'Request');
        for (const f of fields(doc.raw, op.body.schema)) {
          deepest = Math.max(deepest, f.depth);
          if (!req.includes(`\`${f.name}\``)) missing.push(`${p.name}/${op.id}: ${f.name}`);
        }
      }
    }
    expect(missing).toEqual([]);
    expect(deepest).toBeGreaterThan(0);
  });

  it('lists every response status the document declares', () => {
    const missing: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) {
        const declared = Object.keys(doc.raw.paths?.[op.path]?.[op.method]?.responses ?? {});
        if (!declared.length) continue;
        const res = section(page.get(at(p, op))!, 'Response');
        for (const s of declared) if (!res.includes(`\`${s}\``)) missing.push(`${p.name}/${op.id}: ${s}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('shows the call on all four surfaces', () => {
    const thin: string[] = [];
    for (const p of doc.products) {
      for (const op of p.operations) {
        const ex = section(page.get(at(p, op))!, 'Examples');
        if (!ex.includes("items={['CLI', 'SDK', 'HTTP', 'MCP']}")) thin.push(`${p.name}: ${op.id}`);
      }
    }
    expect(thin).toEqual([]);
  });
});

// The operator surface. z: "HIDE the admin shit? that is private only? don't
// have that in our public docs?" — so no published page names one of these
// routes, and no published document carries one.
describe('withheld — the operator surface is not published', () => {
  // "Documented here" means an entry: the address line, or a row in a table. It
  // deliberately does not mean "the characters appear on the page" — two public
  // referrals operations CROSS-REFERENCE the sweep job in their own prose, and
  // that sentence was written next to the Go handler. This generator authors
  // nothing and rewrites nothing; editing it here would mean the page no longer
  // says what the document says. That one belongs upstream, in the doc comment.
  //
  // The address line on an operation page is ONLY the address — a prose line
  // that opens with a backticked route keeps going past the closing backtick,
  // and two referrals operations do exactly that, naming the sweep job they
  // hand off to. Anchoring the pattern at both ends is what separates "this
  // page documents the route" from "this page mentions it".
  const entries = (src: string): string[] =>
    spoken(src)
      .split('\n')
      .filter((l) => l.startsWith('|') || /^`(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \S+`$/.test(l.trim()));

  it('gives no /v1/admin route an entry on any published page', () => {
    const leaked: string[] = [];
    for (const [name, src] of page) {
      for (const l of entries(src)) if (l.includes('/v1/admin')) leaked.push(`${name}: ${l.slice(0, 90)}`);
    }
    expect(leaked).toEqual([]);
  });

  it('gives no entry to an operation held back by name', () => {
    const held = doc.operations.filter(isInternal);
    const leaked: string[] = [];
    for (const [name, src] of page) {
      const rows = entries(src);
      for (const op of held) if (rows.some((l) => l.includes(op.path))) leaked.push(`${name}: ${op.path}`);
    }
    expect(leaked).toEqual([]);
  });

  // public/openapi/hanzo.yaml ships in the static export and is what /reference
  // renders. Filtering the pages and copying the document whole would leave the
  // whole surface one URL away.
  it('carries none of them in the published document', () => {
    const paths = Object.keys(shipped.paths);
    expect(paths.filter((p) => p.startsWith('/v1/admin'))).toEqual([]);
    expect(shipped.tags.map((t: any) => t.name)).not.toContain('admin');
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
    const iam = doc.products.find((p) => p.name === 'iam')!;
    const op = iam.operations.find((o) => o.path === route)!;
    expect(spoken(page.get(at(iam, op))!)).toContain(route);
  });
});

describe('kept — the operator surface is documented, just not here', () => {
  it('renders every held-back operation onto an internal page', () => {
    const missing: string[] = [];
    for (const p of doc.internal) {
      for (const op of p.operations) {
        if (!internal.has(`${p.name}/${opSlug(op)}.mdx`)) missing.push(`${p.name}: ${op.id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  // The COUNT is the pin's, not this file's: `openapi.yaml` holds 87 operator
  // routes and `public.yaml` holds the one cloud has not finished moving, so a
  // literal here fails on a re-pin that changed nothing. What must hold either
  // way is that the split is exhaustive — everything `isInternal` names is held
  // back, and nothing else is.
  it('holds back every operation the document has and nothing more', () => {
    const held = doc.internal.reduce((n, p) => n + p.operations.length, 0);
    expect(held).toBe(doc.operations.filter(isInternal).length);
  });
});
