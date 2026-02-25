import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs/ui/layouts/shared';
import { HanzoDocsIcon } from '@/app/layout.client';

export const linkItems: LinkItemType[] = [
  {
    text: 'Docs',
    url: '/docs/services',
    active: 'nested-url',
  },
  {
    text: 'API',
    url: '/docs/openapi',
    active: 'nested-url',
  },
  {
    text: 'SDKs',
    url: '/docs/sdks',
    active: 'nested-url',
  },
  {
    text: 'Models',
    url: 'https://zenlm.org',
    external: true,
  },
];

export const logo = (
  <HanzoDocsIcon className="size-5" />
);

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium max-md:hidden">Hanzo</span>
        </>
      ),
    },
  };
}
