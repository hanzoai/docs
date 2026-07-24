import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isGitHubPages = process.env.GITHUB_PAGES === '1';

// Federated docs: each section build uses a unique asset prefix so the
// CF Worker can route /__kms/_next/... to the correct Pages project.
const sectionAssetPrefix: Record<string, string> = {
  kms: '/__kms',
  iam: '/__iam',
  platform: '/__platform',
  projects: '/__projects',
};
const assetPrefix = sectionAssetPrefix[process.env.DOCS_SECTION ?? ''];

// Stub module that exports a no-op component for every named/default import.
// Used as the resolution target for unresolvable upstream doc platform packages.
const emptyProjectModule = path.resolve(__dirname, 'lib/empty-project-module.js');

const config: NextConfig = {
  output: process.env.NEXT_EXPORT === '1' ? 'export' : undefined,
  basePath: isGitHubPages ? '/docs' : undefined,
  assetPrefix: assetPrefix || undefined,
  reactStrictMode: true,
  // Shared Hanzo shell chrome (header/mega-menu/footer) + brand tokens ship as
  // ESM with 'use client' boundaries — transpile them through the app build so
  // the client/server split and JSX runtime resolve correctly.
  transpilePackages: ['@hanzogui/shell', '@hanzo/brand'],
  // Turbopack is the Next 16 default and correctly compiles MDX bodies via the
  // createMDX loader rules (the --webpack path emits empty bodies on Next 16).
  // Turbopack ignores the webpack resolve.alias below, so the virtual content
  // collection modules are aliased here too — AND so are the upstream
  // doc-platform imports (@theme/*, @docusaurus, nextra, @mintlify, @hanzo/icons)
  // that ported OSS project/service docs reference. The webpack ProjectDocsFallback
  // plugin below stubs those for the (unused) webpack path; Turbopack has no
  // beforeResolve hook, so the unified build (which compiles ALL synced content,
  // incl. iam/kms/platform/projects) needs them stubbed here or it fails to
  // resolve foreign refs. Stub → the no-op empty module, rendering children only.
  turbopack: {
    resolveAlias: {
      'collections/server': './docs/server.ts',
      'collections/browser': './docs/browser.ts',
      'collections/dynamic': './docs/dynamic.ts',
      '@hanzo/mdx:collections/server': './docs/server.ts',
      '@hanzo/mdx:collections/browser': './docs/browser.ts',
      '@hanzo/mdx:collections/dynamic': './docs/dynamic.ts',
      '@docusaurus': './lib/empty-project-module.js',
      '@theme': './lib/empty-project-module.js',
      '@theme/Tabs': './lib/empty-project-module.js',
      '@theme/TabItem': './lib/empty-project-module.js',
      'nextra': './lib/empty-project-module.js',
      '@mintlify': './lib/empty-project-module.js',
      '@hanzo/icons': './lib/empty-project-module.js',
    },
  },
  // HTTP redirects live in public/_redirects (Cloudflare Pages). This site
  // deploys as a static export (`out/`), which ignores next.config redirects(),
  // so declaring them here would be dead config.
  experimental: {
    // Reduce peak memory during webpack compilation for large builds.
    webpackMemoryOptimizations: true,
  },
  webpack: (config) => {
    // ------------------------------------------------------------------ //
    // Layer 1 – Resolve aliases                                          //
    //                                                                    //
    // Upstream project docs (content/docs/projects/) are cloned verbatim //
    // from other repos and import packages that don't exist here.        //
    // Three categories:                                                  //
    //   a) upstream doc-framework imports -> @hanzo/docs-* (forked lib)   //
    //   b) other doc platforms -> empty stub module                       //
    //   c) absolute path imports -> false (empty object)                 //
    // ------------------------------------------------------------------ //
    config.resolve.alias = {
      ...config.resolve.alias,

      // Virtual collection modules (internal). Both the namespaced specifier
      // and the bare `collections/*` specifier resolve to the generated source
      // (lib/source imports the bare form).
      '@hanzo/mdx:collections/server': path.resolve(__dirname, 'docs/server.ts'),
      '@hanzo/mdx:collections/browser': path.resolve(__dirname, 'docs/browser.ts'),
      '@hanzo/mdx:collections/dynamic': path.resolve(__dirname, 'docs/dynamic.ts'),
      'collections/server': path.resolve(__dirname, 'docs/server.ts'),
      'collections/browser': path.resolve(__dirname, 'docs/browser.ts'),
      'collections/dynamic': path.resolve(__dirname, 'docs/dynamic.ts'),

      // Other doc-platform packages -> no-op stub
      '@docusaurus': emptyProjectModule,
      '@theme/Tabs': emptyProjectModule,
      '@theme/TabItem': emptyProjectModule,
      '@theme': emptyProjectModule,
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
      '@hanzo/docs-', '@hanzo/', '@docusaurus', '@theme', 'nextra', '@mintlify',
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
                if (!issuer.includes('content/docs/projects/') && !issuer.includes('content/docs/services/')) return;

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
  // Workspace UI packages are consumed as compiled dist; list them so Turbopack
  // resolves their deep subpath exports (@hanzo/docs-base-ui/components/ui/*, etc.).
  transpilePackages: [
    '@hanzo/docs',
    '@hanzo/docs-ui',
    '@hanzo/docs-base-ui',
    '@hanzo/docs-core',
    '@hanzo/docs-openapi',
  ],
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

    // Some fork packages emit types the consuming app doesn't type-check against.
    ignoreBuildErrors: true,
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

// Regenerate the content collection (docs/server.ts etc.) into the SAME dir the
// resolve.alias below points at, so the build always uses a fresh, section-filtered
// collection instead of a stale committed one (which referenced projects/* pages
// excluded from the core build).
const withMDX = createMDX({ outDir: 'docs' });

// Type assertion needed due to version mismatch between @hanzo/docs-mdx (next@16) and docs app (next@15)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAnalyzer(withMDX(config as any) as any);
