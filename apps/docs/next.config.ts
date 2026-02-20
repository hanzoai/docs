import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';
import path from 'path';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isGitHubPages = process.env.GITHUB_PAGES === '1';

const config: NextConfig = {
  output: process.env.NEXT_EXPORT === '1' ? 'export' : undefined,
  basePath: isGitHubPages ? '/docs' : undefined,
  reactStrictMode: true,
  // Use webpack resolve aliases for virtual modules
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@hanzo/mdx:collections/server': path.resolve(__dirname, 'docs/server.ts'),
      '@hanzo/mdx:collections/browser': path.resolve(__dirname, 'docs/browser.ts'),
      '@hanzo/mdx:collections/dynamic': path.resolve(__dirname, 'docs/dynamic.ts'),

      // Upstream project docs use absolute imports that don't exist in this
      // monorepo.  Map them to `false` so webpack provides an empty module
      // instead of crashing.
      //   /snippets/...       – KMS (Mintlify-style)
      //   /src/components/... – Datastore (ClickHouse-style)
      //   @site/...           – Datastore (Docusaurus-style)
      '/snippets': false,
      '/src/components': false,
      '@site': false,
    };
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
    // Turbopack JSON file issues with these packages
    'mcp-handler',
    '@modelcontextprotocol/sdk',
    'raw-body',
    'iconv-lite',
    'statuses',
    'ajv',
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
};

const withMDX = createMDX();

// Type assertion needed due to version mismatch between @hanzo/docs-mdx (next@16) and docs app (next@15)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAnalyzer(withMDX(config as any) as any);
