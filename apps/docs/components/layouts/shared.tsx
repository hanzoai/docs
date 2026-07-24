import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs/ui/layouts/shared';
import { U } from '@hanzogui/shell';
import { HanzoDocsIcon } from '@/app/layout.client';

// Canonical ecosystem top-nav, sourced from the shell registry (`U`). One shape
// across every Hanzo property: Models · Agents · Solutions · Developers ·
// Pricing · Enterprise. "Developers" is docs itself, so it stays internal;
// the rest resolve to their canonical hanzo.ai URLs. Doc-section navigation
// (API, SDKs, sections) lives in the Fumadocs sidebar + the Meet-Hanzo menu.
export const linkItems: LinkItemType[] = [
  {
    text: 'Models',
    url: U.models,
    external: true,
  },
  {
    text: 'Agents',
    url: U.agents,
    external: true,
  },
  {
    text: 'Solutions',
    url: U.solutions,
    external: true,
  },
  {
    text: 'Developers',
    url: '/docs',
    active: 'nested-url',
  },
  {
    text: 'Pricing',
    url: U.pricing,
    external: true,
  },
  {
    text: 'Enterprise',
    url: U.enterprise,
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
