'use client';

import { useSidebar } from '@hanzo/docs-base-ui/components/sidebar/base';

import { HanzoDocsIcon } from '@/app/layout.client';

/**
 * The name at the top left.
 *
 * ONE slot renders in two places — the sidebar's own header while it is open,
 * and the top bar once it collapses (docs-navbar.tsx suppresses its copy while
 * the rail is drawing one). So this reads the same collapse state both do and
 * shows the form that fits the space it is actually in:
 *
 *   open       the wordmark alone. It is the full name and there is room for it,
 *              and setting the mark beside it says the same thing twice.
 *   collapsed  the mark alone. The rail is a strip; a wordmark does not fit one,
 *              and the mark is what a reader recognises at that size.
 *
 * It is "Hanzo AI" and not "Hanzo" because that is the company's name. The
 * shorter form reads as a product on a page that is documenting several.
 */
export function Brand({ className }: { className?: string }) {
  const { collapsed } = useSidebar();
  return collapsed ? (
    <HanzoDocsIcon className={className ?? 'size-5'} />
  ) : (
    <span className="font-medium">Hanzo AI</span>
  );
}
