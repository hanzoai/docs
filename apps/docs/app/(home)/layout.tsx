import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layouts/shared';
import { MeetHanzo } from '@/components/meet-hanzo';
import { HanzoAppLauncher, HanzoPreFooterCTA } from '@hanzogui/shell';
import { Footer } from '@/components/footer';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <HomeLayout
        {...baseOptions()}
        themeSwitch={{ enabled: false }}
        links={[
          ...linkItems,
          {
            type: 'custom',
            secondary: true,
            on: 'nav',
            children: <MeetHanzo />,
          },
          {
            type: 'custom',
            secondary: true,
            on: 'nav',
            children: (
              <HanzoAppLauncher
                currentApp="docs"
                quickSwitchKey={false}
                label="Meet Hanzo apps"
              />
            ),
          },
        ]}
        className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
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
      </HomeLayout>
      <HanzoPreFooterCTA surface="hanzo.ai" />
      <Footer />
    </>
  );
}
