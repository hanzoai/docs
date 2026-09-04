import * as React from 'react';
import type { ReactNode } from 'react';
import { Folder as FolderIcon, File as FileIcon } from 'lucide-react';

export function Files({ children }: { children: ReactNode }) {
  return (
    <div style={{ margin: '1rem 0', padding: '0.75rem', border: '1px solid var(--color-border, #333)', borderRadius: '0.5rem', background: '#111' }}>
      {children}
    </div>
  );
}

export function Folder({ name, children, defaultOpen = true }: { name: string, children: ReactNode, defaultOpen?: boolean }) {
  return (
    <div style={{ margin: '0.25rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>
        <FolderIcon size={16} />
        <span>{name}</span>
      </div>
      <div style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
        {children}
      </div>
    </div>
  );
}

export function File({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0', fontSize: '0.875rem', color: '#aaa' }}>
      <FileIcon size={14} />
      <span>{name}</span>
    </div>
  );
}
