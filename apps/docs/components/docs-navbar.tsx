'use client';

import type { ComponentProps } from 'react';
import { useDocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { cn } from '@/lib/cn';
import { DocsNavLinks } from '@/components/docs-nav-links';

// The top bar on doc pages.
//
// DocsLayout ships its header slot as `md:hidden`: on desktop it puts the wordmark
// and search in the SIDEBAR and renders no bar at all. That is why the
// API/CLI/MCP/SDKs nav shows on the landing page and disappears the moment you open
// a doc — there was no bar to put it in.
//
// This replaces the slot rather than wrapping it, for a concrete reason. The stock
// Header renders its middle track from `nav?.children`, but layouts/docs/client.tsx
// DESTRUCTURES `nav` out of the props before spreading the rest into context:
//
//     nav: { enabled: navEnabled = true, transparentMode: ... } = {},
//     ...
//     props: { tabMode, tabs, ...baseProps }
//
// so `useDocsLayout().props.nav` is always undefined. Passing nav.children — or
// nav.component, which the stock Header checks first — reaches nothing. Measured,
// not assumed: the bar rendered with md:flex and an empty middle track.
//
// The shell below mirrors the stock slot's classes so it sits in the same grid area
// with the same height and sticky offset; only `md:hidden` is dropped and the middle
// track is ours. Search and the sidebar trigger still come from the layout's own
// slots, so they keep their behaviour.
export function DocsNavbar(props: ComponentProps<'header'>) {
  const { isNavTransparent, slots } = useDocsLayout();

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      className={cn(
        '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center gap-3 ps-4 pe-2.5',
        'border-b transition-colors backdrop-blur-sm h-(--fd-header-height)',
        // The height variable is only declared under max-md upstream, because the bar
        // is not expected on desktop. Without it the grid row collapses to zero and
        // the bar renders clipped over the content.
        'max-md:layout:[--fd-header-height:--spacing(14)] md:[--fd-header-height:--spacing(14)]',
        'data-[transparent=false]:bg-fd-background/80',
        props.className,
      )}
    >
      {slots.navTitle && (
        <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
      )}

      <div className="flex flex-1 items-center">
        <DocsNavLinks />
      </div>

      {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
    </header>
  );
}
