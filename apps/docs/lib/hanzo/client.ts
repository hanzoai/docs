export const searchEndpoint =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_ENDPOINT ??
  'https://api.cloud.hanzo.ai/api/search-docs';

export const indexEndpoint =
  process.env.HANZO_SEARCH_INDEX_ENDPOINT ??
  'https://api.cloud.hanzo.ai/api/index-docs';

export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ??
  'https://api.cloud.hanzo.ai/api/chat-docs';

export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ?? 'pk-hanzo-docs-search-2026';

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
