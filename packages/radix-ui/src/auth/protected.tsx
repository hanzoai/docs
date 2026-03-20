'use client';

import { type ReactNode } from 'react';
import { useDocsAuth } from './provider';
import { cn } from '@/utils/cn';
import type { AccessLevel } from '@hanzo/docs-core/source/schema';

export interface ProtectedProps {
  /** Minimum access level required. @default "authenticated" */
  access?: AccessLevel;
  /** Required org membership */
  orgs?: string[];
  /** Content to display when authorized */
  children: ReactNode;
  /** Custom placeholder when unauthorized */
  fallback?: ReactNode;
  /** Additional className for the wrapper */
  className?: string;
}

function hasAccess(
  access: AccessLevel,
  isAuthenticated: boolean,
  roles: string[],
  org: string | undefined,
  orgs?: string[],
): boolean {
  if (access === 'public') return true;
  if (!isAuthenticated) return false;

  if (orgs && orgs.length > 0 && (!org || !orgs.includes(org))) {
    return false;
  }

  if (access === 'admin' && !roles.includes('admin')) return false;
  if (access === 'team' && !roles.includes('team') && !roles.includes('admin')) return false;

  return true;
}

export function Protected({
  access = 'authenticated',
  orgs,
  children,
  fallback,
  className,
}: ProtectedProps) {
  const { isAuthenticated, roles, org, login } = useDocsAuth();

  if (hasAccess(access, isAuthenticated, roles, org, orgs)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div
      className={cn(
        'relative my-4 rounded-xl border border-fd-border bg-fd-muted/30 p-6',
        className,
      )}
    >
      <div className="select-none blur-sm" aria-hidden="true">
        <div className="h-4 w-3/4 rounded bg-fd-muted-foreground/10 mb-3" />
        <div className="h-4 w-full rounded bg-fd-muted-foreground/10 mb-3" />
        <div className="h-4 w-2/3 rounded bg-fd-muted-foreground/10 mb-3" />
        <div className="h-4 w-5/6 rounded bg-fd-muted-foreground/10" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium text-fd-muted-foreground">
          Sign in to view this content
        </p>
        <button
          type="button"
          onClick={() =>
            login(typeof window !== 'undefined' ? window.location.pathname : undefined)
          }
          className="inline-flex items-center rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
