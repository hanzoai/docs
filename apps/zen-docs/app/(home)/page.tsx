import Link from 'next/link';
import {
  Brain, Code, Zap, Cpu, Eye, Shield, Search, Network,
  ArrowRight, Download, Terminal, BookOpen, Beaker, Database,
  Mic, Video, Box, Sparkles, ExternalLink, GitBranch
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-0 bg-gradient-to-b from-fd-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted px-4 py-1.5 text-sm text-fd-muted-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Zen MoDE — Mixture of Distilled Experts</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Zen LM
          </h1>
          <p className="text-xl md:text-2xl text-fd-muted-foreground max-w-3xl mx-auto mb-4">
            Frontier AI models for code, reasoning, and multimodal understanding
          </p>
          <p className="text-base text-fd-muted-foreground max-w-2xl mx-auto mb-10">
            14 production API models spanning 4B to 1T+ parameters. Consumer, Coder, and Ultra
            tiers — from edge deployment to frontier-scale reasoning. Trained on 8.47 billion tokens
            of real-world agentic programming data.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/docs/models"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <Brain className="h-4 w-4" />
              Explore Models
            </Link>
            <a
              href="https://huggingface.co/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <Download className="h-4 w-4" />
              HuggingFace
            </a>
            <a
              href="https://github.com/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <Stat value="14" label="API Models" />
            <Stat value="1T+" label="Max Parameters" />
            <Stat value="256K" label="Max Context" />
            <Stat value="45+" label="Open Weights" />
          </div>
        </div>
      </section>

      {/* ── Flagship Models ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Flagship Models"
          subtitle="Three tiers — from efficient edge models to trillion-parameter frontier scale"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <ModelHighlight
            icon={<Zap className="h-6 w-6" />}
            name="zen4-max"
            badge="FRONTIER"
            spec="1.04T MoE · 32B active · 256K ctx"
            description="Trillion-parameter frontier model with deep reasoning capabilities. The largest and most capable model in the Zen family."
            href="/docs/models/zen4-max"
          />
          <ModelHighlight
            icon={<Brain className="h-6 w-6" />}
            name="zen4"
            badge="FLAGSHIP"
            spec="~400B Dense · 202K ctx"
            description="Flagship dense model for complex reasoning and multi-domain tasks. Optimal balance of intelligence and speed."
            href="/docs/models/zen4"
            featured
          />
          <ModelHighlight
            icon={<Code className="h-6 w-6" />}
            name="zen4-coder"
            badge="CODE"
            spec="480B MoE · 35B active · 262K ctx"
            description="Code-specialized MoE model for generation, review, debugging, and agentic programming workflows."
            href="/docs/models/zen4-coder"
          />
        </div>

        <div className="text-center">
          <Link
            href="/docs/models"
            className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
          >
            View all 14 API models <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Zen4 Generation ───────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Zen4 Generation"
            subtitle="9 production API models — flagship, reasoning, and code"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fd-border text-left">
                  <th className="pb-3 pr-4 font-medium">Model</th>
                  <th className="pb-3 pr-4 font-medium">Architecture</th>
                  <th className="pb-3 pr-4 font-medium">Context</th>
                  <th className="pb-3 pr-4 font-medium">Tier</th>
                  <th className="pb-3 pr-4 font-medium text-right">Input $/1M</th>
                  <th className="pb-3 font-medium text-right">Output $/1M</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                <ModelRow name="zen4" arch="~400B Dense" ctx="202K" tier="ultra max" input="$3.00" output="$9.60" href="/docs/models/zen4" />
                <ModelRow name="zen4-ultra" arch="~400B Dense + CoT" ctx="202K" tier="ultra max" input="$3.00" output="$9.60" href="/docs/models/zen4-ultra" />
                <ModelRow name="zen4-max" arch="1.04T (32B active) MoE" ctx="256K" tier="ultra max" input="$3.60" output="$3.60" href="/docs/models/zen4-max" featured />
                <ModelRow name="zen4-pro" arch="80B (3B active) MoE" ctx="131K" tier="ultra" input="$2.70" output="$2.70" href="/docs/models/zen4-pro" />
                <ModelRow name="zen4-mini" arch="8B Dense" ctx="40K" tier="pro" input="$0.60" output="$0.60" href="/docs/models/zen4-mini" />
                <ModelRow name="zen4-thinking" arch="80B (3B active) MoE + CoT" ctx="131K" tier="pro max" input="$2.70" output="$2.70" href="/docs/models/zen4-thinking" />
                <ModelRow name="zen4-coder" arch="480B (35B active) MoE" ctx="262K" tier="ultra" input="$3.60" output="$3.60" href="/docs/models/zen4-coder" />
                <ModelRow name="zen4-coder-pro" arch="480B Dense BF16" ctx="262K" tier="ultra max" input="$4.50" output="$4.50" href="/docs/models/zen4-coder-pro" />
                <ModelRow name="zen4-coder-flash" arch="Dense" ctx="262K" tier="pro max" input="$1.50" output="$1.50" href="/docs/models/zen4-coder-flash" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Zen3 Generation ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Zen3 Generation"
          subtitle="5 specialized models — multimodal, vision, safety, and embeddings"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-border text-left">
                <th className="pb-3 pr-4 font-medium">Model</th>
                <th className="pb-3 pr-4 font-medium">Architecture</th>
                <th className="pb-3 pr-4 font-medium">Context</th>
                <th className="pb-3 pr-4 font-medium">Tier</th>
                <th className="pb-3 pr-4 font-medium text-right">Input $/1M</th>
                <th className="pb-3 font-medium text-right">Output $/1M</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fd-border">
              <ModelRow name="zen3-omni" arch="~200B Dense Multimodal" ctx="202K" tier="pro max" input="$1.80" output="$6.60" />
              <ModelRow name="zen3-vl" arch="30B (3B active) MoE VL" ctx="131K" tier="pro max" input="$0.45" output="$1.80" />
              <ModelRow name="zen3-nano" arch="4B Dense" ctx="40K" tier="pro" input="$0.30" output="$0.30" />
              <ModelRow name="zen3-guard" arch="4B Dense" ctx="40K" tier="pro" input="$0.30" output="$0.30" />
              <ModelRow name="zen3-embedding" arch="Embedding (3072 dim)" ctx="8K" tier="pro max" input="$0.39" output="—" />
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Architecture ──────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Architecture"
            subtitle="Zen MoDE — curating best open-source foundations and fusing them into a unified, high-performance family"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArchCard
              icon={<Brain className="h-5 w-5" />}
              title="Consumer Line"
              description="Dense and MoE models from 4B to 80B. Edge-deployable dense models and efficient MoE flagships with only 3B active parameters."
            />
            <ArchCard
              icon={<Code className="h-5 w-5" />}
              title="Coder Line"
              description="Code-specialized models trained on 8.47B tokens of real agentic programming data. Fast completions to full-precision code intelligence."
            />
            <ArchCard
              icon={<Zap className="h-5 w-5" />}
              title="Ultra Line"
              description="Trillion-parameter MoE models for cloud deployment. 1.04T parameters with 32B active for frontier-scale reasoning."
            />
            <ArchCard
              icon={<Cpu className="h-5 w-5" />}
              title="Efficient MoE"
              description="Mixture-of-Experts architecture delivers frontier performance with only 3B active parameters — runs on consumer hardware."
            />
            <ArchCard
              icon={<ArrowRight className="h-5 w-5" />}
              title="Long Context"
              description="Up to 262K context window on code models, 256K on frontier models. Dense models support 32–40K for efficient local inference."
            />
            <ArchCard
              icon={<Beaker className="h-5 w-5" />}
              title="Zen MoDE"
              description="Mixture of Distilled Experts methodology — curating the best open-source foundations and fusing into a unified model family."
            />
          </div>
        </div>
      </section>

      {/* ── Model Categories ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Full Model Catalog"
          subtitle="45+ models across 10 categories — available on HuggingFace and via API"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <CategoryCard icon={<Brain />} title="Foundation" count="6" examples="zen-nano to zen-max" />
          <CategoryCard icon={<Sparkles />} title="Zen4" count="5" examples="zen4-mini to zen4-ultra" />
          <CategoryCard icon={<Code />} title="Code" count="4" examples="zen4-coder family" />
          <CategoryCard icon={<Eye />} title="Vision" count="5" examples="zen-vl, zen-omni, zen-artist" />
          <CategoryCard icon={<Video />} title="Video" count="4" examples="zen-director, zen-video" />
          <CategoryCard icon={<Mic />} title="Audio" count="7" examples="zen-scribe, zen-dub, zen-live" />
          <CategoryCard icon={<Box />} title="3D &amp; Spatial" count="2" examples="zen-3d, zen-world" />
          <CategoryCard icon={<Shield />} title="Safety" count="3" examples="zen-guard family" />
          <CategoryCard icon={<Search />} title="Embedding" count="2" examples="zen-embedding, zen-reranker" />
          <CategoryCard icon={<Network />} title="Agents" count="1" examples="zen-agent" />
        </div>
      </section>

      {/* ── Agentic Dataset ───────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Zen Agentic Dataset"
            subtitle="8.47 billion tokens of real-world agentic programming — not synthetic data"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Stat value="8.47B" label="Training Tokens" large />
            <Stat value="3.35M" label="Training Samples" large />
            <Stat value="1,452" label="Repositories" large />
            <Stat value="15yr" label="History (2010–2025)" large />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <DataCard pct="48%" title="Git History" tokens="4.03B tokens" />
            <DataCard pct="29%" title="Agentic Debug Sessions" tokens="2.42B tokens" />
            <DataCard pct="13%" title="Architecture Discussions" tokens="1.14B tokens" />
            <DataCard pct="10%" title="Code Review Sessions" tokens="0.86B tokens" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <div className="rounded-xl border border-fd-border bg-fd-background p-6">
              <h4 className="font-semibold mb-3">Real Agentic Data</h4>
              <p className="text-sm text-fd-muted-foreground">
                Trained on actual agentic debug sessions — not synthetic data. Real debugging workflows,
                multi-file refactoring, and tool use patterns from production AI systems.
              </p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6">
              <h4 className="font-semibold mb-3">Production Code</h4>
              <p className="text-sm text-fd-muted-foreground">
                15 years of professional development across AI, Web3, cryptography, and modern software
                engineering from 1,452 repositories (Python, TypeScript, Rust, Go, Solidity).
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/docs/datasets"
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
            >
              Dataset documentation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Start ───────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Quick Start"
          subtitle="OpenAI-compatible API — works with every SDK that supports the OpenAI format"
        />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              Python
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.hanzo.ai/v1",
    api_key="hk-your-api-key",
)

response = client.chat.completions.create(
    model="zen4",
    messages=[{"role": "user", "content": "Hello, Zen."}],
)
print(response.choices[0].message.content)`}</code></pre>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              curl
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer hk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zen4",
    "messages": [
      {"role": "user", "content": "Hello, Zen."}
    ]
  }'`}</code></pre>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GetStartedCard
            title="Browse Models"
            description="All Zen models on HuggingFace Hub"
            href="https://huggingface.co/zenlm"
            external
          />
          <GetStartedCard
            title="API Documentation"
            description="OpenAI-compatible endpoints, pricing, usage"
            href="/docs/api"
          />
          <GetStartedCard
            title="Training Guides"
            description="Fine-tune on CUDA, MLX, or cloud GPUs"
            href="/docs/training"
          />
          <GetStartedCard
            title="zen-trainer"
            description="pip install zen-trainer — fine-tune on your data"
            href="https://github.com/zenlm/zen-trainer"
            external
          />
        </div>
      </section>

      {/* ── Open Weights ──────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Open Weights"
            subtitle="45+ models available for self-hosting in multiple formats"
          />

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">SafeTensors</h4>
              <p className="text-sm text-fd-muted-foreground">Full precision for transformers</p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">GGUF</h4>
              <p className="text-sm text-fd-muted-foreground">Quantized for llama.cpp / Ollama</p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">MLX</h4>
              <p className="text-sm text-fd-muted-foreground">Apple Silicon optimized</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://huggingface.co/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <Download className="h-4 w-4" />
              Browse All Models on HuggingFace
            </a>
          </div>
        </div>
      </section>

      {/* ── Research ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Research"
          subtitle="Technical reports and model papers"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <PaperCard title="Zen Technical Report" pages="7" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-technical-report.pdf" />
          <PaperCard title="Zen Coder" pages="Code Generation" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-coder.pdf" />
          <PaperCard title="Zen Agent" pages="Agent Systems" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-agent.pdf" />
          <PaperCard title="Zen Guard" pages="Safety Model" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-guard.pdf" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <PaperCard title="Zen Omni" pages="Multimodal" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-omni.pdf" />
          <PaperCard title="Zen Artist" pages="Image Generation" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-artist.pdf" />
          <PaperCard title="Zen Designer" pages="Design & UI" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-designer.pdf" />
          <PaperCard title="Zen Pro" pages="Professional Model" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-pro.pdf" />
        </div>

        <div className="text-center">
          <a
            href="https://papers.zenlm.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
          >
            All research papers <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-gradient-to-b from-fd-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Build with Zen LM
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-xl mx-auto">
            14 API models. 45+ open weights. From $0.30/MTok. OpenAI-compatible.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-8 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <BookOpen className="h-4 w-4" />
              Read the Docs
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-8 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <Terminal className="h-4 w-4" />
              API Reference
            </Link>
            <a
              href="https://hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-8 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              Hanzo AI <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-fd-muted-foreground">
            <span>Hanzo AI · Techstars &apos;17</span>
            <span>·</span>
            <a href="https://hanzo.ai" className="hover:text-fd-foreground transition">hanzo.ai</a>
            <span>·</span>
            <a href="https://github.com/zenlm" className="hover:text-fd-foreground transition">github.com/zenlm</a>
            <span>·</span>
            <a href="https://huggingface.co/zenlm" className="hover:text-fd-foreground transition">huggingface.co/zenlm</a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-fd-muted-foreground max-w-2xl">{subtitle}</p>
    </div>
  );
}

function Stat({ value, label, large }: { value: string; label: string; large?: boolean }) {
  return (
    <div className="text-center">
      <div className={`font-bold tracking-tight ${large ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}>
        {value}
      </div>
      <div className="text-sm text-fd-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function ModelHighlight({
  icon, name, badge, spec, description, href, featured,
}: {
  icon: React.ReactNode; name: string; badge: string; spec: string;
  description: string; href: string; featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border p-6 transition hover:border-fd-primary/40 ${
        featured
          ? 'border-fd-primary/30 bg-fd-primary/5 ring-1 ring-fd-primary/20'
          : 'border-fd-border bg-fd-background'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1 group-hover:text-fd-primary transition">{name}</h3>
      <p className="text-xs text-fd-muted-foreground font-mono mb-3">{spec}</p>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </Link>
  );
}

function ModelRow({
  name, arch, ctx, tier, input, output, href, featured,
}: {
  name: string; arch: string; ctx: string; tier: string;
  input: string; output: string; href?: string; featured?: boolean;
}) {
  const inner = (
    <tr className={`${featured ? 'bg-fd-primary/5' : ''} ${href ? 'hover:bg-fd-muted/50 cursor-pointer' : ''}`}>
      <td className="py-3 pr-4 font-medium">
        <span className={href ? 'text-fd-primary' : ''}>{name}</span>
      </td>
      <td className="py-3 pr-4 text-fd-muted-foreground font-mono text-xs">{arch}</td>
      <td className="py-3 pr-4 text-fd-muted-foreground">{ctx}</td>
      <td className="py-3 pr-4">
        <span className="text-[10px] font-semibold tracking-wider uppercase bg-fd-muted px-2 py-0.5 rounded-full">
          {tier}
        </span>
      </td>
      <td className="py-3 pr-4 text-right text-fd-muted-foreground">{input}</td>
      <td className="py-3 text-right text-fd-muted-foreground">{output}</td>
    </tr>
  );
  if (href) {
    return <Link href={href} className="contents">{inner}</Link>;
  }
  return inner;
}

function ArchCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-6">
      <div className="rounded-lg bg-fd-muted p-2 w-fit text-fd-primary mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}

function CategoryCard({ icon, title, count, examples }: { icon: React.ReactNode; title: string; count: string; examples: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-fd-primary h-4 w-4">{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
        <span className="ml-auto text-xs text-fd-muted-foreground bg-fd-muted px-1.5 py-0.5 rounded">{count}</span>
      </div>
      <p className="text-xs text-fd-muted-foreground">{examples}</p>
    </div>
  );
}

function DataCard({ pct, title, tokens }: { pct: string; title: string; tokens: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-5">
      <div className="text-2xl font-bold text-fd-primary mb-1">{pct}</div>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-xs text-fd-muted-foreground">{tokens}</p>
    </div>
  );
}

function GetStartedCard({ title, description, href, external }: { title: string; description: string; href: string; external?: boolean }) {
  const cls = "group rounded-xl border border-fd-border bg-fd-background p-5 hover:border-fd-primary/40 transition block";
  const content = (
    <>
      <h4 className="font-semibold text-sm mb-1 group-hover:text-fd-primary transition flex items-center gap-1.5">
        {title}
        {external && <ExternalLink className="h-3 w-3 text-fd-muted-foreground" />}
      </h4>
      <p className="text-xs text-fd-muted-foreground">{description}</p>
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>;
  }
  return <Link href={href} className={cls}>{content}</Link>;
}

function PaperCard({ title, pages, href }: { title: string; pages: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-fd-border bg-fd-background p-5 hover:border-fd-primary/40 transition block"
    >
      <h4 className="font-semibold text-sm mb-1 group-hover:text-fd-primary transition">{title}</h4>
      <p className="text-xs text-fd-muted-foreground">{pages}</p>
    </a>
  );
}
