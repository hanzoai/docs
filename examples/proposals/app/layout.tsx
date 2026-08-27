import './global.css';
import '@hanzo/docs/ui/style.css';
import { RootProvider } from '@hanzo/docs/ui/provider/next';
import { ZenSans } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';
import type { ReactNode } from 'react';
import { SearchDialog } from '../components/search-dialog';
import { brand } from '../lib/config';

export const metadata = {
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [brand.shortName, 'proposals', 'governance', 'standards'],
  metadataBase: new URL(brand.baseUrl),
  openGraph: {
    title: brand.name,
    description: brand.description,
    type: 'website',
    siteName: brand.name,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={ZenSans.variable} suppressHydrationWarning>
      <body className="min-h-svh bg-fd-background font-sans antialiased">
        <RootProvider
          search={{
            enabled: false,
          }}
          theme={{
            enabled: true,
            defaultTheme: 'dark',
            storageKey: `${brand.shortName.toLowerCase()}-theme`,
          }}
        >
          <SearchDialog brand={brand} />
          <div className="relative flex min-h-svh flex-col bg-fd-background">
            {children}
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
