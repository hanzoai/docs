import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  fixedExtension: false,
  target: 'es2023',
  entry: ['./src/index.ts', './src/client/index.ts'],
  format: 'esm',
  deps: {
    onlyBundle: [],
    alwaysBundle: ['@hanzo/docs-core/content/md/frontmatter'],
    neverBundle: ['mdx/types'],
  },
});
