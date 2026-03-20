import type { DocsAuthConfig } from './types';
import { AUTH_DEFAULTS } from './types';

interface RouteContext {
  config: DocsAuthConfig;
}

function resolveRedirectUri(config: DocsAuthConfig, requestUrl: string): string {
  if (config.redirectUri) return config.redirectUri;
  const url = new URL(config.callbackPath ?? AUTH_DEFAULTS.callbackPath, requestUrl);
  return url.toString();
}

/**
 * Handles the login route — redirects to OIDC authorize endpoint.
 */
export function createLoginHandler({ config }: RouteContext) {
  return function handleLogin(request: Request): Response {
    if (!config.enabled) {
      return new Response('Auth not enabled', { status: 404 });
    }

    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') ?? '/';
    const scope = config.scope ?? AUTH_DEFAULTS.scope;
    const redirectUri = resolveRedirectUri(config, request.url);

    // Encode redirect path in state
    const state = btoa(JSON.stringify({ redirect: redirectTo }));

    const authorizeUrl = new URL('/oauth/authorize', config.issuer);
    authorizeUrl.searchParams.set('client_id', config.clientId);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('scope', scope);
    authorizeUrl.searchParams.set('state', state);

    return Response.redirect(authorizeUrl.toString(), 302);
  };
}

/**
 * Handles the OIDC callback — exchanges code for tokens, sets cookie, redirects.
 */
export function createCallbackHandler({ config }: RouteContext) {
  return async function handleCallback(request: Request): Promise<Response> {
    if (!config.enabled) {
      return new Response('Auth not enabled', { status: 404 });
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const stateParam = url.searchParams.get('state');

    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    // Decode redirect from state
    let redirectTo = '/';
    if (stateParam) {
      try {
        const state = JSON.parse(atob(stateParam));
        if (typeof state.redirect === 'string') redirectTo = state.redirect;
      } catch {
        // Ignore malformed state
      }
    }

    const redirectUri = resolveRedirectUri(config, request.url);
    const tokenUrl = new URL('/oauth/token', config.issuer);

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: config.clientId,
    });
    if (config.clientSecret) {
      body.set('client_secret', config.clientSecret);
    }

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      return new Response(`Token exchange failed: ${text}`, { status: 502 });
    }

    const tokens = (await tokenResponse.json()) as {
      access_token?: string;
      id_token?: string;
    };

    // Prefer id_token (contains user claims), fall back to access_token
    const jwt = tokens.id_token ?? tokens.access_token;
    if (!jwt) {
      return new Response('No token in response', { status: 502 });
    }

    const cookieName = config.cookieName ?? AUTH_DEFAULTS.cookieName;
    const cookieParts = [
      `${cookieName}=${jwt}`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Max-Age=86400', // 24 hours
    ];
    if (config.cookieDomain) {
      cookieParts.push(`Domain=${config.cookieDomain}`);
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTo,
        'Set-Cookie': cookieParts.join('; '),
      },
    });
  };
}

/**
 * Handles the logout route — clears cookie and redirects to home.
 */
export function createLogoutHandler({ config }: RouteContext) {
  return function handleLogout(_request: Request): Response {
    const cookieName = config.cookieName ?? AUTH_DEFAULTS.cookieName;
    const cookieParts = [
      `${cookieName}=`,
      'Path=/',
      'HttpOnly',
      'Secure',
      'SameSite=Lax',
      'Max-Age=0',
    ];
    if (config.cookieDomain) {
      cookieParts.push(`Domain=${config.cookieDomain}`);
    }

    // Optionally redirect to OIDC end-session endpoint
    const location = config.issuer
      ? new URL('/oauth/logout', config.issuer).toString()
      : '/';

    return new Response(null, {
      status: 302,
      headers: {
        Location: location,
        'Set-Cookie': cookieParts.join('; '),
      },
    });
  };
}

/**
 * Create all three route handlers at once.
 */
export function createAuthHandlers(config: DocsAuthConfig) {
  const ctx = { config };
  return {
    login: createLoginHandler(ctx),
    callback: createCallbackHandler(ctx),
    logout: createLogoutHandler(ctx),
  };
}
