import { createContentHighlighter, type SortedResult } from '../index';

export interface HanzoSearchOptions {
  /**
   * The Hanzo Search API endpoint.
   *
   * @defaultValue 'https://cloud-api.hanzo.ai/api/search-docs'
   */
  endpoint?: string;

  /**
   * Publishable API key (pk-*).
   */
  apiKey: string;

  /**
   * Filter results with specific tag.
   */
  tag?: string;

  /**
   * Search mode.
   *
   * @defaultValue 'hybrid'
   */
  mode?: 'hybrid' | 'fulltext' | 'vector';

  /**
   * Filter by locale.
   */
  locale?: string;
}

interface HanzoSearchHit {
  id: string;
  page_id: string;
  title: string;
  url: string;
  section?: string;
  section_id?: string;
  content: string;
  tag?: string;
  breadcrumbs?: string[];
}

interface HanzoSearchResponse {
  hits: HanzoSearchHit[];
}

const cache = new Map<string, SortedResult[]>();

export async function searchDocs(
  query: string,
  options: HanzoSearchOptions,
): Promise<SortedResult[]> {
  const {
    endpoint = 'https://cloud-api.hanzo.ai/api/search-docs',
    apiKey,
    tag,
    mode = 'hybrid',
    locale,
  } = options;

  if (!query.trim()) return [];

  const body = JSON.stringify({ query, tag, mode, locale, limit: 20 });
  const cacheKey = `${endpoint}:${body}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Hanzo Search error: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as HanzoSearchResponse;
  const highlighter = createContentHighlighter(query);
  const list: SortedResult[] = [];

  const groupedByPage = new Map<string, HanzoSearchHit[]>();
  for (const hit of data.hits) {
    const pageId = hit.page_id;
    const group = groupedByPage.get(pageId);
    if (group) {
      group.push(hit);
    } else {
      groupedByPage.set(pageId, [hit]);
    }
  }

  for (const [, hits] of groupedByPage) {
    let addedHead = false;

    for (const hit of hits) {
      if (!addedHead) {
        list.push({
          id: hit.page_id,
          type: 'page',
          content: highlighter.highlightMarkdown(hit.title),
          breadcrumbs: hit.breadcrumbs,
          url: hit.url,
        });
        addedHead = true;
      }

      list.push({
        id: hit.id,
        content: highlighter.highlightMarkdown(hit.content),
        type: hit.content === hit.section ? 'heading' : 'text',
        url: hit.section_id ? `${hit.url}#${hit.section_id}` : hit.url,
      });
    }
  }

  const results = list.length > 80 ? list.slice(0, 80) : list;
  cache.set(cacheKey, results);
  return results;
}
