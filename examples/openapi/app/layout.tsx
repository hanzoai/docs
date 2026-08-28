import { RootProvider } from '@hanzo/docs/ui/provider/next';
import './global.css';
import { Zen, ZenMono } from '@hanzo/font';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${Zen.className} ${ZenMono.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
