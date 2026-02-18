import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import type { ReactNode } from 'react';

export const metadata = createMetadata({
  title: {
    template: '%s | Zen LM',
    default: 'Zen LM - Open Foundation Models',
  },
  description: 'Zen AI model family documentation. Consumer, Coder, Vision-Language, and Max tiers from 0.6B to 671B parameters by Zen LM and Hanzo AI.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
