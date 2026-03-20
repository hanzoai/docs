import { createRemoteJWKSSet, jwtVerify, type JWTPayload } from 'jose';
import type { DocsAuthConfig, DocsAuthUser } from './types';
import { AUTH_DEFAULTS } from './types';

interface MiddlewareRequest {
  nextUrl: { pathname: string };
  cookies: { get(name: string): { value: string } | undefined };
  url: string;
}

interface MiddlewareResponse {
  redirect(url: URL): MiddlewareResponse;
  next(): MiddlewareResponse;
}

/**
 * Page metadata used by the middleware to determine access requirements.
 */
export interface PageAccessInfo {
  access?: 'public' | 'authenticated' | 'team' | 'admin';
  accessOrgs?: string[];
}

/**
 * Creates a Next.js middleware function for auth-gated docs.
 *
 * @param config - OIDC auth configuration
 * @param getPageAccess - Given a pathname, returns the page's access metadata.
 *   Return undefined for non-docs paths or pages without access restrictions.
 */
export function createDocsAuthMiddleware(
  config: DocsAuthConfig,
  getPageAccess: (pathname: string) => PageAccessInfo | undefined,
) {
  if (!config.enabled) {
    return function noopMiddleware() {
      return undefined;
    };
  }

  const cookieName = config.cookieName ?? AUTH_DEFAULTS.cookieName;
  const loginPath = config.loginPath ?? AUTH_DEFAULTS.loginPath;
  const jwksUri = new URL('/.well-known/jwks.json', config.issuer);
  const JWKS = createRemoteJWKSSet(jwksUri);

  async function verifyToken(token: string): Promise<(JWTPayload & DocsAuthUser) | null> {
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: config.issuer,
      });
      return payload as JWTPayload & DocsAuthUser;
    } catch {
      return null;
    }
  }

  function hasAccess(
    pageAccess: PageAccessInfo,
    claims: (JWTPayload & DocsAuthUser) | null,
  ): boolean {
    const level = pageAccess.access ?? 'public';
    if (level === 'public') return true;
    if (!claims) return false;

    // Check org restriction
    if (pageAccess.accessOrgs && pageAccess.accessOrgs.length > 0) {
      const userOrg = claims.org;
      if (!userOrg || !pageAccess.accessOrgs.includes(userOrg)) return false;
    }

    // Check email domain restriction
    if (config.emailDomains && config.emailDomains.length > 0 && claims.email) {
      const domain = claims.email.split('@')[1];
      if (!domain || !config.emailDomains.includes(domain)) return false;
    }

    // Check role-based access
    const roles = claims.roles ?? [];
    if (level === 'admin' && !roles.includes('admin')) return false;
    if (level === 'team' && !roles.includes('team') && !roles.includes('admin')) return false;

    return true;
  }

  return async function docsAuthMiddleware(
    request: MiddlewareRequest,
    NextResponse: MiddlewareResponse,
  ) {
    const { pathname } = request.nextUrl;

    // Skip auth routes themselves
    if (
      pathname === loginPath ||
      pathname === (config.callbackPath ?? AUTH_DEFAULTS.callbackPath) ||
      pathname === (config.logoutPath ?? AUTH_DEFAULTS.logoutPath)
    ) {
      return NextResponse.next();
    }

    const pageAccess = getPageAccess(pathname);

    // Not a docs page or no access restrictions
    if (!pageAccess || (pageAccess.access ?? 'public') === 'public') {
      return NextResponse.next();
    }

    // Check JWT
    const cookie = request.cookies.get(cookieName);
    const claims = cookie ? await verifyToken(cookie.value) : null;

    if (hasAccess(pageAccess, claims)) {
      return NextResponse.next();
    }

    // Redirect to login
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  };
}
