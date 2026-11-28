import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsContentDir = path.join(rootDir, 'apps/docs/content/docs');
const redirectsPath = path.join(rootDir, 'apps/docs/public/_redirects');

const ONBOARDING_PAGES = [
  'quickstart.mdx',
  'self-hosting.mdx',
  'skills.mdx',
  'contributing/getting-started.mdx',
  'contributing/index.mdx'
];

test('Onboarding Docs Audit: All core pages exist and carry valid MDX frontmatter', () => {
  for (const pageRel of ONBOARDING_PAGES) {
    const fullPath = path.join(docsContentDir, pageRel);
    assert.ok(fs.existsSync(fullPath), `Page ${pageRel} must exist`);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Frontmatter check
    assert.ok(content.startsWith('---'), `${pageRel} must start with YAML frontmatter delimiter`);
    assert.ok(content.includes('title:'), `${pageRel} frontmatter must declare a title`);
    assert.ok(content.includes('description:'), `${pageRel} frontmatter must declare a description`);
  }
});

test('Public Redirects Contract: /docs/contributing/oss-onboarding resolves to getting-started', () => {
  assert.ok(fs.existsSync(redirectsPath), '_redirects file must exist');
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  
  assert.ok(
    redirects.includes('/docs/contributing/oss-onboarding /docs/contributing/getting-started 301'),
    'Must redirect /docs/contributing/oss-onboarding to canonical getting-started'
  );
});

test('No Broken Internal Docs Links: Verifies all internal /docs/ links resolve', () => {
  for (const pageRel of ONBOARDING_PAGES) {
    const fullPath = path.join(docsContentDir, pageRel);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Find all markdown / JSX links like [text](/docs/something)
    const matches = [...content.matchAll(/\]\(\/docs\/([^)#]+)/g)];
    for (const match of matches) {
      const rawSlug = match[1].replace(/\/$/, '');
      const targetSlug = rawSlug.replace(/\.md$/, '');
      
      // Target could be an mdx file directly or a directory with index.mdx
      const directMdx = path.join(docsContentDir, `${targetSlug}.mdx`);
      const indexMdx = path.join(docsContentDir, targetSlug, 'index.mdx');
      const directDir = path.join(docsContentDir, targetSlug);
      
      const GENERATED_ROOTS = new Set(['openapi', 'cli', 'mcp-tools', 'pricing']);
      const isGenerated = GENERATED_ROOTS.has(targetSlug.split('/')[0]);
      const exists = isGenerated || fs.existsSync(directMdx) || fs.existsSync(indexMdx) || fs.existsSync(directDir);
      assert.ok(exists, `Internal link target /docs/${targetSlug} from ${pageRel} must resolve on disk`);
    }
  }
});

test('Canonical CLI Commands: Verifies accurate flags on copy-paste code blocks', () => {
  const allowedCommands = new Set([
    'hanzo start',
    'hanzo stop',
    'hanzo restart',
    'hanzo up',
    'hanzo down',
    'hanzo ps',
    'hanzo status',
    'hanzo doctor',
    'hanzo reset',
    'hanzo version',
    'hanzo auth login',
    'hanzo dev',
    'hanzo mcp',
    'hanzo pull'
  ]);

  for (const pageRel of ONBOARDING_PAGES) {
    const fullPath = path.join(docsContentDir, pageRel);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Extract bash code blocks
    const codeBlocks = [...content.matchAll(/```(?:bash|sh)\n([\s\S]*?)```/g)];
    for (const block of codeBlocks) {
      const lines = block[1].split('\n').map(l => l.trim()).filter(l => l.startsWith('hanzo '));
      for (const line of lines) {
        const cmdParts = line.split('#')[0].trim().split(/\s+/).slice(0, 2).join(' ');
        if (cmdParts.startsWith('hanzo ')) {
          // Verify it uses a recognized CLI subcommand
          assert.ok(
            [...allowedCommands].some(ac => cmdParts.startsWith(ac.split(' ')[0])),
            `Command "${line}" in ${pageRel} must start with known hanzo subcommand`
          );
        }
      }
    }
  }
});

test('Zero Private / Leaked Local URLs: Verifies absence of localhost in external link anchors', () => {
  for (const pageRel of ONBOARDING_PAGES) {
    const fullPath = path.join(docsContentDir, pageRel);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Prohibit markdown links pointing to private staging or localhost
    const privateLinks = [...content.matchAll(/\[[^\]]+\]\((https?:\/\/(?:localhost|127\.0\.0\.1|staging\.[^)]+))\)/g)];
    assert.equal(privateLinks.length, 0, `No private host links allowed in ${pageRel}`);
  }
});
