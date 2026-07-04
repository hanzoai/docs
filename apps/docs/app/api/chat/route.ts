import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, a helpful assistant for the Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo services, APIs, SDKs, and infrastructure. ' +
  'Be concise and accurate.';

export async function POST(req: Request) {
  const apiKey = process.env.HANZO_API_KEY ?? process.env.LLM_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI chat is not configured. Set HANZO_API_KEY.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { messages } = await req.json();

  const provider = createOpenAICompatible({
    name: 'hanzo',
    baseURL: 'https://api.hanzo.ai/v1',
    apiKey,
  });

  const result = streamText({
    model: provider.chatModel('zen-coder-flash'),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
