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
const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

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
    L.push(`description: ${JSON.stringify(desc || `REST API reference for ${title}.`).slice(1, -1)}`);
    L.push('---');
    L.push('');
    if (desc) L.push(desc);
    L.push('');
    L.push('| | |');
    L.push('|---|---|');
    L.push(`| **Base URL** | \`${serverUrl}\` |`);
    if (version) L.push(`| **Version** | ${textEsc(version)} |`);
    L.push(`| **Operations** | ${total} |`);
    L.push('');
    if (authLines.length) {
      L.push('## Authentication');
      L.push('');
      for (const a of authLines) L.push(`- ${a}`);
      L.push('');
    }
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
      for (const [method, p, summary] of byTag.get(tag)!) {
        L.push(`| \`${method}\` | \`${codeEsc(p)}\` | ${textEsc(summary)} |`);
      }
      L.push('');
    }
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
