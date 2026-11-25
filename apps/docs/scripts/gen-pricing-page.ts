import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { text, yamlString } from './mdx';

// THE PRICING PAGE, generated from the billing API.
//
// `GET https://api.hanzo.ai/v1/pricing` is the shape of the bill — the tool
// rates, the provider count, which models exist and what
// each one is for. Every figure on /docs/pricing is read out of a response.
// Nothing is typed by hand, because a hand-typed price is wrong the first time a
// rate moves and nobody notices until a bill does.
//
// The per-token rates and context windows come from `GET /v1/models`, the
// gateway's own catalogue, because that is the answer the gateway gives about
// the model you are about to name in `model` — and, when the two disagree, the
// one that matches what you were actually charged. /v1/pricing has been serving
// a frozen 2026-03-14 snapshot with no Enso rows at all; a page built from it
// alone published Enso prices five times the real ones, or dropped the family
// off the page entirely. So: rates from the catalogue, everything else from
// /v1/pricing, and a pricing response that has lost the Enso family is treated
// as no answer at all (see fetchPricing).
//
// The Enso section is the catalogue's alone: the four paid tiers and their
// rates as `/v1/models` lists them. /v1/pricing's Enso rows are a frozen
// snapshot whose tiers, descriptions and windows no longer exist, so none of it
// is printed. What only /docs/enso says (cache rates, the chain behind
// each tier, fast mode, how `enso-auto` picks) is linked, not copied.
//
// Snapshot, like the document and the MCP server: fetched when reachable, and the
// committed copy when not, so a builder with no egress still renders a truthful
// page. `meta.captured` records when the copy on disk was taken and
// `meta.source` whether THIS build refreshed it, so the page states its own
// provenance instead of implying it is live.
//
// The long tail — the outside models we carry, each with its own rate — is NOT
// rendered here. /docs/models fetches the catalogue in the browser and is
// therefore current without a rebuild; this page links to it rather than
// printing a second, staler copy of the same table.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const VENDORED = path.join(APP_ROOT, 'openapi-specs/pricing.json');
const OUT = path.join(APP_ROOT, 'content/docs/pricing.mdx');

export const PRICING_ENDPOINT = 'https://api.hanzo.ai/v1/pricing';
export const MODELS_ENDPOINT = 'https://api.hanzo.ai/v1/models';

/**
 * The rows of the Enso table: the four paid tiers. `enso-auto`, the fifth Enso
 * model and the default, bills at the tier that answers, so it has no rate of its
 * own to print and the page says so in prose. Any other Enso id the catalogue
 * still answers (a retired one, during a cutover) is not printed.
 */
const TIERS = new Set(['enso-flash', 'enso-pro', 'enso-max', 'enso-ultra']);

/** USD per million tokens, or per unit when `pricingUnit` says otherwise. */
interface Rate {
  input?: number | null;
  output?: number | null;
  cacheRead?: number | null;
  cacheWrite?: number | null;
  perUnit?: number | null;
}

interface Model {
  name: string;
  fullName?: string;
  description?: string;
  features?: string[];
  context?: number | null;
  pricingUnit?: string;
  pricing?: Rate;
}

interface Tool {
  name: string;
  unit: string;
  price: number;
}

/**
 * What the docs landing prints about the gateway's catalogue, read off
 * `GET /v1/models` with the rates: how many models it serves (each id once),
 * how many makers they come from (`owned_by`, without OpenRouter's `~` alias
 * mark), and Kai's rate, the one price the landing states.
 */
interface Catalogue {
  models: number;
  makers: number;
  kai: Rate;
  captured: string;
}

/** An Enso id as `/v1/models` lists it: USD per million tokens. */
interface EnsoRate {
  id: string;
  input: number;
  output: number | null;
}

interface Pricing {
  updated?: string;
  enso?: EnsoRate[];
  summary?: Record<string, number>;
  hanzoModels?: Model[];
  tools?: Tool[];
  providers?: Record<string, { total: number; free: number; paid: number }>;
  catalogue?: Catalogue;
  meta?: { captured: string; source: 'live' | 'snapshot' };
}


// ------------------------------------------------------------------ format

/**
 * A rate in USD, as exact as the gateway states it. Sub-cent rates keep their
 * precision — $0.005 per web search is not $0.01 — and so does a rate past the
 * cent ($5.236 is not $5.24), but nothing prints with a single decimal, because
 * `$0.2` reads as a truncation bug rather than twenty cents.
 */
const usd = (v: number | null | undefined): string => {
  if (v == null) return '—';
  if (v === 0) return 'Free';
  if (v >= 1) return `$${Number(v.toFixed(2)) === v ? v.toFixed(2) : String(v)}`;
  const trimmed = v.toFixed(3).replace(/0+$/, '');
  const decimals = trimmed.split('.')[1] ?? '';
  return `$${decimals.length >= 2 ? trimmed : v.toFixed(2)}`;
};

