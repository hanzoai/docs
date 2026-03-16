import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts', './src/components/index.tsx'],
  format: 'esm',
  dts: false,
  fixedExtension: false,
  target: 'es2023',
  deps: {
    onlyBundle: [],
    external: ['@base-ui/utils'],
  },
});
