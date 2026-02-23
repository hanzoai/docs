/**
 * HanzoChatTransport -- a ChatTransport that calls the Hanzo LLM Gateway
 * (OpenAI-compatible /v1/chat/completions) directly from the browser.
 *
 * Works in static exports (CF Pages) where Next.js API routes don't exist.
 */
import type { UIMessage } from '@ai-sdk/react';
import type { ChatTransport, UIMessageChunk } from 'ai';

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, a helpful assistant for the Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo services, APIs, SDKs, and infrastructure. ' +
  'Be concise and accurate.';

interface HanzoChatTransportOptions {
  baseURL?: string;
  apiKey?: string;
  model?: string;
}

export class HanzoChatTransport implements ChatTransport<UIMessage> {
  private baseURL: string;
  private apiKey: string;
  private model: string;

  constructor(options: HanzoChatTransportOptions = {}) {
    this.baseURL = options.baseURL ?? 'https://api.hanzo.ai/v1';
    this.apiKey = options.apiKey ?? '';
    this.model = options.model ?? 'zen-coder-flash';
  }

  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>['sendMessages']>[0]): Promise<
    ReadableStream<UIMessageChunk>
  > {
    // Convert UIMessage[] to OpenAI messages format
    const openaiMessages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    for (const msg of messages) {
      let text = '';
      if (msg.parts) {
        for (const part of msg.parts) {
          if (part.type === 'text') {
            text += part.text;
          }
        }
      }
      if (text) {
        openaiMessages.push({ role: msg.role, content: text });
      }
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        messages: openaiMessages,
        stream: true,
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return new ReadableStream<UIMessageChunk>({
        start(controller) {
          controller.enqueue({
            type: 'error',
            errorText: `API error ${response.status}: ${errorText}`,
          });
          controller.close();
        },
      });
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let started = false;
    const textId = crypto.randomUUID();

    return new ReadableStream<UIMessageChunk>({
      async pull(controller) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            if (started) {
              controller.enqueue({ type: 'text-end', id: textId });
            }
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              if (started) {
                controller.enqueue({ type: 'text-end', id: textId });
              }
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta.length > 0) {
                if (!started) {
                  controller.enqueue({ type: 'text-start', id: textId });
                  started = true;
                }
                controller.enqueue({ type: 'text-delta', id: textId, delta });
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }
      },
      cancel() {
        reader.cancel();
      },
    });
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    // Direct browser transport does not support reconnection
    return null;
  }
}
