/**
 * Configuration for OIDC-based docs authentication.
 *
 * Pass this to `DocsAuthProvider` and `createDocsAuthMiddleware` to enable
 * auth-gated docs pages.
 */
export interface DocsAuthConfig {
  /** Enable auth features. When false, all pages are public. */
  enabled: boolean;

  /** OIDC issuer URL, e.g. "https://hanzo.id" */
  issuer: string;

  /** OIDC client ID */
  clientId: string;

  /** OIDC client secret (server-side only, for token exchange) */
  clientSecret?: string;

  /** Cookie name for the JWT. @default "_docs_auth" */
  cookieName?: string;

  /** Cookie domain, e.g. ".hanzo.ai" */
  cookieDomain?: string;

  /** Callback URL for OIDC redirect. @default "/auth/callback" */
  redirectUri?: string;

  /** OIDC scopes. @default "openid email profile" */
  scope?: string;

  /** Restrict login to specific email domains */
  emailDomains?: string[];

  /** Login route path. @default "/auth/login" */
  loginPath?: string;

  /** Callback route path. @default "/auth/callback" */
  callbackPath?: string;

  /** Logout route path. @default "/auth/logout" */
  logoutPath?: string;
}

/** Claims decoded from the JWT (display-only on client, verified on server). */
export interface DocsAuthUser {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  org?: string;
  roles?: string[];
}

export const AUTH_DEFAULTS = {
  cookieName: '_docs_auth',
  scope: 'openid email profile',
  loginPath: '/auth/login',
  callbackPath: '/auth/callback',
  logoutPath: '/auth/logout',
} as const;
