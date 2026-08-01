import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDocument, type Document, type Operation, type Product } from './openapi-doc';
import { code, firstSentence, prose, text, yamlString } from './mdx';

// The API reference, generated from THE document.
//
// hanzoai/openapi `hanzo.yaml` describes every Hanzo endpoint once. This script
// renders one page per product tag: the tag's description — the owning package's
// doc synopsis — is the product's intro, and each operation's entry is its own
// prose and schema out of the document. Nothing here is authored; if a sentence
// about an endpoint appears on docs.hanzo.ai, it was written next to the code
// and travelled here through hanzo.yaml.
//
// Static MDX, not the runtime <APIPage>: the site ships as a static export
// (NEXT_EXPORT=1), which disables the interactive loader (lib/openapi/index.ts).
// MDX exports cleanly and can never 530.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCUMENT = path.join(APP_ROOT, 'openapi-specs/hanzo.yaml');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/openapi');
const SERVICES_DIR = path.join(APP_ROOT, 'content/docs/services');
const PUBLIC_COPY = path.join(APP_ROOT, 'public/openapi/hanzo.yaml');

// A few products document their concepts under a slug that differs from the
// product name. Everything else resolves by looking for a guide on disk.
const GUIDE_OVERRIDES: Record<string, string> = {
  ai: '/docs/llm',
  app: '/docs/services/paas',
  evals: '/docs/experiments',
};

function guideHref(svc: string): string | null {
  if (GUIDE_OVERRIDES[svc]) return GUIDE_OVERRIDES[svc];
  // `services/index.mdx` is the SECTION LANDING, not a guide for a product
  // called "index". The document does serve a product named index (full-text
  // search), and matching it here pointed the Index reference at the whole
  // services catalogue — via /docs/services/index, which is not even a route:
  // the file renders at /docs/services.
  if (svc === 'index') return null;
  if (
    fs.existsSync(path.join(SERVICES_DIR, `${svc}.mdx`)) ||
    fs.existsSync(path.join(SERVICES_DIR, svc, 'index.mdx'))
  ) {
    return `/docs/services/${svc}`;
  }
  return null;
}

// ------------------------------------------------------------------ schema

const typeOf = (schema: any): string => {
  if (!schema || typeof schema !== 'object') return '';
  if (schema.$ref) return String(schema.$ref).split('/').pop() ?? '';
  const t = Array.isArray(schema.type) ? schema.type.join(' | ') : schema.type;
  if (t === 'array') return `${typeOf(schema.items) || 'any'}[]`;
  if (schema.enum?.length) return schema.enum.slice(0, 4).map((e: any) => `\`${e}\``).join(' \\| ');
  if (schema.oneOf || schema.anyOf) return 'object';
  return t || (schema.properties ? 'object' : '');
};

function bodyTable(op: Operation): string[] {
  const s = op.body?.schema;
  const props = s?.properties;
  if (!props || !Object.keys(props).length) return [];
  const required = new Set<string>(Array.isArray(s.required) ? s.required : []);
  const names = Object.keys(props);
  const rows = names
    .slice(0, 40)
    .map(
      (name) =>
        `| \`${code(name)}\` | ${text(typeOf(props[name]))} | ${
          required.has(name) ? 'yes' : '—'
        } | ${text(firstSentence(props[name]?.description ?? '', 120))} |`,
    );
  return [
    '',
    `**Request body** — \`${op.body!.contentType}\`${op.body!.required ? ' (required)' : ''}`,
    '',
    '| Field | Type | Required | Description |',
    '|---|---|---|---|',
    ...rows,
    ...(names.length > 40 ? [`| … | | | ${names.length - 40} more fields in the schema |`] : []),
  ];
}

function paramTable(op: Operation): string[] {
  if (!op.parameters.length) return [];
  const rows = op.parameters
    .slice(0, 30)
    .map(
      (p) =>
        `| \`${code(p.name)}\` | ${p.in} | ${text(typeOf(p.schema))} | ${
          p.required ? 'yes' : '—'
        } | ${text(firstSentence(p.description, 120))} |`,
    );
  return ['', '| Parameter | In | Type | Required | Description |', '|---|---|---|---|---|', ...rows];
}

