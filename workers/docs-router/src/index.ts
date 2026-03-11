interface Route {
  prefix: string;
  origin: string;
  assetPrefix?: string;
}

const ROUTES: Route[] = [
  { prefix: '/docs/services/kms',      origin: 'kms-docs.pages.dev',         assetPrefix: '/__kms' },
  { prefix: '/docs/services/iam',      origin: 'iam-docs-s4h.pages.dev',     assetPrefix: '/__iam' },
  { prefix: '/docs/services/platform', origin: 'platform-docs-djx.pages.dev', assetPrefix: '/__platform' },
  { prefix: '/docs/projects',          origin: 'project-docs-5r8.pages.dev', assetPrefix: '/__projects' },
];

const MAIN_ORIGIN = 'hanzo-docs.pages.dev';

/**
 * Determine which section origin a request belongs to based on the Referer header.
 * When a browser loads /_next/ assets, the Referer is the page URL that triggered the load.
 */
function originFromReferer(request: Request): string | null {
  const referer = request.headers.get('Referer');
  if (!referer) return null;
  try {
    const refUrl = new URL(referer);
    for (const route of ROUTES) {
      if (refUrl.pathname.startsWith(route.prefix)) return route.origin;
    }
  } catch {}
  return null;
}

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

    // Static asset routing: /_next/ chunks, CSS, fonts, etc.
    // Each section build produces unique layout/page chunks that only exist on
    // that section's CF Pages origin.  Use the Referer header to route assets
    // to the origin that built the page the browser is rendering.
    if (url.pathname.startsWith('/_next/')) {
      const sectionOrigin = originFromReferer(request);
      if (sectionOrigin) {
        const res = await fetch(
          new Request(`https://${sectionOrigin}${url.pathname}${url.search}`, request),
        );
        if (res.ok) return res;
        // Asset missing on section origin — fall through to main origin.
        // This handles shared framework chunks that may only exist on main.
      }
    }

    // Default: main docs
    return fetch(new Request(`https://${MAIN_ORIGIN}${url.pathname}${url.search}`, request));
  },
};
