'use client';

import { PROVIDER_ICONS } from '@/components/provider-icons';

// The providers, as marks rather than a list of words.
//
// A reader scanning for "can I use Claude here" finds a logo in a glance and a
// noun in a second. Names alone make them read seven lines to answer one question.
// These are the real brand marks from hanzoai/icons (our MIT fork of lobe-icons),
// already vendored in this app for the models catalogue — no CDN, no runtime dep.
//
// Ordered deliberately: Zen first because the open weights are ours, then the
// frontier labs, then the rest of the open families. Not alphabetical — the order
// is the argument.
const PROVIDERS = [
  { key: 'hanzo', name: 'Zen', note: 'Open weights' },
  { key: 'openai', name: 'OpenAI', note: 'GPT' },
  { key: 'anthropic', name: 'Anthropic', note: 'Claude' },
  { key: 'google', name: 'Google', note: 'Gemini' },
  { key: 'qwen', name: 'Qwen', note: 'Open' },
  { key: 'meta', name: 'Llama', note: 'Open' },
  { key: 'deepseek', name: 'DeepSeek', note: 'Open' },
  { key: 'mistral', name: 'Mistral', note: 'Open' },
] as const;

function Mark({ svg }: { svg: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex size-6 items-center justify-center text-fd-foreground [&>svg]:size-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function ProviderStrip() {
  return (
    <div className="not-prose my-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-4">
      {PROVIDERS.map(({ key, name, note }) => {
        const svg = PROVIDER_ICONS[key];
        if (!svg) return null;
        return (
          <div
            key={key}
            className="flex flex-col gap-2 bg-fd-background p-4 transition-colors hover:bg-fd-accent/40"
          >
            <Mark svg={svg} />
            <div>
              <div className="text-sm font-medium text-fd-foreground">{name}</div>
              <div className="text-xs text-fd-muted-foreground">{note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