/** A context window, printed as the catalogue prints it. */
const ctx = (n: number | null | undefined): string => {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
};

// ------------------------------------------------------------------- fetch

const isEnso = (name: string): boolean => /^(hanzo\/)?enso(-|$)/.test(name);

/** The billing API's own answer. Null when it does not give a usable one. */
async function fetchPricing(): Promise<Pricing | null> {
  try {
    const r = await fetch(PRICING_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(60_000),
    });
    if (!r.ok) {
      console.warn(`[pricing] api answered ${r.status}`);
      return null;
    }
    const d = (await r.json()) as Pricing;
    // A response with no Hanzo models is an API mid-deploy, not a catalogue
    // that lost its own family. Treat it as no answer.
    if (!Array.isArray(d.hanzoModels) || !d.hanzoModels.length) {
      console.warn('[pricing] api answered without hanzoModels');
      return null;
    }
    // Nor is one that answers with a Hanzo family containing no Enso. Enso is
    // the first section of this page and the tier a reader is here to price; a
    // response missing it is incomplete, not a catalogue where Enso stopped
    // existing. Rendering it would silently delete the section.
    if (!d.hanzoModels.some((m) => isEnso(m.name))) {
      console.warn('[pricing] api answered without the Enso family');
      return null;
    }
    return d;
  } catch (e) {
    console.warn(`[pricing] api unreachable: ${(e as Error).message}`);
    return null;
  }
}

type Rates = Map<string, Rate & { context: number | null }>;

/**
 * The gateway catalogue: each id's rate, keyed by the id you pass as `model`,
 * and the landing's summary of it. The summary is null when the catalogue gave
 * no answer, so a build that cannot reach it keeps the committed one.
 */
async function fetchCatalogue(): Promise<{ rates: Rates; summary: Catalogue | null; enso: EnsoRate[] | null }> {
  const rates: Rates = new Map();
  try {
    const r = await fetch(MODELS_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(60_000),
    });
    if (!r.ok) {
      console.warn(`[pricing] catalogue answered ${r.status}`);
      return { rates, summary: null, enso: null };
    }
    // `pricing.prompt`/`completion` are USD per token; the per-million rates this
    // page prints sit under `input_per_million`/`output_per_million`.
    const d = (await r.json()) as {
      data?: Array<{
        id: string;
        owned_by?: string;
        family?: string;
        context_window?: number | null;
        pricing?: { input_per_million?: number; output_per_million?: number };
      }>;
    };
    const rows = d.data ?? [];
    for (const m of rows) {
      const input = m.pricing?.input_per_million;
      if (input == null) continue;
      rates.set(m.id, { input, output: m.pricing?.output_per_million ?? null, context: m.context_window ?? null });
    }
    const enso: EnsoRate[] = [];
    for (const m of rows) {
      const input = m.pricing?.input_per_million;
      if (!TIERS.has(m.id) || input == null) continue;
      enso.push({ id: m.id, input, output: m.pricing?.output_per_million ?? null });
    }
    const kai = rows.find((m) => m.family === 'kai' && m.pricing?.input_per_million != null);
    if (!rows.length || !kai) {
      console.warn('[pricing] catalogue answered without Kai');
      return { rates, summary: null, enso: enso.length ? enso : null };
    }
    const summary: Catalogue = {
      models: new Set(rows.map((m) => m.id)).size,
      makers: new Set(rows.map((m) => (m.owned_by ?? '').replace(/^~/, '').toLowerCase()).filter(Boolean)).size,
      kai: { input: kai.pricing!.input_per_million, output: kai.pricing!.output_per_million ?? null },
      captured: new Date().toISOString().slice(0, 10),
    };
    return { rates, summary, enso: enso.length ? enso : null };
  } catch (e) {
    console.warn(`[pricing] catalogue unreachable: ${(e as Error).message}`);
    return { rates, summary: null, enso: null };
  }
}

/**
 * The catalogue's rate wins. Only for models billed per token — a model priced
 * per image or per clip has no input/output rate for the catalogue's per-token
 * figure to be about, and overwriting one with the other prints a rate that
 * nobody is charged.
 */
function applyCatalogue(p: Pricing, catalogue: Rates): number {
  let changed = 0;
  for (const m of p.hanzoModels ?? []) {
    const c = catalogue.get(m.name);
    if (!c || m.pricingUnit) continue;
    if (m.pricing?.input !== c.input || m.pricing?.output !== c.output || m.context !== c.context) {
      changed += 1;
    }
    m.pricing = { ...m.pricing, input: c.input, output: c.output };
    m.context = c.context;
  }
  return changed;
}

