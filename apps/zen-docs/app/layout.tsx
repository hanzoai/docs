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
  description: 'Zen AI model family by Hanzo AI. 14 frontier models from 4B to 1T+ parameters for code, reasoning, vision, and multimodal tasks.',
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
      <head>
        {/* Hanzo Analytics */}
        <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="14444591-8be2-4a23-84a3-04a2124e539b" data-do-not-track="true" data-exclude-search="true" />
      </head>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
