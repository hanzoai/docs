import * as React from 'react';

export interface TypeTableProps {
  type: Record<
    string,
    {
      description?: string;
      type: string;
      default?: string;
      required?: boolean;
    }
  >;
}

export function TypeTable({ type }: TypeTableProps) {
  return (
    <div style={{ overflowX: 'auto', margin: '1.25rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border, #333)' }}>
            <th style={{ padding: '0.5rem 1rem' }}>Prop</th>
            <th style={{ padding: '0.5rem 1rem' }}>Type</th>
            <th style={{ padding: '0.5rem 1rem' }}>Default</th>
            <th style={{ padding: '0.5rem 1rem' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(type).map(([name, item]) => (
            <tr key={name} style={{ borderBottom: '1px solid var(--color-border, #222)' }}>
              <td style={{ padding: '0.5rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>{name}</td>
              <td style={{ padding: '0.5rem 1rem', fontFamily: 'monospace', color: 'var(--color-primary, #3b82f6)' }}>{item.type}</td>
              <td style={{ padding: '0.5rem 1rem', fontFamily: 'monospace', color: 'var(--color-muted-foreground, #888)' }}>{item.default || '-'}</td>
              <td style={{ padding: '0.5rem 1rem' }}>{item.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
