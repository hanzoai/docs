'use client';

import { RootProvider } from '@hanzo/docs/ui/provider/base';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      {children}
    </RootProvider>
  );
}
