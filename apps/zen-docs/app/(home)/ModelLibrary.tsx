'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Atom, Code, Zap, Cpu, Eye, Shield, Search, Network,
  Mic, Video, Box, Sparkles, ExternalLink, ChevronDown, ChevronUp,
  Filter,
} from 'lucide-react';

/* ── Model metadata ────────────────────────────────────────── */

type ModelInfo = {
  name: string;
  spec: string;
  ctx: string;
  desc: string;
  hf?: string;
  featured?: boolean;
  status?: 'active' | 'preview' | 'coming-soon' | 'legacy';
};

type ModelFamilyData = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  models: ModelInfo[];
};

// Active = currently served via Zen API or available as open weights for download
// Legacy/preview/coming-soon are hidden by default

const families: ModelFamilyData[] = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Zen4 Generation',
    subtitle: 'Latest generation — production API models',
    models: [
      { name: 'zen4-max', spec: 'Dense', ctx: '1M', desc: 'Most capable model — complex reasoning, analysis, and agentic coding', hf: 'zenlm/zen4-max', featured: true, status: 'active' },
      { name: 'zen4', spec: '744B (40B active) MoE', ctx: '202K', desc: 'Flagship intelligence — multi-domain reasoning', hf: 'zenlm/zen4', status: 'active' },
      { name: 'zen4-ultra', spec: '744B (40B active) MoE + CoT', ctx: '262K', desc: 'Maximum reasoning with chain-of-thought', hf: 'zenlm/zen4-ultra', status: 'active' },
      { name: 'zen4-pro', spec: '80B (3B active) MoE', ctx: '131K', desc: 'High capability — efficient MoE architecture', hf: 'zenlm/zen4-pro', status: 'active' },
      { name: 'zen4-thinking', spec: '80B (3B active) MoE + CoT', ctx: '131K', desc: 'Deep reasoning — chain-of-thought enabled', hf: 'zenlm/zen4-thinking', status: 'active' },
      { name: 'zen4-mini', spec: 'Dense', ctx: '128K', desc: 'Ultra-fast inference — free tier available', hf: 'zenlm/zen4-mini', status: 'active' },
      { name: 'zen4-coder', spec: '480B (35B active) MoE', ctx: '262K', desc: 'Code generation — 262K context for large codebases', hf: 'zenlm/zen4-coder', status: 'active' },
      { name: 'zen4-coder-pro', spec: '480B Dense BF16', ctx: '262K', desc: 'Premium code — full-precision dense model', hf: 'zenlm/zen4-coder-pro', status: 'active' },
      { name: 'zen4-coder-flash', spec: '30B (3B active) MoE', ctx: '262K', desc: 'Fast code — low-latency completions', hf: 'zenlm/zen4-coder-flash', status: 'active' },
    ],
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: 'Zen3 Multimodal & Specialty',
    subtitle: 'Vision, safety, and embedding models',
    models: [
      { name: 'zen3-omni', spec: '~200B Dense Multimodal', ctx: '202K', desc: 'Multimodal — text, vision, audio, and structured output', hf: 'zenlm/zen3-omni', status: 'active' },
      { name: 'zen3-vl', spec: '30B (3B active) MoE VL', ctx: '262K', desc: 'Vision-language model for image understanding', hf: 'zenlm/zen3-vl', status: 'active' },
      { name: 'zen3-nano', spec: '8B Dense', ctx: '128K', desc: 'Ultra-lightweight edge model — free tier', hf: 'zenlm/zen3-nano', status: 'active' },
      { name: 'zen3-guard', spec: '4B Dense', ctx: '65K', desc: 'Content safety — 9 categories, 119 languages', hf: 'zenlm/zen3-guard', status: 'active' },
      { name: 'zen3-embedding', spec: '3072 dim', ctx: '8K', desc: 'High-quality text embeddings for RAG and search', hf: 'zenlm/zen3-embedding', status: 'active' },
    ],
  },
  {
    icon: <Atom className="h-5 w-5" />,
    title: 'Foundation (Open Weights)',
    subtitle: 'Open weight models from 0.6B to 1T+ — download and self-host',
    models: [
      { name: 'zen-max', spec: '1.04T MoE', ctx: '256K', desc: 'Maximum scale — frontier open weights', hf: 'zenlm/zen-max', featured: true, status: 'active' },
      { name: 'zen-pro', spec: '32B Dense', ctx: '32K', desc: 'Professional grade — high-quality outputs', hf: 'zenlm/zen-pro-32b', status: 'active' },
      { name: 'zen', spec: '8–32B Dense', ctx: '32K', desc: 'Standard foundation — versatile for most tasks', hf: 'zenlm/zen-8b', status: 'active' },
      { name: 'zen-eco', spec: '4B Dense', ctx: '32K', desc: 'Efficient general-purpose — 2–8GB memory', hf: 'zenlm/zen-eco-4b', status: 'active' },
      { name: 'zen-nano', spec: '0.6B Dense', ctx: '32K', desc: 'Ultra-lightweight — 44K tokens/sec, fits in 0.4GB', hf: 'zenlm/zen-nano-0.6b', status: 'active' },
      { name: 'zen-next', spec: 'TBD Dense', ctx: '256K', desc: 'Next-generation preview', status: 'preview' },
    ],
  },
  {
    icon: <Code className="h-5 w-5" />,
    title: 'Code (Open Weights)',
    subtitle: 'Specialized for generation, review, and debugging',
    models: [
      { name: 'zen-coder', spec: '32B Dense', ctx: '131K', desc: 'Multi-language code generation and understanding', hf: 'zenlm/zen-coder', status: 'active' },
      { name: 'zen-coder-flash', spec: '7B Dense', ctx: '32K', desc: 'Low-latency code completions', hf: 'zenlm/zen-coder-flash', status: 'active' },
      { name: 'zen-code', spec: '14B Dense', ctx: '32K', desc: 'Legacy code model', hf: 'zenlm/zen-code', status: 'legacy' },
    ],
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: 'Embedding & Retrieval',
    subtitle: 'Text embeddings and search reranking via API',
    models: [
      { name: 'zen3-embedding', spec: '3072 dim', ctx: '8K', desc: 'High-dimensional text embeddings', hf: 'zenlm/zen3-embedding', status: 'active' },
      { name: 'zen3-embedding-medium', spec: '4B', ctx: '40K', desc: 'Balanced embedding model', hf: 'zenlm/zen3-embedding-medium', status: 'active' },
      { name: 'zen3-embedding-small', spec: '0.6B', ctx: '32K', desc: 'Lightweight embedding model', hf: 'zenlm/zen3-embedding-small', status: 'active' },
      { name: 'zen3-reranker', spec: '8B', ctx: '40K', desc: 'High-quality reranker for RAG', hf: 'zenlm/zen3-reranker', status: 'active' },
      { name: 'zen3-reranker-medium', spec: '4B', ctx: '40K', desc: 'Balanced reranker', hf: 'zenlm/zen3-reranker-medium', status: 'active' },
      { name: 'zen3-reranker-small', spec: '0.6B', ctx: '40K', desc: 'Lightweight reranker', hf: 'zenlm/zen3-reranker-small', status: 'active' },
      { name: 'zen-embedding', spec: '3072 dim', ctx: '8K', desc: 'Legacy embedding model', hf: 'zenlm/zen-embedding', status: 'legacy' },
      { name: 'zen-reranker', spec: '568M Dense', ctx: '8K', desc: 'Legacy reranker', hf: 'zenlm/zen-reranker', status: 'legacy' },
    ],
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: 'Image Generation',
    subtitle: 'Text-to-image generation via API',
    models: [
      { name: 'zen3-image', spec: 'Diffusion', ctx: '—', desc: 'Best general-purpose image generation', status: 'active' },
      { name: 'zen3-image-max', spec: 'Diffusion', ctx: '—', desc: 'Maximum quality for professional creative work', status: 'active' },
      { name: 'zen3-image-dev', spec: 'Diffusion', ctx: '—', desc: 'Development model for experimentation', status: 'active' },
      { name: 'zen3-image-fast', spec: 'Diffusion', ctx: '—', desc: 'Fastest model for real-time generation', status: 'active' },
      { name: 'zen3-image-sdxl', spec: 'Diffusion', ctx: '—', desc: 'High-resolution 1024px generation', status: 'active' },
      { name: 'zen3-image-playground', spec: 'Diffusion', ctx: '—', desc: 'Aesthetic model for artistic generation', status: 'active' },
      { name: 'zen3-image-ssd', spec: '1B Diffusion', ctx: '—', desc: 'Fastest diffusion model', status: 'active' },
      { name: 'zen3-image-jp', spec: 'Diffusion', ctx: '—', desc: 'Japanese-specialized generation', status: 'active' },
    ],
  },
  {
    icon: <Mic className="h-5 w-5" />,
    title: 'Audio & Speech',
    subtitle: 'Speech-to-text and transcription via API',
    models: [
      { name: 'zen3-audio', spec: 'ASR', ctx: '—', desc: 'Best quality speech-to-text transcription', status: 'active' },
      { name: 'zen3-audio-fast', spec: 'ASR', ctx: '—', desc: 'Fastest speech-to-text', status: 'active' },
      { name: 'zen3-asr', spec: 'Streaming ASR', ctx: '—', desc: 'Real-time streaming speech recognition', status: 'active' },
      { name: 'zen3-asr-v1', spec: 'Streaming ASR', ctx: '—', desc: 'First-generation streaming ASR', status: 'active' },
    ],
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Safety & Guardrails',
    subtitle: 'Content moderation and safety classification',
    models: [
      { name: 'zen3-guard', spec: '4B Dense', ctx: '65K', desc: 'Content safety — 9 categories, 119 languages', hf: 'zenlm/zen3-guard', status: 'active' },
      { name: 'zen-guard', spec: '8B Dense', ctx: '32K', desc: 'Legacy safety model', hf: 'zenlm/zen-guard', status: 'legacy' },
      { name: 'zen-guard-gen', spec: '8B Dense', ctx: '32K', desc: 'Safe generation with built-in guardrails', status: 'legacy' },
      { name: 'zen-guard-stream', spec: '4B Dense', ctx: '8K', desc: 'Low-latency streaming moderation', status: 'legacy' },
    ],
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: 'Vision & Multimodal (Open Weights)',
    subtitle: 'Image understanding and multimodal models',
    models: [
      { name: 'zen-omni', spec: '72B Dense Multimodal', ctx: '131K', desc: 'Hypermodal — text, vision, audio, code', hf: 'zenlm/zen-omni', status: 'active' },
      { name: 'zen-vl', spec: '32B Dense Multimodal', ctx: '32K', desc: 'Vision-language understanding', hf: 'zenlm/zen-vl', status: 'active' },
      { name: 'zen-artist', spec: 'Image Generation', ctx: '—', desc: 'High-resolution image generation', status: 'legacy' },
      { name: 'zen-artist-edit', spec: 'Image Editing', ctx: '—', desc: 'Edit-by-instruction, inpainting', status: 'legacy' },
      { name: 'zen-designer', spec: 'Design Generation', ctx: '—', desc: 'UI/UX design generation', status: 'coming-soon' },
    ],
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: 'Video',
    subtitle: 'Video generation and understanding',
    models: [
      { name: 'zen-director', spec: 'Text-to-Video', ctx: '—', desc: 'Cinematic-quality text-to-video', status: 'coming-soon' },
      { name: 'zen-video', spec: 'Video Understanding', ctx: '—', desc: 'Video analysis and understanding', status: 'coming-soon' },
      { name: 'zen-video-i2v', spec: 'Image-to-Video', ctx: '—', desc: 'Animate images into video', status: 'coming-soon' },
      { name: 'zen-voyager', spec: 'World Model', ctx: '—', desc: 'Spatial reasoning and simulation', status: 'coming-soon' },
    ],
  },
  {
    icon: <Box className="h-5 w-5" />,
    title: '3D & Spatial',
    subtitle: '3D asset generation and world simulation',
    models: [
      { name: 'zen-3d', spec: '3D Generation', ctx: '—', desc: 'Text-to-3D and image-to-3D', status: 'coming-soon' },
      { name: 'zen-world', spec: 'World Simulation', ctx: '—', desc: 'Spatial reasoning and environment sim', status: 'coming-soon' },
    ],
  },
  {
    icon: <Mic className="h-5 w-5" />,
    title: 'Audio (Coming Soon)',
    subtitle: 'Music, voice synthesis, and translation',
    models: [
      { name: 'zen-scribe', spec: 'Speech-to-Text', ctx: '—', desc: 'Multi-language transcription', status: 'coming-soon' },
      { name: 'zen-translator', spec: 'Translation', ctx: '—', desc: '100+ languages', status: 'coming-soon' },
      { name: 'zen-dub', spec: 'Voice Synthesis', ctx: '—', desc: 'Multi-language voice dubbing', status: 'coming-soon' },
      { name: 'zen-dub-live', spec: 'Real-time Voice', ctx: '—', desc: 'Ultra-low latency real-time voice', status: 'coming-soon' },
      { name: 'zen-musician', spec: 'Music Generation', ctx: '—', desc: 'Multi-instrument composition', status: 'coming-soon' },
      { name: 'zen-foley', spec: 'Sound Effects', ctx: '—', desc: 'Text-to-SFX generation', status: 'coming-soon' },
      { name: 'zen-live', spec: 'Real-time Translation', ctx: '—', desc: 'Bidirectional real-time speech', status: 'coming-soon' },
    ],
  },
  {
    icon: <Network className="h-5 w-5" />,
    title: 'Agents',
    subtitle: 'Agentic AI with tool use and multi-step planning',
    models: [
      { name: 'zen-agent', spec: '32B Dense', ctx: '131K', desc: 'Agentic AI — tool use, multi-step planning', status: 'preview' },
    ],
  },
];

