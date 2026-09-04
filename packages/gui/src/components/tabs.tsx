'use client';

import * as React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  items?: string[];
  defaultValue?: string;
  defaultIndex?: number;
  groupId?: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ items, defaultValue, defaultIndex = 0, children, className }: TabsProps) {
  const initial = defaultValue || (items && items[defaultIndex]) || (items && items[0]) || '';
  const [activeTab, setActiveTab] = useState<string>(initial);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} style={{ margin: '1.5rem 0', borderRadius: '0.75rem', border: '1px solid var(--color-border, #333)', overflow: 'hidden' }}>
        {items && items.length > 0 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border, #333)', background: 'var(--color-surface-subtle, #18181b)' }}>
            {items.map((item) => {
              const isActive = activeTab === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveTab(item)}
                  style={{
                    padding: '0.625rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--color-primary, #3b82f6)' : '2px solid transparent',
                    color: isActive ? 'var(--color-foreground, #fff)' : 'var(--color-foreground-muted, #a1a1aa)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
        <div style={{ padding: '1rem', background: 'var(--color-surface, #09090b)' }}>
          {children}
        </div>
      </div>
    </TabsContext.Provider>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
}

export function Tab({ value, children }: TabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) return <div>{children}</div>;
  if (ctx.activeTab !== value) return null;
  return <div>{children}</div>;
}
