'use client';

import * as React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import Link from '@hanzo/docs-core/link';

export function Cards({ children, className, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        margin: '1.5rem 0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
};

export function Card({ icon, title, description, href, children, style, className, ...props }: CardProps) {
  const isLink = Boolean(href);
  const Component = isLink ? (Link as any) : 'div';

  return (
    <Component
      {...props}
      href={href}
      className={className}
      style={{
        display: 'block',
        padding: '1.25rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--color-border, #27272a)',
        background: 'var(--color-card, #121214)',
        color: 'var(--color-card-foreground, #f4f4f5)',
        textDecoration: 'none',
        transition: 'background 0.15s ease, border-color 0.15s ease',
        ...style,
      }}
    >
      {icon && (
        <div style={{ marginBottom: '0.75rem', width: 'fit-content', padding: '0.5rem', borderRadius: '0.5rem', background: 'var(--color-muted, #27272a)' }}>
          {icon}
        </div>
      )}
      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>
      {description && <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted-foreground, #a1a1aa)' }}>{description}</p>}
      {children && <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{children}</div>}
    </Component>
  );
}
