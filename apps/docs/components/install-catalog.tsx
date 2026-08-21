'use client';

// Everywhere Hanzo installs — the ONE place to find the snippet for the stack you
// already have, rather than reading a per-language SDK page and translating it.
//
// The counterpart to <ConnectorsCatalog/>, which answers "what can Hanzo connect
// TO"; this answers "what can I install Hanzo INTO". Same lazy-island pattern,
// rendered inline in the docs, never a link-out to a second site.
//
// Each entry carries the command or snippet that actually starts the work, so the
// catalog is usable without leaving the page: a framework that installs from npm
// shows the npm line, one that ships a tag shows the tag.
import { useMemo, useState } from 'react';
import { Search, Check, Copy } from 'lucide-react';

type Kind = 'web' | 'mobile' | 'server' | 'llm' | 'platform';

type Target = {
  id: string;
  label: string;
  kind: Kind;
  /** The line that starts the work — an install command, or the tag to paste. */
  install: string;
  /** Where the SDK's own page lives, when it has one. */
  docs?: string;
};

// Ordered by kind, then by how likely a reader is to be on it. The list is the
// same set the product's own install step offers, so a framework that works there
// is discoverable here and vice versa.
const TARGETS: Target[] = [
  // Web
  { id: 'nextjs', label: 'Next.js', kind: 'web', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'react', label: 'React', kind: 'web', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'vue', label: 'Vue', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'svelte', label: 'Svelte', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'angular', label: 'Angular', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'astro', label: 'Astro', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'remix', label: 'Remix', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'nuxt', label: 'Nuxt', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'vite', label: 'Vite', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'tanstack', label: 'TanStack Start', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'html', label: 'HTML snippet', kind: 'web', install: '<script src="https://cdn.hanzo.ai/event.js"></script>' },

  // Mobile
  { id: 'ios', label: 'iOS', kind: 'mobile', install: 'pod "Hanzo"', docs: '/docs/sdks/swift' },
  { id: 'android', label: 'Android', kind: 'mobile', install: 'implementation("ai.hanzo:hanzo")', docs: '/docs/sdks/kotlin' },
  { id: 'react-native', label: 'React Native', kind: 'mobile', install: 'npm i @hanzo/event' },
  { id: 'flutter', label: 'Flutter', kind: 'mobile', install: 'flutter pub add hanzo' },

  // Server
  { id: 'node', label: 'Node.js', kind: 'server', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'python', label: 'Python', kind: 'server', install: 'pip install hanzoai', docs: '/docs/sdks/python' },
  { id: 'go', label: 'Go', kind: 'server', install: 'go get github.com/hanzoai/go', docs: '/docs/sdks/go' },
  { id: 'rust', label: 'Rust', kind: 'server', install: 'cargo add hanzo', docs: '/docs/sdks/rust' },
  { id: 'cpp', label: 'C++', kind: 'server', install: 'find_package(hanzo)', docs: '/docs/sdks/cpp' },
  { id: 'ruby', label: 'Ruby', kind: 'server', install: 'gem install hanzo' },
  { id: 'rails', label: 'Ruby on Rails', kind: 'server', install: 'gem install hanzo' },
  { id: 'php', label: 'PHP', kind: 'server', install: 'composer require hanzo/hanzo' },
  { id: 'laravel', label: 'Laravel', kind: 'server', install: 'composer require hanzo/hanzo' },
  { id: 'django', label: 'Django', kind: 'server', install: 'pip install hanzoai', docs: '/docs/sdks/python' },
  { id: 'elixir', label: 'Elixir', kind: 'server', install: '{:hanzo, "~> 1.0"}' },
  { id: 'api', label: 'HTTP API', kind: 'server', install: 'POST https://api.hanzo.ai/v1/event', docs: '/docs/openapi' },

  // LLM
  { id: 'openai', label: 'OpenAI-compatible', kind: 'llm', install: 'base_url="https://api.hanzo.ai/v1"', docs: '/docs/openapi' },
  { id: 'anthropic', label: 'Anthropic-compatible', kind: 'llm', install: 'base_url="https://api.hanzo.ai/v1"', docs: '/docs/openapi' },
  { id: 'ai-sdk', label: 'Vercel AI SDK', kind: 'llm', install: 'npm i @hanzo/ai' },
  { id: 'langchain', label: 'LangChain', kind: 'llm', install: 'pip install hanzoai' },
  { id: 'llamaindex', label: 'LlamaIndex', kind: 'llm', install: 'pip install hanzoai' },
  { id: 'mcp', label: 'MCP', kind: 'llm', install: 'npx @hanzo/mcp', docs: '/docs/mcp' },

  // Platform / no-code
  { id: 'wordpress', label: 'WordPress', kind: 'platform', install: 'Hanzo plugin' },
  { id: 'shopify', label: 'Shopify', kind: 'platform', install: 'Hanzo app' },
  { id: 'webflow', label: 'Webflow', kind: 'platform', install: 'Custom code → head' },
  { id: 'framer', label: 'Framer', kind: 'platform', install: 'Custom code → head' },
  { id: 'bubble', label: 'Bubble', kind: 'platform', install: 'Hanzo plugin' },
  { id: 'gtm', label: 'Google Tag Manager', kind: 'platform', install: 'Custom HTML tag' },
  { id: 'segment', label: 'Segment', kind: 'platform', install: 'Hanzo destination' },
  { id: 'zapier', label: 'Zapier', kind: 'platform', install: 'Hanzo app' },
  { id: 'n8n', label: 'n8n', kind: 'platform', install: 'Hanzo node' },
  { id: 'retool', label: 'Retool', kind: 'platform', install: 'REST resource' },
  { id: 'docusaurus', label: 'Docusaurus', kind: 'platform', install: 'npm i @hanzo/event' },
];

