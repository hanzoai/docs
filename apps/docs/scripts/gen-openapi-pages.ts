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
  titleCase,
  type Document,
  type Operation,
  type Product,
} from './openapi-doc';
import { fields, type Field } from './openapi-schema';
import { behind, command, door, firstCall, pascalTag, runnable, server, surfaces, type Door } from './openapi-surfaces';
import { MCP_DOOR, load as loadDoor, ops } from './sync-mcp-tools';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { loadCorpus, type Corpus, type Hip } from './sync-hips';
import { domains, doors, icon } from './capabilities';
import { coverage, gaps, type Coverage } from './coverage';
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

// A capability's page IS its guide.
//
// This used to look for a hand-written page under `content/docs/services/<name>`
// and link to it as "Guide & examples", with three overrides where the authored
// slug differed from the product name. That surface is gone: 454 pages
// describing capabilities in prose written beside no code, which is the copy the
// generated page replaces rather than links to. What a reader wanted from it —
// what the capability is, what it costs, what it publishes — is the HIP, and it
// is now ON this page.

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
        : `The document declares no body for \`${op.method.toUpperCase()} ${code(op.path)}\`. The handler is typed in cloud but its shape is not yet emitted, so the fields are not listed here — ask MCP's \`describe\` for \`${code(op.id)}\`, which answers from the running route.`,
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
/**
 * THE FOUR SURFACES, COUNTED.
 *
 * One name reaches this capability four ways — the address, the command group,
 * the client class, the MCP tool — and HIP-0139 is the reason they are the same
 * word. What HIP-0139 does not promise is that all four are FINISHED at the same
 * moment: the CLI folds a document it pins on its own clock, and the MCP server
 * declares its own verbs for operations it chooses to name.
 *
 * So this is a count, not a claim. Every number is a join performed here against
 * the artefact that surface actually ships — cloud's document, the CLI's
 * committed command table, the server's `tools/list` answer — and where a join
 * yields nothing the row says none rather than omitting itself. A reader asking
 * "can I drive this from the CLI?" gets a number; a reader who gets no row would
 * assume yes.
 *
 * The quickstart below then shows ONE operation through all four, so the table
 * says how much is reachable and the block says what reaching it looks like.
 */
function reachTable(p: Product, table: Map<string, CliCommand>, d: Door): string[] {
  // The CLI join follows the ALIAS, because the command table is pinned on its
  // own clock and cloud answers at either spelling. Keyed on the exact string,
  // a sweep of the addresses made this table report `none yet` for forty
  // capabilities whose command runs — a gap that does not exist is a worse
  // answer than no table.
  const hits = p.operations.map((o) => command(o, table)).filter(Boolean) as CliCommand[];
  const commands = hits.length;
  const group = hits[0]?.product;
  const serving = server(p, d);
  const n = p.operations.length;
  // The SDK column was the one number here that was never measured: it printed
  // the OPERATION count, on the assumption that a published client declares a
  // method per operation. The clients are generated at their own release and
  // lag it, so for 56 capabilities that assumption overstated what an installed
  // client can call, and for eighteen of them the true count is zero. Ask the
  // clients what they declare, the same way the per-operation SDK tab already
  // does, and print that.
  const methods = p.operations.filter((o) => behind(o).length === 0).length;

  const L: string[] = ['## Four surfaces', ''];
  L.push('| Surface | Reaches this capability as | Coverage |');
  L.push('|---|---|---|');
  L.push(`| **REST** | \`${code(p.name)}\` at its own prefix | ${n} operation${n === 1 ? '' : 's'} |`);
  L.push(
    `| **CLI** | ${group ? `\`hanzo ${code(group)} …\`` : '—'} | ${
      commands
        ? `${commands} of ${n}${commands < n ? ' — the CLI pins the document on its own clock' : ''}`
        : 'no command reaches it yet — use HTTP or an SDK'
    } |`,
  );
  L.push(
    `| **SDK** | ${methods ? `\`${code(pascalTag(p.name))}Api\` in every published client` : '—'} | ${
      methods === n
        ? `${n} method${n === 1 ? '' : 's'}`
        : methods
          ? `${methods} of ${n} — the clients are generated at their own release`
          : 'no published client declares one yet — regenerating the clients is what adds them'
    } |`,
  );
  L.push(
    `| **MCP** | ${serving ? `tool \`${code(serving.tool.name)}\` on \`${MCP_DOOR}\`` : '—'} | ${
      serving
        ? `${ops(serving.tool).length} operation${ops(serving.tool).length === 1 ? '' : 's'}${
            serving.named < ops(serving.tool).length
              ? `, ${serving.named} under the document's own id — ask \`describe\` for the rest`
              : ''
          }`
        : 'no tool names it yet — use HTTP or an SDK'
    } |`,
  );
  L.push('');
  return L;
}

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
      : // Said plainly rather than papered over: this product's entry point takes
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
/**
 * Words that are an ACTION on the noun before them, not a noun of their own.
 * `/v1/webhook/{id}/test` is testing a webhook; `/v1/webhook/{id}/deliveries`
 * is a collection under it. Nothing in the document tells the two apart, so the
 * ones we serve are listed — a short list that is wrong quietly (a name reading
 * "Create sync" instead of "Sync repo") rather than a rule that guesses.
 */
