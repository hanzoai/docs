import './global.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@hanzo/docs-analytics';

export const metadata: Metadata = {
  title: 'Hanzo Team — Project Management & Collaboration',
  description:
    'All-in-one project management, issue tracking, knowledge base, and real-time collaboration for modern teams.',
  openGraph: {
    title: 'Hanzo Team — Project Management & Collaboration',
    description:
      'All-in-one project management with issue tracking, knowledge base, and real-time collaboration.',
    url: 'https://hanzo.team',
    siteName: 'Hanzo Team',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hanikidev',
    creator: '@hanikidev',
  },
  metadataBase: new URL('https://hanzo.team'),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Analytics product="team-docs" />
      </body>
    </html>
  );
}
