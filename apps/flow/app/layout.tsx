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
  title: 'Hanzo Flow — Visual AI Workflow Builder',
  description:
    'Build, test, and deploy AI-powered workflows visually. Drag-and-drop interface with 100+ components, built-in API server, and MCP support.',
  openGraph: {
    title: 'Hanzo Flow — Visual AI Workflow Builder',
    description:
      'Build, test, and deploy AI-powered workflows visually. Drag-and-drop interface with 100+ components, built-in API server, and MCP support.',
    url: 'https://flow.hanzo.ai',
    siteName: 'Hanzo Flow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hanikidev',
    creator: '@hanikidev',
  },
  metadataBase: new URL('https://flow.hanzo.ai'),
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
      <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="811b5039-8438-453a-9c8a-e1f4cff05353" data-do-not-track="true" data-exclude-search="true" />
    </html>
  );
}
