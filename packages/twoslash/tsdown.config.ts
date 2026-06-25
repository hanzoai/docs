import { defineConfig } from 'tsdown';

export default defineConfig({
  fixedExtension: false,
  target: 'es2023',
  format: 'esm',
  entry: ['src/index.ts', 'src/cache-fs.ts', 'src/ui/index.ts'],
  dts: {
    sourcemap: false,
  },
  deps: {
    // Transitive type-only deps pulled in via @shikijs/twoslash's public type
    // surface. The fork's lockfile resolves a fractured @shikijs/* tree, so these
    // arrive from undeclared node_modules; bundle their .d.ts into our emitted
    // types rather than leave dangling external references.
    onlyBundle: ['@types/hast', '@types/unist', '@shikijs/types', '@shikijs/vscode-textmate'],
  },
});
