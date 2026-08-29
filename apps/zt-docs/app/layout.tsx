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
    template: '%s | Hanzo Zero Trust',
    default: 'Hanzo ZT - Zero Trust SDK Suite',
  },
  description: 'Zero-trust overlay networking SDKs with ZAP transport for 6 programming languages.',
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
        <Analytics product="zt-docs" />
      </Body>
    </html>
  );
}