function load(): Pricing {
  if (!fs.existsSync(VENDORED)) throw new Error(`[pricing] no vendored pricing at ${VENDORED}`);
  return JSON.parse(fs.readFileSync(VENDORED, 'utf8')) as Pricing;
}

/**
 * What gets committed: the projection this page renders, not the whole 128 KB
 * response. `/v1/pricing` also carries the cloud plans, the datastore tiers, the
 * GPU table and every third-party rate — none of which appear here, and all
 * of which move constantly. Vendoring them would churn the snapshot on every
 * sync with no change to the page, and bury a real Enso price change in noise.
 * A section that starts being rendered gets added here at the same time.
 */
const project = (
  p: Pricing,
  catalogue: Catalogue | undefined,
  enso: EnsoRate[] | undefined,
  meta: Pricing['meta'],
): Pricing => ({
  updated: p.updated,
  enso,
  summary: p.summary,
  hanzoModels: p.hanzoModels,
  tools: p.tools,
  providers: p.providers,
  catalogue,
  meta,
});

// ------------------------------------------------------------------ render

/** The paid Enso tiers, cheapest first. */
const ensoTiers = (enso: EnsoRate[]): EnsoRate[] =>
  enso.filter((t) => t.input > 0).sort((a, b) => a.input - b.input);

/** Hanzo-served models billed per call/image/clip rather than per token. */
function perUnit(models: Model[]): Model[] {
  return models
    .filter((m) => m.pricingUnit && m.pricing?.perUnit != null)
    .sort((a, b) => (a.pricing!.perUnit ?? 0) - (b.pricing!.perUnit ?? 0));
}

function render(p: Pricing): string {
  const models = p.hanzoModels ?? [];
  const tiers = ensoTiers(p.enso ?? []);
  const units = perUnit(models);
  const tools = p.tools ?? [];
  const captured = p.meta?.captured ?? 'an unrecorded date';

  const L: string[] = [];
  const w = (...lines: string[]) => L.push(...lines);

  w(
    '---',
    'icon: CircleDollarSign',
    'title: Pricing',
    `description: ${yamlString(
      'What a request costs — the Enso tiers, per-token billing for every other model, and the per-call rates for tools, images and audio.',
    )}`,
    '---',
    '',
    '',
    '# Pricing',
    '',
    '**After this page you can work out what a request will cost before you send',
    'it, and pick the tier that makes that number worth paying.**',
    '',
    'You are billed for what you use — tokens for a chat model, calls for a tool,',
    'images for an image model. There is no seat licence and no minimum: an',
    'account that sends nothing is charged nothing.',
    '',
    'Every rate below is per **million tokens** unless the table says otherwise,',
    'in US dollars.',
    '',
  );

  // --- Enso ---------------------------------------------------------------
  if (tiers.length) {
    w(
      '## The Enso tiers',
      '',
      'Enso is Hanzo\'s own family. Each paid tier runs a chain of frontier',
      'models under one id and one price, and a call bills that price whichever',
      'model answered it. `enso-auto`, the default, picks a tier per request and',
      'bills at the tier that answers.',
      '',
      '| Model | Input | Output |',
      '|---|---|---|',
    );
    for (const t of tiers) w(`| \`${text(t.id)}\` | ${usd(t.input)} | ${usd(t.output)} |`);
    w('');
    w(
      'Fast mode, `"fast": true` in the body or the header `X-Fast: 1`, bills 2x',
      'on `enso-auto` and `enso-flash`, 3x on `enso-pro` and `enso-max`, and 4x on',
      '`enso-ultra`, always from prepaid balance.',
      '',
      'Cache read and write rates, the models behind each tier, and a worked',
      'cost for an agent turn: [Enso](/docs/enso).',
      '',
    );
  }

  // --- Everything else ----------------------------------------------------
  w(
    '## Every other model',
    '',
    'Alongside the Enso and Zen families the gateway carries models from outside',
    'labs, on the same key and the same endpoint. Each is billed at its own',
    'published rate.',
    '',
    'Those rates move as providers change theirs, so they are not reprinted here.',
    'The catalogue at [**Models**](/docs/models) fetches them in your browser as',
    'you read, which means it is current without waiting for a docs deploy — read',
    'the price there, next to the model id you are about to paste.',
    '',
  );
  // --- Not per token ------------------------------------------------------
  if (tools.length) {
    w(
      '## Tools',
      '',
      'Tool calls are billed by their own unit, not by tokens:',
      '',
      '| Tool | Unit | Price |',
      '|---|---|---|',
    );
    for (const t of tools) w(`| ${text(t.name)} | ${text(t.unit)} | ${usd(t.price)} |`);
    w('');
  }

  if (units.length) {
    w(
      '## Billed per artefact, not per token',
      '',
      'Images, audio, video and reranking have no output token count to charge',
      'against, so each is billed by the thing it actually produces:',
      '',
      '| Model | Unit | Price |',
      '|---|---|---|',
    );
    for (const m of units) {
      w(`| \`${text(m.name)}\` | per ${text(m.pricingUnit)} | ${usd(m.pricing?.perUnit)} |`);
    }
    w('');
  }

  // --- How billing works --------------------------------------------------
  w(
    '## What you are actually charged',
    '',
    'A token is roughly three quarters of a word, so a 2,000-token prompt is',
    'about three pages. Divide the rate by a million and multiply:',
    '',
    '```',
    'cost = (input_tokens x input_rate + output_tokens x output_rate) / 1_000_000',
    '```',
    '',
    'You never have to trust that arithmetic. Every response to',
    '`/v1/chat/completions` carries a `usage` object counting exactly what was',
    'billed:',
    '',
    '```json',
    '{',
    '  "usage": {',
    '    "prompt_tokens": 2000,',
    '    "completion_tokens": 500,',
    '    "total_tokens": 2500',
    '  }',
    '}',
    '```',
    '',
    'Where a model publishes a cache-read rate, tokens served from cache are',
    'billed at that lower rate instead of the input rate — the catalogue shows it',
    'per model as `cacheRead`.',
    '',
    '## Read the rates programmatically',
    '',
    'The page you are reading is generated from this endpoint, so it can tell you',
    'nothing the endpoint will not:',
    '',
    '```bash',
    `curl -s ${MODELS_ENDPOINT} | jq '.data[] | select(.id | test("^enso-")) | {id, pricing}'`,
    '```',
    '',
    'It needs no key. `/v1/pricing` returns the Hanzo family, the third-party',
    'rates, the tool table, and the provider breakdown in one document;',
    '`/v1/models` returns the same rates alongside the model ids you pass as',
    '`model`.',
    '',
    '## Next',
    '',
    '<Cards>',
    '  <Card icon="Boxes" title="Models" href="/docs/models" description="The live catalogue — every model id and its current rate." />',
    '  <Card icon="Sparkle" title="Enso" href="/docs/enso" description="The Enso tiers: what each costs, cached tokens included, and the models behind it." />',
    '  <Card icon="Key" title="API keys" href="/docs/api-keys" description="Mint the key these requests are billed against." />',
    '  <Card icon="Code" title="Pricing API" href="/docs/openapi/pricing" description="Every pricing endpoint, generated from the spec." />',
    '</Cards>',
    '',
    `*Per-token rates read from \`/v1/models\`. Everything` +
      ` else captured from \`/v1/pricing\` on ${captured}.*`,
    '',
  );

  return L.join('\n');
}

