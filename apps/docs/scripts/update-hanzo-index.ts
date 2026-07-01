import { type HanzoDocument, sync } from '@hanzo/docs-core/search/hanzo';
import * as fs from 'node:fs/promises';

export async function updateSearchIndexes(): Promise<void> {
  const apiKey = process.env.HANZO_SEARCH_ADMIN_KEY;
  if (!apiKey) {
    console.log('HANZO_SEARCH_ADMIN_KEY not set, skipping index sync');
    return;
  }

  const content = await fs.readFile('.next/server/app/static.json.body');
  const records = JSON.parse(content.toString()) as HanzoDocument[];

  // Section builds append to the index; only the core/full build replaces it.
  const isSection = !!process.env.DOCS_SECTION && process.env.DOCS_SECTION !== 'core';

  const backend = (process.env.HANZO_SEARCH_BACKEND as 'cloud' | 'meilisearch') ?? 'meilisearch';
  const defaultEndpoint =
    backend === 'meilisearch'
      ? 'https://search.hanzo.ai'
      : 'https://api.hanzo.ai/v1/index-docs';

  await sync({
    endpoint: process.env.HANZO_SEARCH_INDEX_ENDPOINT ?? defaultEndpoint,
    backend,
    index: process.env.HANZO_SEARCH_INDEX ?? 'app-docs-hanzo-ai-docs',
    apiKey,
    documents: records,
    replace: !isSection,
  });

  console.log(`hanzo search index updated (${backend}): ${records.length} records`);
}
