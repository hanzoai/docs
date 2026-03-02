export const searchEndpoint =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_ENDPOINT ??
  'https://cloud-api.hanzo.ai/api/search-docs?store=bot-docs';

export const indexEndpoint =
  process.env.HANZO_SEARCH_INDEX_ENDPOINT ??
  'https://cloud-api.hanzo.ai/api/index-docs?store=bot-docs';

export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ??
  'https://cloud-api.hanzo.ai/api/chat-docs?store=bot-docs';

export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ?? 'pk-hanzo-docs-search-2026';

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
