interface Route {
  prefix: string;
  origin: string;
  assetPrefix?: string;
}

const ROUTES: Route[] = [
  { prefix: '/docs/services/kms',      origin: 'kms-docs.pages.dev',         assetPrefix: '/__kms' },
  { prefix: '/docs/services/iam',      origin: 'iam-docs-s4h.pages.dev',     assetPrefix: '/__iam' },
  { prefix: '/docs/services/platform', origin: 'platform-docs.pages.dev',    assetPrefix: '/__platform' },
  { prefix: '/docs/projects',          origin: 'project-docs-5r8.pages.dev', assetPrefix: '/__projects' },
];

const MAIN_ORIGIN = 'hanzo-docs.pages.dev';

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Asset prefix routing: /__kms/_next/... → kms-docs.pages.dev/_next/...
    for (const route of ROUTES) {
      if (route.assetPrefix && url.pathname.startsWith(route.assetPrefix + '/')) {
        const path = url.pathname.slice(route.assetPrefix.length);
        return fetch(new Request(`https://${route.origin}${path}${url.search}`, request));
      }
    }

    // Page routing: /docs/services/kms/... → kms-docs.pages.dev/docs/services/kms/...
    for (const route of ROUTES) {
      if (url.pathname.startsWith(route.prefix)) {
        return fetch(new Request(`https://${route.origin}${url.pathname}${url.search}`, request));
      }
    }

    // Default: main docs
    return fetch(new Request(`https://${MAIN_ORIGIN}${url.pathname}${url.search}`, request));
  },
};
