import { RootProvider } from '@hanzo/docs/ui/provider/next';
import '@hanzo/docs/ui/style.css';
import { Zen } from '@hanzo/font';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={Zen.className} suppressHydrationWarning>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
