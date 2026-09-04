'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';

export interface CalloutProps {
  type?: 'info' | 'warn' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const configs = {
    info: {
      border: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.08)',
      icon: <Info size={18} color="#3b82f6" />,
    },
    warn: {
      border: '#eab308',
      bg: 'rgba(234, 179, 8, 0.08)',
      icon: <AlertTriangle size={18} color="#eab308" />,
    },
    error: {
      border: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      icon: <AlertCircle size={18} color="#ef4444" />,
    },
  };

  const c = configs[type] || configs.info;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1rem',
        margin: '1.25rem 0',
        borderRadius: '0.75rem',
        border: `1px solid ${c.border}`,
        backgroundColor: c.bg,
        color: 'inherit',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>{c.icon}</div>
      <div style={{ flexGrow: 1 }}>
        {title && <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>}
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}
