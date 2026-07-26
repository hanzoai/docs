// Brand tokens (monochrome --hanzo-*, --font-size-*, --z-*) load first so the
// Fumadocs theme + Tailwind layers in global.css can override where they meet.
import '@hanzo/brand/styles/variables.css';
import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { TreeContextProvider } from '@hanzo/docs/ui/contexts/tree';
import { source } from '@/lib/source';
import { NextProvider } from '@hanzo/docs/core/framework/next';
import { Analytics } from '@hanzo/docs-analytics';

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Docs',
    default: 'Hanzo — Documentation',
  },
  description:
    'Documentation for Hanzo AI Cloud — 33 services, one API key, one gateway.',
  metadataBase: baseUrl,
});

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} suppressHydrationWarning>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
        <Analytics product="docs" />
      </Body>
      {/*
        No Hanzo Edit widget here. Its shadow-DOM FAB is fixed at right/bottom
        16px with z-index 2147483000 — the exact corner fumadocs floats "Ask AI"
        into — so it painted over that button and the label read as "As". Both
        jobs it offered are already served natively and in-page: asking the AI is
        the "Ask AI" float (wired to the docs index), and improving a page is the
        per-page ViewOptionsPopover (edit-on-GitHub + copy-as-markdown). One
        launcher per corner, one way to each job.
      */}
    </html>
  );
}
