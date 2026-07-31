import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { DocsNavbar } from '@/components/docs-navbar';
import { baseOptions, logo } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { getSection } from '@/lib/source/navigation';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { ProjectSwitcher } from '@/components/projects/project-switcher';
import { AuthButtons } from '@/components/auth-buttons';
import { MeetHanzo } from '@/components/meet-hanzo';
import { HanzoAppLauncher } from '@hanzogui/shell';
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
        links={[
          // Only the custom `on: 'nav'` items belong here. The four developer
          // surfaces used to be spread in as well, which put API/CLI/MCP/SDKs at
          // the top of the SIDEBAR — the same four the top bar already shows, two
          // inches away. That cost four rows of the one screen the sidebar gets,
          // to repeat what was already on screen. DocsNavbar renders linkItems in
          // the bar; the sidebar is for the tree.
          {
            type: 'custom',
            on: 'nav',
            children: <MeetHanzo />,
          },
          {
            type: 'custom',
            on: 'nav',
            children: (
              <HanzoAppLauncher
                currentApp="docs"
                quickSwitchKey={false}
                label="Meet Hanzo apps"
              />
            ),
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
