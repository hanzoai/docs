import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { DocsNavbar } from '@/components/docs-navbar';
import { baseOptions, logo } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { getSection } from '@/lib/source/navigation';
import { ProjectSwitcher } from '@/components/projects/project-switcher';
import { SidebarFilter } from '@/components/sidebar-filter';
import { Footer } from '@/components/footer';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();
  // Title + path for every page, for the sidebar filter.
  //
  // The element type is annotated because `source`'s methods resolve to `never`
  // in THIS file specifically — the same reason getNodeMeta(node).path errors
  // below, which predates this and is untouched. sitemap.ts calls the identical
  // getPages() against the identical import and types fine, so it is a resolution
  // quirk local to this module, not a wrong shape. Verified at runtime: the
  // filter renders and matches.
  const filterPages: [string, string][] = (
    source.getPages() as unknown as { url: string; data: { title?: string } }[]
  ).map((page) => [page.url, page.data.title ?? page.url]);

  return (
    <>
      <DocsLayout
        {...base}
        // Desktop top bar. The stock slot is md:hidden, so doc pages had no header
        // and the API/CLI/MCP/SDKs nav had nowhere to render. DocsNavbar is a client
        // MODULE — an inline function here crashes the server at the RSC boundary.
        slots={{ header: DocsNavbar }}
        tree={source.getPageTree()}
        nav={{
          ...base.nav,
          title: (
            <>
              {logo}
              <span className="font-medium max-md:hidden">Hanzo</span>
            </>
          ),
        }}
        sidebar={{
          prefetch: false,
          // The tree shows 12 rows so it fits one screen; the filter is how a
          // reader reaches the ~1,600 pages it does not list. Titles and paths are
          // computed here, on the server, from the same source the tree comes from.
          banner: (
            <>
              <ProjectSwitcher />
              <SidebarFilter pages={filterPages} />
            </>
          ),
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
        }}
      >
        {children}
      </DocsLayout>
      <Footer />
    </>
  );
}
