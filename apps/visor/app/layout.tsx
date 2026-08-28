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

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Visor',
    default: 'Hanzo Visor — Virtual Machine Management',
  },
  description: 'Launch and manage VMs across AWS, DigitalOcean, and Hetzner. Browser terminal, block storage, multi-cloud.',
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
        <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="PLACEHOLDER" />
      </head>
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree()}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
