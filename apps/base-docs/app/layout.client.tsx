'use client';

import type { ReactNode } from 'react';

export function Body({ children }: { children: ReactNode }) {
  return <body className="flex min-h-screen flex-col">{children}</body>;
}
