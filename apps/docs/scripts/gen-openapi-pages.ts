import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stringify as stringifyYaml } from 'yaml';
import {
  DOCUMENT,
  loadDocument,
  opHref,
  opSlug,
  publicDocument,
  secretKey,
  type Document,
  type Operation,
  type Product,
} from './openapi-doc';
import { fields, type Field } from './openapi-schema';
import { door, firstCall, runnable, surfaces, type Door } from './openapi-surfaces';
import { load as loadDoor } from './sync-mcp-tools';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { code, firstSentence, prose, text, yamlString } from './mdx';

// The API reference, generated from THE document.
//
// hanzoai/cloud's `openapi.yaml` describes every Hanzo endpoint once, and it is
// the same document the SDKs, the CLI and the MCP tools are projections of. This
// script renders one page per product tag: the tag's description — the owning
// package's doc synopsis — is the product's intro, and each operation's entry is
// its own prose and schema out of the document. Nothing here is authored; if a
// sentence about an endpoint appears on docs.hanzo.ai, it was written next to
// the code and travelled here unaltered.
//
// Every count on every page is the document's own — `p.operations.length`, never
// a literal — so a number here cannot disagree with the API. What it CAN
// disagree with is the release, and that is what `openapi-specs/.spec-lock`
// pins.
//
// Static MDX, not the runtime <APIPage>: the site ships as a static export
// (NEXT_EXPORT=1), which disables the interactive loader (lib/openapi/index.ts).
// MDX exports cleanly and can never 530.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/openapi');
const SERVICES_DIR = path.join(APP_ROOT, 'content/docs/services');
// Served at /openapi/<name>, under the name the lock gives the document, so the
// bytes a reader downloads and the bytes the pages were built from are one file
// with one name.
const PUBLIC_COPY = path.join(APP_ROOT, 'public/openapi', path.basename(DOCUMENT));

// Where the operator surface is rendered, and why it is not a repo.
//
// z asked for these 84 paths to live in hanzo-inc/docs at docs.admin.hanzo.ai.
// That repo does not exist — hanzo-inc has 373 of them and none is `docs`
// (`docs-template` and `hips-docs` do exist, so this is an absence, not a
// permissions answer) — and inventing one is not this build's call to make.
//
// It cannot go anywhere under `content/`, because everything there is routed
// and hanzo-docs/docs is a PUBLIC repository: committing the pages here would
// move the leak rather than close it. So the pages are BUILT and gitignored —
// real output a private site can be pointed at the day it has a home, and
// nothing the public build reads or ships in the meantime.
const INTERNAL_DIR = path.join(APP_ROOT, 'internal/openapi');

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

/**
 * WHAT A CALLER SENDS, in one table.
 *
 * A path parameter, a query parameter, a header and a body field are the same
 * thing to a reader — a value they must supply — differing only in where it
 * rides on the wire, which is one column. Two tables asked the reader to hold
 * that split in their head and to check both before concluding a field does not
 * exist; one table, sorted by where it rides, answers in one look.
 *
 * Body fields are enumerated at every depth by openapi-schema, so a nested one
 * is a row named `messages[].role` rather than a row named `messages` that
 * hides four more. Nothing is capped: a reference that stops at forty fields
 * sends the reader to the raw document, which is the page's whole reason to
 * exist. The count is printed above the table, so the size is known before the
 * scroll.
 */
function requestRows(op: Operation, raw: any): string[] {
  const order: Record<string, number> = { path: 0, query: 1, header: 2, cookie: 3 };
  const rows = [...op.parameters]
    .sort((a, b) => (order[a.in] ?? 9) - (order[b.in] ?? 9))
    .map(
      (p) =>
        `| \`${code(p.name)}\` | ${p.in} | ${text(typeOf(p.schema))} | ${
          p.required ? 'yes' : '—'
        } | ${text(firstSentence(p.description, 160))} |`,
    );

  if (op.body?.schema) {
    for (const f of fields(raw, op.body.schema)) rows.push(fieldRow(f, 'body'));
  }
  return rows;
}