const KINDS: { id: Kind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'server', label: 'Server' },
  { id: 'llm', label: 'LLM' },
  { id: 'platform', label: 'Platform' },
];

function Row({ t }: { t: Target }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-fd-border bg-fd-card p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{t.label}</span>
        {t.docs ? (
          <a href={t.docs} className="text-xs text-fd-muted-foreground underline-offset-2 hover:underline">
            docs
          </a>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(t.install);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="group flex items-center justify-between gap-2 rounded border border-fd-border bg-fd-secondary/40 px-2 py-1.5 text-left font-mono text-xs"
        aria-label={`Copy install for ${t.label}`}
      >
        <code className="truncate">{t.install}</code>
        {copied ? (
          <Check className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <Copy className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden />
        )}
      </button>
    </div>
  );
}

export function InstallCatalog() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind | 'all'>('all');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TARGETS.filter(
      (t) =>
        (kind === 'all' || t.kind === kind) &&
        (needle === '' || t.label.toLowerCase().includes(needle) || t.id.includes(needle)),
    );
  }, [q, kind]);

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-fd-muted-foreground" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search frameworks and platforms"
            aria-label="Search frameworks and platforms"
            className="w-full rounded-md border border-fd-border bg-fd-background py-1.5 pl-8 pr-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={
                'rounded-md px-2.5 py-1 text-sm ' +
                (kind === k.id
                  ? 'bg-fd-primary text-fd-primary-foreground'
                  : 'text-fd-muted-foreground hover:bg-fd-secondary')
              }
            >
              {k.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <Row key={t.id} t={t} />
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-fd-muted-foreground">
          Nothing matches “{q}”. Every stack can use the{' '}
          <a href="/docs/openapi" className="underline underline-offset-2">
            HTTP API
          </a>
          .
        </p>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          {shown.length} of {TARGETS.length}. Anything not listed reaches the same endpoints over the{' '}
          <a href="/docs/openapi" className="underline underline-offset-2">
            HTTP API
          </a>
          .
        </p>
      )}
    </div>
  );
}
