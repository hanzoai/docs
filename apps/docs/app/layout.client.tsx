'use client';

import { useParams } from 'next/navigation';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { getSection } from '@/lib/source/navigation';
import { getMenuBarSVG } from '@hanzo/logo';

export function Body({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode();

  return <body className={cn(mode, 'relative flex min-h-screen flex-col')}>{children}</body>;
}

export function useMode(): string | undefined {
  const params = useParams();
  const slug = params?.slug ?? [];
  if (Array.isArray(slug)) return getSection(slug[0]);
}

export function HanzoDocsIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: getMenuBarSVG() }}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    />
  );
}