/* ── Component ─────────────────────────────────────────────── */

export default function ModelLibrary() {
  const [showAll, setShowAll] = useState(false);

  // Filter families: only show families that have at least one visible model
  const visibleFamilies = families
    .map((f) => ({
      ...f,
      models: showAll ? f.models : f.models.filter((m) => m.status === 'active'),
    }))
    .filter((f) => f.models.length > 0);

  const totalActive = families.reduce((n, f) => n + f.models.filter((m) => m.status === 'active').length, 0);
  const totalAll = families.reduce((n, f) => n + f.models.length, 0);
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
        <ModelFamilySection key={family.title} {...family} showAll={showAll} />
      ))}
    </>
  );
}

function ModelFamilySection({ icon, title, subtitle, models, showAll }: ModelFamilyData & { showAll: boolean }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-fd-muted-foreground">{subtitle}</p>
        </div>
        <span className="ml-auto text-xs text-fd-muted-foreground bg-fd-muted px-2 py-1 rounded-full">
          {models.length} model{models.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {models.map((m) => (
          <ModelCard key={m.name} m={m} />
        ))}
      </div>
    </div>
  );
}

function ModelCard({ m }: { m: ModelInfo }) {
  const statusBadge = () => {
    switch (m.status) {
      case 'preview':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">PREVIEW</span>;
      case 'coming-soon':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded-full">SOON</span>;
      case 'legacy':
        return <span className="text-[9px] font-semibold tracking-wider uppercase bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded-full">LEGACY</span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 ${
        m.featured
          ? 'border-fd-primary/30 bg-fd-primary/5'
          : m.status === 'legacy' || m.status === 'coming-soon'
            ? 'border-fd-border bg-fd-muted/30 opacity-75'
            : 'border-fd-border bg-fd-background'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm">{m.name}</span>
        {statusBadge()}
      </div>
      <div className="text-xs font-mono text-fd-muted-foreground mb-2">
        {m.spec}{m.ctx !== '—' ? ` · ${m.ctx} ctx` : ''}
      </div>
      <p className="text-xs text-fd-muted-foreground mb-2">{m.desc}</p>
      {m.hf && (
        <a
          href={`https://huggingface.co/${m.hf}`}
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
