import * as React from 'react';
import type { ReactNode } from 'react';

export function DocsPage({ children, toc }: { children: ReactNode, toc?: any }) {
  return (
    <article style={{ maxWidth: '48rem', margin: '0 auto', padding: '2rem 1rem' }}>
      {children}
    </article>
  );
}

export function DocsBody({ children }: { children: ReactNode }) {
  return <div style={{ lineHeight: 1.7, fontSize: '1rem' }}>{children}</div>;
}

export function DocsTitle({ children }: { children: ReactNode }) {
  return <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{children}</h1>;
}

export function DocsDescription({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: '1.125rem', color: '#888', marginBottom: '1.5rem' }}>{children}</p>;
}
