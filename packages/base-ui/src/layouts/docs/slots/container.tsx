'use client';
import { cn } from '@/utils/cn';
import { useEffect, useState, type ComponentProps } from 'react';
import { useDocsLayout } from '..';

export function Container(props: ComponentProps<'div'>) {
  const { slots } = useDocsLayout();
  const { collapsed } = slots.sidebar?.useSidebar?.() ?? {};
  const [previousCollapsed, setPreviousCollapsed] = useState(collapsed);
  const isCollapseChanged = previousCollapsed !== collapsed;

  // will only set data attribute for an instant
  useEffect(() => {
    if (isCollapseChanged) setPreviousCollapsed(collapsed);
  }, [collapsed, isCollapseChanged]);

  return (
    <div
      id="nd-docs-layout"
      data-sidebar-collapsed={collapsed}
      data-column-changed={isCollapseChanged}
      {...props}
      style={
        {
          // THREE columns: the nav rail, the page, the table of contents. The
          // rails pin to the edges and everything between them is the page.
          //
          // There were five. The first and last were `minmax(min-content, 1fr)`
          // gutters that centred a band capped at --fd-layout-width, and the
          // sidebar AREA spanned the leading gutter as well as its own column —
          // so the wider the display, the wider the sidebar's column grew, while
          // the nav inside it stayed 232px and sat at the column's END. Measured
          // on docs.hanzo.ai: at 1920 the nav began 176.5px from the left edge,
          // at 2560 it began 496.5px in, and the space it left behind was inside
          // the sidebar's own card — a bordered, filled rail with nothing in the
          // left half of it. Every pixel the display gained went to that gap.
          //
          // The band was doing two jobs braided together: bounding the READING
          // MEASURE so lines do not run long, and bounding the layout so the
          // rails do not fly apart. The page container already owns the first
          // (`max-w-[900px]` on the docs page slot), so the only job left here
          // was the one that produced the gap. Dropping the gutters gives the
          // freed width to the page column, which is what it was taking from.
          //
          // Narrow viewports are untouched by construction: below the md
          // breakpoint --fd-sidebar-width is 0 and the sidebar is a drawer, and
          // --fd-toc-width is 0 until a toc exists, so both rails are already
          // zero-width and the page column was already the whole viewport.
          gridTemplate: `"sidebar header toc"
"sidebar toc-popover toc"
"sidebar main toc" 1fr / var(--fd-sidebar-col) minmax(0, 1fr) var(--fd-toc-width)`,
          '--fd-docs-row-1': 'var(--fd-banner-height, 0px)',
          '--fd-docs-row-2': 'calc(var(--fd-docs-row-1) + var(--fd-header-height))',
          '--fd-docs-row-3': 'calc(var(--fd-docs-row-2) + var(--fd-toc-popover-height))',
          '--fd-sidebar-col': collapsed ? '0px' : 'var(--fd-sidebar-width)',
          ...props.style,
        } as object
      }
      className={cn(
        'grid overflow-x-clip min-h-(--fd-docs-height) [--fd-docs-height:100dvh] [--fd-header-height:0px] [--fd-toc-popover-height:0px] [--fd-sidebar-width:0px] [--fd-toc-width:0px] data-[column-changed=true]:transition-[grid-template-columns]',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
