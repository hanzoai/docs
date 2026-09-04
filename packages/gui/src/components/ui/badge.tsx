import * as React from 'react';
import type { HTMLAttributes } from 'react';

export function Badge({ children, style, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '9999px',
        background: '#27272a',
        color: '#e4e4e7',
        border: '1px solid #3f3f46',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