// -------------------------------------------------------------------- main

export async function genPricingPage(): Promise<void> {
  const [live, { rates, summary, enso: liveEnso }] = await Promise.all([fetchPricing(), fetchCatalogue()]);
  const have = fs.existsSync(VENDORED) ? load() : null;
  const catalogue = summary ?? have?.catalogue;
  const enso = liveEnso ?? have?.enso;
  if (!liveEnso) console.log(`[pricing] no Enso rates from /v1/models — the page states the snapshot's`);
  if (!catalogue) throw new Error(`[pricing] catalogue unreachable and no snapshot at ${VENDORED}`);
  if (!summary) console.log(`[pricing] no usable /v1/models — the landing states the catalogue as of ${catalogue.captured}`);

  let pricing: Pricing;
  if (live) {
    pricing = project(live, catalogue, enso, { captured: new Date().toISOString().slice(0, 10), source: 'live' });
  } else {
    if (!have) throw new Error(`[pricing] api unreachable and no snapshot at ${VENDORED}`);
    // Say it in the build log, loudly: this build's page states the rates as
    // they were, not as they are.
    console.log(
      `[pricing] no usable /v1/pricing — rendering the vendored copy captured ${have.meta?.captured ?? '(undated)'}`,
    );
    pricing = project(have, catalogue, enso, { ...have.meta!, source: 'snapshot' });
  }
  const corrected = applyCatalogue(pricing, rates);
  if (corrected) console.log(`[pricing] ${corrected} rate(s) corrected from ${MODELS_ENDPOINT}`);
  fs.writeFileSync(VENDORED, JSON.stringify(pricing, null, 2) + '\n');

  fs.writeFileSync(OUT, render(pricing) + '\n');
  const s = pricing.summary ?? {};
  console.log(
    `[pricing] ${path.relative(APP_ROOT, OUT)} from ${pricing.meta!.source}: ` +
      `${ensoTiers(pricing.enso ?? []).length} Enso tiers, ` +
      `${(pricing.tools ?? []).length} tools, ` +
      `${s.totalModels ?? '?'} models`,
  );
}

if (import.meta.main) {
  genPricingPage().catch((e) => {
    console.error('[pricing] failed', e);
    process.exit(1);
  });
}
