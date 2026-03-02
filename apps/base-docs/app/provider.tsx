'use client';

import { RootProvider } from '@hanzo/docs/ui/provider/base';
import type { ReactNode } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </RootProvider>
  );
}
