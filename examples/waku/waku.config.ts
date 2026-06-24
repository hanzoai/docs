import { type Config, defineConfig } from 'waku/config';
import mdx from 'fumadocs-mdx/vite';
import * as MdxConfig from './source.config.js';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    // we do this to avoid Vite from bundling React contexts and cause duplicated contexts conflicts.
    optimizeDeps: {
      exclude: ['@fumadocs/base-ui', 'fumadocs-core'],
    },
    ssr: {
      external: ['@takumi-rs/image-response'],
      dedupe: ['waku'],
    },

    plugins: [tailwindcss(), mdx()],
  },
});
