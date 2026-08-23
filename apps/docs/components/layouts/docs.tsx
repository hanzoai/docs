import type { ReactNode } from 'react';
import { DocsLayout, type DocsLayoutProps } from '@hanzo/docs-base-ui/layouts/docs';
import { DocsNavbar } from '@/components/docs-navbar';
import { Brand } from '@/components/brand';
import { baseOptions } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { getSection } from '@/lib/source/navigation';
import { SidebarSearch } from '@/components/sidebar-search';
import { SidebarAccount } from '@/components/sidebar-account';

// The documentation chrome: navbar, page tree, sidebar filter.
//
// TWO routes mount it — /docs/** and the landing page at / — so it lives here
// rather than in either layout.tsx. Copying it would give the site two page
// trees and two sidebar banners that agree only until someone edits one of
// them, and the pieces below (the `never` cast, the tab colours) are exactly
// the kind of detail that drifts silently.
//
// What a caller may vary is what is NOT spread over: the tree, the slots, the
// nav title and the sidebar's CONTENT are fixed here, everything else in
// DocsLayoutProps passes through. The one exception is the rail's starting
// state, which is genuinely per-route — / opens collapsed, /docs/** does not —
// so it is threaded as a narrow prop rather than by reopening `sidebar` whole.
// Typed to that single field on purpose: nobody can clobber the banner or tabs.
export function Docs({
  children,
  sidebar,
  ...props
}: Omit<DocsLayoutProps, 'tree' | 'slots' | 'nav' | 'sidebar' | 'children'> & {
  children: ReactNode;
  sidebar?: Pick<NonNullable<DocsLayoutProps['sidebar']>, 'defaultCollapsed'>;
}) {
  const base = baseOptions();

  return (
    <DocsLayout
      {...base}
      {...props}
      // Desktop top bar. The stock slot is md:hidden, so doc pages had no header
      // and the API/CLI/MCP/SDKs nav had nowhere to render. DocsNavbar is a client
      // MODULE — an inline function here crashes the server at the RSC boundary.
      slots={{ header: DocsNavbar }}
      tree={source.getPageTree()}
      nav={{
        ...base.nav,
        // The mark and the wordmark are alternatives, not a pair — see Brand.
        title: <Brand />,
      }}
      sidebar={{
        prefetch: false,
        // The tree shows 12 rows so it fits one screen; the filter is how a
        // reader reaches the ~1,600 pages it does not list. Titles and paths are
        // computed here, on the server, from the same source the tree comes from.
        //
        // The filter is the only thing here. A product switcher sat above it and
        // answered the same question worse: it listed sections a reader could
        // already see in the tree, and typing reaches any of them plus every page
        // inside them.
        banner: <SidebarSearch />,
        // Who you are, at the foot of the rail. The top bar is a fixed 56px row
        // and these are the widest labels on the page; a column can afford them.
        footer: <SidebarAccount />,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;
            const color = `var(--${getSection(meta.path)}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
        ...sidebar,
      }}
    >
      {children}
    </DocsLayout>
  );
}
