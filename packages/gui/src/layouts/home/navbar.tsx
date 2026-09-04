import * as React from 'react';
import type { ReactNode } from 'react';

export function Navbar({ children }: { children?: ReactNode }) {
  return (
    <nav style={{ height: '3.5rem', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 1.5rem' }}>
      {children}
    </nav>
  );
}