// ------------------------------------------------------------------- pages

function renderProduct(p: Product, doc: Document): string {
  const guide = guideHref(p.name);
  const L: string[] = [];

  // The product's intro IS the tag description — the owning package's synopsis.
  // Where the document carries only a title-length tag, there is no synopsis to
  // print yet: say what the reference covers rather than echoing the heading.
  const synopsis = p.description.trim() === p.title.trim() ? '' : p.description;

  L.push('---');
  L.push(`title: ${yamlString(p.title)}`);
  L.push(
    `description: ${yamlString(
      firstSentence(synopsis) || `${p.title} — ${p.operations.length} operations on ${doc.server}.`,
    )}`,
  );
  L.push('---');
  L.push('');
  L.push(
    synopsis
      ? prose(synopsis)
      : `The REST reference for **${text(p.title)}** — ${p.operations.length} operations, generated from the OpenAPI document.`,
  );
  L.push('');

  const nav = [
    ...(guide ? [`[Guide & examples →](${guide})`] : []),
    '[All API references →](/docs/openapi)',
    '[Six flows, four surfaces →](/docs/start)',
  ];
  L.push(`> ${nav.join(' · ')}`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Base URL** | \`${doc.server}\` |`);
  L.push(`| **Operations** | ${p.operations.length} |`);
  L.push(`| **Auth** | \`Authorization: Bearer $HANZO_API_KEY\` |`);
  L.push('');

  const sections = new Map<string, Operation[]>();
  for (const op of p.operations) {
    if (!sections.has(op.tag)) sections.set(op.tag, []);
    sections.get(op.tag)!.push(op);
  }

  for (const [tag, ops] of [...sections.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    L.push(`## ${text(tag)}`);
    L.push('');
    for (const op of ops) {
      L.push(`### ${text(op.summary || op.name)}`);
      L.push('');
      L.push(
        `\`${op.method.toUpperCase()} ${code(op.path)}\`${op.deprecated ? ' · **deprecated**' : ''}`,
      );
      L.push('');
      if (op.description) {
        L.push(prose(op.description));
        L.push('');
      }
      L.push(...paramTable(op));
      L.push(...bodyTable(op));
      L.push('');
    }
  }

  L.push('---');
  L.push('');
  L.push(
    [
      ...(guide ? [`[${text(p.title)} guide](${guide})`] : []),
      '[All Hanzo APIs](/docs/openapi)',
      '[Interactive reference](/reference)',
    ].join(' · '),
  );
  L.push('');
  return L.join('\n');
}

function renderIndex(doc: Document): string {
  const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
  const L: string[] = [];
  L.push('---');
  L.push('title: API Reference');
  L.push(
    `description: ${yamlString(
      `The unified REST API reference for every Hanzo product — ${doc.products.length} products, ${ops} operations, generated from the OpenAPI document.`,
    )}`,
  );
  L.push('icon: BookOpen');
  L.push('---');
  L.push('');
  L.push("import { Cards, Card } from '@hanzo/docs-base-ui/components/card'");
  L.push('');
  L.push('# Hanzo API Reference');
  L.push('');
  L.push(
    `One cloud, one credential. Every Hanzo product speaks REST over HTTPS, shares a single API key, and is documented here straight from the OpenAPI document that also generates the SDKs, the CLI and the MCP tools — **${doc.products.length} products, ${ops} operations**.`,
  );
  L.push('');
  L.push('## Authentication');
  L.push('');
  L.push('Every product accepts the same bearer credential — a Hanzo IAM JWT or an `hk-` API key.');
  L.push('');
  L.push('```bash');
  L.push(`curl -H "Authorization: Bearer $HANZO_API_KEY" ${doc.server}/v1/models`);
  L.push('```');
  L.push('');
  L.push(
    'Get a key at [console.hanzo.ai](https://console.hanzo.ai). New here? [Six flows, four surfaces](/docs/start) walks the same journeys as CLI, SDK, HTTP and MCP.',
  );
  L.push('');
  L.push('## Products');
  L.push('');
  L.push('<Cards>');
  for (const p of doc.products) {
    L.push(`  <Card title=${JSON.stringify(p.title)} href="/docs/openapi/${p.name}">`);
    L.push(`    ${text(firstSentence(p.description, 130))} · ${p.operations.length} operations`);
    L.push('  </Card>');
  }
  L.push('</Cards>');
  L.push('');
  L.push('---');
  L.push('');
  L.push('Prefer to click? The [interactive reference](/reference) renders the same document.');
  L.push('');
  return L.join('\n');
}

// -------------------------------------------------------------------- main

function syncDocument(): void {
  try {
    execFileSync('bash', [path.join(SCRIPT_DIR, 'sync-openapi.sh')], { stdio: 'inherit' });
  } catch (e) {
    console.warn('[openapi] sync failed; building from the committed snapshot', e);
  }
}

export async function genOpenapiPages(): Promise<void> {
  syncDocument();
  if (!fs.existsSync(DOCUMENT)) {
    throw new Error(
      `[openapi] ${DOCUMENT} is missing — the API reference cannot be generated without the document`,
    );
  }

  const doc = loadDocument(DOCUMENT);
  if (!doc.products.length) throw new Error('[openapi] the document resolved to zero products');
  if (doc.unresolved.length) {
    console.warn(
      `[openapi] ${doc.unresolved.length} operations name no product and are omitted:`,
      doc.unresolved.slice(0, 5).map((o) => `${o.method.toUpperCase()} ${o.path}`),
    );
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // `index.mdx` is this folder's own page, at /docs/openapi. A product slugged
  // `index` (Hanzo Index — full-text search) wants /docs/openapi/index, which is
  // a different URL but the same filename, and writing it flat silently
  // destroyed one or the other. A folder index resolves it: `index/index.mdx`
  // serves /docs/openapi/index and leaves /docs/openapi alone.
  const pageFile = (slug: string) =>
    slug === 'index' ? path.join(OUT_DIR, slug, 'index.mdx') : path.join(OUT_DIR, `${slug}.mdx`);

  for (const p of doc.products) {
    const f = pageFile(p.name);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, renderProduct(p, doc));
  }
  fs.writeFileSync(path.join(OUT_DIR, 'index.mdx'), renderIndex(doc));

  // Every product got its own page, or the build is lying about its coverage.
  const written = new Set(doc.products.map((p) => pageFile(p.name)));
  if (written.size !== doc.products.length) {
    throw new Error(
      `[openapi] ${doc.products.length} products collapsed onto ${written.size} files — two slugs share a path`,
    );
  }
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'API Reference',
        description:
          'REST API reference for every Hanzo product, generated from the OpenAPI document.',
        pages: ['index', ...doc.products.map((p) => p.name)],
      },
      null,
      2,
    ) + '\n',
  );

  // The interactive reference at /reference reads the same document. Copy it at
  // build time rather than checking in a second one — one document, one copy.
  fs.mkdirSync(path.dirname(PUBLIC_COPY), { recursive: true });
  fs.copyFileSync(DOCUMENT, PUBLIC_COPY);

  const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
  const withSynopsis = doc.products.filter((p) => p.description).length;
  console.log(
    `[openapi] ${doc.products.length} product pages, ${ops} operations, ` +
      `${doc.operations.filter((o) => o.description).length} carrying prose`,
  );
  console.log(
    `[openapi] ${withSynopsis} products carry the owning package's synopsis; ` +
      `${doc.undeclared.size} are served but declare no tag ` +
      `(${doc.products.filter((p) => doc.undeclared.has(p.name)).reduce((n, p) => n + p.operations.length, 0)} operations) ` +
      `— those want a tag in hanzoai/openapi`,
  );
}

if (import.meta.main) {
  genOpenapiPages().catch((e) => {
    console.error('[openapi] failed', e);
    process.exit(1);
  });
}
