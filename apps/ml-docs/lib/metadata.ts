import type { Metadata } from 'next';

export const baseUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.hanzo.bot',
);

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl,
      siteName: 'Hanzo Bot Docs',
      images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Hanzo Bot Documentation' }],
      type: 'website',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@hanikidev',
      creator: '@hanikidev',
      images: ['/og-image.svg'],
      ...override.twitter,
    },
    metadataBase: baseUrl,
  };
}
