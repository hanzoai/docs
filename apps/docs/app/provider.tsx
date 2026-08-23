'use client';

import { RootProvider } from '@hanzo/docs-base-ui/provider/base';
import { Hanzo } from '@hanzo/ui';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const SearchDialog = dynamic(() => import('@/components/layouts/search'), {
  ssr: false,
});

// `<Hanzo>` is what makes a @hanzo/ui component render as anything at all: it
// carries gui's process-global config, its stylesheet, and the root theme gui
// throws without. Before it was here, this app declared @hanzo/ui and @hanzo/gui
// as dependencies and rendered zero gui classes — the same shape @zenlm/ui is in,
// where the markup names classes no rule ever defines.
//
// INSIDE RootProvider, not above it. Both manage a theme, and the one that wins
// has to be the one the reader can switch: fumadocs owns the toggle in the rail
// and writes `.dark` on <html>, so gui takes the fixed dark identity and the
// document class stays fumadocs' to set. Nesting the other way puts gui's theme
// context above a subtree that never reads it.
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
      <Hanzo theme="dark">{children}</Hanzo>
    </RootProvider>
  );
}
