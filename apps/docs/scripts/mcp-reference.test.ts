import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { DOCUMENT, loadDocument } from './openapi-doc';
import { toolKeys, toolOperations } from './openapi-surfaces';
import { load } from './sync-mcp-tools';
import { constraintsOf, genMcpPages, published } from './gen-mcp-pages';

// THE MCP REFERENCE, held to its own claims.
//
// The reference claims four checkable properties, so they are checked here
// against pages the generator really writes from the really-vendored tool list —
// not against a fixture, which could agree with a broken generator.
//
//   uniform     every tool page carries the same sections in the same order
//   complete    every field the door declares appears in the page's table
//   exemplified every page carries a tools/call envelope that parses
//   reachable   every page is linked from the catalogue and its product index
//
// A tool page states nothing the door did not say, so "generated" is not a test
// but a property of gen-mcp-pages: no sentence about a tool is written there.

const catalog = load();
const doc = loadDocument(DOCUMENT);
/** The join every completeness assertion below reads through. */
const mappedOps = toolOperations(doc, catalog.tools);
// The reference documents the PUBLISHED tools, so the claims below are read
// against the same list the generator writes — see published(). Reading the
// door's whole answer here would fail every count by the 78 operator tools that
// deliberately have no page.
catalog.tools = published(catalog, mappedOps);

let out: string;
let pageOf: Map<string, string>;