/** One field of an enumerated schema as a table row. */
function fieldRow(f: Field, where: string): string {
  const notes = [
    f.default ? `Default \`${code(f.default)}\`.` : '',
    f.enum.length ? `One of ${f.enum.map((e) => `\`${code(e)}\``).join(', ')}.` : '',
    text(firstSentence(f.description, 160)),
  ]
    .filter(Boolean)
    .join(' ');
  return `| \`${code(f.name)}\` | ${where} | ${text(f.type)} | ${f.required ? 'yes' : '—'} | ${notes} |`;
}

function request(op: Operation, raw: any): string[] {
  const rows = requestRows(op, raw);
  if (!rows.length) {
    // A GET with nothing declared genuinely takes nothing. A POST with nothing
    // declared is a hole in the DOCUMENT — the handler reads a body the
    // emission does not describe — and saying "the credential is the whole
    // request" there would teach a call that fails. State which of the two it
    // is; the reader can then reach for `describe` instead of guessing.
    const reads = op.method === 'get' || op.method === 'head' || op.method === 'delete';
    return [
      '## Request',
      '',
      reads
        ? `\`${op.method.toUpperCase()} ${code(op.path)}\` takes no parameters and no body — the credential is the whole request.`
        : `The document declares no body for \`${op.method.toUpperCase()} ${code(op.path)}\`. The handler is typed in cloud but its shape is not yet emitted, so the fields are not listed here — ask the MCP door's \`describe\` for \`${code(op.id)}\`, which answers from the running route.`,
      '',
    ];
  }
  return [
    '## Request',
    '',
    `${rows.length} field${rows.length === 1 ? '' : 's'}${
      op.body ? `, body \`${op.body.contentType}\`${op.body.required ? ' (required)' : ''}` : ''
    }.`,
    '',
    '| Field | In | Type | Required | Description |',
    '|---|---|---|---|---|',
    ...rows,
    '',
  ];
}

/**
 * EVERY DECLARED RESPONSE, success and failure in one list.
 *
 * A status code says which kind a response is; splitting them into a "response"
 * section and an "errors" section states that twice and leaves the errors
 * section empty on the 1,539 of 1,562 operations that declare no failure body.
 * A section that is almost always a referral to another page is not a section.
 */
function response(op: Operation, raw: any, doc: Document): string[] {
  const declared: Array<[string, any]> = Object.entries(
    (doc.raw.paths?.[op.path]?.[op.method]?.responses ?? {}) as Record<string, any>,
  ).sort(([a], [b]) => a.localeCompare(b));

  const L: string[] = ['## Response', ''];
  if (!declared.length) {
    L.push(
      'The document declares no response body for this operation. It answers `200` on success and the platform error shape on failure — see [Errors](/docs/errors).',
    );
    L.push('');
    return L;
  }

  L.push('| Status | Body | Meaning |');
  L.push('|---|---|---|');
  for (const [status, r] of declared) {
    const schema = Object.values((r?.content ?? {}) as Record<string, any>)[0]?.schema;
    L.push(
      `| \`${code(status)}\` | ${schema ? text(typeOf(schema)) : '—'} | ${text(
        firstSentence(r?.description ?? '', 160),
      )} |`,
    );
  }
  L.push('');

  const ok = op.success?.schema ? fields(raw, op.success.schema) : [];
  if (ok.length) {
    L.push(`\`${code(op.success!.status)}\` body — ${ok.length} field${ok.length === 1 ? '' : 's'}.`);
    L.push('');
    L.push('| Field | In | Type | Always | Description |');
    L.push('|---|---|---|---|---|');
    for (const f of ok) L.push(fieldRow(f, 'body'));
    L.push('');
  }

  L.push('Failure carries the platform error shape — see [Errors](/docs/errors).');
  L.push('');
  return L;
}

// ------------------------------------------------------------------- pages

