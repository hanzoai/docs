import './global.css';
import 'katex/dist/katex.min.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { RootProvider } from '@fumadocs/base-ui/provider/next';
import type { ReactNode } from 'react';

export const metadata = createMetadata({
  title: {
    template: '%s | Pulsar',
    default: 'Pulsar — Threshold ML-DSA-65',
  },
  description:
    'A 2-round threshold ML-DSA-65 signing and DKG system whose per-party-aggregated signature is bit-identical to a single-party FIPS 204 signature. NIST MPTC Class N1 + N4 submission package by Lux Industries.',
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
      </body>
    </html>
  );
}
