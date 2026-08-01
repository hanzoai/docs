'use client';

import type { ComponentProps } from 'react';
import { useDocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { MeetHanzo } from '@/components/meet-hanzo';
import { cn } from '@/lib/cn';
import { DocsNavLinks } from '@/components/docs-nav-links';
import { AuthButtons } from '@/components/auth-buttons';

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
      {/* Mobile only. The sidebar renders this same `navTitle` slot at its top, and
          the sidebar is visible from md up — so on desktop the wordmark drew twice,
          once here and once six inches to the left. Below md the sidebar collapses
          into a drawer and this is the only place a wordmark can live, so it stays
          there rather than being dropped outright. */}
      {slots.navTitle && (
        <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold md:hidden" />
      )}

      <div className="flex flex-1 items-center">
        <DocsNavLinks />
      </div>

      {/* The right-hand rail. These are passed to DocsLayout as `links` with
          `on: 'nav'`, which the STOCK header renders — but this bar replaces that
          header, so anything not named here simply does not appear. That is how
          the site lost its Sign in and Console buttons: they were configured
          correctly and rendered by nobody. Named explicitly so the omission
          cannot happen silently again. */}
      <div className="flex items-center gap-2">
        {slots.searchTrigger && <slots.searchTrigger.sm hideIfDisabled className="p-2" />}
        {/* ONE ecosystem affordance, the same on every page. The home layout used to
            render BOTH this and <MeetHanzo>, which said the same thing twice and put an
            unlabeled grid icon next to a labelled menu; the inner pages then showed only
            the grid, so "where do I find the other products" had a different answer
            depending on which page you were on. MeetHanzo is the one kept: it is
            labelled, and it resolves a product to its DOCS page when we have one instead
            of bouncing the reader out to marketing. */}
        <MeetHanzo compact />
        <AuthButtons />
      </div>
    </header>
  );
}