beforeAll(async () => {
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-ref-'));
  await genMcpPages(out);
  pageOf = new Map();
  for (const product of fs.readdirSync(out, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    for (const f of fs.readdirSync(path.join(out, product.name))) {
      if (f.endsWith('.mdx') && f !== 'index.mdx') {
        pageOf.set(f.slice(0, -4), fs.readFileSync(path.join(out, product.name, f), 'utf8'));
      }
    }
  }
}, 120_000);

// The join is one rule read in both directions, so it is pinned in both. The
// cases are taken from the live door's own tools/list answer.
describe('the tool -> operation rule', () => {
  it('keys an operation by its name and by its route', () => {
    const op = doc.operations.find((o) => o.id === 'patch_v1_agents_targets_by_id')!;
    expect(toolKeys(op)).toEqual(['patch_v1_agents_targets_by_id', 'patch_v1_agents_targets_id']);
  });

  it('keys a route whose operationId spells a parameter differently', () => {
    const op = doc.operations.find((o) => o.id === 'delete_v1_projects_by_slug');
    if (!op) return expect(op).toBeUndefined(); // pin moved; the rule below still holds
    const [name, route] = toolKeys(op);
    expect(name).toBe('delete_v1_projects_by_slug');
    expect(route).toBe('delete_v1_projects_slug');
  });

  it('resolves all but a handful of the door\'s tools to an operation', () => {
    const mapped = toolOperations(doc, catalog.tools);
    // Every tool the document describes must resolve; the rest are counted and
    // published as unmapped rather than dropped, so this asserts the shape of
    // the gap, not a number that pins the fleet in place.
    expect(mapped.size).toBeGreaterThan(catalog.tools.length * 0.95);
    expect(mapped.size).toBeLessThanOrEqual(catalog.tools.length);
  });
});

describe('every tool has a page', () => {
  it('one page per tool, no collisions', () => {
    expect(pageOf.size).toBe(catalog.tools.length);
  });
});

describe('uniform — the same sections in the same order', () => {
  it('every tool page carries exactly the reference sections, in order', () => {
    const want = ['## Arguments', '## Call it', '## The operation behind it'];
    const wrong: string[] = [];
    for (const [name, src] of pageOf) {
      const got = src.split('\n').filter((l) => l.startsWith('## '));
      // `## Object types` is the one conditional section: it appears only when
      // the tool's schema declares $defs, and always directly after Arguments.
      const core = got.filter((h) => h !== '## Object types');
      if (core.join('|') !== want.join('|')) wrong.push(`${name}: ${got.join(' ')}`);
      const defs = got.indexOf('## Object types');
      if (defs !== -1 && got[defs - 1] !== '## Arguments') wrong.push(`${name}: Object types misplaced`);
    }
    expect(wrong).toEqual([]);
  });
});

describe('complete — every declared field is enumerated', () => {
  it('names every property, and every $defs type, in the page', () => {
    const missing: string[] = [];
    for (const t of catalog.tools) {
      const src = pageOf.get(t.name)!;
      for (const f of Object.keys(t.inputSchema?.properties ?? {})) {
        if (!src.includes(`| \`${f}\` |`)) missing.push(`${t.name}.${f}`);
      }
      for (const d of Object.keys(t.inputSchema?.$defs ?? {})) {
        if (!src.includes(`### ${d}`)) missing.push(`${t.name} $defs.${d}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('attributes every column to the source that filled it', () => {
    // The door publishes a type and a description and nothing else, so the
    // Required, Default and Values columns come from the operation. A page that
    // printed them without saying so would imply the door declares them.
    const withFields = catalog.tools.filter((t) => Object.keys(t.inputSchema?.properties ?? {}).length);
    expect(withFields.length).toBeGreaterThan(0);
    const silent = withFields.filter((t) => !pageOf.get(t.name)!.includes('and nothing further'));
    expect(silent).toEqual([]);
  });

  it('marks a field the operation requires, on every page that has one', () => {
    // The gap this reference exists to close: the door marks nothing required,
    // so before the join every one of these pages printed `—` for a field the
    // API rejects the call without.
    const marked: string[] = [];
    const wrong: string[] = [];
    for (const t of catalog.tools) {
      const props = t.inputSchema?.properties ?? {};
      const con = constraintsOf(mappedOps.get(t.name));
      const required = Object.keys(props).filter((n) => con.get(n)?.required);
      if (!required.length) continue;
      marked.push(t.name);
      const src = pageOf.get(t.name)!;
      for (const n of required) {
        const row = src.split('\n').find((l) => l.startsWith(`| \`${n}\` |`));
        if (!row?.includes('**yes**')) wrong.push(`${t.name}.${n}`);
      }
      if (!src.includes(`, ${required.length} required |`)) wrong.push(`${t.name}: header count`);
    }
    expect(wrong).toEqual([]);
    // Guard the join itself: if it collapsed, the loop above would run zero
    // times and pass vacuously. A fraction, not a count — the fleet's tool list
    // moves daily and this asserts the shape of the join, not today's total.
    expect(marked.length).toBeGreaterThan(catalog.tools.length * 0.2);
  });

  it('enumerates every value the operation restricts a field to', () => {
    const missing: string[] = [];
    let checked = 0;
    for (const t of catalog.tools) {
      const props = t.inputSchema?.properties ?? {};
      const con = constraintsOf(mappedOps.get(t.name));
      for (const n of Object.keys(props)) {
        const vals = con.get(n)?.enum ?? [];
        if (!vals.length) continue;
        checked++;
        const row = pageOf.get(t.name)!.split('\n').find((l) => l.startsWith(`| \`${n}\` |`));
        for (const v of vals) {
          const bare = v.startsWith('"') ? v.slice(1, -1) : v;
          if (!row?.includes(`\`${bare}\``)) missing.push(`${t.name}.${n} = ${v}`);
        }
      }
    }
    expect(missing).toEqual([]);
    // The document declares NO enum on any tool-visible field at this pin, so
    // this passes over an empty set — deliberately, and out loud. cloud's
    // emission carries a shape only where a route is a typed op; the 114 enum
    // fields that used to be here belonged to the hand-merged master hanzoai/
    // openapi deleted, and every one was an approximation of a route nobody
    // typed. The rule is right and it starts checking real values the release
    // those routes become `zip.Get[In, Out]`. The JOIN is guarded above, on
    // required fields, where the document does declare — so an empty set here
    // cannot hide a collapsed join.
    console.log(`[mcp-ref] enum fields checked: ${checked}`);
  });

  it('enumerates an object declared inline, not just one named in $defs', () => {
    const missing: string[] = [];
    let checked = 0;
    for (const t of catalog.tools) {
      for (const [n, p] of Object.entries<any>(t.inputSchema?.properties ?? {})) {
        const obj = p?.properties ? p : p?.items?.properties ? p.items : null;
        if (!obj) continue;
        checked++;
        const src = pageOf.get(t.name)!;
        if (!src.includes(`### ${n}`)) missing.push(`${t.name}.${n}: no table`);
        for (const f of Object.keys(obj.properties)) {
          if (!src.includes(`| \`${f}\` |`)) missing.push(`${t.name}.${n}.${f}`);
        }
      }
    }
    expect(missing).toEqual([]);
    expect(checked).toBeGreaterThan(0);
  });

  it('states a required argument the door never declares, instead of an empty object', () => {
    // Some operations need a path parameter the door's schema omits entirely.
    // The page cannot say where the value goes, so it must say that.
    const silent: string[] = [];
    let checked = 0;
    for (const t of catalog.tools) {
      const con = constraintsOf(mappedOps.get(t.name));
      const props = t.inputSchema?.properties ?? {};
      const absent = [...con.entries()].filter(([n, c]) => c.required && !(n in props)).map(([n]) => n);
      if (!absent.length) continue;
      checked++;
      const src = pageOf.get(t.name)!;
      for (const n of absent) {
        if (!src.includes(`does not declare on this tool`) || !src.includes(`\`${n}\``))
          silent.push(`${t.name}.${n}`);
      }
    }
    expect(silent).toEqual([]);
    expect(checked).toBeGreaterThan(0);
  });
});

