import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Code2,
  Database,
  FileJson2,
  Globe,
  LayoutGrid,
  Package,
  Server,
  Shield,
  ShoppingCart,
  Sparkles,
  Terminal,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/code-block';

/* -- The eight movements -- category-first, mirrors the console shell -------- */

const movements = [
  {
    name: 'Identity & Trust',
    desc: 'Who you are, what you may touch, where secrets live. IAM, AuthZ, KMS, MPC, Zero-Trust.',
    icon: Shield,
    href: '/docs/iam',
    tag: 'Identity',
  },
  {
    name: 'Intelligence',
    desc: 'The mind of the cloud. Models, agents, MCP, embeddings, prompts, GPUs, functions.',
    icon: Sparkles,
    href: '/docs/llm',
    tag: 'Intelligence',
  },
  {
    name: 'Data',
    desc: 'The stores everything writes to. SQL, Vector, KV, Search, Object, Base, DocDB.',
    icon: Database,
    href: '/docs/sql',
    tag: 'Data',
  },
  {
    name: 'Streams',
    desc: 'Messaging, durable tasks, async orchestration. PubSub, Tasks, Pipelines, Crawl.',
    icon: Workflow,
    href: '/docs/pubsub',
    tag: 'Streams',
  },
  {
    name: 'Observability',
    desc: 'See everything. Telemetry, metrics, logs, traces, sessions, evals, analytics.',
    icon: Activity,
    href: '/docs/o11y',
    tag: 'Observe',
  },
  {
    name: 'Commerce',
    desc: 'The economy. Meter, price, bill, reward. Commerce, Billing, Marketplace, Referrals.',
    icon: ShoppingCart,
    href: '/docs/commerce',
    tag: 'Commerce',
  },
  {
    name: 'Platform',
    desc: 'The cloud fabric. Deploy, provision, route, host. Gateway, Machines, Edge, Registry.',
    icon: Server,
    href: '/docs/gateway',
    tag: 'Platform',
  },
  {
    name: 'Applications',
    desc: 'The user-facing surfaces. Chat, Studio, Dev, Integrations, Apps.',
    icon: LayoutGrid,
    href: '/docs/chat',
    tag: 'Apps',
  },
];

/* -- Developer quick links -------------------------------------------------- */

const devLinks = [
  {
    name: 'The Network',
    desc: 'Run the whole cloud yourself',
    href: '/docs/network',
    icon: Globe,
  },
  {
    name: 'SDKs',
    desc: 'Python, TypeScript, Go, Rust',
    href: '/docs/sdks',
    icon: Code2,
  },
  {
    name: 'API Reference',
    desc: 'REST for every capability',
    href: '/docs/openapi',
    icon: FileJson2,
  },
  {
    name: 'Architecture',
    desc: 'One binary, one contract',
    href: '/docs/architecture',
    icon: Package,
  },
];

/* -- Page ------------------------------------------------------------------- */

