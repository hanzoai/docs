'use client';

import * as React from 'react';
import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function Accordions({ children }: { children: ReactNode }) {
  return <div style={{ margin: '1.25rem 0', borderTop: '1px solid var(--color-border, #333)' }}>{children}</div>;
}

export interface AccordionProps {
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: '1px solid var(--color-border, #333)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '1rem 0',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{title}</span>
        <ChevronDown
          size={16}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
      {open && (
        <div style={{ paddingBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-muted-foreground, #a1a1aa)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
