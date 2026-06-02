import { defineConfig } from 'tsdown';

const external = ['next', 'typescript', 'webpack', 'bun', 'mdx/types'];

const noExternal = [
  '@hanzo/docs-core/source/schema',
  '@hanzo/docs-core/mdx-plugins/remark-llms',
];

export default defineConfig([
  {
    entry: [
      './src/{index,bin}.ts',
      './src/{config,next,vite,bun}/index.ts',
      './src/webpack/{mdx,meta}.ts',
      './src/node/loader.ts',
      './src/runtime/*.{ts,tsx}',
      './src/plugins/*.ts',
    ],
    format: 'esm',
    dts: true,
    fixedExtension: false,
    target: 'node22',
    deps: {
      onlyBundle: noExternal,
      alwaysBundle: noExternal,
      neverBundle: external,
    },
  },
  target: 'es2023',
  platform: 'neutral',
  exports: {
    bin: false,
  },
  deps: {
    onlyBundle: ['@fumadocs/vite'],
    neverBundle: ['webpack', 'bun', /^node:/],
  },
});
