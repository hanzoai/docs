import type { Metadata } from 'next';

export const baseUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pulsar.lux.network',
);

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl,
      siteName: 'Pulsar',
      type: 'website',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      ...override.twitter,
    },
    metadataBase: baseUrl,
  };
}
