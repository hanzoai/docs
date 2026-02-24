'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const PRICING_API = 'https://pricing.hanzo.ai/v1/pricing';

interface ZenModel {
  name: string;
  fullName: string;
  description: string;
  features: string[];
  tier: string;
  context?: number | null;
  specs?: { params: string; arch: string };
  endpoint?: string;
  pricingUnit?: string;
  pricing: {
    input: number | null;
    output: number | null;
    perUnit?: number;
  };
}

interface PricingData {
  hanzoModels: ZenModel[];
}

function fmtPrice(p: number | null | undefined): string {
  if (p == null) return '—';
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(p >= 0.001 ? 3 : 4)}`;
}

function fmtCtx(ctx: number | null | undefined): string {
  if (!ctx) return '—';
  if (ctx >= 1_000_000) return `${Math.round(ctx / 1000)}K`;
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}K`;
  return `${ctx}`;
}

function ModelRow({ m, featured }: { m: ZenModel; featured?: boolean }) {
  return (
    <tr className={featured ? 'bg-fd-primary/5' : ''}>
      <td className="py-3 pr-4">
        <Link href={`/docs/models/${m.name}`} className="font-mono text-fd-primary hover:underline text-sm">
          {m.name}
        </Link>
      </td>
      <td className="py-3 pr-4 text-sm text-fd-muted-foreground">{m.specs?.params} {m.specs?.arch}</td>
      <td className="py-3 pr-4 text-sm text-fd-muted-foreground">{fmtCtx(m.context)}</td>
      <td className="py-3 pr-4 text-sm text-fd-muted-foreground">{m.tier}</td>
      <td className="py-3 pr-4 text-sm text-right font-mono">
        {m.pricingUnit ? `${fmtPrice(m.pricing.perUnit)}/${m.pricingUnit}` : `${fmtPrice(m.pricing.input)}`}
      </td>
      <td className="py-3 text-sm text-right font-mono">
        {m.pricingUnit ? '—' : `${fmtPrice(m.pricing.output)}`}
      </td>
    </tr>
  );
}

function CostExample({ task, model, tokens, input, output }: {
  task: string; model: string; tokens: string; input: number; output: number;
}) {
  const cost = (input + output).toFixed(2);
  return (
    <div className="rounded-lg border border-fd-border bg-fd-background p-4">
      <div className="text-sm font-medium mb-1">{task}</div>
      <div className="text-xs text-fd-muted-foreground mb-2">{model} · {tokens}</div>
      <div className="text-lg font-bold text-fd-primary">${cost}</div>
    </div>
  );
}

