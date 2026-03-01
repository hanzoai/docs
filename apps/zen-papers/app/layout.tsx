import './global.css';
import type { ReactNode } from 'react';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';

export const metadata = {
  title: 'Zen LM — Research Papers',
  description:
    'Technical whitepapers for the Zen model family. Frontier AI models from 600M to 1T+ parameters, co-developed by Hanzo AI and Zoo Labs.',
  metadataBase: new URL('https://papers.zenlm.org'),
  openGraph: {
    title: 'Zen LM — Research Papers',
    description:
      'Technical whitepapers for the Zen model family.',
    url: 'https://papers.zenlm.org',
    siteName: 'Zen Papers',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Zen LM — Research Papers',
    description: 'Technical whitepapers for the Zen model family.',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider theme={{ forcedTheme: 'dark' }}>{children}</RootProvider>
      </body>
    </html>
  );
}
