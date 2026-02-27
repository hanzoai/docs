'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Atom, Code, Zap, Cpu, Eye, Shield, Search, Network,
  Mic, Video, Box, Sparkles, ExternalLink, ChevronDown, ChevronUp,
  Filter, Image, Brain, Rocket,
} from 'lucide-react';

import { allModels, families } from '@hanzo/zen-models';
import type { ZenModel, ModelFamily } from '@hanzo/zen-models';

/* ── Icon map ─────────────────────────────────────────────── */

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5" />,
  Rocket: <Rocket className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  Image: <Image className="h-5 w-5" />,
  Mic: <Mic className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Network: <Network className="h-5 w-5" />,
  Box: <Box className="h-5 w-5" />,
  Video: <Video className="h-5 w-5" />,
  Atom: <Atom className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
};

/* ── Helpers ──────────────────────────────────────────────── */

const modelById = new Map(allModels.map(m => [m.id, m]));

function fmtCtx(ctx: number | null | undefined): string {
  if (!ctx) return '—';
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(ctx % 1_000_000 === 0 ? 0 : 1)}M`;
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}K`;
  return `${ctx}`;
}

function modelStatus(m: ZenModel): 'active' | 'preview' | 'coming-soon' | 'contact-sales' | 'legacy' {
  if (m.status === 'contact-sales') return 'contact-sales';
  if (m.status === 'preview') return 'preview';
  if (m.status === 'coming-soon') return 'coming-soon';
  return 'active';
}

function isFeatured(m: ZenModel): boolean {
  return m.id === 'zen4-max' || m.id === 'zen-max' || m.id === 'zen5';
}

/* ── Component ─────────────────────────────────────────────── */

export default function ModelLibrary() {
  const [showAll, setShowAll] = useState(false);

  const visibleFamilies = families
    .map((f) => {
      const models = f.models
        .map(id => modelById.get(id))
        .filter((m): m is ZenModel => m !== undefined)
        .filter(m => showAll || modelStatus(m) === 'active' || modelStatus(m) === 'contact-sales');
      return { ...f, resolvedModels: models };
    })
    .filter(f => f.resolvedModels.length > 0);

  const totalActive = allModels.filter(m => modelStatus(m) === 'active' || modelStatus(m) === 'contact-sales').length;
  const totalAll = allModels.length;
  const totalHidden = totalAll - totalActive;

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-fd-muted-foreground">
            Showing <strong>{showAll ? totalAll : totalActive}</strong> models
            {!showAll && totalHidden > 0 && (
              <> &middot; {totalHidden} legacy/upcoming hidden</>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-3 py-1.5 text-sm font-medium hover:bg-fd-muted transition"
        >
          <Filter className="h-3.5 w-3.5" />
          {showAll ? 'Show Current Only' : 'Show All Models'}
        </button>
      </div>

      {visibleFamilies.map((family) => (
        <ModelFamilySection key={family.id} family={family} models={family.resolvedModels} />
      ))}
    </>
  );
}

function ModelFamilySection({ family, models }: { family: ModelFamily; models: ZenModel[] }) {
  const icon = iconMap[family.icon] || <Atom className="h-5 w-5" />;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{family.name}</h3>
          <p className="text-sm text-fd-muted-foreground">{family.description}</p>
        </div>
        <span className="ml-auto text-xs text-fd-muted-foreground bg-fd-muted px-2 py-1 rounded-full">
          {models.length} model{models.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {models.map((m) => (
          <ModelCard key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

function ModelCard({ m }: { m: ZenModel }) {
  const status = modelStatus(m);
  const featured = isFeatured(m);

  const statusBadge = () => {
    switch (status) {
      case 'preview':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">PREVIEW</span>;
      case 'coming-soon':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded-full">SOON</span>;
      case 'contact-sales':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-purple-500/20 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded-full">EARLY ACCESS</span>;
      default:
        return null;
    }
  };

  const specStr = [
    m.spec.params !== 'N/A' && m.spec.params !== 'TBA' && m.spec.params !== 'TBD' ? m.spec.params : null,
    m.spec.activeParams ? `(${m.spec.activeParams} active)` : null,
    m.spec.arch,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`rounded-lg border p-4 ${
        featured
          ? 'border-fd-primary/30 bg-fd-primary/5'
          : status === 'coming-soon'
            ? 'border-fd-border bg-fd-muted/30 opacity-75'
            : status === 'contact-sales'
              ? 'border-purple-500/20 bg-purple-500/5'
              : 'border-fd-border bg-fd-background'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Link href={`/docs/models/${m.id}`} className="font-semibold text-sm hover:text-fd-primary transition">
          {m.id}
        </Link>
        {statusBadge()}
      </div>
      <div className="text-xs font-mono text-fd-muted-foreground mb-2">
        {specStr}{m.spec.context > 0 ? ` · ${fmtCtx(m.spec.context)} ctx` : ''}
      </div>
      <p className="text-xs text-fd-muted-foreground mb-2">{m.description}</p>
      {m.huggingface && (
        <a
          href={m.huggingface}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-fd-primary hover:underline"
        >
          HuggingFace <ExternalLink className="h-2.5 w-2.5" />
        </a>
      )}
    </div>
  );
}
