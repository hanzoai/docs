'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROVIDER_ICONS } from '@/components/provider-icons';

// The masthead. Two doors and one model, and nothing else above the fold.
//
// A developer arriving here is answering one question — "how do I start?" — and the
// honest answer is binary: build WITH the AI (chat, agents, MCP) over at hanzo.app,
// or build AGAINST it (API, CLI, SDKs) from these docs. Everything else on this page
// is downstream of that fork, so the fork is the only choice offered up top.
//
// Seven things, deliberately: wordmark, headline, one line of copy, two doors, the
// Enso strip, and the prompt button. Each extra option costs a reader more than it
// gives them, and this page's job is to get them through one of the two doors.
//
// Monochrome, because Hanzo's tokens are (--color-brand is hsl(0,0%,96%) on
// hsl(0,0%,4%)). Nothing here introduces a hue the rest of the site does not use.

/** Assistants a reader might paste the prompt into, from our own icon set. */
const ASSISTANTS = ['hanzo', 'anthropic', 'openai', 'google'] as const;

/**
 * Points an assistant at the machine-readable corpus rather than paraphrasing it,
 * so it answers from current docs instead of its training data.
 */
const PROMPT = [
  'Read the Hanzo developer documentation at https://docs.hanzo.ai/llms.txt',
  'and answer questions about the Hanzo platform using it.',
  '',
  'The REST API is at https://api.hanzo.ai/v1 and takes a bearer token:',
  'an API key (hk-...) for server-to-server calls, or an IAM access token',
  'for user-facing apps.',
].join('\n');

function BrandIcon({ name, className = 'size-4' }: { name: string; className?: string }) {
  const svg = PROVIDER_ICONS[name];
  if (!svg) return null;
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center ${className} [&>svg]:size-full`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/** One of the two doors. Whole card is the target — not a link buried in prose. */
function Door({
  href,
  eyebrow,
  title,
  body,
  external,
}: {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group flex flex-col rounded-xl border border-fd-border bg-fd-card/40 p-6 transition-colors hover:border-fd-foreground/25 hover:bg-fd-accent/40"
    >
      <span className="mb-2 text-[11px] uppercase tracking-[0.16em] text-fd-muted-foreground">
        {eyebrow}
      </span>
      <span className="mb-1.5 flex items-center gap-1.5 text-lg font-semibold text-fd-foreground">
        {title}
        <span
          aria-hidden
          className="translate-x-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
        >
          →
        </span>
      </span>
      <span className="text-sm leading-relaxed text-fd-muted-foreground">{body}</span>
    </Link>
  );
}

export function DocsHero({
  title = 'Build anything with Hanzo',
  description = 'Over 400 models, one platform. Start in the app, or wire it into your own stack.',
}: {
  title?: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      // Revert rather than latch — a button stuck on "Copied" reads as broken.
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="not-prose mb-12">
      <div className="mb-4 flex items-center gap-2.5">
        <BrandIcon name="hanzo" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-fd-muted-foreground">
          Hanzo
        </span>
      </div>

      <h1 className="mb-3 text-4xl font-semibold tracking-tight text-fd-foreground md:text-5xl">
        {title}
      </h1>

      <p className="mb-8 max-w-xl text-base text-fd-muted-foreground md:text-lg">{description}</p>

      {/* The fork. hanzo.app is the product surface; these docs are the developer one. */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Door
          href="https://hanzo.app"
          external
          eyebrow="No code required"
          title="Build with AI"
          body="Chat, agents and MCP tools in the browser. Sign in and start building — nothing to install."
        />
        <Door
          href="/docs/api"
          eyebrow="In your own stack"
          title="Build with code"
          body="Over 400 models behind one REST API, a CLI, and SDKs for every language. One bearer token works across every service."
        />
      </div>

      {/* The model, because it is the reason to choose the platform at all. */}
      <Link
        href="https://hanzo.ai/enso"
        target="_blank"
        rel="noreferrer"
        className="group mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-fd-border bg-fd-card/40 px-5 py-4 transition-colors hover:border-fd-foreground/25 hover:bg-fd-accent/40"
      >
        <span className="rounded border border-fd-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-fd-muted-foreground">
          Enso
        </span>
        <span className="text-sm font-medium text-fd-foreground">
          Our frontier model, and the default on every surface
        </span>
        <span className="text-sm text-fd-muted-foreground">
          Zen stays open weights.{' '}
          <span className="text-fd-foreground/70 underline-offset-4 group-hover:underline">
            Meet Enso →
          </span>
        </span>
      </Link>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy a prompt that points your assistant at these docs"
        className="inline-flex h-10 items-center gap-3 rounded-full border border-fd-border px-5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
      >
        <span className="flex items-center gap-1.5 text-fd-muted-foreground">
          {ASSISTANTS.map((name) => (
            <BrandIcon key={name} name={name} className="size-4" />
          ))}
        </span>
        {copied ? 'Copied' : 'Copy prompt'}
      </button>
    </div>
  );
}
