import { ProvideLinksToolSchema } from '@/lib/ai/qa-schema';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { $routeHandler } from 'fuma-cli/macros/route-handler';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

export type HanzoUIMessage = UIMessage<
  never,
  {
    client: {
      location: string;
    };
  }
>;

// NATIVE Hanzo AI — replaces the retired third-party hosted RAG. Everything
// runs on our own stack: the `rag-api` native index for retrieval + the Hanzo
// gateway (api.hanzo.ai, OpenAI-compatible) for generation. No third-party AI.
const hanzo = createOpenAICompatible({
  name: 'hanzo',
  apiKey: process.env.HANZO_API_KEY,
  baseURL: process.env.HANZO_AI_BASE_URL ?? 'https://api.hanzo.ai/v1',
});

// The native RAG index (rag-api). `/query` returns the top-k indexed doc chunks
// (page_content + metadata) — we ground the answer on these and cite their URLs.
const RAG_URL = process.env.HANZO_RAG_URL ?? 'https://api.hanzo.ai/v1';
const RAG_ENTITY = process.env.HANZO_RAG_ENTITY ?? 'docs.hanzo.ai';

interface RagChunk {
  page_content: string;
  metadata?: Record<string, unknown>;
}

async function retrieve(
  query: string,
): Promise<{ context: string; links: { url: string; title?: string }[] }> {
  try {
    const res = await fetch(`${RAG_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HANZO_API_KEY ?? ''}`,
      },
      body: JSON.stringify({ query, k: 8, entity_id: RAG_ENTITY }),
    });
    if (!res.ok) return { context: '', links: [] };
    const chunks = (await res.json()) as RagChunk[];
    if (!Array.isArray(chunks)) return { context: '', links: [] };
    const links = chunks
      .map((c) => ({
        url: String(c.metadata?.url ?? c.metadata?.source ?? ''),
        title: (c.metadata?.title as string | undefined) ?? undefined,
      }))
      .filter((l) => l.url);
    const context = chunks
      .map((c, i) => `[${i + 1}] ${(c.metadata?.title as string) ?? ''}\n${c.page_content}`)
      .join('\n\n');
    return { context, links };
  } catch {
    return { context: '', links: [] };
  }
}

export const handler = $routeHandler(
  {
    methods: ['POST'],
    params: [],
  },
  async (req) => {
    const reqJson = await req.json();

    // Ground the answer on the native index: retrieve for the latest user turn.
    const msgs = (reqJson.messages ?? []) as HanzoUIMessage[];
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    const question = (lastUser?.parts ?? [])
      .map((p) => ((p as { type?: string; text?: string }).type === 'text' ? (p as { text?: string }).text ?? '' : ''))
      .join(' ')
      .trim();
    const { context } = question ? await retrieve(question) : { context: '' };

    const result = streamText({
      model: hanzo(process.env.HANZO_AI_MODEL ?? 'zen5'),
      system:
        'You are the Hanzo documentation assistant. Answer using ONLY the Hanzo ' +
        'documentation context below. Cite every source you use by calling the ' +
        'provideLinks tool with its URL. If the answer is not in the context, say ' +
        'so plainly and point to the closest relevant section.\n\n' +
        (context
          ? `--- Hanzo docs context ---\n${context}\n--- end context ---`
          : '(no matching docs were found in the native index for this query)'),
      tools: {
        provideLinks: {
          inputSchema: ProvideLinksToolSchema,
        },
      },
      messages: await convertToModelMessages<HanzoUIMessage>(reqJson.messages, {
        ignoreIncompleteToolCalls: true,
        convertDataPart(part) {
          if (part.type === 'data-client')
            return {
              type: 'text',
              text: `[Client Context: ${JSON.stringify(part.data)}]`,
            };
        },
      }),
      toolChoice: 'auto',
    });

    return result.toUIMessageStreamResponse();
  },
);
