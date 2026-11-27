import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadCliTable } from './sync-cli-commands';

// THE FIRST CALL, held to what the platform serves.
//
// A page that names a model the catalogue does not list, or a flag the CLI does
// not take, fails on the reader's first paste — and a refusal on the first call
// reads like a bad key. These pages are checked against the snapshots the rest
// of the site is generated from: the CLI's own command table and the catalogue
// captured in pricing.json.

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel: string) => fs.readFileSync(path.join(APP, rel), 'utf8');

const PAGES = [
  'content/docs/quickstart.mdx',
  'content/docs/api-keys.mdx',
  'content/docs/index.mdx',
  'content/docs/concepts/agents.mdx',
  'content/docs/concepts/budgets.mdx',
];

const table = [...loadCliTable().values()];
const clients: { lang: string; methods: string[] }[] = JSON.parse(
  read('openapi-specs/sdk-clients.json'),
).clients;
const products = new Set(table.map((c) => c.product));
const served = new Set<string>(
  JSON.parse(read('openapi-specs/pricing.json')).hanzoModels.map((m: { name: string }) => m.name),
);

/**
 * Every fenced code block on the first-call pages, and every `<Example>` (the
 * home page's snippets). `shell` says whether a line of it is a command a reader
 * types.
 */
const code = PAGES.flatMap((page) => {
  const src = read(page);
  const blocks = [...src.matchAll(/```([a-z]*)[^\n]*\n([\s\S]*?)```/g)].map((m) => ({
    text: m[2],
    shell: ['bash', 'sh', 'shell', ''].includes(m[1]),
  }));
  const examples = [...src.matchAll(/<Example lang="([a-z]*)" code="([^"]*)"/g)].map((m) => ({
    text: m[2],
    shell: ['bash', 'sh', 'shell'].includes(m[1]),
  }));
  return [...blocks, ...examples].map((b) => ({ page, ...b }));
});