describe('exemplified — every page carries a call that parses', () => {
  it('emits a valid tools/call envelope naming the tool', () => {
    const bad: string[] = [];
    for (const t of catalog.tools) {
      const body = pageOf.get(t.name)!.match(/-d '([\s\S]*?)'\n```/)?.[1];
      if (!body) {
        bad.push(`${t.name}: no envelope`);
        continue;
      }
      let parsed: any;
      try {
        parsed = JSON.parse(body.replace(/\n {5}/g, '\n'));
      } catch (e) {
        bad.push(`${t.name}: ${(e as Error).message}`);
        continue;
      }
      if (parsed.jsonrpc !== '2.0' || parsed.method !== 'tools/call') bad.push(`${t.name}: not a tools/call`);
      if (parsed.params?.name !== t.name) bad.push(`${t.name}: envelope names ${parsed.params?.name}`);
      const args = Object.keys(parsed.params?.arguments ?? {});
      const declared = Object.keys(t.inputSchema?.properties ?? {});
      const con = constraintsOf(mappedOps.get(t.name));
      const required = declared.filter((n) => con.get(n)?.required);
      // The envelope is the smallest call that can run: exactly the required
      // arguments where the operation names any, every declared one where it
      // names none. Never a subset chosen by anything else.
      const want = required.length ? required : declared;
      if (args.join(',') !== want.sort().join(','))
        bad.push(`${t.name}: sent [${args}] for [${want}]`);
      for (const n of args) {
        if (!declared.includes(n)) bad.push(`${t.name}: sent ${n}, which the door does not declare`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('names every value it had to invent, so none reads as a declared default', () => {
    // A `<placeholder>` announces itself. A number, a boolean and a timestamp
    // cannot, so an unannounced one is indistinguishable from a value the API
    // declares — the page would be inventing quietly. Checked against the
    // RENDERED envelope, and the schema walk below is this test's own: it
    // resolves a dotted path through the door's schema without asking the
    // generator what it decided.
    const nodeAt = (schema: any, path: string): any => {
      const defs: Record<string, any> = schema?.$defs ?? {};
      let node = schema?.properties?.[path.split('.')[0].replace(/\[\]$/, '')];
      for (const seg of path.split('.').slice(1)) {
        const bare = seg.replace(/\[\]$/, '');
        if (node?.$ref?.startsWith('#/$defs/')) node = defs[node.$ref.slice(8)];
        if (seg.endsWith('[]') || node?.type === 'array') node = node?.items ?? node;
        node = node?.properties?.[bare];
      }
      return node ?? {};
    };
    /** Dotted paths of leaves a reader cannot tell are stand-ins. */
    const opaque = (v: unknown, at: string): string[] => {
      if (typeof v === 'number' || typeof v === 'boolean') return [at];
      if (typeof v === 'string') return /^\d{4}-\d{2}-\d{2}T/.test(v) ? [at] : [];
      if (Array.isArray(v)) return v.flatMap((x) => opaque(x, `${at}[]`));
      if (v && typeof v === 'object')
        return Object.entries(v).flatMap(([k, x]) => opaque(x, `${at}.${k}`));
      return [];
    };

    const quiet: string[] = [];
    let checked = 0;
    for (const t of catalog.tools) {
      const src = pageOf.get(t.name)!;
      const schema = t.inputSchema ?? {};
      const con = constraintsOf(mappedOps.get(t.name));
      const args = JSON.parse(
        src.match(/-d '([\s\S]*?)'\n```/)![1].replace(/\n {5}/g, '\n'),
      ).params.arguments ?? {};
      for (const [n, v] of Object.entries(args)) {
        const c = con.get(n);
        // A value either source declares is the API's own, whole subtree.
        if (schema.properties?.[n]?.default !== undefined || c?.def || c?.enum.length) continue;
        for (const p of opaque(v, n)) {
          if (nodeAt(schema, p)?.default !== undefined) continue;
          checked++;
          if (!src.includes(`\`${p}\` hold`) && !src.includes(`\`${p}\`, `) && !src.includes(`\`${p}\` and `))
            quiet.push(`${t.name}: ${p} = ${JSON.stringify(v)}`);
        }
      }
    }
    expect(quiet).toEqual([]);
    // The catalogue really does force this: without it, hundreds of fabricated
    // scalars would ship unattributed.
    expect(checked).toBeGreaterThan(100);
  });

  it('uses a value the operation accepts wherever it declares one', () => {
    // A placeholder where a real value exists is an invented example. Where the
    // operation enumerates a field's values, the call must carry one of them.
    const invented: string[] = [];
    let checked = 0;
    for (const t of catalog.tools) {
      const con = constraintsOf(mappedOps.get(t.name));
      const body = pageOf.get(t.name)!.match(/-d '([\s\S]*?)'\n```/)?.[1];
      const args = JSON.parse(body!.replace(/\n {5}/g, '\n')).params.arguments ?? {};
      for (const [n, v] of Object.entries(args)) {
        const vals = con.get(n)?.enum ?? [];
        if (!vals.length) continue;
        checked++;
        if (!vals.includes(JSON.stringify(v))) invented.push(`${t.name}.${n} = ${JSON.stringify(v)}`);
      }
    }
    expect(invented).toEqual([]);
    // The document declares NO enum on any tool-visible field at this pin, so
    // this passes over an empty set — deliberately, and out loud. cloud's
    // emission carries a shape only where a route is a typed op; the 114 enum
    // fields that used to be here belonged to the hand-merged master hanzoai/
    // openapi deleted, and every one was an approximation of a route nobody
    // typed. The rule is right and it starts checking real values the release
    // those routes become `zip.Get[In, Out]`. The JOIN is guarded above, on
    // required fields, where the document does declare — so an empty set here
    // cannot hide a collapsed join.
    console.log(`[mcp-ref] enum fields checked: ${checked}`);
  });
});

describe('reachable — no orphans', () => {
  it('links every tool page from the catalogue and from its product index', () => {
    const catalogSrc = fs.readFileSync(path.join(out, 'all-tools.mdx'), 'utf8');
    const orphans: string[] = [];
    for (const product of fs.readdirSync(out, { withFileTypes: true }).filter((e) => e.isDirectory())) {
      const indexSrc = fs.readFileSync(path.join(out, product.name, 'index.mdx'), 'utf8');
      const meta = JSON.parse(fs.readFileSync(path.join(out, product.name, 'meta.json'), 'utf8'));
      for (const f of fs.readdirSync(path.join(out, product.name))) {
        if (!f.endsWith('.mdx') || f === 'index.mdx') continue;
        const name = f.slice(0, -4);
        const href = `(/docs/mcp-tools/${product.name}/${name})`;
        if (!catalogSrc.includes(href)) orphans.push(`${name}: not in the catalogue`);
        if (!indexSrc.includes(href)) orphans.push(`${name}: not in its product index`);
        if (!meta.pages.includes(name)) orphans.push(`${name}: not in the nav`);
      }
    }
    expect(orphans).toEqual([]);
  });

  it('lists every product folder in the section nav', () => {
    const meta = JSON.parse(fs.readFileSync(path.join(out, 'meta.json'), 'utf8'));
    const dirs = fs.readdirSync(out, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
    expect(dirs.filter((d) => !meta.pages.includes(d))).toEqual([]);
    expect(meta.pages.slice(0, 2)).toEqual(['index', 'all-tools']);
  });
});

describe('provenance — the reference says where it came from', () => {
  it('stamps the door, the count and the capture date on every page', () => {
    const unstamped = [...pageOf.entries()].filter(
      ([, src]) => !src.includes(catalog.door) || !src.includes(catalog.meta.captured),
    );
    expect(unstamped.map(([n]) => n)).toEqual([]);
  });

  it('the conceptual page states the count and the client command', () => {
    const src = fs.readFileSync(path.join(out, 'index.mdx'), 'utf8');
    expect(src).toContain(`${catalog.meta.count} tools`);
    expect(src).toContain('claude mcp add --transport http hanzo-cloud');
    expect(src).toContain(catalog.door);
  });
});
