import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// Generate one static MDX API-reference page per OpenAPI spec.
//
// The specs (openapi-specs/*.yaml) are synced from hanzoai/openapi by
// scripts/sync-openapi.sh and are .gitignored, as are the generated pages
// (content/docs/openapi/**/*.mdx — except the tracked index.mdx). We render a
// self-contained static page (operations grouped by tag) rather than the
// runtime <APIPage>, because the interactive loader is disabled in static
// export (deep operation slugs break prerender). Pages are pure MDX, so they
// export cleanly and can never 530.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const SPECS_DIR = path.join(APP_ROOT, 'openapi-specs');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/openapi');
const SERVICES_DIR = path.join(APP_ROOT, 'content/docs/services');
const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

// A handful of services expose their concept guide under a slug that differs
// from the OpenAPI product slug (the inference/app/evals surfaces live at
// top-level guide pages, not under /docs/services/<svc>). Everything else is
// resolved source-derived by checking for a matching guide on disk.
const GUIDE_OVERRIDES: Record<string, string> = {
  ai: '/docs/llm',
  app: '/docs/apps',
  evals: '/docs/experiments',
};

// Resolve the human guide (concepts + examples) that pairs with an API
// reference, so the two halves of the docs cross-link. Returns null when the
// product has no prose guide yet (link is simply omitted — never fabricated).
function guideHref(svc: string): string | null {
  if (GUIDE_OVERRIDES[svc]) return GUIDE_OVERRIDES[svc];
  if (
    fs.existsSync(path.join(SERVICES_DIR, `${svc}.mdx`)) ||
    fs.existsSync(path.join(SERVICES_DIR, svc, 'index.mdx'))
  ) {
    return `/docs/services/${svc}`;
  }
  return null;
}

// Inline code (inside backticks): only the GFM table pipe needs escaping.
const codeEsc = (s: unknown): string =>
  String(s ?? '').replace(/[\r\n]+/g, ' ').trim().replace(/\|/g, '\\|');

// Plain table/heading text: neutralise MDX ({ }) and HTML (< >) + table pipe.
const textEsc = (s: unknown): string =>
  String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');

const firstLine = (s: unknown): string =>
  String(s ?? '').split('\n')[0].trim().slice(0, 200);

function syncSpecs(): void {
  try {
    execFileSync('bash', [path.join(SCRIPT_DIR, 'sync-openapi.sh')], {
      stdio: 'inherit',
    });
  } catch (e) {
    console.warn('[gen-openapi-pages] sync-openapi.sh failed; using existing specs', e);
  }
}

