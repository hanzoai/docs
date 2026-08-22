'use client';

import type { ComponentProps } from 'react';
import { useDocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { useSidebar } from '@hanzo/docs-base-ui/components/sidebar/base';
import { cn } from '@/lib/cn';
import { DocsNavLinks } from '@/components/docs-nav-links';
import { OrgBadge } from '@/components/org-badge';
import { NavAccount } from '@/components/sidebar-account';
import { AgentActions } from '@/components/agent-actions';

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
  const { collapsed } = useSidebar();

  return (
    <header
      id="nd-subnav"
      data-transparent={isNavTransparent}
      {...props}
      className={cn(
        '[grid-area:header] sticky top-(--fd-docs-row-1) z-30 flex items-center gap-3 pe-2.5',
        // A COLLAPSED RAIL TAKES NO COLUMN, SO THIS BAR STARTS AT THE VIEWPORT EDGE.
        // container.tsx sets `--fd-sidebar-col: 0px` when collapsed, and the rail's
        // floating control is `fixed inset-s-4` at 66px wide — x∈[16,82] — at z-40,
        // above this bar's z-30. With a flat ps-4 the first nav item begins at x=16,
        // i.e. underneath it, which is what buried the leading link on the landing
        // page (the one route that opens collapsed). Reserve the control's footprint:
        // 88px clears 82 with a gap. The rail only exists in `full` mode, so below md
        // there is no control to clear and the padding stays 4.
        collapsed ? 'ps-4 md:ps-22' : 'ps-4 md:ps-8',
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
        <slots.navTitle
          className={cn(
            'inline-flex items-center gap-2.5 font-semibold',
            // Hidden on desktop only while the SIDEBAR is showing it — which it is
            // not when collapsed, and collapsed is exactly the landing page. Left
            // unconditional the front door rendered no wordmark at all: the rail
            // that owns it was off-screen and this copy was suppressed for a
            // neighbour that was not drawing.
            !collapsed && 'md:hidden',
          )}
        />
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
        {/* NO SEARCH HERE. The sidebar carries the search field itself, and the
            collapsed rail carries a search button beside its own toggle — so a
            third one on the far right was the same action offered twice on one
            screen, and the two were not even the same shape. Search lives where
            the tree lives. */}

        {/* The full-width account controls live at the foot of the sidebar: this
            row is a fixed 56px and "Get API Key" is the widest label on the
            page, so it was the control that reflowed to three lines and spilled
            out of the bar between 768 and 805px. A column can afford a long
            label; this row carries the short one instead, and only when the rail
            is not on screen to carry either. */}
        {/* One control for "hand this page to an agent", derived from the
            pathname so it works on every page. It replaced a Copy Markdown
            button and an Open menu buried under the title, plus a Copy prompt
            that existed only on the front page. */}
        <OrgBadge />
        {/* Shown exactly where the rail is not showing it: below md the rail is
            a drawer, and on desktop only while it is collapsed. Everywhere else
            the column version at the foot of the rail is the one control. */}
        <div className={cn(collapsed ? '' : 'md:hidden')}>
          <NavAccount />
        </div>
        {/* Last in the row, so it sits at the right edge where the reader's eye
            ends rather than in the middle of the trailing controls. */}
        <AgentActions />
      </div>
    </header>
  );
}
