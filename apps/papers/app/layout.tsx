import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import type { ReactNode } from 'react';

export const metadata = createMetadata({
  title: {
    template: '%s | Research Papers',
    default: 'Research Papers — Hanzo AI, Lux Network, Zoo Labs, Zen LM',
  },
  description:
    'Open-access research papers covering AI infrastructure, blockchain consensus, decentralized science, and frontier language models.',
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
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
