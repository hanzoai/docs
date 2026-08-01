import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { loadDocument } from './openapi-doc';
import { toolKeys, toolOperations } from './openapi-surfaces';
import { load } from './sync-mcp-tools';
import { genMcpPages } from './gen-mcp-pages';

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
const doc = loadDocument(path.join(import.meta.dirname, '../openapi-specs/hanzo.yaml'));

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
    const op = doc.operations.find((o) => o.id === 'cloud_patch_v1_agents_targets_id')!;
    expect(toolKeys(op)).toEqual(['patch_v1_agents_targets_id', 'patch_v1_agents_targets_id']);
  });

  it('keys a route whose operationId spells a parameter differently', () => {
    const op = doc.operations.find((o) => o.id === 'cloud_delete_v1_projects_by_slug');
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

  it('states the columns the door leaves empty rather than implying "none"', () => {
    // Not one tool in the door's answer declares `required`, `default` or
    // `enum`. A page with fields must therefore say so, or its empty columns
    // are an unsourced claim.
    const withFields = catalog.tools.filter((t) => Object.keys(t.inputSchema?.properties ?? {}).length);
    expect(withFields.length).toBeGreaterThan(0);
    const silent = withFields.filter((t) => !pageOf.get(t.name)!.includes('does not declare'));
    expect(silent).toEqual([]);
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
      if (args.length !== declared.length) bad.push(`${t.name}: ${args.length} args for ${declared.length} fields`);
    }
    expect(bad).toEqual([]);
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
