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
    'Documentation for Hanzo AI Cloud — every model, every tool, one key.',
  metadataBase: baseUrl,
  // Hanzo Edit convention: a page self-declares its source so the widget can
  // resolve the file under the current route and open a PR against it. Repo-wide
  // default; a route that maps 1:1 to a file may add `hanzo:path` of its own.
  other: {
    'hanzo:repo': 'hanzo-docs/docs',
    'hanzo:branch': 'main',
    'hanzo:provider': 'github',
  },
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
        {/*
          Hanzo Edit — the same widget every other Hanzo app carries, served by
          hanzo.app. It was kept out of this app because its shadow-DOM FAB pins
          to right/bottom 16px at z-index 2147483000, the exact corner fumadocs
          floated "Ask AI" into: the two overlapped and the label read as "As".
          That was a corner collision, not a reason to run a second chat surface —
          so Ask AI is gone and this is the one launcher in that corner. Reads the
          hanzo:repo/branch/provider metas above and resolves the file under the
          current route itself.
        */}
        <script async src="https://hanzo.app/edit.js" />
      </Body>
    </html>
  );
}
