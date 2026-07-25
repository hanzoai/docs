import { defineConfig } from 'tsdown';

export default defineConfig({
  format: 'esm',
  target: 'es2023',
  platform: 'browser',
  entry: ['./src/index.tsx'],
  fixedExtension: false,
  dts: { sourcemap: false },
});
