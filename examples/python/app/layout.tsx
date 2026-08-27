import './global.css';
import { RootProvider } from '@hanzo/docs/ui/provider/next';
import { ZenSans } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={ZenSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
