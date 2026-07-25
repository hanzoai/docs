import { source } from '@/lib/source';
import { buildIndexDefault, flexsearchFromSource } from '@hanzo/docs-core/search/flexsearch';
import { getSection } from '@/lib/source/navigation';

// The search dialog's "Products" filter covers Zen LM, Chat, MCP, Dev and ZAP.
// getSection keeps those as distinct sections, so we additionally tag their
// pages `products` for that one filter. The other filters (Services/SDKs/API)
// match the single section tag as before — flexsearch tags are a set, so a
// page can carry both its section and `products`.
const PRODUCT_SECTIONS = new Set(['chat', 'llm', 'mcp', 'dev', 'zap']);

function sectionTags(slug: string | undefined): string | string[] {
  const section = getSection(slug);
  return PRODUCT_SECTIONS.has(section) ? [section, 'products'] : section;
}

// Client-side static search for the static export (served by hanzoai/static).
//
// `staticGET` serializes the flexsearch index to /api/search; the browser
// (search dialog, `type: 'flexsearch-static'`) downloads it once and searches
// locally — no server, no auth, works on a static host. This replaces the old
// `GET` (dynamic search handler) which, under `dynamic = 'force-static'`, froze
// to the empty-query response `[]`, so every search returned nothing.
//
// Index shape is tuned for this corpus (~1.7k docs):
//   - `tokenize: 'forward'` gives prefix / search-as-you-type matching.
//   - We index titles, descriptions and section headings, NOT body paragraphs
//     (`contents: []`). Indexing full bodies with a prefix tokenizer produces a
//     serialized index that exceeds V8's max string length and OOMs the build;
//     headings-only keeps it at ~20MB (~1.7MB gzipped) while still matching the
//     titles/headings users actually search for. Deep body text is reachable
//     via the on-page anchors those headings link to.
//
// Tags mirror /static.json (getSection over the top-level slug) so the
// All/Services/SDKs/API filters narrow correctly.
export const { staticGET: GET } = flexsearchFromSource(source, {
  document: { tokenize: 'forward' },
  async buildIndex(page) {
    const tag = sectionTags(page.slugs[0]);

    // OpenAPI pages carry no MDX structured data; index title/description only.
    // (In static-export mode they aren't generated at all, so this is a no-op
    // there — it keeps `next dev`, where specs are present, from throwing.)
    if (page.type === 'openapi') {
      return {
        id: page.url,
        url: page.url,
        title: page.data.title ?? page.url,
        description: page.data.description,
        tag,
        structuredData: { headings: [], contents: [] },
      };
    }

    const base = await buildIndexDefault(page);
    return {
      ...base,
      tag,
      structuredData: { headings: base.structuredData.headings, contents: [] },
    };
  },
});

export const revalidate = false;
