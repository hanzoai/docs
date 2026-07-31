import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { DocsNavbar } from '@/components/docs-navbar';
import { baseOptions, logo } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { getSection } from '@/lib/source/navigation';
import { ProjectSwitcher } from '@/components/projects/project-switcher';
import { Footer } from '@/components/footer';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();

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
          banner: <ProjectSwitcher />,
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
