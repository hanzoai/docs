export const searchBackend =
  (process.env.NEXT_PUBLIC_HANZO_SEARCH_BACKEND as 'cloud' | 'meilisearch' | undefined) ??
  'meilisearch';

export const searchEndpoint =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_ENDPOINT ??
  (searchBackend === 'meilisearch'
    ? 'https://search.hanzo.ai'
    : 'https://api.hanzo.ai/v1/search-docs');

export const searchIndex =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_INDEX ?? 'app-docs-hanzo-ai-docs';

export const indexEndpoint =
  process.env.HANZO_SEARCH_INDEX_ENDPOINT ??
  'https://api.hanzo.ai/v1/index-docs';

export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ??
  'https://api.hanzo.ai/v1/chat-docs';

export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ??
  (searchBackend === 'meilisearch'
    ? '2d99c3ab7551b807c9b8c132f663eba7e27e765a511907d9a566799497c7fd42'
    : 'pk-hanzo-docs-search-2026');

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