export default function DynamicPricing() {
  const [data, setData] = useState<PricingData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(PRICING_API)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <p className="text-center text-fd-muted-foreground py-8">
        Unable to load pricing.{' '}
        <Link href="/docs/api/pricing" className="text-fd-primary hover:underline">View pricing docs</Link>
      </p>
    );
  }

  if (!data) {
    return <p className="text-center text-fd-muted-foreground py-8">Loading pricing...</p>;
  }

  const chatModels = data.hanzoModels.filter((m) => !m.endpoint && !m.pricingUnit);
  const zen4 = chatModels.filter((m) => m.name.startsWith('zen4') && !m.name.includes('coder'));
  const zen4Coder = chatModels.filter((m) => m.name.startsWith('zen4-coder'));
  const zen3 = chatModels.filter((m) => m.name.startsWith('zen3'));
  const allChat = [...zen4, ...zen4Coder, ...zen3];

  // Find cheapest for the "From" stat
  const cheapest = allChat.reduce((min, m) => {
    const p = m.pricing.input ?? Infinity;
    return p < min ? p : min;
  }, Infinity);

  // Find specific models for cost examples
  const mini = data.hanzoModels.find((m) => m.name === 'zen4-mini');
  const coderFlash = data.hanzoModels.find((m) => m.name === 'zen4-coder-flash');
  const embed = data.hanzoModels.find((m) => m.name === 'zen3-embedding');
  const flagship = data.hanzoModels.find((m) => m.name === 'zen4');

  return (
    <>
      {/* Tier cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="rounded-xl border border-fd-primary/30 bg-fd-primary/5 p-6 ring-1 ring-fd-primary/20">
          <div className="text-xs font-semibold tracking-widest uppercase text-fd-primary mb-2">FREE TIER</div>
          <div className="text-3xl font-bold mb-1">$5</div>
          <p className="text-sm text-fd-muted-foreground mb-4">Free credit on every new account</p>
          <ul className="text-sm text-fd-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> zen4-mini + zen3-nano</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> OpenAI-compatible API</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> 30-day expiry</li>
          </ul>
          <a href="https://console.hanzo.ai" target="_blank" rel="noopener noreferrer"
            className="mt-6 block text-center rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition">
            Get Started Free
          </a>
        </div>
        <div className="rounded-xl border border-fd-border bg-fd-background p-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-2">PAY AS YOU GO</div>
          <div className="text-3xl font-bold mb-1">{fmtPrice(cheapest)}<span className="text-base font-normal text-fd-muted-foreground">/MTok</span></div>
          <p className="text-sm text-fd-muted-foreground mb-4">Starting from — scale with usage</p>
          <ul className="text-sm text-fd-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> All {chatModels.length}+ API models</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> Real-time usage tracking</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> No surprise bills</li>
          </ul>
          <a href="https://console.hanzo.ai" target="_blank" rel="noopener noreferrer"
            className="mt-6 block text-center rounded-lg border border-fd-border px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition">
            Add Credits
          </a>
        </div>
        <div className="rounded-xl border border-fd-border bg-fd-background p-6">
          <div className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-2">ENTERPRISE</div>
          <div className="text-3xl font-bold mb-1">Custom</div>
          <p className="text-sm text-fd-muted-foreground mb-4">Volume pricing, SLAs, dedicated support</p>
          <ul className="text-sm text-fd-muted-foreground space-y-2">
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> Volume discounts</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> Dedicated infrastructure</li>
            <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> SLA guarantees</li>
          </ul>
          <a href="https://hanzo.industries/contact" target="_blank" rel="noopener noreferrer"
            className="mt-6 block text-center rounded-lg border border-fd-border px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition">
            Contact Sales
          </a>
        </div>
      </div>

      {/* Zen4 table */}
      <h3 className="text-xl font-semibold mb-6">Zen4 Generation — Production API</h3>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border text-left">
              <th className="pb-3 pr-4 font-medium">Model</th>
              <th className="pb-3 pr-4 font-medium">Architecture</th>
              <th className="pb-3 pr-4 font-medium">Context</th>
              <th className="pb-3 pr-4 font-medium">Tier</th>
              <th className="pb-3 pr-4 font-medium text-right">Input $/MTok</th>
              <th className="pb-3 font-medium text-right">Output $/MTok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fd-border">
            {[...zen4, ...zen4Coder].map((m) => (
              <ModelRow key={m.name} m={m} featured={m.name === 'zen4-max'} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Zen3 table */}
      <h3 className="text-xl font-semibold mb-6">Zen3 Generation — Specialized Models</h3>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border text-left">
              <th className="pb-3 pr-4 font-medium">Model</th>
              <th className="pb-3 pr-4 font-medium">Architecture</th>
              <th className="pb-3 pr-4 font-medium">Context</th>
              <th className="pb-3 pr-4 font-medium">Tier</th>
              <th className="pb-3 pr-4 font-medium text-right">Input $/MTok</th>
              <th className="pb-3 font-medium text-right">Output $/MTok</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fd-border">
            {zen3.map((m) => (
              <ModelRow key={m.name} m={m} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Cost examples */}
      {mini && coderFlash && embed && flagship && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CostExample task="100 chat messages" model="zen4-mini" tokens="50K in + 50K out"
            input={(mini.pricing.input ?? 0) * 0.05} output={(mini.pricing.output ?? 0) * 0.05} />
          <CostExample task="1K code completions" model="zen4-coder-flash" tokens="500K in + 500K out"
            input={(coderFlash.pricing.input ?? 0) * 0.5} output={(coderFlash.pricing.output ?? 0) * 0.5} />
          <CostExample task="10K embeddings" model="zen3-embedding" tokens="1M input"
            input={embed.pricing.input ?? 0} output={0} />
          <CostExample task="Heavy daily use" model="zen4" tokens="1M in + 1M out"
            input={flagship.pricing.input ?? 0} output={flagship.pricing.output ?? 0} />
        </div>
      )}

      <div className="text-center">
        <Link href="/docs/api/pricing" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
          Full pricing details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
