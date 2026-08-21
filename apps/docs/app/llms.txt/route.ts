import { source } from '@/lib/source';

// THE INDEX: every page, not every page a human navigates to.
//
// This rendered the sidebar — `llms(source).index()` walks the page TREE — and
// the tree is a navigation decision. A capability's folder deliberately lists
// only its own page, because a sidebar folder holding 200 operations is a tree
// nobody opens; that choice is right for a reader and wrong for an agent, and
// with one structure answering both questions it silently kept 2,283 operation
// pages out of the index while they published, sat in the sitemap and served
// their own markdown twin.
//
// So the index is built from the PAGES, grouped by section. What a human
// navigates and what an agent enumerates are different questions, and they now
// have different answers.
export const revalidate = false;

const TITLES: Record<string, string> = {
  openapi: 'API reference — one page per capability, one per operation',
  cli: 'CLI — the `hanzo` command line, one page per capability',
  start: 'Start — six journeys, each shown as CLI, SDK, HTTP and MCP',
  'mcp-tools': 'MCP — one page per tool the door exposes',
  projects: 'Open source — docs ported from the repositories themselves',
  sdks: 'SDKs — one page per language',
  architecture: 'Architecture',
  contributing: 'Contributing',
};

export function GET() {
  const pages = source.getPages();

  const bySection = new Map<string, typeof pages>();
  for (const page of pages) {
    const section = page.slugs.length ? page.slugs[0] : '';
    const list = bySection.get(section) ?? [];
    list.push(page);
    bySection.set(section, list);
  }

  const line = (page: (typeof pages)[number]): string => {
    const desc = String(page.data.description ?? '').replace(/\s+/g, ' ').trim();
    return `- [${page.data.title}](${page.url})${desc ? `: ${desc}` : ''}`;
  };

  const out: string[] = ['# Hanzo', ''];
  // Sections in the order the root sidebar declares them, then anything else —
  // so the file reads like the site and cannot silently drop a new section.
  const sections = [...bySection.keys()].sort((a, b) => {
    const ai = Object.keys(TITLES).indexOf(a);
    const bi = Object.keys(TITLES).indexOf(b);
    if (ai !== bi) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return a.localeCompare(b);
  });

  for (const section of sections) {
    const list = bySection.get(section)!;
    out.push(`## ${TITLES[section] ?? (section || 'Docs')}`, '');
    for (const page of list.sort((a, b) => a.url.localeCompare(b.url))) out.push(line(page));
    out.push('');
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
