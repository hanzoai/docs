import Link from 'next/link';
import {
  Brain, Code, Zap, Cpu, Eye, Shield, Search, Network,
  ArrowRight, Download, Terminal, BookOpen, Beaker, Database,
  Mic, Video, Box, Sparkles, ExternalLink, GitBranch,
  MessageSquare, Globe, Lock, Layers, DollarSign, Package,
  Gauge, CloudLightning, Heart, Star, Users, Clock,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────── */
/*  LANDING PAGE                                               */
/* ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-0 bg-gradient-to-b from-fd-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted px-4 py-1.5 text-sm text-fd-muted-foreground mb-6">
            <Sparkles className="h-4 w-4" />
            Zen MoDE — Mixture of Distilled Experts
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Zen LM
          </h1>

          <p className="text-xl md:text-2xl text-fd-muted-foreground max-w-3xl mx-auto mb-4">
            Frontier AI models for code, reasoning, vision, video, audio, 3D, and agentic workflows
          </p>

          <p className="text-base text-fd-muted-foreground max-w-2xl mx-auto mb-10">
            49 models across 10 modalities. 15 production API models from 4B to 1T+ parameters.
            Open weights on HuggingFace. OpenAI-compatible API. Built by{' '}
            <a href="https://hanzo.ai" className="text-fd-primary hover:underline">Hanzo AI</a> (Techstars &apos;17).
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <a
              href="https://hanzo.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Try Zen Free
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <Terminal className="h-4 w-4" />
              API Reference
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            <Stat value="49" label="Models" />
            <Stat value="1T+" label="Max Parameters" />
            <Stat value="262K" label="Max Context" />
            <Stat value="10" label="Modalities" />
            <Stat value="$0.30" label="From $/MTok" />
          </div>
        </div>
      </section>

      {/* ── Flagship Models ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Flagship Models"
          subtitle="Three tiers — from efficient edge to trillion-parameter frontier scale"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ModelHighlight
            icon={<Zap className="h-6 w-6" />}
            name="zen4-max"
            badge="FRONTIER"
            spec="1.04T MoE · 32B active · 256K ctx"
            description="Trillion-parameter frontier model with deep reasoning. Our largest and most capable model."
            href="/docs/models/zen4-max"
          />
          <ModelHighlight
            icon={<Brain className="h-6 w-6" />}
            name="zen4"
            badge="FLAGSHIP"
            spec="744B MoE · 40B active · 202K ctx"
            description="Flagship MoE for complex reasoning and multi-domain tasks. Optimal intelligence-to-speed ratio."
            href="/docs/models/zen4"
            featured
          />
          <ModelHighlight
            icon={<Code className="h-6 w-6" />}
            name="zen4-coder"
            badge="CODE"
            spec="480B MoE · 35B active · 262K ctx"
            description="Code-specialized MoE model for generation, review, debugging, and agentic programming."
            href="/docs/models/zen4-coder"
          />
        </div>

        <div className="text-center">
          <Link href="/docs/models" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
            View all models <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── API Pricing ──────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="API Pricing"
            subtitle="Pay-as-you-go. $5 free credit on signup. No minimum commitment."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border border-fd-primary/30 bg-fd-primary/5 p-6 ring-1 ring-fd-primary/20">
              <div className="text-xs font-semibold tracking-widest uppercase text-fd-primary mb-2">FREE TIER</div>
              <div className="text-3xl font-bold mb-1">$5</div>
              <p className="text-sm text-fd-muted-foreground mb-4">Free credit on every new account</p>
              <ul className="text-sm text-fd-muted-foreground space-y-2">
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> All 15 API models</li>
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> OpenAI-compatible API</li>
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> 30-day expiry</li>
              </ul>
              <a
                href="https://console.hanzo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
              >
                Get Started Free
              </a>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6">
              <div className="text-xs font-semibold tracking-widest uppercase text-fd-muted-foreground mb-2">PAY AS YOU GO</div>
              <div className="text-3xl font-bold mb-1">$0.30<span className="text-base font-normal text-fd-muted-foreground">/MTok</span></div>
              <p className="text-sm text-fd-muted-foreground mb-4">Starting from — scale with usage</p>
              <ul className="text-sm text-fd-muted-foreground space-y-2">
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> Prepaid credits</li>
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> Real-time usage tracking</li>
                <li className="flex items-center gap-2"><Star className="h-3.5 w-3.5 text-fd-primary" /> No surprise bills</li>
              </ul>
              <a
                href="https://console.hanzo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center rounded-lg border border-fd-border px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition"
              >
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
              <a
                href="https://hanzo.industries/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center rounded-lg border border-fd-border px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition"
              >
                Contact Sales
              </a>
            </div>
          </div>

          {/* Pricing table */}
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
                <ModelRow name="zen4-max" arch="1.04T (32B active) MoE" ctx="256K" tier="ultra max" input="$3.60" output="$3.60" href="/docs/models/zen4-max" featured />
                <ModelRow name="zen4" arch="744B (40B active) MoE" ctx="202K" tier="ultra max" input="$3.00" output="$9.60" href="/docs/models/zen4" />
                <ModelRow name="zen4-ultra" arch="744B (40B active) MoE + CoT" ctx="202K" tier="ultra max" input="$3.00" output="$9.60" href="/docs/models/zen4-ultra" />
                <ModelRow name="zen4-pro" arch="80B (3B active) MoE" ctx="131K" tier="ultra" input="$2.70" output="$2.70" href="/docs/models/zen4-pro" />
                <ModelRow name="zen4-thinking" arch="80B (3B active) MoE + CoT" ctx="131K" tier="pro max" input="$2.70" output="$2.70" href="/docs/models/zen4-thinking" />
                <ModelRow name="zen4-coder" arch="480B (35B active) MoE" ctx="262K" tier="ultra" input="$3.60" output="$3.60" href="/docs/models/zen4-coder" />
                <ModelRow name="zen4-coder-pro" arch="480B Dense BF16" ctx="262K" tier="ultra max" input="$4.50" output="$4.50" href="/docs/models/zen4-coder-pro" />
                <ModelRow name="zen4-coder-flash" arch="30B (3B active) MoE" ctx="262K" tier="pro max" input="$1.50" output="$1.50" href="/docs/models/zen4-coder-flash" />
                <ModelRow name="zen4-mini" arch="8B Dense" ctx="40K" tier="pro" input="$0.60" output="$0.60" href="/docs/models/zen4-mini" />
              </tbody>
            </table>
          </div>

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
                <ModelRow name="zen3-omni" arch="~200B Dense Multimodal" ctx="202K" tier="pro max" input="$1.80" output="$6.60" />
                <ModelRow name="zen3-vl" arch="30B (3B active) MoE VL" ctx="131K" tier="pro max" input="$0.45" output="$1.80" />
                <ModelRow name="zen3-nano" arch="4B Dense" ctx="40K" tier="pro" input="$0.30" output="$0.30" />
                <ModelRow name="zen3-guard" arch="4B Dense" ctx="40K" tier="pro" input="$0.30" output="$0.30" />
                <ModelRow name="zen3-embedding" arch="Embedding (3072 dim)" ctx="8K" tier="pro max" input="$0.39" output="—" />
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <CostExample task="100 chat messages" model="zen4-mini" tokens="50K in + 50K out" cost="$0.06" />
            <CostExample task="1K code completions" model="zen4-coder-flash" tokens="500K in + 500K out" cost="$1.50" />
            <CostExample task="10K embeddings" model="zen3-embedding" tokens="1M input" cost="$0.39" />
            <CostExample task="Heavy daily use" model="zen4" tokens="1M in + 1M out" cost="$12.60" />
          </div>

          <div className="text-center">
            <Link href="/docs/api/pricing" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
              Full pricing details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Start with Hanzo SDK ────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Quick Start"
          subtitle="Install the Hanzo SDK — supports OpenAI and Claude-style endpoints, plus 100+ providers"
        />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              Python — Hanzo SDK
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`pip install hanzoai

from hanzoai import Hanzo

client = Hanzo(api_key="hk-your-api-key")

response = client.chat.completions.create(
    model="zen4",
    messages=[
        {"role": "user", "content": "Hello, Zen."}
    ],
)
print(response.choices[0].message.content)`}</code></pre>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              TypeScript — Hanzo SDK
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`npm install hanzoai

import Hanzo from "hanzoai";

const client = new Hanzo({
  apiKey: "hk-your-api-key",
});

const response = await client.chat.completions.create({
  model: "zen4-coder",
  messages: [
    { role: "user", content: "Write a React hook" }
  ],
});
console.log(response.choices[0].message.content);`}</code></pre>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
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

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" />
              Streaming (Python)
            </div>
            <pre className="p-4 text-sm overflow-x-auto"><code>{`from hanzoai import Hanzo

client = Hanzo(api_key="hk-your-api-key")

stream = client.chat.completions.create(
    model="zen4-max",
    messages=[
        {"role": "user", "content": "Explain MoE"}
    ],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`}</code></pre>
          </div>
        </div>

        <div className="rounded-xl border border-fd-border bg-fd-muted/30 p-6 mb-12">
          <h4 className="font-semibold mb-3">SDK Features</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Multi-SDK</strong> — Python, TypeScript, Go, Rust</div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>OpenAI Compatible</strong> — drop-in replacement</div>
            </div>
            <div className="flex items-start gap-2">
              <Layers className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>100+ Providers</strong> — Zen + Claude + GPT + more</div>
            </div>
            <div className="flex items-start gap-2">
              <CloudLightning className="h-4 w-4 text-fd-primary mt-0.5 shrink-0" />
              <div><strong>Streaming</strong> — SSE, async, batch</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GetStartedCard title="Python SDK" description="pip install hanzoai" href="https://github.com/hanzoai/python-sdk" external />
          <GetStartedCard title="TypeScript SDK" description="npm install hanzoai" href="https://github.com/hanzoai/js-sdk" external />
          <GetStartedCard title="Go SDK" description="go get github.com/hanzoai/go-sdk" href="https://github.com/hanzoai/go-sdk" external />
          <GetStartedCard title="Rust SDK" description="cargo add hanzoai" href="https://github.com/hanzoai/rust-sdk" external />
        </div>
      </section>

      {/* ── Full Model Library ────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Full Model Library"
            subtitle="49 models across 10 categories — text, code, vision, video, audio, 3D, safety, embeddings, and agents"
          />

          {/* Foundation Models */}
          <ModelFamily
            icon={<Brain className="h-5 w-5" />}
            title="Foundation"
            subtitle="Core models from 0.6B edge to 1T+ frontier scale"
            models={[
              { name: 'zen-nano', spec: '0.6B Dense', ctx: '32K', desc: 'Ultra-lightweight edge model — 44K tokens/sec, fits in 0.4GB', hf: 'zenlm/zen-nano-0.6b' },
              { name: 'zen-eco', spec: '4B Dense', ctx: '32K', desc: 'Efficient general-purpose — 33K tokens/sec, 2–8GB memory', hf: 'zenlm/zen-eco-4b' },
              { name: 'zen', spec: '8–32B Dense', ctx: '32K', desc: 'Standard foundation — versatile for most tasks', hf: 'zenlm/zen-8b' },
              { name: 'zen-pro', spec: '32B Dense', ctx: '32K', desc: 'Professional grade — 19K tokens/sec, high-quality outputs', hf: 'zenlm/zen-pro-32b' },
              { name: 'zen-max', spec: '1.04T MoE', ctx: '256K', desc: 'Maximum scale — same model as zen4-max, open weights', hf: 'zenlm/zen-max', featured: true },
              { name: 'zen-next', spec: 'TBD Dense', ctx: '256K', desc: 'Next-generation preview', status: 'preview' },
            ]}
          />

          {/* Zen4 API Models */}
          <ModelFamily
            icon={<Sparkles className="h-5 w-5" />}
            title="Zen4 Generation"
            subtitle="Latest generation — 10 production API models"
            models={[
              { name: 'zen4-max', spec: '1.04T (32B active) MoE', ctx: '256K', desc: 'Frontier scale — deepest reasoning capabilities', hf: 'zenlm/zen-max', featured: true },
              { name: 'zen4', spec: '744B (40B active) MoE', ctx: '202K', desc: 'Flagship intelligence — multi-domain reasoning', hf: 'zenlm/zen4' },
              { name: 'zen4-ultra', spec: '744B (40B active) MoE + CoT', ctx: '202K', desc: 'Maximum reasoning with chain-of-thought', hf: 'zenlm/zen4-ultra' },
              { name: 'zen4-pro', spec: '80B (3B active) MoE', ctx: '131K', desc: 'High capability — efficient MoE architecture', hf: 'zenlm/zen4-pro' },
              { name: 'zen4-thinking', spec: '80B (3B active) MoE + CoT', ctx: '131K', desc: 'Deep reasoning — chain-of-thought enabled' },
              { name: 'zen4-mini', spec: '8B Dense', ctx: '40K', desc: 'Ultra-fast inference — cost-effective', hf: 'zenlm/zen4-mini' },
              { name: 'zen4-coder', spec: '480B (35B active) MoE', ctx: '262K', desc: 'Code generation — 262K context for large codebases', hf: 'zenlm/zen4-coder' },
              { name: 'zen4-coder-pro', spec: '480B Dense BF16', ctx: '262K', desc: 'Premium code — full-precision dense model', hf: 'zenlm/zen4-coder-pro' },
              { name: 'zen4-coder-flash', spec: '30B (3B active) MoE', ctx: '262K', desc: 'Fast code — low-latency completions', hf: 'zenlm/zen4-coder-flash' },
              { name: 'zen4-coder-next', spec: 'TBD MoE', ctx: '262K', desc: 'Next-gen code generation — preview', status: 'preview' },
            ]}
          />

          {/* Code Models */}
          <ModelFamily
            icon={<Code className="h-5 w-5" />}
            title="Code"
            subtitle="Specialized for generation, review, debugging, and agentic programming"
            models={[
              { name: 'zen-coder', spec: '32B Dense', ctx: '131K', desc: 'Multi-language code generation and understanding', hf: 'zenlm/zen-coder' },
              { name: 'zen-coder-flash', spec: '7B Dense', ctx: '32K', desc: 'Low-latency code completions', hf: 'zenlm/zen-coder-flash' },
              { name: 'zen-code', spec: '14B Dense', ctx: '32K', desc: 'Legacy code model — still available on HuggingFace', hf: 'zenlm/zen-code' },
            ]}
          />

          {/* Vision & Image */}
          <ModelFamily
            icon={<Eye className="h-5 w-5" />}
            title="Vision & Image"
            subtitle="Image understanding, generation, editing, and design"
            models={[
              { name: 'zen-vl', spec: '32B Dense Multimodal', ctx: '32K', desc: 'Vision-language understanding — image analysis', hf: 'zenlm/zen-vl' },
              { name: 'zen-omni', spec: '72B Dense Multimodal', ctx: '131K', desc: 'Hypermodal — text, vision, audio, code in one model', hf: 'zenlm/zen-omni' },
              { name: 'zen-artist', spec: 'Image Generation', ctx: '—', desc: 'High-resolution image generation, multiple styles' },
              { name: 'zen-artist-edit', spec: 'Image Editing', ctx: '—', desc: 'Edit-by-instruction, inpainting, outpainting' },
              { name: 'zen-designer', spec: 'Design Generation', ctx: '—', desc: 'UI/UX design, graphics, mockups', status: 'coming-soon' },
            ]}
          />

          {/* Video */}
          <ModelFamily
            icon={<Video className="h-5 w-5" />}
            title="Video"
            subtitle="Video generation, understanding, and world modeling"
            models={[
              { name: 'zen-director', spec: 'Text-to-Video', ctx: '—', desc: 'Cinematic-quality text-to-video generation', status: 'coming-soon' },
              { name: 'zen-video', spec: 'Video Understanding', ctx: '—', desc: 'Video analysis, frame-by-frame understanding', status: 'coming-soon' },
              { name: 'zen-video-i2v', spec: 'Image-to-Video', ctx: '—', desc: 'Animate images into video sequences', status: 'coming-soon' },
              { name: 'zen-voyager', spec: 'World Model', ctx: '—', desc: 'Spatial reasoning and world simulation', status: 'coming-soon' },
            ]}
          />

          {/* Audio & Speech */}
          <ModelFamily
            icon={<Mic className="h-5 w-5" />}
            title="Audio & Speech"
            subtitle="Music generation, voice synthesis, transcription, and translation"
            models={[
              { name: 'zen-scribe', spec: 'Speech-to-Text', ctx: '—', desc: 'Multi-language transcription' },
              { name: 'zen-translator', spec: 'Translation', ctx: '—', desc: '100+ languages, context-aware translation' },
              { name: 'zen-dub', spec: 'Voice Synthesis', ctx: '—', desc: 'Multi-language voice dubbing and synthesis', status: 'coming-soon' },
              { name: 'zen-dub-live', spec: 'Real-time Voice', ctx: '—', desc: 'Ultra-low latency real-time voice', status: 'coming-soon' },
              { name: 'zen-musician', spec: 'Music Generation', ctx: '—', desc: 'Multi-instrument music composition', status: 'coming-soon' },
              { name: 'zen-foley', spec: 'Sound Effects', ctx: '—', desc: 'Text-to-SFX, foley art generation', status: 'coming-soon' },
              { name: 'zen-live', spec: 'Real-time Translation', ctx: '—', desc: 'Bidirectional real-time speech translation', status: 'coming-soon' },
            ]}
          />

          {/* 3D & Spatial */}
          <ModelFamily
            icon={<Box className="h-5 w-5" />}
            title="3D & Spatial"
            subtitle="3D asset generation and world simulation"
            models={[
              { name: 'zen-3d', spec: '3D Generation', ctx: '—', desc: 'Text-to-3D and image-to-3D asset generation', status: 'coming-soon' },
              { name: 'zen-world', spec: 'World Simulation', ctx: '—', desc: 'Spatial reasoning and environment simulation', status: 'coming-soon' },
            ]}
          />

          {/* Safety */}
          <ModelFamily
            icon={<Shield className="h-5 w-5" />}
            title="Safety & Guardrails"
            subtitle="Content moderation and safety classification"
            models={[
              { name: 'zen-guard', spec: '8B Dense', ctx: '32K', desc: 'Content moderation and safety classification', hf: 'zenlm/zen-guard' },
              { name: 'zen-guard-gen', spec: '8B Dense', ctx: '32K', desc: 'Safe generation with built-in guardrails' },
              { name: 'zen-guard-stream', spec: '4B Dense', ctx: '8K', desc: 'Low-latency streaming moderation' },
            ]}
          />

          {/* Embedding & Retrieval */}
          <ModelFamily
            icon={<Search className="h-5 w-5" />}
            title="Embedding & Retrieval"
            subtitle="Text embeddings and search reranking"
            models={[
              { name: 'zen-embedding', spec: '3072 dim', ctx: '8K', desc: 'High-dimensional text embeddings', hf: 'zenlm/zen-embedding' },
              { name: 'zen-reranker', spec: '568M Dense', ctx: '8K', desc: 'Cross-encoder search reranking', hf: 'zenlm/zen-reranker' },
            ]}
          />

          {/* Agents */}
          <ModelFamily
            icon={<Network className="h-5 w-5" />}
            title="Agents"
            subtitle="Agentic AI with tool use and multi-step planning"
            models={[
              { name: 'zen-agent', spec: '32B Dense', ctx: '131K', desc: 'Agentic AI — tool use, multi-step planning, autonomous execution', status: 'preview' },
            ]}
          />
        </div>
      </section>

      {/* ── Capabilities & Modalities ─────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="10 Modalities"
          subtitle="One model family covering every AI capability"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <ModalityCard icon={<MessageSquare />} title="Text" models="14" desc="Chat, reasoning, analysis" />
          <ModalityCard icon={<Code />} title="Code" models="9" desc="Generation, review, debugging" />
          <ModalityCard icon={<Eye />} title="Vision" models="5" desc="Understanding, generation, editing" />
          <ModalityCard icon={<Video />} title="Video" models="4" desc="Generation, understanding, I2V" />
          <ModalityCard icon={<Mic />} title="Audio" models="7" desc="Speech, music, translation" />
          <ModalityCard icon={<Box />} title="3D" models="2" desc="Generation, world simulation" />
          <ModalityCard icon={<Shield />} title="Safety" models="3" desc="Moderation, guardrails" />
          <ModalityCard icon={<Search />} title="Embedding" models="2" desc="Search, retrieval, RAG" />
          <ModalityCard icon={<Network />} title="Agents" models="1" desc="Tool use, planning" />
          <ModalityCard icon={<Brain />} title="Math" models="6" desc="Reasoning, proof, computation" />
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Architecture"
            subtitle="Zen MoDE — curating best open-source foundations and fusing them into a unified, high-performance family"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArchCard icon={<Brain className="h-5 w-5" />} title="Consumer Line" description="Dense and MoE models from 4B to 80B. Edge-deployable dense models and efficient MoE flagships with only 3B active parameters." />
            <ArchCard icon={<Code className="h-5 w-5" />} title="Coder Line" description="Code-specialized models trained on 8.47B tokens of real agentic programming data. Fast completions to full-precision code intelligence." />
            <ArchCard icon={<Zap className="h-5 w-5" />} title="Ultra Line" description="Trillion-parameter MoE models for cloud deployment. 1.04T parameters with 32B active for frontier-scale reasoning." />
            <ArchCard icon={<Cpu className="h-5 w-5" />} title="Efficient MoE" description="Mixture-of-Experts delivers frontier performance with only 3B active parameters — runs on consumer hardware." />
            <ArchCard icon={<Gauge className="h-5 w-5" />} title="Long Context" description="Up to 262K context on code models, 256K on frontier models. Dense models support 32–40K for efficient local inference." />
            <ArchCard icon={<Beaker className="h-5 w-5" />} title="Zen MoDE" description="Mixture of Distilled Experts — curating the best open-source foundations and fusing into a unified model family." />
          </div>
        </div>
      </section>

      {/* ── Agentic Dataset ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
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

        <div className="text-center">
          <Link href="/docs/datasets" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
            Dataset documentation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Open Weights ─────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Open Weights"
            subtitle="Download, self-host, and fine-tune — multiple formats for every platform"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">SafeTensors</h4>
              <p className="text-sm text-fd-muted-foreground">Full precision for HuggingFace Transformers</p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">GGUF</h4>
              <p className="text-sm text-fd-muted-foreground">Quantized for llama.cpp / Ollama</p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">MLX</h4>
              <p className="text-sm text-fd-muted-foreground">Apple Silicon optimized</p>
            </div>
            <div className="rounded-xl border border-fd-border bg-fd-background p-6 text-center">
              <h4 className="font-semibold mb-2">ONNX</h4>
              <p className="text-sm text-fd-muted-foreground">Cross-platform inference</p>
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
              Browse All on HuggingFace
            </a>
          </div>
        </div>
      </section>

      {/* ── Ecosystem ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          title="Hanzo Ecosystem"
          subtitle="Zen models power the entire Hanzo AI platform"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <EcosystemCard
            title="Hanzo Chat"
            description="Chat with all 14 Zen models plus 100+ third-party models. MCP tools, file uploads, and persistent conversations."
            href="https://hanzo.chat"
            cta="Try Hanzo Chat"
          />
          <EcosystemCard
            title="Hanzo Cloud"
            description="Managed inference API. Console, billing, usage analytics, API key management."
            href="https://console.hanzo.ai"
            cta="Open Console"
          />
          <EcosystemCard
            title="Hanzo MCP"
            description="260+ Model Context Protocol tools. Connect Zen models to your codebase, browser, filesystem, and APIs."
            href="https://docs.hanzo.ai/docs/mcp"
            cta="Explore MCP"
          />
          <EcosystemCard
            title="Hanzo Dev"
            description="AI coding agent powered by Zen Coder. Code generation, debugging, and refactoring in your IDE."
            href="https://hanzo.ai/dev"
            cta="Get Hanzo Dev"
          />
          <EcosystemCard
            title="LLM Gateway"
            description="Unified proxy for 100+ LLM providers. Load balancing, caching, rate limiting, and observability."
            href="https://docs.hanzo.ai/docs/llm"
            cta="View Docs"
          />
          <EcosystemCard
            title="Hanzo Industries"
            description="Enterprise AI and defense. Custom model training, dedicated infrastructure, and compliance."
            href="https://hanzo.industries"
            cta="Learn More"
          />
        </div>
      </section>

      {/* ── Research ─────────────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeader
            title="Research"
            subtitle="130+ technical papers across AI, cryptography, and consensus"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <PaperCard title="Zen Technical Report" pages="Model Architecture" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-technical-report.pdf" />
            <PaperCard title="Zen Coder" pages="Code Generation" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-coder.pdf" />
            <PaperCard title="Zen Agent" pages="Agent Systems" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-agent.pdf" />
            <PaperCard title="Zen Guard" pages="Safety Model" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-guard.pdf" />
            <PaperCard title="Zen Omni" pages="Multimodal" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-omni.pdf" />
            <PaperCard title="Zen Artist" pages="Image Generation" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-artist.pdf" />
            <PaperCard title="Zen Pro" pages="Professional Model" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-pro.pdf" />
            <PaperCard title="Zen MoDE" pages="Distilled Experts" href="https://github.com/zenlm/papers/blob/main/pdfs/zen-mode.pdf" />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://papers.zenlm.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
              Zen LM papers <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://papers.hanzo.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
              Hanzo AI papers <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://papers.lux.network" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline">
              Lux papers <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-fd-primary/5 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Build with Zen LM
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-xl mx-auto">
            49 models. 10 modalities. Open weights. From $0.30/MTok.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://hanzo.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-8 py-3 text-sm font-medium text-fd-primary-foreground hover:opacity-90 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Try Zen Free
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-8 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <BookOpen className="h-4 w-4" />
              Documentation
            </Link>
            <a
              href="https://console.hanzo.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-8 py-3 text-sm font-medium hover:bg-fd-muted transition"
            >
              <Terminal className="h-4 w-4" />
              Get API Key
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="text-lg font-bold mb-3">⚡ Zen LM</div>
              <p className="text-sm text-fd-muted-foreground mb-4 max-w-xs">
                Frontier AI models by Hanzo AI. Open weights, transparent pricing, production-grade API.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/zenlm" target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground transition">
                  <GitBranch className="h-4 w-4" />
                </a>
                <a href="https://huggingface.co/zenlm" target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground hover:text-fd-foreground transition">
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>

            <FooterColumn title="Models" links={[
              { text: 'All Models', href: '/docs/models' },
              { text: 'zen4-max', href: '/docs/models/zen4-max' },
              { text: 'zen4-coder', href: '/docs/models/zen4-coder' },
              { text: 'HuggingFace', href: 'https://huggingface.co/zenlm', external: true },
            ]} />
            <FooterColumn title="Developers" links={[
              { text: 'Documentation', href: '/docs' },
              { text: 'API Reference', href: '/docs/api' },
              { text: 'Pricing', href: '/docs/api/pricing' },
              { text: 'Training', href: '/docs/training' },
              { text: 'Python SDK', href: 'https://github.com/hanzoai/python-sdk', external: true },
            ]} />
            <FooterColumn title="Hanzo" links={[
              { text: 'Hanzo AI', href: 'https://hanzo.ai', external: true },
              { text: 'Hanzo Chat', href: 'https://hanzo.chat', external: true },
              { text: 'Hanzo Cloud', href: 'https://console.hanzo.ai', external: true },
              { text: 'Hanzo Industries', href: 'https://hanzo.industries', external: true },
              { text: 'Research Papers', href: 'https://papers.zenlm.org', external: true },
            ]} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground">
            <span>&copy; 2016–2026 Hanzo AI Inc. Techstars &apos;17.</span>
            <div className="flex gap-4">
              <a href="https://hanzo.ai/privacy" className="hover:text-fd-foreground transition">Privacy</a>
              <a href="https://hanzo.ai/terms" className="hover:text-fd-foreground transition">Terms</a>
              <a href="https://hanzo.ai/security" className="hover:text-fd-foreground transition">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Chat Widget ──────────────────────────────────── */}
      <a
        href="https://hanzo.chat"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-lg hover:opacity-90 transition"
        title="Chat with Zen models"
      >
        <MessageSquare className="h-4 w-4" />
        Try Zen
      </a>
    </main>
  );
}


