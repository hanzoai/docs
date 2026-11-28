import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const targetPages = [
  'apps/docs/content/docs/run-your-org.mdx',
  'apps/docs/content/docs/console.mdx',
  'apps/docs/content/docs/dev/getting-started/authentication.mdx',
  'apps/docs/content/docs/guides/coding/index.mdx',
  'apps/docs/content/docs/skills.mdx',
  'apps/docs/content/docs/chat/authentication.mdx',
];

test('User-facing sign-in links resolve canonically to hanzo.ai/login', () => {
  for (const relPath of targetPages) {
    const fullPath = resolve(process.cwd(), relPath);
    const content = readFileSync(fullPath, 'utf8');
    assert.ok(
      content.includes('https://hanzo.ai/login'),
      `Expected ${relPath} to link to https://hanzo.ai/login`
    );
  }
});
