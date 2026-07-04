import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// Cross-link the human guides to their API reference (the other half of the
// bidirectional link — gen-openapi-pages.ts links reference -> guide). For every
// product that has an OpenAPI spec AND a prose guide, insert one prominent
// "API reference" callout near the top of the guide.
//
// Source-derived (iterates the synced specs, not a hardcoded list) and
// idempotent (skips a guide that already points at /docs/openapi/<svc>), so it
// is safe to re-run after new products land. It edits committed guide MDX in
// place — run it, review, commit.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const SPECS_DIR = path.join(APP_ROOT, 'openapi-specs');
const CONTENT = path.join(APP_ROOT, 'content/docs');

// Products whose guide lives at a top-level page rather than /docs/services/<svc>.
const GUIDE_FILE_OVERRIDES: Record<string, string> = {
  ai: 'llm.mdx',
  app: 'apps/index.mdx',
  evals: 'experiments.mdx',
};

function guideFile(svc: string): string | null {
  if (GUIDE_FILE_OVERRIDES[svc]) {
    const f = path.join(CONTENT, GUIDE_FILE_OVERRIDES[svc]);
    return fs.existsSync(f) ? f : null;
  }
  const flat = path.join(CONTENT, 'services', `${svc}.mdx`);
  if (fs.existsSync(flat)) return flat;
  const dir = path.join(CONTENT, 'services', svc, 'index.mdx');
  if (fs.existsSync(dir)) return dir;
  return null;
}

function specTitle(svc: string): string {
  try {
    const spec: any = parseYaml(fs.readFileSync(path.join(SPECS_DIR, `${svc}.yaml`), 'utf8'));
    return spec?.info?.title || `${svc} API`;
  } catch {
    return `${svc} API`;
  }
}

// Insert `block` after the first H1 that follows the frontmatter; if there is no
// H1, insert right after the frontmatter (skipping leading blank/import lines).
function insertCallout(src: string, block: string): string {
  const lines = src.split('\n');
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    i++; // past closing ---
  }
  // Prefer just after the first H1.
  for (let j = i; j < lines.length; j++) {
    if (/^#\s+\S/.test(lines[j])) {
      lines.splice(j + 1, 0, '', block);
      return lines.join('\n');
    }
    if (lines[j].trim() && !/^#{2,}\s/.test(lines[j])) break; // hit body before any H1
  }
  // No H1: skip blank + import lines, then insert.
  while (i < lines.length && (lines[i].trim() === '' || /^import\s/.test(lines[i]))) i++;
  lines.splice(i, 0, block, '');
  return lines.join('\n');
}

function main(): void {
  const specs = fs
    .readdirSync(SPECS_DIR)
    .filter((f) => f.endsWith('.yaml') && f !== 'hanzo.yaml')
    .map((f) => f.replace(/\.yaml$/, ''))
    .sort();

  let linked = 0;
  let already = 0;
  const missing: string[] = [];

  for (const svc of specs) {
    const file = guideFile(svc);
    if (!file) {
      missing.push(svc);
      continue;
    }
    const src = fs.readFileSync(file, 'utf8');
    if (src.includes(`/docs/openapi/${svc}`)) {
      already++;
      continue;
    }
    const title = specTitle(svc);
    const callout = `> **API reference** · [${title} →](/docs/openapi/${svc}) — every endpoint, generated from the OpenAPI spec.`;
    fs.writeFileSync(file, insertCallout(src, callout));
    linked++;
  }

  console.log(`[link-api-refs] linked ${linked}, already-linked ${already}, no-guide ${missing.length}${missing.length ? ` (${missing.join(', ')})` : ''}`);
}

main();