/* ═══════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════ */

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
        featured ? 'border-fd-primary/30 bg-fd-primary/5 ring-1 ring-fd-primary/20' : 'border-fd-border bg-fd-background'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary bg-fd-primary/10 px-2 py-0.5 rounded-full">{badge}</span>
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
  const row = (
    <tr className={`${featured ? 'bg-fd-primary/5' : ''} ${href ? 'hover:bg-fd-muted/50 cursor-pointer' : ''}`}>
      <td className="py-3 pr-4 font-medium"><span className={href ? 'text-fd-primary' : ''}>{name}</span></td>
      <td className="py-3 pr-4 text-fd-muted-foreground font-mono text-xs">{arch}</td>
      <td className="py-3 pr-4 text-fd-muted-foreground">{ctx}</td>
      <td className="py-3 pr-4"><span className="text-[10px] font-semibold tracking-wider uppercase bg-fd-muted px-2 py-0.5 rounded-full">{tier}</span></td>
      <td className="py-3 pr-4 text-right text-fd-muted-foreground">{input}</td>
      <td className="py-3 text-right text-fd-muted-foreground">{output}</td>
    </tr>
  );
  if (href) return <Link href={href} className="contents">{row}</Link>;
  return row;
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

type ModelInfo = {
  name: string; spec: string; ctx: string; desc: string;
  hf?: string; featured?: boolean; status?: string;
};

