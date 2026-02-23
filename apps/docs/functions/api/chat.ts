// CF Pages Function — proxies chat requests to Hanzo LLM Gateway.
// Keeps the API key server-side while allowing the static docs site
// to use the AI chat feature.

interface Env {
  HANZO_API_KEY: string;
}

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, a helpful assistant for the Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo services, APIs, SDKs, and infrastructure. ' +
  'Be concise and accurate. When referencing docs, use relative URLs like /docs/services/cloud.';

const GATEWAY_URL = 'https://api.hanzo.ai/v1/chat/completions';
const MODEL = 'zen-coder-flash';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.HANZO_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI chat is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const body = await context.request.json() as {
    messages?: Array<{ role: string; content: string }>;
  };

  if (!body.messages || !Array.isArray(body.messages)) {
    return new Response(
      JSON.stringify({ error: 'Invalid request: messages array required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Forward to LLM Gateway with streaming
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...body.messages,
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return new Response(
      JSON.stringify({ error: `LLM Gateway error: ${response.status}`, detail: text }),
      { status: response.status, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Stream the OpenAI SSE response back to the client, converting to
  // Vercel AI SDK UI message stream format.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') {
              // Send finish message in AI SDK format
              controller.enqueue(encoder.encode('d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) {
                // AI SDK text part format: 0:"text content"
                controller.enqueue(
                  encoder.encode(`0:${JSON.stringify(delta.content)}\n`)
                );
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Vercel-AI-Data-Stream': 'v1',
    },
  });
};
