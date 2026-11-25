'use client';

import type { ReactNode } from 'react';
import type { FeedbackBlockProps } from '@hanzo/docs-core/mdx-plugins/remark-feedback-block';
import { Feedback as FeedbackInner, FeedbackText as FeedbackBlockInner } from './client';
import type { ActionResponse, BlockFeedback, PageFeedback } from './schema';

const COLLECTOR_URL = 'https://api.hanzo.ai/v1/event';
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY?.trim() ||
  'pk-CmfLA2K6kvsPflrS9DSkt06H_kSoQB_21sjedt6VJdc';
const RELEASE = process.env.NEXT_PUBLIC_HANZO_RELEASE?.trim() || 'docs';
const GITHUB_ISSUES_URL = 'https://github.com/hanzoai/docs/issues';

function scrub(text: string): string {
  return text
    .replace(/eyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]*/g, '[redacted]')
    .replace(/\b(Bearer|Basic)\s+[\w.~+/=-]{8,}/gi, '$1 [redacted]')
    .replace(/\b(?:sk|pk|hk|rk|ghp|gho|ghs|github_pat)[-_]?[\w-]{12,}/g, '[redacted]')
    .replace(/\b[\w.+-]+@[\w-]+(?:\.[a-z0-9-]+)+\b/gi, '[redacted]');
}

function anonId(): string {
  try {
    const key = 'hanzo:docs:anon';
    const existing = window.localStorage?.getItem(key);
    if (existing) return existing;
    const fresh = `docs_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage?.setItem(key, fresh);
    return fresh;
  } catch {
    return `docs_${Date.now().toString(36)}`;
  }
}

async function sendDocsFeedback(
  kind: 'page' | 'block',
  input: { url: string; message: string; opinion?: string; blockId?: string; blockBody?: string },
): Promise<ActionResponse> {
  try {
    if (typeof window !== 'undefined' && typeof fetch === 'function') {
      const now = Date.now();
      const host = window.location?.hostname || 'docs.hanzo.ai';
      const path = scrub(window.location?.pathname || '/');
      const cleanMessage = scrub(String(input.message || '')).slice(0, 1000);
      const summary =
        kind === 'page'
          ? `[docs:${input.opinion ?? 'feedback'}] ${cleanMessage || path}`
          : `[docs:block:${input.blockId ?? 'section'}] ${cleanMessage || path}`;
      const body = JSON.stringify({
        batch: [
          {
            messageId: `docs-fb-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            type: 'error',
            event: 'user_feedback',
            timestamp: new Date(now).toISOString(),
            distinctId: anonId(),
            product: 'docs',
            release: RELEASE,
            environment: 'production',
            site: host,
            url: scrub(input.url || `${window.location?.origin || 'https://docs.hanzo.ai'}${path}`),
            path,
            level: 'info',
            library: '@hanzo/docs-feedback',
            libraryVersion: RELEASE,
            error: {
              type: 'UserFeedback',
              message: summary.slice(0, 500),
              handled: true,
            },
            properties: {
              feedback: true,
              source: 'docs',
              release: RELEASE,
              feedback_kind: kind,
              ...(input.opinion ? { opinion: input.opinion } : {}),
              ...(input.blockId ? { block_id: input.blockId } : {}),
              ...(input.blockBody ? { block_body: scrub(input.blockBody).slice(0, 300) } : {}),
              message: cleanMessage,
            },
          },
        ],
      });
      await fetch(`${COLLECTOR_URL}?ingest_key=${encodeURIComponent(PUBLISHABLE_KEY)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* fail-soft so feedback UI still confirms gracefully */
  }
  return { githubUrl: GITHUB_ISSUES_URL };
}

async function submitPageFeedback(feedback: PageFeedback): Promise<ActionResponse> {
  return sendDocsFeedback('page', feedback);
}

async function submitBlockFeedback(feedback: BlockFeedback): Promise<ActionResponse> {
  return sendDocsFeedback('block', feedback);
}

export function PageFeedback() {
  return <FeedbackInner onSendAction={submitPageFeedback} />;
}

export function PageFeedbackBlock({
  children,
  ...props
}: FeedbackBlockProps & { children: ReactNode }) {
  return (
    <FeedbackBlockInner {...props} onSendAction={submitBlockFeedback}>
      {children}
    </FeedbackBlockInner>
  );
}
