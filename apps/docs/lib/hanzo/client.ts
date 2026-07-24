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

// Gateway BASE the docs chat widget streams from, CLIENT-SIDE. The @hanzo/ai
// client appends `/v1/chat/completions` itself (never an `/api/` prefix), so
// this is the gateway ROOT — not a full path. Replaces the retired server-route
// RAG proxy (the dead `/v1/chat-docs` name): docs deploys as a static export
// with no server, so the browser calls the real gateway directly.
export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ?? 'https://api.hanzo.ai';

// Publishable key (pk-*) for the hanzo-docs org, scoped to chat. Ships in the
// client bundle BY DESIGN (NEXT_PUBLIC) — never a server secret. Answering is
// balance-gated: the hanzo-docs org wallet must be funded for the gateway to bill.
export const chatKey = process.env.NEXT_PUBLIC_HANZO_CHAT_KEY ?? '';

// Generation model on the gateway. `enso` is the Hanzo docs assistant model.
export const chatModel = process.env.NEXT_PUBLIC_HANZO_CHAT_MODEL ?? 'enso';

export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ??
  (searchBackend === 'meilisearch'
    ? '2d99c3ab7551b807c9b8c132f663eba7e27e765a511907d9a566799497c7fd42'
    : 'pk-hanzo-docs-search-2026');

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
