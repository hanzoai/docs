import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { getSection } from '@/lib/source/navigation';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { ProjectSwitcher } from '@/components/projects/project-switcher';
import { AuthButtons } from '@/components/auth-buttons';
import { TryHanzoDropdown } from '@/components/try-hanzo-dropdown';
import { Footer } from '@/components/footer';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const base = baseOptions();

  return (
    <>
      <DocsLayout
        {...base}
        tree={source.getPageTree()}
        links={[
          ...linkItems.filter((item) => item.type === 'icon'),
          {
            type: 'custom',
            on: 'nav',
            children: <TryHanzoDropdown />,
          },
          {
            type: 'custom',
            on: 'nav',
            children: <AuthButtons />,
          },
        ]}
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

        <AISearch>
          <AISearchPanel />
          <AISearchTrigger
            position="float"
            className={cn(
              buttonVariants({
                variant: 'secondary',
                className: 'text-fd-muted-foreground rounded-2xl',
              }),
            )}
          >
            <MessageCircleIcon className="size-4.5" />
            Ask AI
          </AISearchTrigger>
        </AISearch>
      </DocsLayout>
      <Footer />
    </>
  );
}
