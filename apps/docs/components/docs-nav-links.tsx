'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { linkItems } from '@/components/layouts/shared';

// The four developer surfaces, rendered INSIDE the docs top bar.
//
// The header slot lays out: navTitle, then `nav.children` in a flex-1 track, then
// the search trigger. `links` never reaches it — those render in the sidebar — so a
// nav row has to be handed in as nav.children or it simply does not exist on doc
// pages. This is that row.
//
// Sourced from the same `linkItems` the landing page uses, so the two bars cannot
// drift: add a surface once and it appears in both.
export function DocsNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 max-md:hidden">
      {linkItems
        .filter((item) => item.type !== 'icon' && 'url' in item)
        .map((item) => {
          const url = String((item as { url: string }).url);
          // `nested-url` semantics: /docs/api is active on /docs/api/anything, so a
          // reader deep in a section can still see which surface they are in.
          const active = pathname === url || pathname.startsWith(`${url}/`);

          return (
            <Link
              key={url}
              href={url}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                active
                  ? 'text-fd-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground',
              )}
            >
              {String((item as { text: string }).text)}
            </Link>
          );
        })}
    </nav>
  );
}