export default function Page() {
  return (
    <main className="pb-6 md:pb-12">
      {/* -- Hero ---------------------------------------------------------- */}
      <section className="relative flex flex-col items-center text-center mx-auto w-full max-w-[1400px] px-6 pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]" />

        <Badge
          variant="outline"
          className="relative mb-8 rounded-full border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-[#a3a3a3] backdrop-blur font-normal"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white mr-2" />
          One binary &middot; One contract &middot; 67 capabilities
        </Badge>

        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <span className="text-white">The AI cloud you<br className="hidden sm:block" /> can run yourself</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-[#737373] text-lg md:text-xl leading-relaxed">
          The same open-source binary we run in production — 67 capabilities across
          eight movements. Run it on your own machine, GPU, or cluster.
          The network is the cloud.
        </p>

        {/* -- Install command -- the main CTA ------------------------------ */}
        <div className="relative mt-10 w-full max-w-lg">
          <Card className="border-white/[0.08] bg-white/[0.03] p-1 shadow-none gap-0 py-0 rounded-2xl">
            <CardContent className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] px-5 py-4 font-mono text-sm">
              <span className="text-[#525252] select-none">$</span>
              <span className="text-white flex-1 text-left">curl hanzo.sh | sh</span>
              <button
                className="text-[#525252] hover:text-white transition-colors"
                title="Copy"
                onClick={undefined}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </CardContent>
          </Card>
          <p className="text-xs text-[#404040] mt-3">
            Installs the <code className="text-[#666] bg-white/5 px-1 py-0.5 rounded">hanzo</code> CLI.
            Then <code className="text-[#666] bg-white/5 px-1 py-0.5 rounded">hanzo login</code> to get started.
          </p>
        </div>

        <div className="relative flex flex-row items-center gap-3 mt-8 flex-wrap justify-center">
          <Button asChild size="lg" className="rounded-full bg-white px-7 text-black hover:bg-neutral-200">
            <Link href="/docs/getting-started">
              Get Started
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 px-7 text-white hover:bg-white/5 bg-transparent">
            <Link href="/docs/network">
              Run it yourself
            </Link>
          </Button>
        </div>

        {/* -- Breadth stats bar -------------------------------------------- */}
        <div className="relative mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px w-full max-w-4xl rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.04]">
          {[
            { n: '67', label: 'Capabilities' },
            { n: '8', label: 'Movements' },
            { n: '157', label: 'Models' },
            { n: '706', label: 'MCP connectors' },
            { n: '6', label: 'SDK languages' },
          ].map((s) => (
            <div key={s.label} className="bg-[#0a0a0a] px-5 py-5 text-center">
              <div className="text-2xl font-bold text-white tabular-nums">{s.n}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-[#525252]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 space-y-24">

        {/* -- Quick Start Guide ------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Quick Start
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            Install the CLI, log in, and reach every capability from your terminal.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock
              code={`# Install the Hanzo CLI
curl hanzo.sh | sh

# Log in (opens browser for OAuth)
hanzo login

# You're ready — try some things:
hanzo chat "Explain quantum computing"
hanzo models list
hanzo keys create my-project
hanzo deploy ./my-app`}
              lang="bash"
              wrapper={{ title: 'Terminal' }}
            />
            <CodeBlock
              code={`# Or use the Python SDK directly
pip install hanzoai

# Use with any OpenAI-compatible code
from hanzoai import Hanzo

client = Hanzo()  # reads HANZO_API_KEY
response = client.chat.completions.create(
    model="zen4",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
              lang="python"
              wrapper={{ title: 'Python SDK' }}
            />
          </div>
        </section>

        {/* -- The eight movements -- category-first ------------------------ */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            The eight movements
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            Every capability is named by its route and lives in exactly one movement. Click any to descend.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {movements.map((item) => {
              const isExternal = !!(item as { external?: boolean }).external;
              const linkProps = isExternal
                ? { target: '_blank' as const, rel: 'noreferrer noopener' }
                : {};
              return (
                <Card
                  key={item.name}
                  className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl min-h-[140px] sm:min-h-[160px]"
                >
                  {isExternal ? (
                    <a href={item.href} {...linkProps} className="absolute inset-0 z-10" />
                  ) : (
                    <Link href={item.href} className="absolute inset-0 z-10" />
                  )}
                  <CardHeader className="p-5 sm:p-6 pb-0 gap-0 grid-rows-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-white/[0.06] p-2">
                        <item.icon className="size-5 text-[#666] group-hover:text-white transition-colors" />
                      </div>
                      <Badge variant="ghost" className="text-[10px] uppercase tracking-wider text-[#333] font-medium border-none px-0">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold text-white mb-1.5">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-[#525252] leading-relaxed group-hover:text-[#737373] transition-colors">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-5 sm:p-6 pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-[#333] group-hover:text-white transition-colors">
                      {isExternal ? 'Visit' : 'View docs'} <ArrowRight className="size-3" />
                    </span>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* -- Developer Tools --------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Developer Tools
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            SDKs, APIs, and protocols for every stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {devLinks.map((t) => (
              <Card
                key={t.name}
                className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl"
              >
                <Link href={t.href} className="absolute inset-0 z-10" />
                <CardContent className="p-6">
                  <t.icon className="size-5 text-[#525252] mb-4 group-hover:text-white transition-colors" />
                  <CardTitle className="font-semibold text-sm text-white mb-1">{t.name}</CardTitle>
                  <CardDescription className="text-xs text-[#525252] group-hover:text-[#737373] transition-colors">{t.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* -- Models & providers ------------------------------------------ */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Every model, one API
          </h2>
          <p className="text-[#737373] text-sm mb-8">
            157 models across every major provider — call any of them with one credential, one request shape.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { name: 'Zen', spec: 'Open weights' },
              { name: 'OpenAI', spec: 'GPT' },
              { name: 'Anthropic', spec: 'Claude' },
              { name: 'Qwen', spec: 'Open' },
              { name: 'Llama', spec: 'Open' },
              { name: 'DeepSeek', spec: 'Open' },
              { name: 'Mistral', spec: 'Open' },
              { name: 'Gemma', spec: 'Open' },
            ].map((p) => (
              <Card key={p.name} className="border-white/[0.06] bg-white/[0.02] shadow-none py-0 gap-0 rounded-lg">
                <CardContent className="px-4 py-3 text-center">
                  <div className="text-xs font-semibold text-white mb-1">{p.name}</div>
                  <div className="text-[10px] text-[#525252]">{p.spec}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* -- SDKs + connectors ------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="size-5 text-[#a3a3a3]" />
                <CardTitle className="text-xl font-bold tracking-tight">SDKs in every language</CardTitle>
              </div>
              <CardDescription className="text-xs text-[#525252] mb-6">
                Generated from one contract — the same <code className="font-mono">/v1</code> surface, typed for your stack.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {['Python', 'TypeScript', 'Go', 'Rust', 'C++', 'Dart'].map((l) => (
                  <span key={l} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#a3a3a3]">
                    {l}
                  </span>
                ))}
              </div>
              <Link href="/docs/sdks" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-[#525252] hover:text-white transition-colors">
                SDK reference <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Workflow className="size-5 text-[#a3a3a3]" />
                <CardTitle className="text-xl font-bold tracking-tight">706 tools, one MCP surface</CardTitle>
              </div>
              <CardDescription className="text-xs text-[#525252] mb-6">
                706 connectors — Slack, GitHub, Notion, Stripe, and more — exposed as MCP tools any agent can call.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {['Slack', 'GitHub', 'Notion', 'Stripe', 'Google', 'Linear', '+700 more'].map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-[#a3a3a3]">
                    {c}
                  </span>
                ))}
              </div>
              <Link href="/docs/mcp" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-[#525252] hover:text-white transition-colors">
                MCP tools <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* -- What the CLI can do ----------------------------------------- */}
        <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-white/[0.06] p-2.5">
                <Terminal className="size-5 text-[#a3a3a3]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  The <code className="font-mono">hanzo</code> CLI
                </CardTitle>
                <CardDescription className="text-xs text-[#525252] mt-0.5">A ~15 MB Rust client for any live cloud — prod, laptop, or self-host</CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { cmd: 'hanzo chat', desc: 'Chat with any model interactively' },
                { cmd: 'hanzo models list', desc: 'Browse every available model' },
                { cmd: 'hanzo keys create', desc: 'Create and manage API keys' },
                { cmd: 'hanzo deploy', desc: 'Deploy apps with git push' },
                { cmd: 'hanzo logs', desc: 'Stream logs from any service' },
                { cmd: 'hanzo storage', desc: 'Manage S3-compatible storage' },
                { cmd: 'hanzo secrets', desc: 'Manage secrets and env vars' },
                { cmd: 'hanzo bot', desc: 'Deploy and manage AI bots' },
                { cmd: 'hanzo flow', desc: 'Run workflow automations' },
              ].map((item) => (
                <Card key={item.cmd} className="border-white/[0.06] bg-white/[0.02] shadow-none py-0 gap-0 rounded-lg">
                  <CardContent className="px-4 py-3">
                    <div className="text-xs font-mono font-medium text-white mb-1">{item.cmd}</div>
                    <div className="text-[11px] text-[#525252]">{item.desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* -- Zen Models Banner ------------------------------------------- */}
        <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="size-5 text-[#a3a3a3]" />
              <CardTitle className="text-2xl font-bold tracking-tight">
                Zen
              </CardTitle>
              <Badge variant="secondary" className="text-xs text-[#525252] font-mono bg-white/5 px-2 py-0.5 rounded-full border-transparent">
                44 models
              </Badge>
            </div>
            <p className="text-[#737373] text-sm leading-relaxed max-w-2xl mb-6">
              Frontier AI models from 4B edge to 1T+ reasoning. MoDE (Mixture of Diverse Experts) architecture.
              Text, code, vision, audio, video, 3D, and safety. Open weights on HuggingFace.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {[
                { name: 'zen4', spec: '~400B MoDE' },
                { name: 'zen4-coder', spec: '~200B MoDE' },
                { name: 'zen4-thinking', spec: 'Deep CoT' },
                { name: 'zen3-omni', spec: '72B Multimodal' },
                { name: 'zen3-nano', spec: '4B Edge' },
                { name: 'zen3-guard', spec: '8B Safety' },
              ].map((m) => (
                <Card key={m.name} className="border-white/[0.06] bg-white/[0.02] shadow-none py-0 gap-0 rounded-lg">
                  <CardContent className="p-3">
                    <div className="text-xs font-mono font-medium text-white mb-1">{m.name}</div>
                    <div className="text-[10px] text-[#525252]">{m.spec}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent text-xs px-4 py-2 h-auto">
                <a
                  href="https://zenlm.org"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  zenlm.org &rarr;
                </a>
              </Button>
              <a
                href="https://huggingface.co/zenlm"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-[#525252] hover:text-white transition-colors"
              >
                HuggingFace &rarr;
              </a>
            </div>
          </CardContent>
        </Card>

        {/* -- CTA --------------------------------------------------------- */}
        <section className="relative text-center py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_200px_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
          <h2 className="relative text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Start building
          </h2>
          <p className="relative text-[#525252] text-sm mb-3">
            Free tier with generous limits. No credit card required.
          </p>
          <div className="relative font-mono text-sm text-[#666] mb-8">
            curl hanzo.sh | sh
          </div>
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <Button asChild size="lg" className="rounded-full bg-white px-8 text-black hover:bg-neutral-200">
              <a href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai">
                Sign Up Free
                <ArrowRight className="size-4 ml-1" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 px-8 text-white hover:bg-white/5 bg-transparent">
              <Link href="/docs">
                Browse Documentation
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
