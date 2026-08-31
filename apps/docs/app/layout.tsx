// Brand tokens (monochrome --hanzo-*, --font-size-*, --z-*) load first so the
// Fumadocs theme + Tailwind layers in global.css can override where they meet.
import '@hanzo/brand/styles/variables.css';
import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Zen, ZenMono } from '@hanzo/font';
import { TreeContextProvider } from '@hanzo/docs/ui/contexts/tree';
import { source } from '@/lib/source';
import { NextProvider } from '@hanzo/docs/core/framework/next';
import { Analytics } from '@hanzo/docs-analytics';
import { AppearanceDock } from '@/components/appearance-dock';

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Docs',
    default: 'Hanzo — Documentation',
  },
  description:
    'Documentation for Hanzo AI Cloud — every model, every tool, one key.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${Zen.variable} ${ZenMono.variable}`} suppressHydrationWarning>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
        <Analytics product="docs" />
        {/*
          Help and appearance, bottom-right — the same corner control hanzo.ai
          carries. The Hanzo Edit launcher used to hold this corner; it is an
          authoring tool on a published page, and hanzo.ai dropped it for the
          same reason. A reader of the docs edits them in the repo.
        */}
        <AppearanceDock />
      </Body>
    </html>
  );
}
