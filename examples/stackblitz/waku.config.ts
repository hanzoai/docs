import { defineConfig } from 'waku/config';
import mdx from '@hanzo/docs-mdx/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    resolve: {
      tsconfigPaths: true,
      external: ['@takumi-rs/image-response'],
    },

    plugins: [tailwindcss(), mdx()],
  },
});
