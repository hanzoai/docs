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

/**
 * Sections whose heading says more than their title does. Everything else takes
 * the title the section already carries — a folder's meta.json or a page's own
 * frontmatter — rather than falling back to the slug.
 *
 * Measured on the live file before this: 26 of 35 headings were raw slugs
 * (api-keys, apps, chat, concepts, console, credits, ...), because the map below
 * held 8 entries and everything absent from it printed its directory name. This
 * is the canonical entry point for an agent reading the site, so a heading that
 * reads "api-keys" instead of "Authentication" is the first thing it learns.
 */
const TITLES: Record<string, string> = {
  openapi: 'API reference — one page per capability, one per operation',
  cli: 'CLI — the `hanzo` command line, one page per capability',
  start: 'Start — six journeys, each shown as CLI, SDK, HTTP and MCP',
  'mcp-tools': 'MCP — one page per tool MCP exposes',
  projects: 'Open source — docs ported from the repositories themselves',
  sdks: 'SDKs — one page per language',
  architecture: 'Architecture',
  contributing: 'Contributing',
};

export function GET() {
  const pages = source.getPages();

  // The section's own title, from the tree the sidebar renders — so a section
  // is named the same way in both places and adding one needs no edit here.
  const named = new Map<string, string>();
  for (const node of source.getPageTree().children) {
    if (node.type === 'separator') continue;
    const slug = ('$id' in node ? String(node.$id) : '').split('/').filter(Boolean).pop();
    if (slug && typeof node.name === 'string') named.set(slug, node.name);
  }
  const titleOf = (section: string): string => {
    if (!section) return 'Docs';
    const fromTree = named.get(section);
    if (fromTree) return fromTree;
    const index = source.getPage([section]);
    return (index?.data.title as string | undefined) ?? section;
  };

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
    out.push(`## ${TITLES[section] ?? titleOf(section)}`, '');
    for (const page of list.sort((a, b) => a.url.localeCompare(b.url))) out.push(line(page));
    out.push('');
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