/**
 * An operation's prose, with the sentence the heading carries printed once.
 *
 * `summary` is the first sentence of the owning Go doc comment and `description`
 * is the whole comment, so 1543 of the 2254 operations carrying both have a
 * description that opens with the summary VERBATIM — printing the summary as a
 * heading and the description under it published that sentence twice. Where the
 * description does not open with it the summary is a genuinely separate label
 * and leads; where there is no description at all (51 operations) the summary is
 * the only prose there is. Nothing the document wrote is dropped.
 */
function leadProse(op: Operation): string {
  const flat = (s: string) => s.replace(/\s+/g, ' ').trim();
  const summary = flat(op.summary);
  const description = op.description.trim();
  if (!summary) return description;
  if (!description) return summary;
  return flat(description).startsWith(summary) ? description : `${summary}\n\n${description}`;
}

/**
 * WHERE A PRODUCT TEACHES ITS FIRST CALL.
 *
 * A product page opened with a synopsis and 2,300 words of reference, and no
 * reader could find the one line that starts them. So each page now opens with
 * the same four things, in the same order, for all 188 of them: what it is, the
 * credential, the first call on four surfaces, and what comes back.
 *
 * Nothing here is authored. The sentence is the owning package's synopsis, the
 * call is `firstCall()`'s choice out of the document, and the four surfaces are
 * the same renderer the flow pages use. 184 hand-written quickstarts would be
 * 184 pages to re-check every time a route moves; this one cannot fall behind
 * the document because it IS the document.
 */
function quickstart(p: Product, doc: Document, table: Map<string, CliCommand>, d: Door): string[] {
  const op = firstCall(p);
  const L: string[] = [];

  L.push('## Quickstart');
  L.push('');
  L.push('```bash');
  L.push(`export HANZO_API_KEY=${secretKey(doc).prefix}...   # console.hanzo.ai → API keys`);
  L.push('```');
  L.push('');
  L.push(
    runnable(op)
      ? `Then the first call — a read that needs nothing but the key. \`${op.method.toUpperCase()} ${code(op.path)}\`, operation \`${op.id}\`:`
      : // Said plainly rather than papered over: this product's front door takes
        // arguments, and a sample that pretended otherwise would fail on the
        // reader's first attempt instead of on ours.
        `Then the first call. This one takes arguments — the placeholders are yours to fill. \`${op.method.toUpperCase()} ${code(op.path)}\`, operation \`${op.id}\`:`,
  );
  L.push('');
  L.push(...surfaces(op, doc, table, d));
  L.push('');

  const shape = returns(op);
  if (shape) {
    L.push(shape);
    L.push('');
  }
  return L;
}

