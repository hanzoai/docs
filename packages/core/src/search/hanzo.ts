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
   * The Hanzo index API endpoint.
   *
   * @defaultValue 'https://api.cloud.hanzo.ai/api/index-docs'
   */
  endpoint?: string;

  /**
   * Admin API key (hk-*).
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

export async function sync(options: HanzoSyncOptions): Promise<void> {
  const {
    endpoint = 'https://api.cloud.hanzo.ai/api/index-docs',
    apiKey,
    documents,
    replace = true,
  } = options;

  const indexes = documents.flatMap(toIndex);

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
