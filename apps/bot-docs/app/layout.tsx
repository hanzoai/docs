// Brand tokens load before the app's own sheet so the theme can override
// where the two meet.
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

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Bot',
    default: 'Hanzo Bot — Your AI Team in a Box',
  },
  description: 'One bot. Every role. Every channel. Full-blown computer-using AI agent that runs free on your Mac or deploys to the cloud starting at $5/mo.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${Zen.variable} ${ZenMono.variable}`} suppressHydrationWarning>
      <head>
        <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="89cb4513-3384-491f-8eba-c393d51a16ef" data-do-not-track="true" data-exclude-search="true" />
      </head>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
        <Analytics product="bot-docs" />
      </Body>
    </html>
  );
}
