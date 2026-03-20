export { DocsAuthProvider, useDocsAuth, type DocsAuthProviderProps } from './provider';
export { DocsLoginButton, type DocsLoginButtonProps } from './login-button';
export { Protected, type ProtectedProps } from './protected';
export { createDocsAuthMiddleware, type PageAccessInfo } from './middleware';
export { createAuthHandlers, createLoginHandler, createCallbackHandler, createLogoutHandler } from './handlers';
export { filterPageTreeByAccess } from './filter-tree';
export type { DocsAuthConfig, DocsAuthUser } from './types';
export { AUTH_DEFAULTS } from './types';
