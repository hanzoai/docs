import './global.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hanzo Cloud — AI Infrastructure Platform',
  description:
    'Unified AI infrastructure platform. LLM gateway, usage analytics, team management, and API key provisioning.',
  openGraph: {
    title: 'Hanzo Cloud — AI Infrastructure Platform',
    description:
      'Unified AI infrastructure platform with LLM gateway, analytics, and team management.',
    url: 'https://cloud.hanzo.ai',
    siteName: 'Hanzo Cloud',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hanikidev',
    creator: '@hanikidev',
  },
  metadataBase: new URL('https://cloud.hanzo.ai'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} dark`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
