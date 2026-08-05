'use client';

import { RootProvider } from '@hanzo/docs-base-ui/provider/base';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const SearchDialog = dynamic(() => import('@/components/layouts/search'), {
  ssr: false,
});

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog,
      }}
      theme={{
        defaultTheme: 'dark',
        enableSystem: false,
      }}
    >
      {children}
    </RootProvider>
  );
}
