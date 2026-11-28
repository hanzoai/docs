import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DOCS_ROOT = path.resolve(import.meta.dirname, '..', 'apps', 'docs', 'content', 'docs');

const TARGET_GUIDES = [
  'quickstart.mdx',
  'self-hosting.mdx',
  'skills.mdx',
  'apps/desktop.mdx',
  'apps/mobile.mdx',
  'apps/mods.mdx',
  'contributing/getting-started.mdx',
];

for (const relPath of TARGET_GUIDES) {
  test(`guide exists and has valid frontmatter & code blocks: ${relPath}`, () => {
    const fullPath = path.join(DOCS_ROOT, relPath);
    assert.ok(fs.existsSync(fullPath), `Missing guide: ${relPath}`);

    const content = fs.readFileSync(fullPath, 'utf8');
    assert.ok(content.startsWith('---'), `${relPath} must start with YAML frontmatter`);
    assert.match(content, /^title:\s*.+/m, `${relPath} frontmatter must include title`);
    assert.match(content, /^description:\s*.+/m, `${relPath} frontmatter must include description`);

    const codeBlocks = [...content.matchAll(/```[^\n]*\r?\n([\s\S]*?)```/g)].map((m) => m[1].trim());
    assert.ok(codeBlocks.length > 0, `${relPath} should contain at least one code block`);
    for (const block of codeBlocks) {
      assert.ok(block.length > 0, `${relPath} has an empty code block`);
    }
  });
}
