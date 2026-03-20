'use client';

import { type ComponentProps } from 'react';
import { useDocsAuth } from './provider';
import { cn } from '@/utils/cn';

export interface DocsLoginButtonProps extends Omit<ComponentProps<'button'>, 'onClick'> {
  /** Text shown when not authenticated. @default "Sign in" */
  signInText?: string;
  /** Text shown when authenticated. @default "Sign out" */
  signOutText?: string;
}

export function DocsLoginButton({
  signInText = 'Sign in',
  signOutText = 'Sign out',
  className,
  ...props
}: DocsLoginButtonProps) {
  const { user, isAuthenticated, login, logout } = useDocsAuth();

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => login(typeof window !== 'undefined' ? window.location.pathname : undefined)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
          className,
        )}
        {...props}
      >
        {signInText}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => logout()}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      {...props}
    >
      {user?.picture && (
        <img
          src={user.picture}
          alt=""
          className="size-5 rounded-full"
        />
      )}
      <span>{user?.email ?? user?.name ?? 'User'}</span>
      <span className="text-fd-muted-foreground/60">{signOutText}</span>
    </button>
  );
}