/** A shell line with its continuations joined, split into words, quotes kept whole. */
const words = (line: string) => [...line.matchAll(/'[^']*'|"[^"]*"|\S+/g)].map((m) => m[0]);

/** The CLI's own commands, which are not capabilities and are not in the table. */
const NATIVE = new Set([
  'auth',
  'version',
  'start',
  'stop',
  'restart',
  'up',
  'down',
  'ps',
  'status',
  'doctor',
  'reset',
  'run',
  'dev',
  'code',
  'host',
]);

const lines = code
  .filter((b) => b.shell)
  .flatMap(({ page, text }) =>
    text
      .replace(/\\\n\s*/g, ' ')
      .split('\n')
      // A trailing `# comment` is prose, not an argument.
      .map((line) => ({ page, line: line.replace(/\s+#.*$/, '').trim() })),
  );

/** The commands on a line: `hanzo auth login && hanzo account keys create` is two. */
const commands = (line: string) => line.split(/\s*&&\s*/).map(words);

/**
 * Where a first call is made: the quickstart, and the home page's line that mints
 * the key it uses.
 */
const firstCalls = lines.filter(
  ({ page, line }) =>
    page.endsWith('quickstart.mdx') || (page.endsWith('index.mdx') && /\bkeys\b/.test(line)),
);

describe('first-call pages', () => {
  it('run only CLI commands the CLI has, with the flags it takes', () => {
    const run = firstCalls.flatMap(({ page, line }) =>
      commands(line)
        // `hanzo --help` lists the capabilities; it names none.
        .filter((w) => w[0] === 'hanzo' && !NATIVE.has(w[1]) && !w[1]?.startsWith('--'))
        .map((w) => ({ page, line: w.join(' '), w })),
    );
    expect(run.length).toBeGreaterThan(0);
    for (const { page, line, w } of run) {
      expect(products.has(w[1]), `${page}: \`${line}\` names no capability`).toBe(true);
      const flagAt = w.findIndex((x) => x.startsWith('--'));
      const said = w.slice(1, flagAt < 0 ? undefined : flagAt);
      // `hanzo billing --help` lists a capability's commands; it runs none.
      if (said.length === 1 && w.includes('--help')) continue;
      const cmd = table.find(
        (c) =>
          [c.product, ...c.nodes, c.verb].join(' ') === said.slice(0, 2 + c.nodes.length).join(' '),
      );
      expect(cmd, `${page}: \`${line}\` is not a command`).toBeDefined();
      // The table records path parameters and REQUIRED flags; a body travels as
      // --data. Nothing else is a flag a first call needs.
      const flags = w.filter((x) => x.startsWith('--')).map((x) => x.slice(2));
      for (const f of flags) {
        expect(['data', 'json', ...cmd!.required], `${page}: \`${line}\` passes --${f}`).toContain(
          f,
        );
      }
    }
  });

  it('name only models the catalogue lists', () => {
    const named = code.flatMap(({ page, text }) =>
      [...text.matchAll(/"model"\s*:\s*"([^"]+)"|model:\s*'([^']+)'/g)].map((m) => ({
        page,
        model: m[1] ?? m[2],
      })),
    );
    expect(named.length).toBeGreaterThan(0);
    for (const { page, model } of named) {
      expect(served.has(model), `${page}: model "${model}" is not in the catalogue`).toBe(true);
    }
  });

  it('parse every JSON body they send', () => {
    for (const { page, line } of lines) {
      for (const m of line.matchAll(/(?:--data|-d)\s+'([^']*)'/g)) {
        expect(() => JSON.parse(m[1]), `${page}: body ${m[1]}`).not.toThrow();
      }
    }
  });

  it('link only to pages the site has', () => {
    // The pre-build generators write these sections; they are not on disk here.
    const generated = new Set(['openapi', 'cli', 'mcp-tools', 'pricing', 'guides', 'services']);
    const exists = (href: string) => {
      const slug = href.replace(/^\/docs\/?/, '').replace(/[#?].*$/, '').replace(/\/$/, '');
      if (slug === '' || generated.has(slug.split('/')[0])) return true;
      const base = path.join(APP, 'content/docs', slug);
      return ['.mdx', '/index.mdx', '/meta.json'].some((ext) => fs.existsSync(base + ext));
    };
    // Every link in the quickstart, and the home page's way into it.
    const links = PAGES.flatMap((page) =>
      read(page)
        .split('\n')
        .filter((line) => page.endsWith('quickstart.mdx') || /first call/i.test(line))
        .flatMap((line) => [...line.matchAll(/href[:=]\s*['"](\/docs[^'"]*)['"]|\]\((\/docs[^)\s]*)\)/g)])
        .map((m) => ({ page, href: m[1] ?? m[2] })),
    );
    expect(links.length).toBeGreaterThan(0);
    for (const { page, href } of links) {
      expect(exists(href), `${page}: ${href} is not a page`).toBe(true);
    }
  });

  it('import the generated clients', () => {
    // hanzo re-exports hanzoai; hanzoai.cloud is the Python one; Go's is /v8.
    const allowed: Record<string, RegExp> = {
      ts: /^(hanzo|hanzoai)$/,
      typescript: /^(hanzo|hanzoai)$/,
      python: /^hanzoai\.cloud(\.api)?$/,
      go: /^github\.com\/hanzoai\/go-sdk\/v8$/,
    };
    const imports = PAGES.flatMap((page) =>
      [...read(page).matchAll(/```(\w+)[^\n]*\n([\s\S]*?)```/g)]
        .filter((m) => allowed[m[1]])
        .flatMap((m) =>
          [
            ...m[2].matchAll(
              /\bfrom ['"]([^'"]+)['"]|^from (\S+) import|^import (?:\w+ )?"(github\.com\/hanzoai\/[^"]+)"/gm,
            ),
          ].map((i) => ({ page, lang: m[1], from: i[1] ?? i[2] ?? i[3] })),
        ),
    );
    expect(imports.length).toBeGreaterThan(0);
    for (const { page, lang, from } of imports) {
      expect(from, `${page}: ${lang} imports ${from}`).toMatch(allowed[lang]);
    }
  });

  it('call only operations the published clients have', () => {
    const langs: Record<string, string> = { ts: 'typescript', typescript: 'typescript', python: 'python' };
    const calls = PAGES.flatMap((page) =>
      [...read(page).matchAll(/```(\w+)[^\n]*\n([\s\S]*?)```/g)]
        .filter((m) => langs[m[1]])
        .flatMap((m) =>
          [...m[2].matchAll(/\.((?:get|post|put|patch|delete)[A-Z_]\w*)\(/g)].map((c) => ({
            page,
            lang: langs[m[1]],
            method: c[1],
          })),
        ),
    );
    expect(calls.length).toBeGreaterThan(0);
    for (const { page, lang, method } of calls) {
      const client = clients.find((c) => c.lang === lang);
      expect(client?.methods, `${page}: the ${lang} client has no ${method}`).toContain(method);
    }
  });

  it('address the API under /v1', () => {
    for (const { page, text } of code) {
      for (const m of text.matchAll(/https:\/\/api\.hanzo\.ai(\/[^\s"'\\]*)/g)) {
        expect(m[1], `${page}: ${m[0]}`).toMatch(/^\/v1\//);
      }
    }
  });
});