export async function genOpenapiPages(): Promise<void> {
  syncSpecs();
  if (!fs.existsSync(SPECS_DIR)) {
    console.warn('[gen-openapi-pages] no specs dir; skipping');
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const specFiles = fs
    .readdirSync(SPECS_DIR)
    .filter((f) => f.endsWith('.yaml') && f !== 'hanzo.yaml')
    .sort();

  const services: string[] = [];

  for (const file of specFiles) {
    const svc = file.replace(/\.yaml$/, '');
    let spec: any;
    try {
      spec = parseYaml(fs.readFileSync(path.join(SPECS_DIR, file), 'utf8'));
    } catch (e) {
      console.warn(`[gen-openapi-pages] skip ${svc}: parse error`, e);
      continue;
    }
    if (!spec || typeof spec !== 'object') continue;

    const info = spec.info ?? {};
    const title = info.title || `${svc} API`;
    const version = info.version || '';
    const desc = firstLine(info.description);
    const summary = firstLine(info.summary);
    const lead = summary || desc;
    const guide = guideHref(svc);
    const servers = Array.isArray(spec.servers) ? spec.servers : [];
    const serverUrl = servers[0]?.url || 'https://api.hanzo.ai';

    const schemes = spec.components?.securitySchemes ?? {};
    const authLines: string[] = [];
    for (const [name, sc] of Object.entries<any>(schemes)) {
      if (!sc || typeof sc !== 'object') continue;
      if (sc.type === 'http') authLines.push(`\`${name}\` — HTTP ${sc.scheme ?? ''}`);
      else if (sc.type === 'apiKey')
        authLines.push(`\`${name}\` — API key in ${sc.in ?? ''} (\`${sc.name ?? ''}\`)`);
      else if (sc.type === 'oauth2') authLines.push(`\`${name}\` — OAuth 2.0`);
      else authLines.push(`\`${name}\` — ${sc.type ?? ''}`);
    }

    const byTag = new Map<string, Array<[string, string, string]>>();
    let total = 0;
    for (const [p, item] of Object.entries<any>(spec.paths ?? {})) {
      if (!item || typeof item !== 'object') continue;
      for (const m of METHODS) {
        const op = item[m];
        if (!op || typeof op !== 'object') continue;
        total++;
        const tag = (Array.isArray(op.tags) && op.tags[0]) || 'General';
        const summary = op.summary || op.operationId || '';
        if (!byTag.has(tag)) byTag.set(tag, []);
        byTag.get(tag)!.push([m.toUpperCase(), p, summary]);
      }
    }

    const L: string[] = [];
    L.push('---');
    L.push(`title: ${title}`);
    L.push(`description: ${JSON.stringify(lead || `REST API reference for ${title}.`).slice(1, -1)}`);
    L.push('---');
    L.push('');
    if (lead) L.push(lead);
    L.push('');
    // Cross-link to the human guide (concepts + examples) and the index.
    const nav: string[] = [];
    if (guide) nav.push(`[Guide & examples →](${guide})`);
    nav.push('[All API references →](/docs/openapi)');
    L.push(`> **${title}** · ${nav.join(' · ')}`);
    L.push('');
    L.push('| | |');
    L.push('|---|---|');
    L.push(`| **Base URL** | \`${serverUrl}\` |`);
    if (version) L.push(`| **Version** | ${textEsc(version)} |`);
    L.push(`| **Operations** | ${total} |`);
    if (guide) L.push(`| **Guide** | [${textEsc(title)} guide](${guide}) |`);
    L.push('');
    L.push('## Authentication');
    L.push('');
    if (authLines.length) {
      for (const a of authLines) L.push(`- ${a}`);
    } else {
      L.push('- `BearerAuth` — HTTP bearer (Hanzo IAM JWT or `hk-` API key)');
    }
    L.push('');
    L.push('All Hanzo APIs share one bearer credential and common [error](https://github.com/hanzoai/openapi/blob/main/shared/errors.yaml) and [pagination](https://github.com/hanzoai/openapi/blob/main/shared/pagination.yaml) conventions. See [API conventions](/docs/openapi#conventions).');
    L.push('');
    L.push('```bash');
    L.push(`curl -H "Authorization: Bearer $HANZO_API_KEY" ${serverUrl}`);
    L.push('```');
    L.push('');
    L.push('## Endpoints');
    L.push('');
    if (total === 0) L.push('_No documented operations in this specification yet._');
    for (const tag of [...byTag.keys()].sort()) {
      L.push(`### ${textEsc(tag)}`);
      L.push('');
      L.push('| Method | Endpoint | Description |');
      L.push('|--------|----------|-------------|');
      for (const [method, p, opSummary] of byTag.get(tag)!) {
        L.push(`| \`${method}\` | \`${codeEsc(p)}\` | ${textEsc(opSummary)} |`);
      }
      L.push('');
    }
    L.push('---');
    L.push('');
    const footer: string[] = [];
    if (guide) footer.push(`[${title} guide](${guide})`);
    footer.push('[All Hanzo APIs](/docs/openapi)');
    footer.push(`[OpenAPI spec](https://github.com/hanzoai/openapi/blob/main/${svc}/openapi.yaml)`);
    L.push(footer.join(' · '));
    L.push('');
    fs.writeFileSync(path.join(OUT_DIR, `${svc}.mdx`), L.join('\n'));
    services.push(svc);
  }

  const meta = {
    title: 'API Reference',
    description:
      'REST API reference for every Hanzo service, generated from OpenAPI specs.',
    pages: ['index', ...services],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  console.log(`[gen-openapi-pages] generated ${services.length} API reference pages`);
}

if (import.meta.main) {
  genOpenapiPages().catch((e) => {
    console.error('[gen-openapi-pages] failed', e);
    process.exit(1);
  });
}
