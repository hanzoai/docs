import type { SearchClient } from '../client';
import type { ExportedData } from '../flexsearch';
import type { Document } from 'flexsearch';
import { createDocument, search, type Doc } from '../flexsearch/utils';

export interface FlexsearchStaticOptions {
  /**
   * @defaultValue `/api/search`
   */
  from?: string;
  locale?: string;
  tag?: string | string[];
}

function initDocument(data: Record<string, string>) {
  const document = createDocument();
  for (const [k, v] of Object.entries(data)) document.import(k, v);
  return document;
}

const cacheMap = new Map<string, Promise<Map<string, Document<Doc>>>>();

export function flexsearchStaticClient(options: FlexsearchStaticOptions = {}): SearchClient {
  const { from = '/api/search', locale = '', tag } = options;

  let dbs = cacheMap.get(from);
  if (!dbs && typeof window !== 'undefined') {
    dbs = init(from);
    cacheMap.set(from, dbs);
  }

  return {
    deps: [from, locale, tag],
    async search(query) {
      const loaded = await dbs!;
      const db = pickFlexsearchIndex(loaded, locale);
      if (!db) return [];
      const hits = await search(db, query, tag);
      if (hits.length > 0 || !locale || locale === 'en') return hits;

      const english = loaded.get('en') ?? loaded.get('');
      if (!english || english === db) return hits;
      return search(english, query, tag);
    },
  };
}

/** Prefer the requested locale, then English, then the unscoped index. */
export function pickFlexsearchIndex<T>(loaded: Map<string, T>, locale: string): T | undefined {
  if (locale && loaded.has(locale)) return loaded.get(locale);
  if (loaded.has('en')) return loaded.get('en');
  if (loaded.has('')) return loaded.get('');
  return undefined;
}

async function init(from: string) {
  const res = await fetch(from);

  if (!res.ok)
    throw new Error(
      `failed to fetch exported search indexes from ${from}, make sure the search database is exported and available for client.`,
    );

  const data = (await res.json()) as ExportedData;
  const dbs = new Map<string, Document<Doc>>();

  if (data.type === 'i18n') {
    for (const [locale, map] of Object.entries(data.raw)) {
      dbs.set(locale, initDocument(map));
    }

    return dbs;
  } else {
    dbs.set('', initDocument(data.raw));
  }

  return dbs;
}
