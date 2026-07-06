export const searchEndpoint =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_ENDPOINT ??
  'https://api.hanzo.ai/v1/search-docs?store=bot-docs';

export const indexEndpoint =
  process.env.HANZO_SEARCH_INDEX_ENDPOINT ??
  'https://api.hanzo.ai/v1/index-docs?store=bot-docs';

export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ??
  'https://api.hanzo.ai/v1/chat-docs?store=bot-docs';

export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ?? 'pk-hanzo-docs-search-2026';

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
