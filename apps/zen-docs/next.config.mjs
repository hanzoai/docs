import { createMDX } from '@hanzo/docs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  // The generated collection modules live in the generator's outDir (`.docs/`),
  // written on every build by createMDX(). Same alias, same location, every app.
  turbopack: {
    resolveAlias: {
      '@hanzo/mdx:collections/server': './.docs/server.ts',
      '@hanzo/mdx:collections/browser': './.docs/browser.ts',
      '@hanzo/mdx:collections/dynamic': './.docs/dynamic.ts',
    },
  },
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
