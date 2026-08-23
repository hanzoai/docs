'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PROVIDER_ICONS } from '@/components/provider-icons';

// The masthead. Three doors, one model, and nothing else above the fold.
//
// A developer arriving here is answering one question — "how do I start?" — and
// there are exactly three honest answers, in descending order of how much code
// they want to write: describe it to the app, tell Dev in a terminal, or call the
// API yourself. Everything else on this page is downstream of that choice, so the
// choice is the only thing offered up top.
//
// The doors are TABS, not just links. Picking one swaps the panel below to that
// path's real first step — the actual prompt, the actual command, the actual
// request. A reader can compare all three without leaving the page or committing,
// which is the whole point: the doors differ in how much you type, and showing
// that is more honest than three paragraphs claiming it.
//
// Monochrome, because Hanzo's tokens are (--color-brand is hsl(0,0%,96%) on
// hsl(0,0%,4%)). Nothing here introduces a hue the rest of the site does not use;
// the only emphasis available is weight, border and motion, so those carry it.

/** Assistants a reader might paste the prompt into, from our own icon set. */

// The clipboard payload lives in lib/agent-setup-prompt.ts — see the note there
// for why it instructs the AGENT rather than describing steps to a human.

/**
 * The three paths, ordered by how much you type. Each carries its real first
 * step — these are commands that work, not illustrative pseudocode.
 */
const PATHS = [
  {
    id: 'app',
    eyebrow: 'No code',
    title: 'Build with App',
    body: 'Describe what you want in English. Chat, agents and MCP tools in the browser — nothing to install.',
    href: 'https://hanzo.app',
    external: true,
    cta: 'Open hanzo.app',
    lang: 'You type',
    code: 'Build me a multiplayer snake game with a\nleaderboard, and deploy it.',
  },
  {
    id: 'cli',
    eyebrow: 'In your terminal',
    title: 'Build with Dev',
    body: 'Our coding agent, in your repo. It reads the codebase, writes the change and runs the tests.',
    href: '/docs/cli',
    external: false,
    cta: 'Read the CLI docs',
    lang: 'Terminal',
    code: 'curl -fsSL hanzo.sh | bash\nhanzo auth login\nhanzo dev "add a leaderboard to the game"',
  },
  {
    id: 'api',
    eyebrow: 'Lower level',
    title: 'Build with API',
    body: 'Over 400 models behind one REST endpoint. One bearer token works across every service we run.',
    href: '/docs/openapi',
    external: false,
    cta: 'Read the API reference',
    lang: 'Request',
    code: 'curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer sk-..." \\\n  -d \'{"model":"enso","messages":[...]}\'',
  },
] as const;

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

export function DocsHero({
  title = 'Build Anything with Hanzo',
  description = 'Over 400 models, one platform. Pick how much you want to type.',
}: {
  title?: string;
  description?: string;
}) {
  const [active, setActive] = useState<string>(PATHS[0].id);

  const path = PATHS.find((d) => d.id === active) ?? PATHS[0];


  return (
    <div className="not-prose mb-12">
      {/* Entrance and panel motion. Colocated rather than pushed into globals.css:
          these keyframes have exactly one consumer, and globals.css is where the
          font-token overrides live — not a file to touch for a decoration.
          Everything is gated on prefers-reduced-motion, which resolves the whole
          block to no animation rather than a faster one. */}
      <style>{`
        @keyframes hanzo-rise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .hanzo-rise {
          opacity: 0;
          animation: hanzo-rise .55s cubic-bezier(.16,1,.3,1) forwards;
          animation-delay: var(--d, 0ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .hanzo-rise { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="hanzo-rise mb-4 flex items-center gap-2.5">
        <BrandIcon name="hanzo" />
      </div>

      <h1
        className="hanzo-rise mb-3 text-4xl font-semibold tracking-tight text-fd-foreground md:text-5xl"
        style={{ ['--d' as string]: '60ms' }}
      >
        {title}
      </h1>

      <p
        className="hanzo-rise mb-8 max-w-xl text-base text-fd-muted-foreground md:text-lg"
        style={{ ['--d' as string]: '120ms' }}
      >
        {description}
      </p>

      {/* The three doors. Each is a tab: hovering or focusing selects it, so the
          panel below follows the pointer and a reader compares paths by moving
          across them rather than by clicking three times. */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {PATHS.map((d, i) => {
          const on = d.id === active;
          return (
            <button
              key={d.id}
              type="button"
              onMouseEnter={() => setActive(d.id)}
              onFocus={() => setActive(d.id)}
              onClick={() => setActive(d.id)}
              aria-pressed={on}
              className={[
                'hanzo-rise group flex flex-col rounded-xl border p-5 text-left',
                'transition-[transform,border-color,background-color] duration-200',
                'hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
                on
                  ? 'border-fd-foreground/30 bg-fd-accent/50'
                  : 'border-fd-border bg-fd-card/40 hover:border-fd-foreground/20',
              ].join(' ')}
              style={{ ['--d' as string]: `${180 + i * 70}ms` }}
            >
              <span className="mb-2 text-xs font-medium text-fd-muted-foreground">
                {d.eyebrow}
              </span>
              <span className="mb-1.5 flex items-center gap-1.5 text-base font-semibold text-fd-foreground">
                {d.title}
                <span
                  aria-hidden
                  className={[
                    'transition-[transform,opacity] duration-200',
                    on ? 'translate-x-0.5 opacity-100' : 'opacity-40',
                  ].join(' ')}
                >
                  →
                </span>
              </span>
              <span className="text-sm leading-relaxed text-fd-muted-foreground">{d.body}</span>
            </button>
          );
        })}
      </div>

      {/* The selected path's real first step. Keyed on the path id so React
          remounts it and the entrance animation replays on every switch — the
          movement is what tells you the panel answers the thing you just hovered. */}
      <div
        className="hanzo-rise mb-8 overflow-hidden rounded-xl border border-fd-border bg-fd-card/40"
        style={{ ['--d' as string]: '400ms' }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-fd-border px-4 py-2.5">
          <span className="text-xs font-medium text-fd-muted-foreground">
            {path.lang}
          </span>
          <Link
            href={path.href}
            {...(path.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="text-xs text-fd-muted-foreground underline-offset-4 transition-colors hover:text-fd-foreground hover:underline"
          >
            {path.cta} →
          </Link>
        </div>
        <pre key={path.id} className="hanzo-rise overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed text-fd-foreground">
          <code>{path.code}</code>
        </pre>
      </div>

      {/* The model, because it is the reason to choose the platform at all. */}
      <Link
        href="https://hanzo.ai/enso"
        target="_blank"
        rel="noreferrer"
        className="hanzo-rise group mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-fd-border bg-fd-card/40 px-5 py-4 transition-colors hover:border-fd-foreground/25 hover:bg-fd-accent/40"
        style={{ ['--d' as string]: '460ms' }}
      >
        <span className="rounded border border-fd-border px-1.5 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
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

      {/* The action row, in the order a reader needs it: start, hand the docs to an
          assistant, or — for anyone who would rather be shown than told — go build
          something that plays. */}
      <div
        className="hanzo-rise flex flex-wrap items-center gap-3"
        style={{ ['--d' as string]: '520ms' }}
      >
        <Link
          href="#get-going"
          className="inline-flex h-10 items-center rounded-full bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Get started
        </Link>

      </div>
    </div>
  );
}
