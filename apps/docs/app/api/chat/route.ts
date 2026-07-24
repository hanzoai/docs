import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';
import { ProvideLinksToolSchema } from '@/lib/ai/qa-schema';

// Hanzo Docs AI — 100% native. Retrieval is our own `rag-api` index over the
// docs; generation is the Hanzo gateway (api.hanzo.ai/v1). No third-party AI —
// everything runs on our own stack. Grounded answers only: the model answers
// from the retrieved context and cites sources via the provideLinks tool.
const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, the assistant for the Hanzo AI Cloud documentation. ' +
  'Answer using ONLY the Hanzo documentation context provided below. Cite every ' +
  'source you use by calling the provideLinks tool with its URL. Be concise and ' +
  'accurate. If the answer is not in the context, say so plainly and point to the ' +
  'closest relevant section — never invent APIs, flags, or endpoints.';

// The native RAG index (rag-api), reached through the gateway. `/query` returns
// the top-k indexed doc chunks (page_content + metadata) to ground the answer.
const RAG_URL = process.env.HANZO_RAG_URL ?? 'https://api.hanzo.ai/v1';
const RAG_ENTITY = process.env.HANZO_RAG_ENTITY ?? 'docs.hanzo.ai';

interface RagChunk {
  page_content: string;
  metadata?: Record<string, unknown>;
}

async function retrieve(apiKey: string, query: string): Promise<string> {
  if (!query) return '';
  try {
    const res = await fetch(`${RAG_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, k: 8, entity_id: RAG_ENTITY }),
    });
    if (!res.ok) return '';
    const chunks = (await res.json()) as RagChunk[];
    if (!Array.isArray(chunks)) return '';
    return chunks
      .map(
        (c, i) =>
          `[${i + 1}] ${(c.metadata?.title as string) ?? ''} ${(c.metadata?.url as string) ?? ''}\n${c.page_content}`,
      )
      .join('\n\n');
  } catch {
    return '';
  }
}

function lastUserText(
  messages: Array<{ role?: string; content?: unknown; parts?: unknown }>,
): string {
  const last = [...messages].reverse().find((m) => m.role === 'user');
  if (!last) return '';
  if (typeof last.content === 'string') return last.content;
  const parts = (last.parts ?? last.content) as
    | Array<{ type?: string; text?: string }>
    | undefined;
  if (!Array.isArray(parts)) return '';
  return parts
    .map((p) => (p.type === 'text' ? p.text ?? '' : ''))
    .join(' ')
    .trim();
}

export async function POST(req: Request) {
  const apiKey = process.env.HANZO_API_KEY ?? process.env.LLM_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI chat is not configured. Set HANZO_API_KEY.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { messages } = await req.json();

  // Ground the answer on our native index (retrieve for the latest user turn).
  const context = await retrieve(apiKey, lastUserText(messages ?? []));

  const provider = createOpenAICompatible({
    name: 'hanzo',
    baseURL: process.env.HANZO_AI_BASE_URL ?? 'https://api.hanzo.ai/v1',
    apiKey,
  });

  const result = streamText({
    model: provider.chatModel(process.env.HANZO_AI_MODEL ?? 'zen-coder-flash'),
    system:
      SYSTEM_PROMPT +
      '\n\n' +
      (context
        ? `--- Hanzo docs context ---\n${context}\n--- end context ---`
        : '(no matching docs were found in the native index for this query)'),
    tools: {
      provideLinks: {
        inputSchema: ProvideLinksToolSchema,
      },
    },
    toolChoice: 'auto',
    messages,
  });

  return result.toUIMessageStreamResponse();
}
