import './global.css';
import { RootProvider } from '@hanzo/docs/ui/provider/next';
import { Zen } from '@hanzo/font';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={Zen.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
