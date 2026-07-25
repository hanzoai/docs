import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs/ui/layouts/shared';
import { U } from '@hanzogui/shell';
import { HanzoDocsIcon } from '@/app/layout.client';

// Docs top-nav. This is a DOCS surface, so items that HAVE a docs home keep the
// visitor IN the docs — Models → /docs/services/models, Agents → /docs/agents,
// Pricing → /docs/services/pricing, Developers → /docs. Only genuinely
// marketing-only concepts (Solutions, Enterprise) resolve out to hanzo.ai. This
// fixes the top nav bouncing readers to the marketing site mid-docs.
export const linkItems: LinkItemType[] = [
  {
    text: 'Models',
    url: '/docs/services/models',
    active: 'nested-url',
  },
  {
    text: 'Agents',
    url: '/docs/agents',
    active: 'nested-url',
  },
  {
    text: 'MCP',
    url: '/docs/mcp',
    active: 'nested-url',
  },
  {
    text: 'Developers',
    url: '/docs',
    active: 'nested-url',
  },
  {
    text: 'Pricing',
    url: '/docs/services/pricing',
    active: 'nested-url',
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
