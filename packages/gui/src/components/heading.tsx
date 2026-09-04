import * as React from 'react';
import type { ComponentPropsWithoutRef } from 'react';

export function Heading({ as: Tag = 'h2', children, ...props }: { as?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6' } & ComponentPropsWithoutRef<'h2'>) {
  return (
    <Tag {...props} style={{ scrollMarginTop: '5rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
      {children}
    </Tag>
  );
}
