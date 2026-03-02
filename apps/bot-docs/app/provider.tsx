'use client';

import { RootProvider } from '@hanzo/docs/ui/provider/base';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AISearch } from '@/components/ai/search';

const SearchDialog = dynamic(() => import('@/components/layouts/search'), {
  ssr: false,
});

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{ defaultTheme: 'dark', enableSystem: false }}
    >
      <TooltipProvider>
        <AISearch>
          {children}
        </AISearch>
      </TooltipProvider>
    </RootProvider>
  );
}
