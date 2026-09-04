import * as React from 'react';

export function InlineTOC({ items }: { items?: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav style={{ padding: '0.75rem', border: '1px solid #333', borderRadius: '0.5rem', margin: '1rem 0' }}>
      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>On this page</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((it: any) => (
          <li key={it.url} style={{ margin: '0.25rem 0' }}>
            <a href={it.url} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem' }}>{it.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