/** What comes back, named from the document's own success response. */
function returns(op: Operation): string {
  const s = op.success;
  if (!s) return '';
  const named = typeOf(s.schema);
  const said = firstSentence(s.description, 140);
  if (!named && !said) return '';
  return `Answers \`${s.status}\`${named ? ` with \`${text(named)}\`` : ''}${said ? ` — ${text(said)}` : ''}.`;
}

/**
 * THE PAGE TITLE A READER SEARCHES FOR.
 *
 * `METHOD /path` is what a reader arrives holding and is unique on every page,
 * so it is the heading and the table-of-contents entry. It is a poor <title>:
 * nobody searches for a slash. The summary — the first sentence of the owning
 * Go doc comment — carries the words they actually type, so that is the title,
 * with the address underneath in the one place it belongs. Where two operations
 * in a product open with the same sentence, the address disambiguates, because
 * two pages with one title is a page a search engine picks between at random.
 */
function opTitle(op: Operation, taken: Set<string>): string {
  const address = `${op.method.toUpperCase()} ${op.path}`;
  const summary = firstSentence(op.summary.replace(/\s+/g, ' ').trim(), 80);
  if (!summary) return address;
  const key = summary.toLowerCase();
  return taken.has(key) ? `${summary} — ${address}` : summary;
}

/**
 * ONE OPERATION, ITS OWN PAGE.
 *
 * The product page carried every operation, so `ai` ran to 2,030 lines and the
 * one route a reader came for was somewhere inside it — unlinkable, and
 * competing with 207 siblings for the same URL. A page per operation gives each
 * one an address to send someone, a title to find it by, and room to state the
 * whole request and the whole response rather than the first forty fields.
 *
 * Four parts, in the order a caller needs them: what it is and what it costs to
 * call, what it does, what you send, what comes back, and then the same call on
 * all four surfaces. Nothing here is authored — every sentence is the document's.
 */
function renderOperation(
  op: Operation,
  p: Product,
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
  taken: Set<string>,
): string {
  const L: string[] = [];
  const address = `${op.method.toUpperCase()} ${op.path}`;

  L.push('---');
  L.push(`title: ${yamlString(opTitle(op, taken))}`);
  L.push(
    `description: ${yamlString(
      firstSentence(op.description || op.summary, 155) || `${address} on ${doc.server}.`,
    )}`,
  );
  L.push('---');
  L.push('');
  L.push("import { Tab, Tabs } from '@hanzo/docs-base-ui/components/tabs'");
  L.push('');
  L.push(`\`${code(address)}\``);
  L.push('');
  if (op.deprecated) {
    L.push('**Deprecated.** It still answers; a caller writing new code should not reach for it.');
    L.push('');
  }
  L.push(`> [${text(p.title)} →](/docs/openapi/${p.name}) · [All API references →](/docs/openapi) · [Six flows, four surfaces →](/docs/start)`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Address** | \`${code(doc.server + op.path)}\` |`);
  L.push(`| **Method** | \`${op.method.toUpperCase()}\` |`);
  L.push(`| **Operation** | \`${code(op.id)}\` |`);
  L.push(`| **Auth** | \`Authorization: Bearer $HANZO_API_KEY\` |`);
  L.push('');

  // The title IS the summary, so the body starts at the description. Printing
  // the summary again under a heading that already says it is the same sentence
  // twice — which is what `leadProse` exists to avoid on the product page,
  // where the heading is the address instead.
  const lead = op.description.trim() || op.summary.trim();
  if (lead) {
    L.push(prose(lead));
    L.push('');
  }

  L.push(...request(op, doc.raw));
  L.push(...response(op, doc.raw, doc));

  L.push('## Examples');
  L.push('');
  L.push(...surfaces(op, doc, table, d));
  L.push('');
  L.push('---');
  L.push('');
  L.push(`[${text(p.title)} API](/docs/openapi/${p.name}) · [All Hanzo APIs](/docs/openapi) · [Interactive reference](/reference)`);
  L.push('');
  return L.join('\n');
}

