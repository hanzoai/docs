'use client';

// Live model catalog + pricing, rendered inline in the docs (never a link-out).
// Fetches the real gateway catalog at runtime so a static export always shows
// the current models/prices without a rebuild. Grouped by family, searchable,
// theme-aware via Fumadocs fd-* tokens.
import { useEffect, useMemo, useState } from 'react';
import { Search, Copy, Check, Cpu, Sparkles, Zap, Box } from 'lucide-react';

const ENDPOINT = 'https://api.hanzo.ai/v1/models';

type Pricing = { input: number | null; output: number | null; cacheRead: number | null; cacheWrite: number | null };
type Model = {
  id: string;
  name: string;
  fullName?: string;
  description?: string;
  features?: string[];
  tier?: string;
  context?: number | null;
  pricing?: Pricing;
  provider?: string;
  owned_by?: string;
};
type Family = { id: string; name: string; description?: string; icon?: string; models: string[] };
type Catalog = { data: Model[]; families?: Family[]; summary?: Record<string, number>; updated?: string };

const FAMILY_ICON: Record<string, typeof Sparkles> = { Sparkles, Zap, Cpu, Box };

// Prices come back as USD per 1M tokens.
function price(v: number | null | undefined): string {
  if (v == null) return '—';
  if (v === 0) return 'Free';
  return `$${v < 1 ? v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') : v.toFixed(2)}`;
}
function ctx(n: number | null | undefined): string {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

// Provider identity chip — a stable, self-contained monogram (no external logo
// assets, so it works in a static export for all 59 providers uniformly). The
// tint is derived deterministically from the name, so a provider always reads
// the same color across sessions. currentColor-free HSL keeps it legible in
// both themes.
function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}
function initials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase() || '?';
}
function ProviderChip({ name }: { name: string }) {
  const hue = hashHue(name.toLowerCase());
  return (
    <span
      aria-hidden
      className="inline-flex size-5 shrink-0 items-center justify-center rounded text-[9px] font-semibold leading-none"
      style={{
        background: `hsl(${hue} 55% 92%)`,
        color: `hsl(${hue} 60% 32%)`,
        boxShadow: `inset 0 0 0 1px hsl(${hue} 45% 82%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function CopyId({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(id).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
      className="group inline-flex items-center gap-1.5 font-mono text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
      title="Copy model id"
    >
      <span>{id}</span>
      {done ? <Check className="size-3 text-green-500" /> : <Copy className="size-3 opacity-0 group-hover:opacity-60" />}
    </button>
  );
}

function ModelRow({ m }: { m: Model }) {
  const p = m.pricing;
  return (
    <tr className="border-t border-fd-border/60 hover:bg-fd-muted/40 transition-colors">
      <td className="py-2.5 pr-4 align-top">
        <div className="font-medium text-fd-foreground">{m.fullName || m.name || m.id}</div>
        <CopyId id={m.id} />
        {m.tier ? (
          <span className="ml-2 rounded bg-fd-primary/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-fd-primary align-middle">
            {m.tier}
          </span>
        ) : null}
      </td>
      <td className="py-2.5 px-3 text-right align-top tabular-nums text-fd-muted-foreground">{ctx(m.context)}</td>
      <td className="py-2.5 px-3 text-right align-top tabular-nums">{price(p?.input)}</td>
      <td className="py-2.5 px-3 text-right align-top tabular-nums">{price(p?.output)}</td>
      <td className="py-2.5 pl-3 align-top">
        <div className="flex flex-wrap gap-1 justify-end">
          {(m.features ?? []).slice(0, 4).map((f) => (
            <span key={f} className="rounded border border-fd-border px-1.5 py-0.5 text-[10px] text-fd-muted-foreground">
              {f}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}

export function ModelsCatalog() {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let live = true;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: Catalog) => live && setCat(d))
      .catch((e) => live && setErr(String(e.message || e)));
    return () => {
      live = false;
    };
  }, []);

  const groups = useMemo(() => {
    if (!cat) return [];
    const byId = new Map(cat.data.map((m) => [m.id, m]));
    const claimed = new Set<string>();
    const fams = (cat.families ?? []).map((f) => {
      const models = f.models.map((id) => byId.get(id)).filter(Boolean) as Model[];
      models.forEach((m) => claimed.add(m.id));
      return { ...f, resolved: models };
    });
    // Everything not in a curated (Hanzo) family groups BY PROVIDER — OpenAI,
    // Anthropic, Google, Qwen, … — sorted by model count, so the full 350+
    // third-party catalog reads like OpenRouter instead of one wall of rows.
    const rest = cat.data.filter((m) => !claimed.has(m.id));
    const byProvider = new Map<string, Model[]>();
    for (const m of rest) {
      const p = m.provider || m.owned_by || 'Other';
      (byProvider.get(p) ?? byProvider.set(p, []).get(p)!).push(m);
    }
    [...byProvider.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([p, models]) => fams.push({ id: `provider-${p}`, name: p, icon: 'Box', models: [], resolved: models }));
    const needle = q.trim().toLowerCase();
    if (!needle) return fams.filter((f) => f.resolved.length);
    return fams
      .map((f) => ({
        ...f,
        resolved: f.resolved.filter((m) =>
          `${m.fullName} ${m.name} ${m.id} ${(m.features ?? []).join(' ')}`.toLowerCase().includes(needle),
        ),
      }))
      .filter((f) => f.resolved.length);
  }, [cat, q]);

  if (err)
    return (
      <div className="my-4 rounded-lg border border-fd-border bg-fd-card p-4 text-sm text-fd-muted-foreground">
        Couldn’t load the live catalog ({err}). Query it directly:{' '}
        <a className="text-fd-primary underline" href={ENDPOINT}>
          {ENDPOINT}
        </a>
      </div>
    );
  if (!cat)
    return (
      <div className="my-4 space-y-2" aria-busy>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-fd-muted/60" />
        ))}
      </div>
    );

  const s = cat.summary ?? {};
  return (
    <div className="not-prose my-6">
      {/* Summary + search */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fd-muted-foreground">
          <span className="font-medium text-fd-foreground">{s.totalModels ?? cat.data.length} models</span>
          {s.zenModels ? <span>{s.zenModels} Zen</span> : null}
          {s.ensoModels ? <span>{s.ensoModels} Enso</span> : null}
          {cat.updated ? <span>updated {new Date(cat.updated).toLocaleDateString()}</span> : null}
        </div>
        <label className="relative flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-4 text-fd-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter models…"
            className="w-full rounded-md border border-fd-border bg-fd-background py-1.5 pl-8 pr-3 text-sm outline-none focus:border-fd-primary sm:w-64"
          />
        </label>
      </div>

      {groups.map((f) => {
        const isProvider = f.id.startsWith('provider-');
        const Icon = FAMILY_ICON[f.icon ?? ''] ?? Box;
        return (
          <section key={f.id} className="mb-8">
            <div className="mb-1 flex items-center gap-2">
              {isProvider ? <ProviderChip name={f.name} /> : <Icon className="size-4 text-fd-primary" />}
              <h3 className="m-0 text-base font-semibold text-fd-foreground">{f.name}</h3>
              <span className="text-xs text-fd-muted-foreground">({f.resolved.length})</span>
            </div>
            {f.description ? <p className="mb-2 mt-0 text-sm text-fd-muted-foreground">{f.description}</p> : null}
            <div className="overflow-x-auto rounded-lg border border-fd-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-fd-muted-foreground">
                    <th className="py-2 pr-4 text-left font-medium">Model</th>
                    <th className="py-2 px-3 text-right font-medium">Context</th>
                    <th className="py-2 px-3 text-right font-medium">Input /1M</th>
                    <th className="py-2 px-3 text-right font-medium">Output /1M</th>
                    <th className="py-2 pl-3 text-right font-medium">Capabilities</th>
                  </tr>
                </thead>
                <tbody>
                  {f.resolved.map((m) => (
                    <ModelRow key={m.id} m={m} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      {!groups.length ? <p className="text-sm text-fd-muted-foreground">No models match “{q}”.</p> : null}
    </div>
  );
}

export default ModelsCatalog;
