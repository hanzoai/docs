import * as React from 'react';
import type { ReactNode } from 'react';

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div style={{ margin: '1.5rem 0', paddingLeft: '1.5rem', borderLeft: '2px solid var(--color-border, #333)' }}>
      {children}
    </div>
  );
}

export function Step({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      {children}
    </div>
  );
}
