'use client';

import type { ComponentProps } from 'react';
import { useDocsLayout } from '../client';
import { cn } from '@/utils/cn';
import { SidebarIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function Header(props: ComponentProps<'header'>) {
  const {
    isNavTransparent,
    slots,
    props: { nav },
  } = useDocsLayout();

  if (nav?.component) return nav.component;
  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      // Four tracks: wordmark, nav, search, sidebar toggle. The nav track is the
      // one that stretches, which `flex` reached by putting `flex-1` on a
      // wrapper; a track says it once and the wrapper stops being load-bearing.
      className={cn(
        '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center ps-4 pe-2.5 border-b transition-colors backdrop-blur-sm h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] data-[transparent=false]:bg-fd-background/80',
        props.className,
      )}
    >
      {/* Every cell is emitted even when its slot is empty. A track list counts
          items, so an absent LEADING slot slides each later one a track to the
          left — the search trigger lands in the stretch track and the toggle
          stops being at the right edge. An empty cell in an `auto` track is
          zero wide and costs nothing. */}
      {slots.navTitle ? (
        <slots.navTitle className="inline-grid grid-flow-col items-center gap-2.5 font-semibold" />
      ) : (
        <span />
      )}
      <div>{nav?.children}</div>
      {slots.searchTrigger ? (
        <slots.searchTrigger.sm hideIfDisabled className="p-2" />
      ) : (
        <span />
      )}
      {slots.sidebar ? (
        <slots.sidebar.trigger
          className={cn(
            buttonVariants({
              color: 'ghost',
              size: 'icon-sm',
              className: 'p-2',
            }),
          )}
        >
          <SidebarIcon />
        </slots.sidebar.trigger>
      ) : (
        <span />
      )}
    </header>
  );
}
