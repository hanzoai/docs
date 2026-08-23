import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';
import { HanzoDocsIcon } from '@/app/layout.client';

// Docs top-nav: the four developer surfaces, and nothing that leaves the site.
//
// It carried six items shaped like the MARKETING nav — Models, Agents, MCP,
// Developers, Pricing, Enterprise — two of which resolved out to hanzo.ai, bouncing
// a reader off mid-page. These four are how you actually reach Hanzo: over the API,
// from the CLI, through MCP, or via an SDK. Each was probed 200 before landing.
//
// CLI does NOT point at /docs/cli. That section is fumadocs' own tooling, kept
// from the fork — "the CLI tool that automates setups and installs components",
// plus a Markdown previewer. 200, and about the wrong product. The `hanzo`
// binary is documented at the URL below, and hanzo.ai's nav now names the same
// four surfaces pointing at these same pages.
// Ordered the way a reader arrives: the whole thing, then the guided path
// through it, then the four surfaces they will write against.
//
// Guides points at /docs/guides: six task journeys, each written as CLI, SDK,
// HTTP and MCP, with the migration and integration guides nested beside them.
// The nav item, the URL, the page title and the sidebar heading are one word,
// which they were not — the nav said Guides and every other surface said Start.
export const linkItems: LinkItemType[] = [
  {
    // Exact, not nested: /docs is a prefix of every page here, so nesting would
    // light this up beside whichever surface the reader is actually in.
    text: 'Docs',
    url: '/docs',
    active: 'url',
  },
  {
    text: 'Guides',
    url: '/docs/guides',
    active: 'nested-url',
  },
  {
    text: 'APIs',
    url: '/docs/openapi',
    active: 'nested-url',
  },
  {
    text: 'SDKs',
    url: '/docs/sdks',
    active: 'nested-url',
  },
  {
    text: 'CLI',
    url: '/docs/cli',
    active: 'nested-url',
  },
  {
    text: 'MCP',
    url: '/docs/mcp',
    active: 'nested-url',
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
          <span className="font-medium max-md:hidden">Hanzo AI</span>
          {/* Says WHICH surface you are on. hanzo.ai, hanzo.app and this site share
              the wordmark, so without it the header is ambiguous the moment a reader
              arrives from search. It sits at the wordmark and not in the nav row
              because it is an identity, not a destination. */}
          <span className="max-md:hidden rounded border border-fd-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-fd-muted-foreground">
            Docs
          </span>
        </>
      ),
    },
  };
}
