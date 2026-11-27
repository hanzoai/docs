/**
 * The docs top nav: the whole thing, the guided path through it, then the
 * surfaces a reader writes against. On-site only — nothing here leaves for
 * hanzo.ai mid-page.
 *
 * CLI points at /docs/cli, the `hanzo` binary. `exact` is for /docs, which
 * prefixes every page and would otherwise stay lit everywhere.
 */
export interface Nav {
  text: string;
  url: string;
  exact?: boolean;
}

export const nav: Nav[] = [
  { text: 'Docs', url: '/docs', exact: true },
  { text: 'Guides', url: '/docs/guides' },
  { text: 'Deploy', url: '/docs/deploy-button' },
  { text: 'Models', url: '/docs/models' },
  { text: 'APIs', url: '/docs/openapi' },
  { text: 'SDKs', url: '/docs/sdks' },
  { text: 'CLI', url: '/docs/cli' },
  { text: 'MCP', url: '/docs/mcp' },
];

export function lit(item: Nav, pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return item.exact ? path === item.url : path === item.url || path.startsWith(`${item.url}/`);
}
