import { DocsLayout } from '@hanzo/docs-base-ui/layouts/docs';
import { baseOptions, linkItems, logo } from '@/components/layouts/shared';
import { source } from '@/lib/source';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
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
