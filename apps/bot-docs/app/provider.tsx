'use client';

import { RootProvider } from '@hanzo/docs/ui/provider/base';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AISearch } from '@/components/ai/search';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
      <TooltipProvider>
        <AISearch>
          {children}
        </AISearch>
      </TooltipProvider>
    </RootProvider>
  );
}
