import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function getEntries(dir: string, base = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = base ? `${base}/${item}` : item;

    if (statSync(fullPath).isDirectory()) {
      Object.assign(entries, getEntries(fullPath, relativePath));
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      const name = relativePath.replace(/\.ts$/, '');
      entries[name] = fullPath;
    }
  }

  return entries;
}

const entries = getEntries('./src');

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: false,
  splitting: false,
  clean: true,
  external: [
    // Core packages (we re-export from these)
    '@hanzo/docs-core',
    '@hanzo/docs-mdx',
    '@hanzo/docs-base-ui',
    '@hanzo/docs-ui',
    '@hanzo/docs-openapi',
    '@hanzo/docs-twoslash',
    '@hanzo/docs-obsidian',
    '@hanzo/docs-mdx-remote',
    '@hanzo/docs-cli',
    // Hanzo packages (peer dependencies)
    '@hanzo/ui',
    '@hanzo/mdx',
    '@hanzo/docs-typescript',
    '@hanzo/docs-docgen',
    '@hanzo/docs-python',
    '@hanzo/docs-content-collections',
    '@hanzo/docs-press',
    '@hanzo/mdx-runtime',
    // React ecosystem
    'react',
    'react-dom',
    'next',
    // Optional integrations
    'algoliasearch',
    '@orama/orama',
    '@orama/core',
    '@oramacloud/client',
    '@tanstack/react-router',
    'react-router',
    'waku',
    'zod',
    'lucide-react'
  ],
});
