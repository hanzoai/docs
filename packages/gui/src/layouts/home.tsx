import * as React from 'react';
import type { ReactNode } from 'react';

export function HomeLayout({ children, nav }: { children: ReactNode, nav?: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff' }}>
      {nav}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
