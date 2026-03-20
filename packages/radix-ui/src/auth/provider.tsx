'use client';

import {
  createContext,
  use,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { DocsAuthConfig, DocsAuthUser } from './types';
import { AUTH_DEFAULTS } from './types';

interface DocsAuthContextValue {
  user: DocsAuthUser | null;
  isAuthenticated: boolean;
  org: string | undefined;
  roles: string[];
  login: (redirectTo?: string) => void;
  logout: () => void;
}

const DocsAuthContext = createContext<DocsAuthContextValue | null>(null);

function decodeJwtPayload(token: string): DocsAuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as DocsAuthUser;
  } catch {
    return null;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export interface DocsAuthProviderProps {
  config: DocsAuthConfig;
  children: ReactNode;
}

export function DocsAuthProvider({ config, children }: DocsAuthProviderProps) {
  const cookieName = config.cookieName ?? AUTH_DEFAULTS.cookieName;
  const loginPath = config.loginPath ?? AUTH_DEFAULTS.loginPath;
  const logoutPath = config.logoutPath ?? AUTH_DEFAULTS.logoutPath;

  const token = config.enabled ? getCookie(cookieName) : undefined;
  const user = token ? decodeJwtPayload(token) : null;

  const login = useCallback(
    (redirectTo?: string) => {
      const params = new URLSearchParams();
      if (redirectTo) params.set('redirect', redirectTo);
      const qs = params.toString();
      window.location.href = qs ? `${loginPath}?${qs}` : loginPath;
    },
    [loginPath],
  );

  const logout = useCallback(() => {
    window.location.href = logoutPath;
  }, [logoutPath]);

  const value = useMemo<DocsAuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      org: user?.org,
      roles: user?.roles ?? [],
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <DocsAuthContext value={value}>{children}</DocsAuthContext>;
}

export function useDocsAuth(): DocsAuthContextValue {
  const ctx = use(DocsAuthContext);
  if (!ctx) {
    throw new Error(
      'useDocsAuth must be used within a <DocsAuthProvider>. ' +
        'Wrap your app with DocsAuthProvider and pass a DocsAuthConfig.',
    );
  }
  return ctx;
}
