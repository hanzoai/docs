import type { StructuredData } from '@/mdx-plugins';

export interface HanzoDocument {
  /**
   * The ID of document, must be unique.
   */
  id: string;

  title: string;
  description?: string;

  /**
   * URL to the page.
   */
  url: string;

  structured: StructuredData;

  /**
   * Tag to filter results.
   */
  tag?: string;

  /**
   * Data to be added to each section index.
   */
  extra_data?: object;

  breadcrumbs?: string[];
}

export interface HanzoIndex {
  id: string;
  title: string;
  url: string;
  tag?: string;

  /**
   * The id of page, used for grouping.
   */
  page_id: string;

  /**
   * Heading content.
   */
  section?: string;

  breadcrumbs?: string[];

  /**
   * Heading (anchor) id.
   */
  section_id?: string;

  content: string;
}

export interface HanzoSyncOptions {
  /**
   * The index API endpoint.
   *
   * For `backend: 'cloud'`: the cloud-api index-docs URL.
   * For `backend: 'meilisearch'`: the Meilisearch base URL (e.g. 'https://search.hanzo.ai').
   *
   * @defaultValue 'https://api.cloud.hanzo.ai/api/index-docs'
   */
  endpoint?: string;

  /**
   * Sync backend to use.
   *
   * - `'cloud'`: Hanzo cloud-api `/api/index-docs` endpoint.
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
   * Admin API key (hk-* for cloud, master key for meilisearch).
   */
  apiKey: string;

  documents: HanzoDocument[];

  /**
   * Replace existing index documents.
   *
   * @defaultValue true
   */
  replace?: boolean;
}

function toIndex(page: HanzoDocument): HanzoIndex[] {
  let id = 0;
  const indexes: HanzoIndex[] = [];
  const scannedHeadings = new Set<string>();

  function createIndex(
    section: string | undefined,
    sectionId: string | undefined,
    content: string,
  ): HanzoIndex {
    return {
      id: `${page.id}-${(id++).toString()}`,
      title: page.title,
      url: page.url,
      page_id: page.id,
      tag: page.tag,
      section,
      section_id: sectionId,
      content,
      breadcrumbs: page.breadcrumbs,
      ...page.extra_data,
    };
  }

  if (page.description) {
    indexes.push(createIndex(undefined, undefined, page.description));
  }

  page.structured.contents.forEach((p) => {
    const heading = p.heading
      ? page.structured.headings.find((h) => p.heading === h.id)
      : null;

    const index = createIndex(heading?.content, heading?.id, p.content);

    if (heading && !scannedHeadings.has(heading.id)) {
      scannedHeadings.add(heading.id);

      indexes.push(createIndex(heading.content, heading.id, heading.content));
    }

    indexes.push(index);
  });

  return indexes;
}

async function syncCloud(
  endpoint: string,
  apiKey: string,
  indexes: HanzoIndex[],
  replace: boolean,
): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ documents: indexes, replace }),
  });

  if (!res.ok) {
    throw new Error(`Hanzo index sync error: ${res.status} ${await res.text()}`);
  }
}

async function syncMeilisearch(
  endpoint: string,
  apiKey: string,
  indexName: string,
  indexes: HanzoIndex[],
  replace: boolean,
): Promise<void> {
  const base = endpoint.replace(/\/$/, '');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  // Delete all documents first when replacing.
  if (replace) {
    const delRes = await fetch(`${base}/indexes/${indexName}/documents`, {
      method: 'DELETE',
      headers,
    });
    if (!delRes.ok) {
      throw new Error(`Meilisearch delete error: ${delRes.status} ${await delRes.text()}`);
    }
    // Wait for deletion to complete.
    const delTask = (await delRes.json()) as { taskUid: number };
    await waitForTask(base, apiKey, delTask.taskUid);
  }

  // Upload in chunks of 5000 to stay within payload limits.
  const chunkSize = 5000;
  for (let i = 0; i < indexes.length; i += chunkSize) {
    const chunk = indexes.slice(i, i + chunkSize);
    const res = await fetch(`${base}/indexes/${indexName}/documents`, {
      method: 'POST',
      headers,
      body: JSON.stringify(chunk),
    });
    if (!res.ok) {
      throw new Error(`Meilisearch index error: ${res.status} ${await res.text()}`);
    }
  }

  // Configure filterable attributes for tag-based search.
  await fetch(`${base}/indexes/${indexName}/settings/filterable-attributes`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(['tag', 'page_id']),
  });
}

async function waitForTask(
  base: string,
  apiKey: string,
  taskUid: number,
  timeoutMs = 30_000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${base}/tasks/${taskUid}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.ok) {
      const task = (await res.json()) as { status: string };
      if (task.status === 'succeeded' || task.status === 'failed') return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}

export async function sync(options: HanzoSyncOptions): Promise<void> {
  const {
    endpoint = 'https://api.cloud.hanzo.ai/api/index-docs',
    backend = 'cloud',
    index: indexName = 'app-docs-hanzo-ai-docs',
    apiKey,
    documents,
    replace = true,
  } = options;

  const indexes = documents.flatMap(toIndex);

  if (backend === 'meilisearch') {
    await syncMeilisearch(endpoint, apiKey, indexName, indexes, replace);
  } else {
    await syncCloud(endpoint, apiKey, indexes, replace);
  }
}
