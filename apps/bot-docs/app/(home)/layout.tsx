import type { ReactNode } from 'react';
import { HomeLayout } from '@hanzo/docs/ui/layouts/home';
import { baseOptions, linkItems, logo } from '@/lib/layout.shared';
import { AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions()}
      links={linkItems}
      nav={{
        title: (
          <>
            {logo}
            <span className="font-bold">Hanzo Bot</span>
          </>
        ),
      }}
    >
      {children}

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
    </HomeLayout>
  );
}
