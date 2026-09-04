import * as React from 'react';
import type { HTMLAttributes } from 'react';

export function CodeBlock({ children, style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      style={{
        margin: '1.25rem 0',
        borderRadius: '0.75rem',
        border: '1px solid var(--color-border, #333)',
        overflow: 'hidden',
        background: 'var(--color-code-bg, #0d0d0f)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Pre({ children, style, ...props }: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      {...props}
      style={{
        margin: 0,
        padding: '1rem',
        overflowX: 'auto',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        fontFamily: 'monospace',
        ...style,
      }}
    >
      {children}
    </pre>
  );
}
