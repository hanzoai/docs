import { createContentHighlighter, type SortedResult } from '../index';

export interface HanzoSearchOptions {
  /**
   * The Hanzo Search API endpoint.
   *
   * For `backend: 'cloud'` (default): the Hanzo AI `/v1/search` URL.
   * For `backend: 'meilisearch'`: the Meilisearch base URL (e.g. 'https://search.hanzo.ai').
   *
   * @defaultValue 'https://api.hanzo.ai/v1/search'
   */
  endpoint?: string;

  /**
   * Search backend to use.
   *
   * - `'cloud'`: Hanzo AI `/v1/search` endpoint.
   * - `'meilisearch'`: Direct Meilisearch instance (requires `index`).
   *
   * @defaultValue 'cloud'
   */
  backend?: 'cloud' | 'meilisearch';

  /**
   * Meilisearch index name. Required when `backend` is `'meilisearch'`.
   *
   * @defaultValue 'app-docs-hanzo-ai-docs'
   */
  index?: string;

  /**
   * API key for the search backend.
   *
   * For cloud: publishable API key (pk-*).
   * For meilisearch: search API key.
   */
  apiKey: string;

  /**
   * Filter results with specific tag.
   */
  tag?: string;

  /**
   * Search mode (cloud backend only).
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

async function fetchCloud(
  query: string,
  endpoint: string,
  apiKey: string,
  tag: string | undefined,
  mode: string,
  locale: string | undefined,
): Promise<HanzoSearchResponse> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, tag, mode, locale, limit: 20 }),
  });

  if (!res.ok) {
    throw new Error(`Hanzo Search error: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as HanzoSearchResponse;
}

async function fetchMeilisearch(
  query: string,
  endpoint: string,
  apiKey: string,
  index: string,
  tag: string | undefined,
): Promise<HanzoSearchResponse> {
  const url = `${endpoint.replace(/\/$/, '')}/indexes/${index}/search`;

  const filter = tag ? `tag = "${tag}"` : undefined;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ q: query, filter, limit: 20 }),
  });

  if (!res.ok) {
    throw new Error(`Hanzo Search error: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as HanzoSearchResponse;
}

export async function searchDocs(
  query: string,
  options: HanzoSearchOptions,
): Promise<SortedResult[]> {
  const {
    endpoint = 'https://api.hanzo.ai/v1/search',
    backend = 'cloud',
    index = 'app-docs-hanzo-ai-docs',
    apiKey,
    tag,
    mode = 'hybrid',
    locale,
  } = options;

  if (!query.trim()) return [];

  const cacheKey = `${backend}:${endpoint}:${query}:${tag ?? ''}:${mode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const data =
    backend === 'meilisearch'
      ? await fetchMeilisearch(query, endpoint, apiKey, index, tag)
      : await fetchCloud(query, endpoint, apiKey, tag, mode, locale);
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
