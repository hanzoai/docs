import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import type { ReactNode } from 'react';
import { Analytics } from '@hanzo/docs-analytics';

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Insights',
    default: 'Hanzo Insights — Product Analytics Platform',
  },
  description: 'Self-hosted product analytics with event tracking, feature flags, session replay, A/B testing, and more. Open source, privacy-first, built by Hanzo AI.',
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
        <Analytics product="insights-docs" />
      </body>
    </html>
  );
}
