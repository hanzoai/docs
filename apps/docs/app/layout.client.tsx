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
  // The mark arrives as markup, and `getMenuBarSVG()` carries a viewBox with no
  // width, height or class of its own. An <svg> sized that way does not obey the
  // box it is dropped into, so at `size-5` it painted past its 20px on both axes:
  // sideways over the wordmark's gap, so the two read as one glued word, and
  // downward past its own centre line, so `items-center` centred a box the mark
  // had already left. Sizing it to the box is what makes the row's gap and
  // centring apply to the thing you can see.
  return (
    <div
      className={cn('[&>svg]:size-full', className)}
      dangerouslySetInnerHTML={{ __html: getMenuBarSVG() }}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    />
  );
}
