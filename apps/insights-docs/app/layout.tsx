import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import type { ReactNode } from 'react';

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
        <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="ebdee691-6316-4b97-ba48-bc6b914e2d20" data-do-not-track="true" data-exclude-search="true" />
      </body>
    </html>
  );
}
