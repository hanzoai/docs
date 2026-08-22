import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from '@hanzo/docs/mdx/next';
import type { NextConfig } from 'next';
import path from 'path';

// `__dirname`, the CommonJS global, not a `fileURLToPath(import.meta.url)`
// shim. This app is `next.config.ts` like every other app in the monorepo, and
// this package declares no `"type": "module"`, so Next compiles the config to
// CommonJS — where `import.meta` is a syntax error and the shim above it fails
// the whole build before a single page renders. An upstream merge renamed this
// file to `.mts` and brought the ESM idiom with it; the pinned Next refuses
// `.mts` outright, so the rename could never have built. One extension, one
// module system, one way to find the app root.

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
  // Directory-index export (docs/services/index.html), not flat siblings
  // (docs/services.html). This is the ONE convention hanzoai/static serves:
  // it resolves /docs/services -> docs/services/index.html in place. Without
  // it the export writes docs.html AND a docs/ dir, so /docs opens the dir,
  // finds no index.html, redirects to /docs/, and 404s. CF Pages tolerated
  // flat .html via its own router; a plain file server does not. One way.
  trailingSlash: true,
  basePath: isGitHubPages ? '/docs' : undefined,
  assetPrefix: assetPrefix || undefined,
  reactStrictMode: true,
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
      'collections/server': './.docs/server.ts',
      'collections/browser': './.docs/browser.ts',
      'collections/dynamic': './.docs/dynamic.ts',
      '@hanzo/mdx:collections/server': './.docs/server.ts',
      '@hanzo/mdx:collections/browser': './.docs/browser.ts',
      '@hanzo/mdx:collections/dynamic': './.docs/dynamic.ts',
      // Ported docs written against the upstream framework name still say
      // `fumadocs-ui`; those components are ours, under our name.
      'fumadocs-ui/components/callout': '@hanzo/docs-ui/components/callout',
      'fumadocs-ui/components/tabs': '@hanzo/docs-ui/components/tabs',
      '@docusaurus': './lib/empty-project-module.js',
      '@theme': './lib/empty-project-module.js',
      '@theme/Tabs': './lib/empty-project-module.js',
      '@theme/TabItem': './lib/empty-project-module.js',
      '@theme/CodeBlock': './lib/empty-project-module.js',
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
      '@hanzo/mdx:collections/server': path.resolve(__dirname, '.docs/server.ts'),
      '@hanzo/mdx:collections/browser': path.resolve(__dirname, '.docs/browser.ts'),
      '@hanzo/mdx:collections/dynamic': path.resolve(__dirname, '.docs/dynamic.ts'),
      'collections/server': path.resolve(__dirname, '.docs/server.ts'),
      'collections/browser': path.resolve(__dirname, '.docs/browser.ts'),
      'collections/dynamic': path.resolve(__dirname, '.docs/dynamic.ts'),

      // (a) Upstream framework name -> the same components under ours
      'fumadocs-ui/components/callout': '@hanzo/docs-ui/components/callout',
      'fumadocs-ui/components/tabs': '@hanzo/docs-ui/components/tabs',

      // Other doc-platform packages -> no-op stub
      '@docusaurus': emptyProjectModule,
      '@theme/Tabs': emptyProjectModule,
      '@theme/TabItem': emptyProjectModule,
      '@theme/CodeBlock': emptyProjectModule,
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
  // ONE list. There were two `transpilePackages` keys in this object literal and
  // the later one won, so the shell/brand entries above it had never taken
  // effect — the comment explaining why they must be transpiled outlived the
  // setting it described. Both groups are here now:
  //   - workspace UI packages are consumed as compiled dist, so Turbopack needs
  //     them listed to resolve deep subpath exports
  //     (@hanzo/docs-base-ui/components/ui/*, etc.)
  //   - the shared Hanzo shell chrome (header/mega-menu/footer) and brand tokens
  //     ship as ESM with 'use client' boundaries, so the client/server split and
  //     JSX runtime resolve correctly only when the app build compiles them
  transpilePackages: [
    '@hanzo/docs',
    '@hanzo/docs-ui',
    '@hanzo/docs-base-ui',
    '@hanzo/docs-core',
    '@hanzo/docs-openapi',
    '@hanzogui/shell',
    '@hanzo/brand',
    // @hanzo/ui ships 'use client' ESM against React 19; the app build has to
    // compile it for the client/server split and the JSX runtime to resolve,
    // the same reason the shell above is listed.
    '@hanzo/ui',
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

// The collection modules are generated into the generator's own output dir
// (`.docs/`, gitignored) — the same dir every alias above points at, and the
// same dir every other app and example uses. Nothing is committed, so the build
// can never pick up a stale collection.
const withMDX = createMDX();

// createMDX is typed against its own copy of NextConfig, so the two structurally
// identical types are nominally distinct here. (The comment this replaces blamed
// a next@16-vs-next@15 skew that no longer exists — both are on 16.2.12.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withAnalyzer(withMDX(config as any) as any);
