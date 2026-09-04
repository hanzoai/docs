import * as React from 'react';
import type { ReactNode } from 'react';

export function Banner({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '0.5rem 1rem', background: 'var(--color-primary, #3b82f6)', color: '#fff', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}>
      {children}
    </div>
  );
}
