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
    template: '%s | Hanzo Platform',
    default: 'Hanzo Platform - Deploy Anywhere',
  },
  description: 'Deploy to Kubernetes, Docker Swarm, or bare VMs from one dashboard. Multi-cluster fleet management, git-powered builds, and real-time monitoring.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
    { media: '(prefers-color-scheme: light)', color: '#050505' },
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
      </Body>
      <script defer src="https://analytics.hanzo.ai/script.js" data-website-id="c8d2ce3a-8591-4f63-8920-b6ce0393dd1a" data-do-not-track="true" data-exclude-search="true" />
    </html>
  );
}
