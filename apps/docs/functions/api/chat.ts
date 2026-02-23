// CF Pages Function — proxies chat requests to Hanzo LLM Gateway.
//
// Two modes:
// 1. Unauthenticated: Rate-limited per IP (ANON_RATE_LIMIT per RATE_WINDOW_MS).
//    Uses server-side HANZO_API_KEY so no secret is exposed to the client.
// 2. Authenticated: Client sends `Authorization: Bearer <iam-token>`.
//    Token is validated against IAM userinfo. Higher rate limit.

interface Env {
  HANZO_API_KEY: string;
  // KV namespace for rate limiting (bind in CF Pages settings as RATE_LIMIT)
  RATE_LIMIT?: KVNamespace;
}

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, a helpful assistant for the Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo services, APIs, SDKs, and infrastructure. ' +
  'Be concise and accurate. When referencing docs, use relative URLs like /docs/services/cloud.';

const GATEWAY_URL = 'https://api.hanzo.ai/v1/chat/completions';
const MODEL = 'zen-coder-flash';
const IAM_USERINFO_URL = 'https://hanzo.id/api/userinfo';

// Rate limits
const ANON_RATE_LIMIT = 10;       // requests per window for anonymous users
const AUTH_RATE_LIMIT = 100;      // requests per window for authenticated users
const RATE_WINDOW_MS = 3600_000;  // 1 hour

function getClientIP(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

// Simple in-memory rate limiter fallback (per-isolate, resets on cold start).
// For production, use the KV-based limiter below.
const memoryStore = new Map<string, { count: number; reset: number }>();

async function checkRateLimit(
  key: string,
  limit: number,
  kv?: KVNamespace,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const windowEnd = now + RATE_WINDOW_MS;

  // KV-based rate limiting (persistent across isolates)
  if (kv) {
    const stored = await kv.get<{ count: number; reset: number }>(key, 'json');
    if (stored && stored.reset > now) {
      if (stored.count >= limit) {
        return { allowed: false, remaining: 0, reset: stored.reset };
      }
      stored.count++;
      await kv.put(key, JSON.stringify(stored), {
        expirationTtl: Math.ceil(RATE_WINDOW_MS / 1000),
      });
      return { allowed: true, remaining: limit - stored.count, reset: stored.reset };
    }
    const entry = { count: 1, reset: windowEnd };
    await kv.put(key, JSON.stringify(entry), {
      expirationTtl: Math.ceil(RATE_WINDOW_MS / 1000),
    });
    return { allowed: true, remaining: limit - 1, reset: windowEnd };
  }

  // In-memory fallback
  const entry = memoryStore.get(key);
  if (entry && entry.reset > now) {
    if (entry.count >= limit) {
      return { allowed: false, remaining: 0, reset: entry.reset };
    }
    entry.count++;
    return { allowed: true, remaining: limit - entry.count, reset: entry.reset };
  }
  memoryStore.set(key, { count: 1, reset: windowEnd });
  return { allowed: true, remaining: limit - 1, reset: windowEnd };
}

async function validateIAMToken(token: string): Promise<string | null> {
  try {
    const res = await fetch(IAM_USERINFO_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { sub?: string; email?: string };
    return user.sub || user.email || null;
  } catch {
    return null;
  }
}

function rateLimitHeaders(remaining: number, reset: number): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.HANZO_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'AI chat is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Determine auth mode
  const authHeader = context.request.headers.get('authorization');
  let userId: string | null = null;
  let rateKey: string;
  let rateLimit: number;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    userId = await validateIAMToken(token);
    if (userId) {
      rateKey = `auth:${userId}`;
      rateLimit = AUTH_RATE_LIMIT;
    } else {
      // Invalid token — treat as anonymous
      const ip = getClientIP(context.request);
      rateKey = `anon:${ip}`;
      rateLimit = ANON_RATE_LIMIT;
    }
  } else {
    const ip = getClientIP(context.request);
    rateKey = `anon:${ip}`;
    rateLimit = ANON_RATE_LIMIT;
  }

  // Check rate limit
  const rl = await checkRateLimit(rateKey, rateLimit, context.env.RATE_LIMIT);
  if (!rl.allowed) {
    const loginHint = !userId
      ? ' Sign in at hanzo.id for higher limits.'
      : '';
    return new Response(
      JSON.stringify({
        error: `Rate limit exceeded.${loginHint}`,
        retryAfter: Math.ceil((rl.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rl.reset - Date.now()) / 1000)),
          ...rateLimitHeaders(rl.remaining, rl.reset),
        },
      },
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
      ...rateLimitHeaders(rl.remaining, rl.reset),
    },
  });
};
