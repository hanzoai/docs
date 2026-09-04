import * as React from 'react';
import type { ReactNode } from 'react';

export interface DocsLayoutProps {
  tree?: any;
  nav?: any;
  children: ReactNode;
}

export function DocsLayout({ children, nav }: DocsLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--color-background, #000)', color: 'var(--color-foreground, #fff)' }}>
      {nav && <header style={{ height: '3.5rem', borderBottom: '1px solid var(--color-border, #222)', display: 'flex', alignItems: 'center', padding: '0 1.5rem' }}>{nav}</header>}
      <main style={{ flex: 1, display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