function renderProduct(
  p: Product,
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
): string {
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
  L.push("import { Tab, Tabs } from '@hanzo/docs-base-ui/components/tabs'");
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

  L.push(...quickstart(p, doc, table, d));

  // THE CAPABILITY PAGE IS AN INDEX, NOT A COPY.
  //
  // It used to carry every operation's prose and tables, which made `ai` 2,030
  // lines and gave 208 routes one shared URL. Each operation now has its own
  // page, so printing the prose again here would publish the same sentences at
  // two addresses — the reader picks the wrong one and a search engine picks
  // for them. What belongs here is the part a page of its own cannot give: the
  // whole capability at a glance, in the order the document declares it.
  //
  // One table, never sub-sections. A capability's operations all carry one tag
  // — its own name, which is what selected them — so a heading above the table
  // could only repeat the page title.
  L.push('## Endpoints');
  L.push('');
  L.push('| Endpoint | What it does |');
  L.push('|---|---|');
  for (const op of p.operations) {
    const said = firstSentence(op.summary || op.description, 150);
    L.push(
      `| [\`${op.method.toUpperCase()} ${code(op.path)}\`](${opHref(op)}) | ${
        op.deprecated ? '**Deprecated.** ' : ''
      }${text(said)} |`,
    );
  }
  L.push('');

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

function renderIndex(products: Product[], doc: Document): string {
  const ops = products.reduce((n, p) => n + p.operations.length, 0);
  const L: string[] = [];
  L.push('---');
  L.push('title: API Reference');
  L.push(
    `description: ${yamlString(
      `The unified REST API reference for every Hanzo product — ${products.length} products, ${ops} operations, generated from the OpenAPI document.`,
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
    `One cloud, one credential. Every Hanzo product speaks REST over HTTPS, shares a single API key, and is documented here straight from the OpenAPI document that also generates the SDKs, the CLI and the MCP tools — **${products.length} products, ${ops} operations**.`,
  );
  L.push('');
  L.push('## Authentication');
  L.push('');
  L.push(
    `Every product accepts the same bearer credential — a Hanzo IAM JWT or a \`${secretKey(doc).prefix}\` secret key.`,
  );
  L.push('');
  L.push('```bash');
  L.push(`curl -H "Authorization: Bearer $HANZO_API_KEY" ${doc.server}/v1/models`);
  L.push('```');
  L.push('');
  L.push(
    'Get a key at [console.hanzo.ai](https://console.hanzo.ai). New here? [Six flows, four surfaces](/docs/start) walks the same journeys as CLI, SDK, HTTP and MCP.',
  );
  L.push('');
  L.push('## Start anywhere');
  L.push('');
  // The claim is counted, not asserted: `runnable` is the same predicate the
  // pages are generated through, so this number cannot disagree with them.
  const ready = products.filter((p) => runnable(firstCall(p))).length;
  L.push(
    `Every product page opens with a **Quickstart**: what the product is, in its own words, and its first call ` +
      `shown as the CLI, an SDK, raw HTTP and an MCP tool. For ${ready} of the ${products.length} that first call is a read ` +
      `that needs nothing but the key — paste it and it answers. The other ${products.length - ready} take an argument, ` +
      'and say so rather than printing a sample that cannot run.',
  );
  L.push('');
  L.push('## Products');
  L.push('');
  L.push('<Cards>');
  for (const p of products) {
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

/** One reference: a page per product, an index, and the section's nav. */
function writePages(
  dir: string,
  products: Product[],
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
): void {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  // `index.mdx` is this folder's own page, at /docs/openapi. A product slugged
  // `index` (Hanzo Index — full-text search) wants /docs/openapi/index, which is
  // a different URL but the same filename, and writing it flat silently
  // destroyed one or the other. A folder index resolves it: `index/index.mdx`
  // serves /docs/openapi/index and leaves /docs/openapi alone.
  // Every product is a FOLDER — `<product>/index.mdx` beside one page per
  // operation. It used to be a flat `<product>.mdx`, with `index` special-cased
  // because Hanzo Index wants /docs/openapi/index and that is the same filename
  // as this folder's own page. One shape for all of them retires the special
  // case: the folder index serves the product, and no product can collide with
  // the section.
  let ops = 0;
  for (const p of products) {
    const folder = path.join(dir, p.name);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.mdx'), renderProduct(p, doc, table, d));

    // Summaries that repeat inside one product get the address appended, so no
    // two pages here carry the same title.
    const seen = new Set<string>();
    const dup = new Set<string>();
    for (const op of p.operations) {
      const k = firstSentence(op.summary.replace(/\s+/g, ' ').trim(), 80).toLowerCase();
      if (k && seen.has(k)) dup.add(k);
      if (k) seen.add(k);
    }

    const slugs = new Set<string>();
    for (const op of p.operations) {
      const slug = opSlug(op);
      if (slugs.has(slug)) {
        throw new Error(
          `[openapi] ${p.name}: "${op.id}" and an earlier operation both address "${slug}" — the slug rule in openapi-doc.ts must separate them`,
        );
      }
      slugs.add(slug);
      fs.writeFileSync(
        path.join(folder, `${slug}.mdx`),
        renderOperation(op, p, doc, table, d, dup),
      );
      ops++;
    }

    // The operations are routed but NOT in the sidebar: 2,344 leaves under 179
    // products is a tree nobody navigates. The product page's endpoint table is
    // their index, and it is the better one — it states what each call does.
    fs.writeFileSync(
      path.join(folder, 'meta.json'),
      JSON.stringify({ title: p.title, description: firstSentence(p.description, 160), pages: ['index'] }, null, 2) +
        '\n',
    );
  }
  fs.writeFileSync(path.join(dir, 'index.mdx'), renderIndex(products, doc));

  fs.writeFileSync(
    path.join(dir, 'meta.json'),
    JSON.stringify(
      {
        title: 'API Reference',
        description:
          'REST API reference for every Hanzo product, generated from the OpenAPI document.',
        pages: ['index', ...products.map((p) => p.name)],
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`[openapi] ${products.length} products, ${ops} operation pages -> ${path.relative(APP_ROOT, dir)}`);
}

// -------------------------------------------------------------------- main

function syncDocument(): void {
  try {
    execFileSync('bash', [path.join(SCRIPT_DIR, 'sync-openapi.sh')], { stdio: 'inherit' });
  } catch (e) {
    console.warn('[openapi] sync failed; building from the committed snapshot', e);
  }
}

export async function genOpenapiPages(
  out: string = OUT_DIR,
  internalOut: string = INTERNAL_DIR,
): Promise<void> {
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

  // The quickstart's CLI and MCP columns are the CLI's own table and the door's
  // own answer, read here once and handed down — the same two artefacts the flow
  // pages read, through the same two functions.
  const table = loadCliTable();
  const d = door(loadDoor().tools);

  writePages(out, doc.products, doc, table, d);

  // The operator surface is rendered too, just not here. 86 endpoints our own
  // people run on are worth a page each; what they are not worth is being on
  // docs.hanzo.ai. See INTERNAL_DIR for where they go and why it is not a repo.
  if (doc.internal.length) writePages(internalOut, doc.internal, doc, table, d);

  // The interactive reference at /reference reads the same document, so the
  // document it reads is the published one. Copying the source whole — which is
  // what this did — left every hidden operation one URL away at
  // docs.hanzo.ai/openapi/hanzo.yaml: the pages filtered and the surface still
  // public. Only the real build publishes it; rendering into a scratch
  // directory is a test reading the generator's output, not a site served.
  if (out === OUT_DIR) {
    fs.mkdirSync(path.dirname(PUBLIC_COPY), { recursive: true });
    fs.writeFileSync(PUBLIC_COPY, stringifyYaml(publicDocument(doc)));
  }

  const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
  const withSynopsis = doc.products.filter((p) => p.description).length;
  console.log(
    `[openapi] ${doc.products.length} product pages, ${ops} operations, ` +
      `${doc.operations.filter((o) => o.description).length} carrying prose`,
  );
  if (doc.internal.length) {
    const held = doc.internal.reduce((n, p) => n + p.operations.length, 0);
    console.log(
      `[openapi] ${held} operations are the operator surface and are NOT published: ` +
        `written to ${path.relative(APP_ROOT, internalOut)} (gitignored) and removed from ` +
        `${path.relative(APP_ROOT, PUBLIC_COPY)}. They still want a private home — see INTERNAL_DIR.`,
    );
  }
  console.log(
    `[openapi] ${withSynopsis} products carry the owning package's synopsis; ` +
      `${doc.undeclared.size} are served but declare no tag ` +
      `(${doc.products.filter((p) => doc.undeclared.has(p.name)).reduce((n, p) => n + p.operations.length, 0)} operations) ` +
      `— those want a tag in hanzoai/cloud`,
  );
}

if (import.meta.main) {
  genOpenapiPages().catch((e) => {
    console.error('[openapi] failed', e);
    process.exit(1);
  });
}