function ModelFamily({ icon, title, subtitle, models }: {
  icon: React.ReactNode; title: string; subtitle: string; models: ModelInfo[];
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="rounded-lg bg-fd-muted p-2 text-fd-primary">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-fd-muted-foreground">{subtitle}</p>
        </div>
        <span className="ml-auto text-xs text-fd-muted-foreground bg-fd-muted px-2 py-1 rounded-full">{models.length} models</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {models.map((m) => (
          <div
            key={m.name}
            className={`rounded-lg border p-4 ${
              m.featured ? 'border-fd-primary/30 bg-fd-primary/5' : 'border-fd-border bg-fd-background'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{m.name}</span>
              {m.status === 'preview' && (
                <span className="text-[9px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">PREVIEW</span>
              )}
              {m.status === 'coming-soon' && (
                <span className="text-[9px] font-semibold tracking-wider uppercase bg-fd-muted text-fd-muted-foreground px-1.5 py-0.5 rounded-full">SOON</span>
              )}
            </div>
            <div className="text-xs font-mono text-fd-muted-foreground mb-2">{m.spec}{m.ctx !== '—' ? ` · ${m.ctx} ctx` : ''}</div>
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
        ))}
      </div>
    </div>
  );
}

function ModalityCard({ icon, title, models, desc }: {
  icon: React.ReactNode; title: string; models: string; desc: string;
}) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-4 text-center">
      <div className="flex justify-center mb-2 text-fd-primary">{icon}</div>
      <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
      <p className="text-xs text-fd-muted-foreground mb-1">{models} models</p>
      <p className="text-xs text-fd-muted-foreground">{desc}</p>
    </div>
  );
}

function CostExample({ task, model, tokens, cost }: { task: string; model: string; tokens: string; cost: string }) {
  return (
    <div className="rounded-lg border border-fd-border bg-fd-background p-4">
      <div className="text-sm font-medium mb-1">{task}</div>
      <div className="text-xs text-fd-muted-foreground mb-2">{model} · {tokens}</div>
      <div className="text-lg font-bold text-fd-primary">{cost}</div>
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

function GetStartedCard({ title, description, href, external }: {
  title: string; description: string; href: string; external?: boolean;
}) {
  const cls = "group rounded-xl border border-fd-border bg-fd-background p-5 hover:border-fd-primary/40 transition block";
  const content = (
    <>
      <h4 className="font-semibold text-sm mb-1 group-hover:text-fd-primary transition flex items-center gap-1.5">
        {title}
        {external && <ExternalLink className="h-3 w-3 text-fd-muted-foreground" />}
      </h4>
      <p className="text-xs text-fd-muted-foreground font-mono">{description}</p>
    </>
  );
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>;
  return <Link href={href} className={cls}>{content}</Link>;
}

function EcosystemCard({ title, description, href, cta }: {
  title: string; description: string; href: string; cta: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-fd-border bg-fd-background p-6 hover:border-fd-primary/40 transition block"
    >
      <h4 className="font-semibold mb-2 group-hover:text-fd-primary transition">{title}</h4>
      <p className="text-sm text-fd-muted-foreground mb-4">{description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
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

function FooterColumn({ title, links }: { title: string; links: { text: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition flex items-center gap-1">
                {link.text} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ) : (
              <Link href={link.href} className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition">
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