const ACTIONS = new Set([
  'upsert', 'test', 'send', 'sync', 'refresh', 'verify', 'revoke', 'rotate',
  'complete', 'reject', 'approve', 'start', 'stop', 'cancel', 'retry', 'resume',
  'export', 'import', 'search', 'query', 'resolve', 'validate', 'preview',
  'publish', 'deploy', 'launch', 'run', 'invoke', 'claim', 'redeem', 'login',
  'logout', 'signin', 'signup', 'connect', 'disconnect', 'enable', 'disable',
]);

/**
 * A NAME for the operation, derived from its address.
 *
 * The title was the summary cut to 80 characters, which put a truncated
 * sentence in every sidebar row: 1,849 of the 2,792 pages on this site read
 * like prose in the tree — "Registers a new webhook subscription for the
 * caller's org and answers 20…". A row is scanned, not read, so it needs a
 * name; the sentence is right below it as the description and loses nothing.
 *
 * Derived, never authored: the method gives the verb, the last real path
 * segment gives the subject. Measured over the whole document — 2,253
 * operations, longest name 33 characters, mean 13, none over 40.
 */
function opTitle(op: Operation, taken: Set<string>): string {
  const address = `${op.method.toUpperCase()} ${op.path}`;
  const segs = op.path.replace(/^\/v1\//, '').split('/').filter(Boolean);
  const words = segs.filter((s) => !s.startsWith('{')).map((s) => s.replace(/[-_]/g, ' '));
  if (words.length === 0) return address;

  const tailIsParam = segs[segs.length - 1].startsWith('{');
  const subject = words[words.length - 1];
  const method = op.method.toUpperCase();
  const cap = (w: string) => w.slice(0, 1).toUpperCase() + w.slice(1);

  let name: string;
  if (!tailIsParam && words.length > 1 && ACTIONS.has(subject.replace(/ /g, ''))) {
    name = `${cap(subject)} ${words[words.length - 2]}`;
  } else {
    const verb =
      method === 'GET'
        ? tailIsParam
          ? 'Get'
          : 'List'
        : method === 'POST'
          ? 'Create'
          : method === 'PUT'
            ? 'Replace'
            : method === 'PATCH'
              ? 'Update'
              : method === 'DELETE'
                ? 'Delete'
                : '';
    if (!verb) return address;
    name = `${verb} ${subject}`;
  }

  // Two operations under one product can land on one name (POST and PUT on the
  // same item). The address disambiguates, exactly as it did for summaries.
  const key = name.toLowerCase();
  return taken.has(key) ? `${name} — ${address}` : name;
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
  L.push(`> [${text(p.title)} →](/docs/openapi/${p.name}) · [All API references →](/docs/openapi) · [Get started →](/docs/start)`);
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

/**
 * WHAT THE CAPABILITY IS, from the capability's own HIP.
 *
 * The reference below states what it SERVES. This states what it is: the store
 * it owns, how a request becomes a tenant, what it meters, what it publishes.
 * HIP-0139 makes that text part of shipping a capability, so it exists in one
 * place and is rendered here rather than re-told.
 *
 * The HIP's own `##` sections become `###`, so the page keeps one spine and the
 * specification nests under it. The Abstract leads WITHOUT a heading — it is the
 * definition, and a reader who arrived at a page called KMS does not need a
 * heading to be told the first paragraph says what KMS is. References and
 * Copyright are the HIP's bookkeeping about itself, not the capability's
 * specification, and are left in the HIP.
 */
const HIP_BOOKKEEPING = new Set(['references', 'copyright']);

function specification(name: string, hips: Corpus): string[] {
  const hip: Hip | undefined = hips.capabilities[name];
  const L: string[] = ['## Specification', ''];

  // A capability with no HIP says so, and says it in one line. Padding the gap
  // with a paragraph of generated prose would make an unwritten specification
  // look like a written one, which is the one thing a reader must not conclude.
  if (!hip) {
    L.push(
      `Specification pending — no HIP in [hanzoai/hips](https://github.com/hanzoai/hips) ` +
        `declares \`capability: ${name}\` yet. What this capability serves is below, ` +
        'from the API document; what it is — the store it owns, how it meters, what it ' +
        'publishes — is written as a HIP under HIP-0139.',
    );
    L.push('');
    return L;
  }

  const url =
    `https://github.com/hanzoai/hips/blob/${hips.pin}/HIPs/${hip.file}`;
  L.push(
    `> **HIP-${text(hip.hip)} · ${text(hip.title)}** — ${text(hip.status)} · ` +
      `[read the specification →](${url})`,
  );
  L.push('');
  for (const sec of hip.sections) {
    if (HIP_BOOKKEEPING.has(sec.heading.toLowerCase())) continue;
    const lead = sec.heading.toLowerCase() === 'abstract';
    if (!lead) {
      L.push(`### ${text(sec.heading)}`);
      L.push('');
    }
    // Everything the author nested moves down one level with its parent, and
    // the prose is escaped for MDX. A HIP is markdown written for a markdown
    // reader, so it is free to contain `{host}` and `<name>` in running text;
    // MDX reads the first as an expression and the second as a component, and
    // the admission page died prerendering with `host is not defined`. `prose`
    // leaves fenced blocks and code spans alone, so examples still read as
    // written.
    L.push(prose(sec.body.replace(/^(#{3,5})\s/gm, (_m, h) => `${h}# `)));
    L.push('');
  }
  return L;
}

/**
 * A capability the public document does not carry.
 *
 * Every one is a row in `manifest/apps.go`. Their page has no Endpoints table and
 * must not pretend to: an empty table reads as a broken product, and a generated
 * sample would be a call that cannot run.
 *
 * The REASON differs, and the page must not flatten it into one. Most answer on
 * something a document cannot describe — a port, a `/.well-known/` convention,
 * another app's router, a control plane the address relays onto. `admin` and
 * `plugins` serve ordinary HTTP at `/v1/admin/*` and are withheld on purpose,
 * because the operator surface is not a customer's. Saying "this serves no HTTP
 * operations" on the admin page would be false, and false in the direction that
 * matters: it would tell an operator the console does not exist.
 *
 * So the sentence states only what is true of all of them — it is not in the
 * public contract, it is GA, and here is where it is reached — and the `doors:`
 * line, written per capability in `capabilities.yaml`, carries the specific why. The COUNT is
 * not written here at all: two of these were retired the week this was authored
 * (`catalogsync` and `rollingcap`, neither of which was a process), and a number
 * in a comment is the one part of that change nothing would have caught.
 */
function renderReached(name: string, door: string, hips: Corpus): string {
  // The SAME title rule every other capability page is titled by — `amqp` is
  // AMQP and `dns` is DNS because openapi-doc's WRITTEN map says so, not
  // because a second rule here happens to agree with it today.
  const title = titleCase(name);
  const L: string[] = [];
  L.push('---');
  L.push(`title: ${yamlString(title)}`);
  L.push(`description: ${yamlString(`${title} — reached at ${door.split(' — ')[0]}; not in the public REST contract.`)}`);
  L.push('---');
  L.push('');
  L.push(
    `**${text(title)}** ships in every Hanzo cloud. It carries no operations in the public API ` +
      'document, so it has no generated REST reference — it is reached another way.',
  );
  L.push('');
  L.push(`> [All capabilities →](/docs/openapi) · [How the four surfaces line up →](/docs/start)`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Reached at** | ${text(door)} |`);
  L.push(`| **In the public contract** | no — see below |`);
  L.push('');
  L.push('## Why there is no reference here');
  L.push('');
  L.push(
    'This reference is generated from the public API document, one page per operation. This ' +
      'capability contributes no operation to that document — which is a fact about its address, not ' +
      'about whether it is finished. It is GA and it runs in every deployment. ' +
      `It is reached at ${text(door)}.`,
  );
  L.push('');
  L.push(...specification(name, hips));
  L.push('---');
  L.push('');
  L.push('[All Hanzo capabilities](/docs/openapi) · [Interactive reference](/reference)');
  L.push('');
  return L.join('\n');
}

function renderProduct(
  p: Product,
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
  hips: Corpus,
): string {
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
    '[All API references →](/docs/openapi)',
    '[Get started →](/docs/start)',
  ];
  L.push(`> ${nav.join(' · ')}`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Base URL** | \`${doc.server}\` |`);
  L.push(`| **Operations** | ${p.operations.length} |`);
  L.push(`| **Auth** | \`Authorization: Bearer $HANZO_API_KEY\` |`);
  // A second address, where there is one. `pubsub` answers at `/v1/pubsub` AND on
  // `:4222`; printing only the first describes half the capability to the half
  // of its readers who came for a NATS client.
  const second = doors().get(p.name);
  if (second) L.push(`| **Also reached at** | ${text(second)} |`);
  L.push('');

  L.push(...specification(p.name, hips));

  L.push(...reachTable(p, table, d));

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
      '[All Hanzo APIs](/docs/openapi)',
      '[Interactive reference](/reference)',
    ].join(' · '),
  );
  L.push('');
  return L.join('\n');
}


function renderIndex(
  products: Product[],
  doc: Document,
  reached: string[] = [],
  rows: Coverage[] = [],
): string {
  const ops = products.reduce((n, p) => n + p.operations.length, 0);
  const total = products.length + reached.length;
  const L: string[] = [];
  L.push('---');
  L.push('title: Capabilities');
  L.push(
    `description: ${yamlString(
      `Every Hanzo capability — ${total} of them, ${ops} operations, generated from the OpenAPI document.`,
    )}`,
  );
  L.push('icon: Boxes');
  L.push('---');
  L.push('');
  L.push("import { Cards, Card } from '@hanzo/docs-base-ui/components/card'");
  L.push('');
  L.push('# Every capability');
  L.push('');
  L.push(
    `One cloud, one credential. **${total} capabilities**, and each is one word that names the same thing everywhere — its address, its command group, its client class, its MCP tool, this page and its HIP. ${products.length} of them speak REST over HTTPS and carry **${ops} operations**, generated straight from the OpenAPI document that also generates the SDKs, the CLI and the MCP tools.`,
  );
  L.push('');
  if (reached.length) {
    L.push(
      `The other ${reached.length} carry no operation in it. Most answer somewhere a document cannot describe — a port, a \`/.well-known/\` convention, ` +
        `another app's router, a control plane the address relays onto — and two are the operator surface, which serves ordinary HTTP and is withheld because its audience is not a customer. ` +
        `All ${reached.length} are GA and run in every deployment; each page names its own address and prints no endpoint table it does not have.`,
    );
    L.push('');
  }
  // THE ALIAS, said ONCE.
  //
  // cloud answers at both the singular and the plural of a capability's name —
  // a mechanical bidirectional alias at the router — but publishes only the
  // canonical one. A reader who has an older client, an older CLI or an older
  // tutorial needs to know their spelling still works; what they must not
  // conclude is that there are two capabilities. Saying it here, on the page
  // that introduces the naming rule, is the one place it belongs: repeating it
  // on 122 pages would make an implementation detail look like a choice a
  // caller has to make.
  L.push(
    'The names below are the canonical ones. cloud also answers at the other ' +
      'spelling of a name that has one — `/v1/sandboxes` reaches `/v1/sandbox` — so an older client ' +
      'keeps working; only the canonical name is published, documented and generated from.',
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
    'Get a key at [console.hanzo.ai](https://console.hanzo.ai). New here? [Get started](/docs/start) walks the same journeys as CLI, SDK, HTTP and MCP.',
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
  // GROUPED, because ungrouped is the one arrangement nobody chose. Every
  // capability in one flat list is a wall a reader scrolls past; nine headings
  // is a question they answer in one look and then a card they click. Same
  // taxonomy as the sidebar, read from the same file, so the two cannot show
  // different shapes.
  const off = doors();
  const by = new Map(products.map((p) => [p.name, p]));
  for (const d of domains()) {
    const names = d.tags.filter((t) => by.has(t) || (off.has(t) && reached.includes(t)));
    if (!names.length) continue;
    L.push(`## ${d.title}`);
    L.push('');
    if (d.role) {
      L.push(`${text(d.role)} — ${names.length} capabilities.`);
      L.push('');
    }
    L.push('<Cards>');
    for (const n of names) {
      const p = by.get(n);
      L.push(`  <Card title=${JSON.stringify(p ? p.title : titleCase(n))} href="/docs/openapi/${n}">`);
      L.push(
        p
          ? `    ${text(firstSentence(p.description, 130))} · ${p.operations.length} operations`
          : `    ${text(off.get(n) ?? '')}`,
      );
      L.push('  </Card>');
    }
    L.push('</Cards>');
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push('Prefer to click? The [interactive reference](/reference) renders the same document.');
  L.push('');
  return L.join('\n');
}

/** One reference: a page per product, an index, and the section's nav. */
/**
 * THE SIDEBAR: nine domains, capabilities in the order the taxonomy writes them.
 *
 * 116 names in one alphabetical list is the arrangement that carries no
 * information — `admission` above `ai`, `zt` beside nothing — and it is the one
 * arrangement nobody chose. `capabilities.yaml` is where the choice was made, so
 * the sidebar reads it: domains as separators, capabilities in file order
 * beneath their own.
 *
 * `check-capabilities` proves the two sets are the same set, in both directions,
 * before this runs. So there is no fallback bucket here and no need for one: a
 * capability that is not grouped fails the build, rather than landing in an
 * "Other" heading nobody meant to create.
 */
function sidebar(products: Product[], reached: string[] = []): string[] {
  const have = new Set([...products.map((p) => p.name), ...reached]);
  const out: string[] = [];
  for (const d of domains()) {
    const names = d.tags.filter((t) => have.has(t));
    if (!names.length) continue;
    const mark = icon(d.id);
    out.push(`---${mark ? `[${mark}]` : ''}${d.title}---`);
    out.push(...names);
  }
  return out;
}

function writePages(
  dir: string,
  products: Product[],
  doc: Document,
  table: Map<string, CliCommand>,
  d: Door,
  hips: Corpus,
): string[] {
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
    fs.writeFileSync(path.join(folder, 'index.mdx'), renderProduct(p, doc, table, d, hips));

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
    // An EMPTY list, which is not the same as no list.
    //
    // No `pages` at all means "every file here", and every file here is this
    // capability's operations — 381 of them under o11y. An empty one means "none
    // of them", which is the intent, and it leaves the folder's own index.mdx as
    // the folder's landing page. Naming `index` did suppress the operations, but
    // it also moved the capability page from being the folder to being a child
    // OF the folder, so the sidebar showed `Projects > Projects` 124 times.
    // `collapsible: false` because there is nothing to collapse. A folder is
    // collapsible by default, and the sidebar draws a chevron on every one of
    // them — so an empty `pages` list published 123 rows each offering to open
    // something and opening nothing. Saying it holds no children is what makes
    // the row read as the link it is.
    fs.writeFileSync(
      path.join(folder, 'meta.json'),
      JSON.stringify(
        { title: p.title, description: firstSentence(p.description, 160), pages: [], collapsible: false },
        null,
        2,
      ) + '\n',
    );
  }
  // The capabilities that answer off `/v1`, written from `doors:` rather than
  // from operations they do not have. Only in the published tree: the operator
  // surface is generated into its own directory and has no taxonomy to place
  // them under.
  const reached: string[] = [];
  if (dir === OUT_DIR) {
    const have = new Set(products.map((p) => p.name));
    for (const [name, door] of doors()) {
      if (have.has(name)) continue;
      const folder = path.join(dir, name);
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(path.join(folder, 'index.mdx'), renderReached(name, door, hips));
      fs.writeFileSync(
        path.join(folder, 'meta.json'),
        JSON.stringify(
          { title: titleCase(name), description: door, pages: [], collapsible: false },
          null,
          2,
        ) + '\n',
      );
      reached.push(name);
    }
  }

  fs.writeFileSync(
    path.join(dir, 'index.mdx'),
    renderIndex(products, doc, reached, coverage(doc, table, d)),
  );

  fs.writeFileSync(
    path.join(dir, 'meta.json'),
    JSON.stringify(
      {
        // NOT 'Capabilities'. The root sidebar already heads this group with
        // that word and the same Boxes icon, so a folder repeating it rendered
        // two near-identical rows one above the other — the reader sees the
        // name twice and neither row says anything the other did not. The
        // folder's job is the one thing the heading does not state: how the
        // capabilities are arranged. The page keeps its own title.
        title: 'By domain',
        description:
          'Every Hanzo capability, grouped — what each one is, its four surfaces, and its generated reference.',
        // NOT led by 'index', and this section is the one place that matters.
        //
        // A folder's own `index.mdx` becomes its landing page automatically —
        // the tree builder resolves it before it reads `pages` at all. Listing
        // it is therefore redundant everywhere and WRONG here, because a name in
        // `pages` resolves to a FOLDER first and only then to a file: `index` is
        // Hanzo Index, a capability with a folder of its own. So the entry did
        // not name this section's landing page as intended — it named the
        // capability a second time, and published it twice, once under Data
        // where it belongs and once above the first domain heading where it read
        // as the section's own page.
        pages: sidebar(products, reached),
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `[openapi] ${products.length} products, ${ops} operation pages` +
      (reached.length ? `, ${reached.length} reached off /v1 (${reached.join(', ')})` : '') +
      ` -> ${path.relative(APP_ROOT, dir)}`,
  );
  return reached;
}

// -------------------------------------------------------------------- main

function syncDocument(): void {
  try {
    execFileSync('bash', [path.join(SCRIPT_DIR, 'sync-openapi.sh')], { stdio: 'inherit' });
  } catch (e) {
    console.warn('[openapi] sync failed; building from the committed snapshot', e);
  }
}

/**
 * THE SECTION SWITCHER'S DATA, generated with the pages it points at.
 *
 * The switcher in the docs chrome carried a hand-written list of 50 services
 * with hand-written routes into `content/docs/services/`. That is a second
 * catalogue of the estate, kept true by memory, on every page of the site — and
 * when the section it pointed at was deleted, all 50 routes died at once with
 * nothing to notice.
 *
 * It is the same projection as the sidebar: nine domains, their capabilities,
 * their pages. Emitted as TypeScript into `generated/`, beside the key-types
 * fragment, for the same reason — a client component cannot read the document at
 * runtime, so the build hands it the answer.
 */
function writeSections(products: Product[], reached: string[] = []): void {
  const by = new Map(products.map((p) => [p.name, p]));
  const off = new Set(reached);
  const groups = domains()
    .map((d) => ({
      label: d.title,
      items: d.tags
        .filter((t) => by.has(t) || off.has(t))
        .map((t) => ({ name: by.get(t)?.title ?? titleCase(t), route: `/docs/openapi/${t}` })),
    }))
    .filter((g) => g.items.length > 0);

  const file = path.join(APP_ROOT, 'generated/sections.ts');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    '// Generated by scripts/gen-openapi-pages.ts from the pinned document and\n' +
      '// openapi-specs/capabilities.yaml. Do not edit.\n\n' +
      'export interface DocSection {\n  name: string;\n  route: string;\n}\n\n' +
      'export interface SectionGroup {\n  label: string;\n  items: DocSection[];\n}\n\n' +
      `export const SECTIONS: SectionGroup[] = ${JSON.stringify(groups, null, 2)};\n`,
  );
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

  // The quickstart's CLI and MCP columns are the CLI's own table and the server's
  // own answer, read here once and handed down — the same two artefacts the flow
  // pages read, through the same two functions.
  const table = loadCliTable();
  const d = door(loadDoor().tools);
  const hips = loadCorpus();

  const reached = writePages(out, doc.products, doc, table, d, hips);
  if (out === OUT_DIR) writeSections(doc.products, reached);

  // The operator surface is rendered too, just not here. 86 endpoints our own
  // people run on are worth a page each; what they are not worth is being on
  // docs.hanzo.ai. See INTERNAL_DIR for where they go and why it is not a repo.
  if (doc.internal.length) writePages(internalOut, doc.internal, doc, table, d, hips);

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
