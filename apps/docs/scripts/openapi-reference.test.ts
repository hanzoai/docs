import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadDocument } from './openapi-doc';
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

const doc = loadDocument(path.join(import.meta.dirname, '../openapi-specs/hanzo.yaml'));

let pageOf: Map<string, string>;

beforeAll(async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'openapi-ref-'));
  await genOpenapiPages(out);
  pageOf = new Map();
  for (const p of doc.products) {
    const f = p.name === 'index' ? path.join(out, p.name, 'index.mdx') : path.join(out, `${p.name}.mdx`);
    pageOf.set(p.name, fs.readFileSync(f, 'utf8'));
  }
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
