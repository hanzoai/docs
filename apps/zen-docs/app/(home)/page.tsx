import Link from 'next/link';
import {
  MessageSquare, Download, Terminal, ArrowRight, ExternalLink, Code,
} from 'lucide-react';
import { allModels } from '@zenlm/models';
import ModelLibrary from './ModelLibrary';
import DownloadSection from './DownloadSection';
import { ZenEnso } from '@/components/ZenEnso';

export default function HomePage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative border-b border-fd-border overflow-hidden">
        {/* subtle gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-fd-primary/5 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-6 py-28 md:py-40 text-center">
          <div className="flex justify-center mb-8">
            <ZenEnso size={120} color="white" animate />
          </div>

          <div className="inline-flex items-center rounded-full border border-fd-border px-4 py-1.5 text-xs text-fd-muted-foreground mb-8">
            Open-source · Apache 2.0 · {allModels.length} models
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Zen AI
          </h1>

          <p className="text-xl md:text-2xl text-fd-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            A family of open-source AI models you can chat with for free — or download and run privately on your own machine.
          </p>

          {/* PRIMARY CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href="https://hanzo.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-fd-primary px-8 py-4 text-base font-semibold text-fd-primary-foreground hover:opacity-90 transition shadow-lg"
            >
              <MessageSquare className="h-5 w-5" />
              Start chatting — free
            </a>
            <a
              href="#download"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-fd-border bg-fd-background px-8 py-4 text-base font-semibold hover:bg-fd-muted transition"
            >
              <Download className="h-5 w-5" />
              Download weights
            </a>
          </div>

          <p className="text-sm text-fd-muted-foreground">
            No account needed to chat &middot; Open weights on{' '}
            <a href="https://huggingface.co/zenlm" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fd-foreground">HuggingFace</a>
            {' '}&middot; Built by{' '}
            <a href="https://hanzo.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fd-foreground">Hanzo AI</a>
          </p>
        </div>
      </section>

      {/* ── Chat Free ────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Chat with Zen — no signup required
          </h2>
          <p className="text-fd-muted-foreground max-w-xl mx-auto">
            Try any Zen model instantly on Hanzo Chat. Free tier includes access to zen4, zen4-mini, zen3-nano and more.
          </p>
        </div>

        {/* Model pick cards → hanzo.chat links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <ChatModelCard
            id="zen4-max"
            name="Zen4 Max"
            tag="Most capable"
            desc="1M context · Max intelligence"
            color="primary"
          />
          <ChatModelCard
            id="zen4"
            name="Zen4"
            tag="Flagship"
            desc="744B MoE · 202K context"
          />
          <ChatModelCard
            id="zen4-coder"
            name="Zen4 Coder"
            tag="Code"
            desc="480B MoE · Code & debugging"
          />
          <ChatModelCard
            id="zen4-mini"
            name="Zen4 Mini"
            tag="Fast · Free"
            desc="128K ctx · Ultra-fast"
            color="muted"
          />
        </div>

        <div className="text-center">
          <a
            href="https://hanzo.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            See all models on Hanzo Chat <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ── Download / Run Locally ────────────────────────── */}
      <section id="download" className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Run locally — 100% private
            </h2>
            <p className="text-fd-muted-foreground max-w-xl mx-auto">
              Download open-weight Zen models and run them on your own hardware. Works with Ollama, LM Studio, llama.cpp, and Transformers.
            </p>
          </div>

          <DownloadSection />
        </div>
      </section>

      {/* ── Why Zen ──────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <WhyCard
            icon={<MessageSquare className="h-6 w-6" />}
            title="Free to chat"
            desc="Try every model instantly on Hanzo Chat. No credit card, no signup. Upgrade for higher limits and API access."
          />
          <WhyCard
            icon={<Download className="h-6 w-6" />}
            title="Run it yourself"
            desc="Apache 2.0 licensed weights on HuggingFace. Download GGUF for Ollama and LM Studio, or full precision for training."
          />
          <WhyCard
            icon={<Code className="h-6 w-6" />}
            title="Build with the API"
            desc="OpenAI-compatible API at api.hanzo.ai. From $0.15/MTok. Drop-in replacement for GPT-4 or Claude."
          />
        </div>
      </section>

      {/* ── Open Weight Models ────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Open weight models</h2>
              <p className="text-fd-muted-foreground">Download and run — Apache 2.0</p>
            </div>
            <a
              href="https://huggingface.co/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              All on HuggingFace <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <OpenModelCard name="Zen Nano" id="zen-nano" hf="zenlm/zen-nano-0.6b" size="0.6B" ctx="32K" arch="Dense" ollama="hf.co/zenlm/zen-nano-0.6b" />
            <OpenModelCard name="Zen Eco" id="zen-eco" hf="zenlm/zen-eco-4b" size="4B" ctx="32K" arch="Dense" ollama="hf.co/zenlm/zen-eco-4b" />
            <OpenModelCard name="Zen" id="zen" hf="zenlm/zen-8b" size="8–32B" ctx="32K" arch="Dense" ollama="hf.co/zenlm/zen-8b" />
            <OpenModelCard name="Zen Pro" id="zen-pro" hf="zenlm/zen-pro-32b" size="32B" ctx="32K" arch="Dense" ollama="hf.co/zenlm/zen-pro-32b" />
            <OpenModelCard name="Zen Max" id="zen-max" hf="zenlm/zen-max" size="235B (22B active)" ctx="131K" arch="MoE" ollama="hf.co/zenlm/zen-max" />
            <OpenModelCard name="Zen Coder" id="zen-coder" hf="zenlm/zen-coder" size="32B" ctx="131K" arch="Dense" ollama="hf.co/zenlm/zen-coder" />
          </div>
        </div>
      </section>

      {/* ── Quick API ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Developer API</h2>
            <p className="text-fd-muted-foreground">OpenAI-compatible. Drop-in replacement.</p>
          </div>
          <Link href="/docs/api" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium hover:underline">
            Full docs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2.5 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" /> Python
            </div>
            <pre className="p-5 text-sm overflow-x-auto"><code>{`pip install hanzoai

from hanzoai import Hanzo

client = Hanzo(api_key="hk-...")
r = client.chat.completions.create(
    model="zen4",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(r.choices[0].message.content)`}</code></pre>
          </div>

          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2.5 text-xs text-fd-muted-foreground bg-fd-muted/50">
              <Terminal className="h-3.5 w-3.5" /> curl
            </div>
            <pre className="p-5 text-sm overflow-x-auto"><code>{`curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer hk-..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "zen4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`}</code></pre>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <a href="https://console.hanzo.ai" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-2.5 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition">
            Get API key
          </a>
          <Link href="/docs/api" className="inline-flex items-center gap-2 text-sm hover:underline">
            API reference <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-sm text-fd-muted-foreground">From $0.15 / 1M tokens</span>
        </div>
      </section>

      {/* ── Full Model Library ────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">All {allModels.length} models</h2>
            <p className="text-fd-muted-foreground">Text, code, vision, audio, image, 3D, safety, embeddings, and agents</p>
          </div>
          <ModelLibrary />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="border-t border-fd-border">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to start?
          </h2>
          <p className="text-fd-muted-foreground mb-10 text-lg">
            Chat for free, download weights, or build with the API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://hanzo.chat" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-fd-primary px-8 py-4 text-base font-semibold text-fd-primary-foreground hover:opacity-90 transition shadow-lg">
              <MessageSquare className="h-5 w-5" /> Start chatting free
            </a>
            <a href="#download"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-fd-border px-8 py-4 text-base font-semibold hover:bg-fd-muted transition">
              <Download className="h-5 w-5" /> Download weights
            </a>
            <a href="https://console.hanzo.ai" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-fd-border px-8 py-4 text-base font-semibold hover:bg-fd-muted transition">
              <Terminal className="h-5 w-5" /> Get API key
            </a>
          </div>
        </div>
      </section>

      {/* ── Research & Blog ──────────────────────────────── */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-semibold mb-1">Research &amp; Writing</h3>
            <p className="text-xs text-fd-muted-foreground">Papers, technical reports, and updates from the Zen LM team</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="https://papers.zenlm.org" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition">
              <ArrowRight className="h-3.5 w-3.5" /> All papers
            </a>
            <Link href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition">
              <ArrowRight className="h-3.5 w-3.5" /> Blog
            </Link>
            <Link href="/docs" className="inline-flex items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-4 py-2.5 text-sm font-medium hover:bg-fd-muted transition">
              <ArrowRight className="h-3.5 w-3.5" /> Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="text-lg font-bold mb-3">🪷 Zen LM</div>
              <p className="text-sm text-fd-muted-foreground mb-4 max-w-xs">
                Open-source AI models by Hanzo AI. Apache 2.0. Runs on your machine or in the cloud.
              </p>
              <div className="flex gap-3">
                <a href="https://huggingface.co/zenlm" target="_blank" rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition text-xs">HuggingFace</a>
                <a href="https://github.com/zenlm" target="_blank" rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition text-xs">GitHub</a>
              </div>
            </div>
            <FooterColumn title="Use it" links={[
              { text: 'Hanzo Chat (free)', href: 'https://hanzo.chat', external: true },
              { text: 'Download weights', href: '#download' },
              { text: 'HuggingFace', href: 'https://huggingface.co/zenlm', external: true },
              { text: 'All models', href: '/docs/models' },
            ]} />
            <FooterColumn title="Build" links={[
              { text: 'API reference', href: '/docs/api' },
              { text: 'Get API key', href: 'https://console.hanzo.ai', external: true },
              { text: 'Python SDK', href: 'https://github.com/hanzoai/python-sdk', external: true },
              { text: 'Pricing', href: '/docs/api/pricing' },
            ]} />
            <FooterColumn title="Hanzo" links={[
              { text: 'Hanzo AI', href: 'https://hanzo.ai', external: true },
              { text: 'Blog', href: '/blog' },
              { text: 'Research papers', href: 'https://papers.zenlm.org', external: true },
              { text: 'Console', href: 'https://console.hanzo.ai', external: true },
              { text: 'Hanzo Industries', href: 'https://hanzo.industries', external: true },
            ]} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground">
            <span>&copy; 2016–2026 Hanzo AI Inc. Techstars &apos;17.</span>
            <div className="flex gap-4">
              <a href="https://hanzo.ai/privacy" className="hover:text-fd-foreground">Privacy</a>
              <a href="https://hanzo.ai/terms" className="hover:text-fd-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Sub-components ─────────────────────────────────── */

function ChatModelCard({ id, name, tag, desc, color }: {
  id: string; name: string; tag: string; desc: string; color?: 'primary' | 'muted';
}) {
  return (
    <a
      href={`https://hanzo.chat?model=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group rounded-2xl border p-5 hover:scale-[1.02] transition-transform block ${
        color === 'primary'
          ? 'border-fd-primary/40 bg-fd-primary/5'
          : 'border-fd-border bg-fd-background hover:bg-fd-muted/30'
      }`}
    >
      <span className="text-[10px] font-semibold tracking-widest uppercase text-fd-muted-foreground">{tag}</span>
      <h3 className="text-base font-bold mt-1 mb-1">{name}</h3>
      <p className="text-xs text-fd-muted-foreground mb-4">{desc}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-fd-primary">
        <MessageSquare className="h-3 w-3" /> Chat now →
      </span>
    </a>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center px-4">
      <div className="inline-flex rounded-2xl bg-fd-muted p-4 text-fd-foreground mb-5">{icon}</div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-fd-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function OpenModelCard({ name, id, hf, size, ctx, arch, ollama }: {
  name: string; id: string; hf: string; size: string; ctx: string; arch: string; ollama: string;
}) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-xs text-fd-muted-foreground font-mono mt-0.5">{size} · {arch} · {ctx} ctx</p>
        </div>
        <Link href={`/docs/models/${id}`} className="text-xs text-fd-muted-foreground hover:underline">docs</Link>
      </div>
      <div className="space-y-2 mb-4">
        <div className="rounded-lg bg-fd-muted px-3 py-2 text-xs font-mono">
          ollama run {ollama}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a href={`https://huggingface.co/${hf}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-fd-muted px-2.5 py-1 rounded-full hover:bg-fd-border transition">
          <Download className="h-2.5 w-2.5" /> Download
        </a>
        <a href={`https://hanzo.chat?model=${id}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-fd-primary text-fd-primary-foreground px-2.5 py-1 rounded-full hover:opacity-90 transition">
          <MessageSquare className="h-2.5 w-2.5" /> Chat
        </a>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { text: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.text}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer"
                className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition">
                {link.text}
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
