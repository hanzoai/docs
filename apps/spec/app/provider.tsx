'use client';

import { RootProvider } from 'fumadocs-ui/ui/provider/base';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ defaultTheme: 'dark', enableSystem: false }}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </RootProvider>
  );
}
