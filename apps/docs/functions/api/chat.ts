// CF Pages Function — proxies chat requests to Hanzo LLM Gateway.
//
// Two modes:
// 1. Unauthenticated: Uses server-side HANZO_API_KEY. Gateway handles
//    rate limiting natively (100/min per IP via KrakenD config).
// 2. Authenticated: Client sends `Authorization: Bearer <iam-token>`.
//    Token is forwarded to gateway for user-level rate limiting.
//
// No CF KV or client-side secrets needed — the gateway is the single
// source of truth for auth, rate limiting, and usage tracking.

interface Env {
  HANZO_API_KEY: string;
}

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, powered by Zen LM. You help users with Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo services, APIs, SDKs, and infrastructure. ' +
  'Be concise and accurate. When referencing docs, use relative URLs like /docs/services/cloud.';

const GATEWAY_URL = 'https://api.hanzo.ai/v1/chat/completions';
const MODEL = 'zen4-mini';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const serverKey = context.env.HANZO_API_KEY;
  if (!serverKey) {
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

  // Use client's IAM token if present, otherwise fall back to server key.
  // The gateway handles rate limiting based on the auth identity.
  const clientAuth = context.request.headers.get('authorization');
  const authToken = clientAuth?.startsWith('Bearer ') ? clientAuth.slice(7) : serverKey;

  // Forward client IP so the gateway can rate-limit anonymous requests per IP.
  const clientIP =
    context.request.headers.get('cf-connecting-ip') ||
    context.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };
  if (clientIP) {
    headers['X-Forwarded-For'] = clientIP;
    headers['X-Real-IP'] = clientIP;
  }

  // Forward to LLM Gateway with streaming
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers,
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
    // Pass through gateway rate limit headers
    const retryAfter = response.headers.get('retry-after');
    const respHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (retryAfter) respHeaders['Retry-After'] = retryAfter;

    return new Response(
      JSON.stringify({
        error: response.status === 429
          ? 'Rate limit exceeded. Sign in at hanzo.id for higher limits.'
          : `LLM Gateway error: ${response.status}`,
        detail: text,
      }),
      { status: response.status, headers: respHeaders },
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
              controller.enqueue(encoder.encode('d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'));
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) {
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
