'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function Body({ children }: { children: ReactNode }) {
  return (
    <body className="antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  );
}
