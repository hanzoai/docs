import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';
import path from 'path';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isGitHubPages = process.env.GITHUB_PAGES === '1';

// Stub module that exports a no-op component for every named/default import.
// Used as the resolution target for unresolvable upstream doc platform packages.
const emptyProjectModule = path.resolve(__dirname, 'lib/empty-project-module.js');

const config: NextConfig = {
  output: process.env.NEXT_EXPORT === '1' ? 'export' : undefined,
  basePath: isGitHubPages ? '/docs' : undefined,
  reactStrictMode: true,
  experimental: {
    // Reduce peak memory during webpack compilation for large builds.
    webpackMemoryOptimizations: true,
    // Limit static generation workers to reduce memory pressure.
    // Default (3 workers × ~4GB each) exceeds the GH Actions runner memory.
    cpus: 1,
  },
  webpack: (config) => {
    // ------------------------------------------------------------------ //
    // Layer 1 – Resolve aliases                                          //
    //                                                                    //
    // Upstream project docs (content/docs/projects/) are cloned verbatim //
    // from other repos and import packages that don't exist here.        //
    // Three categories:                                                  //
    //   a) fumadocs-* -> @hanzo/docs-* (same library, forked)            //
    //   b) other doc platforms -> empty stub module                       //
    //   c) absolute path imports -> false (empty object)                 //
    // ------------------------------------------------------------------ //
    config.resolve.alias = {
      ...config.resolve.alias,

      // Virtual collection modules (internal)
      '@hanzo/mdx:collections/server': path.resolve(__dirname, 'docs/server.ts'),
      '@hanzo/mdx:collections/browser': path.resolve(__dirname, 'docs/browser.ts'),
      '@hanzo/mdx:collections/dynamic': path.resolve(__dirname, 'docs/dynamic.ts'),

      // (a) fumadocs -> @hanzo/docs equivalents (real components/APIs)

      'fumadocs-ui': '@hanzo/docs-base-ui',
      'fumadocs-core': '@hanzo/docs-core',
      'fumadocs-mdx': '@hanzo/docs-mdx',
      '@hanzo/docs-core': '@hanzo/docs-core',
      '@hanzo/docs-mdx': '@hanzo/docs-mdx',

      // (b) Other doc-platform packages -> no-op stub
      '@docusaurus': emptyProjectModule,
      'nextra': emptyProjectModule,
      '@mintlify': emptyProjectModule,

      // (c) Absolute-path imports from various upstream conventions
      //   /snippets/...       – KMS (Mintlify-style)
      //   /src/components/... – Datastore (ClickHouse-style)
      //   @site/...           – Datastore (Docusaurus-style)
      '/snippets': false,
      '/src/components': false,
      '@site': false,
    };

    // ------------------------------------------------------------------ //
    // Layer 2 – Safety-net plugin                                        //
    //                                                                    //
    // Catch ALL remaining unresolvable imports from files inside          //
    // content/docs/projects/ and redirect them to the empty stub module. //
    // This prevents unknown upstream imports from crashing the build     //
    // without having to add aliases one-by-one.                          //
    // ------------------------------------------------------------------ //
    const aliasedPrefixes = [
      // Already handled by aliases above – skip to avoid double-processing
      'fumadocs-', '@hanzo/', '@docusaurus', 'nextra', '@mintlify',
      '/snippets', '/src/components', '@site',
      // Core dependencies that must always resolve normally
      'react', 'next', 'node:', 'webpack',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.plugins.push({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apply(compiler: any) {
        compiler.hooks.normalModuleFactory.tap(
          'ProjectDocsFallback',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (nmf: any) => {
            nmf.hooks.beforeResolve.tap(
              'ProjectDocsFallback',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (resolveData: any) => {
                if (!resolveData) return;

                const issuer: string = resolveData.contextInfo?.issuer || '';
                if (!issuer.includes('content/docs/projects/')) return;

                const request: string = resolveData.request;
                if (!request) return;

                // Skip webpack-internal, data URIs, relative imports handled
                // normally, and anything already covered by an alias.
                if (
                  request.startsWith('!') ||
                  request.startsWith('data:') ||
                  request.includes('?')
                ) return;

                if (aliasedPrefixes.some((p) => request.startsWith(p))) return;

                // For relative imports, resolve from the issuer's directory.
                // For bare specifiers, resolve from the issuer's context.
                const resolveFrom = resolveData.context || path.dirname(issuer);

                try {
                  require.resolve(request, { paths: [resolveFrom] });
                } catch {
                  // Module not found – redirect to the empty stub so the
                  // build continues instead of crashing.
                  resolveData.request = emptyProjectModule;
                }
              },
            );
          },
        );
      },
    });

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
  typescript: {

    // Upstream project docs import fumadocs-ui which is aliased to @hanzo/docs-base-ui
    // at webpack level, but TS type-checker doesn't see webpack aliases.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
