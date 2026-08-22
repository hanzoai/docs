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
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { Badge } from '@hanzo/docs-base-ui/components/ui/badge';
import { cn } from '@/lib/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@hanzo/docs-base-ui/components/ui/card';
import { CodeBlock } from '@/components/code-block';

/* -- The nine domains -- category-first, mirrors the console shell ---------- */

const domains = [
  {
    name: 'Identity & trust',
    desc: 'Who someone is, what they may touch, and where secrets stay safe. IAM, AuthZ, KMS, MPC, Zero-Trust.',
    icon: Shield,
    href: '/docs/openapi/iam',
    tag: 'Identity',
  },
  {
    name: 'Intelligence',
    desc: 'The mind of the cloud — every model, agent, and tool you can call. Models, Agents, MCP, Embeddings, Prompts, GPUs, Functions.',
    icon: Sparkles,
    href: '/docs/openapi/ai',
    tag: 'Intelligence',
  },
  {
    name: 'Data',
    desc: 'Somewhere to put your data and read it back fast. SQL, Vector, KV, Search, Object, Base, DocDB.',
    icon: Database,
    href: '/docs/openapi/provisioning',
    tag: 'Data',
  },
  {
    name: 'Streams',
    desc: 'Move messages and run work in the background, reliably. PubSub, Tasks, Pipelines, Crawl.',
    icon: Workflow,
    href: '/docs/openapi/pubsub',
    tag: 'Streams',
  },
  {
    name: 'Observability',
    desc: 'See exactly what your system is doing, live. Metrics, Logs, Traces, Sessions, Evals, Analytics.',
    icon: Activity,
    href: '/docs/openapi/o11y',
    tag: 'Observe',
  },
  {
    name: 'Commerce',
    desc: 'Turn usage into money — meter it, price it, bill it, reward it. Commerce, Billing, Marketplace, Referrals.',
    icon: ShoppingCart,
    href: '/docs/openapi/commerce',
    tag: 'Commerce',
  },
  {
    name: 'Platform',
    desc: 'Ship your code and run it anywhere. Gateway, Machines, Edge, Registry.',
    icon: Server,
    href: '/docs/openapi/gateway',
    tag: 'Platform',
  },
  {
    name: 'Applications',
    desc: 'The finished products people use every day. Chat, Studio, Dev, Integrations, Apps.',
    icon: LayoutGrid,
    href: '/docs/openapi/git',
    tag: 'Apps',
  },
  {
    name: 'Chain',
    desc: 'The networks the cloud speaks to — enumerate them, call one, read a holder\'s balances. Web3, Explorer.',
    icon: Globe,
    href: '/docs/openapi/web3',
    tag: 'Chain',
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
    desc: 'Python, TypeScript, Go, Rust, C++, Swift, Kotlin',
    href: '/docs/sdks',
    icon: Code2,
  },
  {
    name: 'API Reference',
    desc: 'Every /v1 endpoint, live',
    href: '/reference',
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
    // `[grid-area:main]` because this page hangs off DocsLayout, whose container
    // is a named 5-column grid — sidebar, header, main, toc. An unplaced child
    // is auto-placed into an implicit row under column one and renders 268px
    // wide beneath the sidebar. The docs pages get this from DocsPage; this one
    // is hand-built, so it says it itself.
    //
    // Widths below are sized to the column the grid gives it — roughly 1170px at
    // a 1440 viewport, not the 1400px the full-bleed home layout had — so the
    // page is laid out for the space it has rather than clamped into it. Every
    // `md:`/`lg:` column count that assumed the full viewport moved up one step,
    // because the sidebar takes 268px from `md` up and 768→1024→1280 step by 256.
    <main className="[grid-area:main] min-w-0 pb-6 md:pb-12">
      {/* -- Hero ---------------------------------------------------------- */}
      <section className="relative flex flex-col items-center text-center mx-auto w-full max-w-5xl px-6 pt-24 pb-16 md:pt-36 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_600px_300px_at_50%_0%,rgba(255,255,255,0.04),transparent_70%)]" />

        {/* Enso first. The model is the reason to choose the platform; a
            capability count is the reason to choose nothing. */}
        <Link
          href="https://hanzo.ai/enso"
          target="_blank"
          rel="noreferrer"
          className="relative mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-400 backdrop-blur transition-colors hover:border-white/20 hover:text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Meet Enso — our frontier model, default on every surface
          <ArrowRight className="size-3.5" />
        </Link>

        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
          <span className="text-white">Build anything<br className="hidden sm:block" /> with Hanzo.</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-neutral-300 text-lg md:text-xl leading-relaxed">
          Every model. Every tool. One key. Start in the browser, ship from your
          terminal, and when you want it on your own hardware, take the whole thing
          with you — it is the same software we run in production.
        </p>

        {/* -- Install command -- the main CTA ------------------------------ */}
        <div className="relative mt-10 w-full max-w-lg">
          <Card className="border-white/[0.08] bg-white/[0.03] p-1 shadow-none gap-0 py-0 rounded-2xl">
            <CardContent className="flex items-center gap-3 rounded-xl bg-[#0a0a0a] px-5 py-4 font-mono text-sm">
              <span className="text-neutral-400 select-none">$</span>
              <span className="text-white flex-1 text-left">curl hanzo.sh | sh</span>
            </CardContent>
          </Card>
          <p className="text-xs text-neutral-400 mt-3">
            Installs the <code className="text-neutral-400 bg-white/5 px-1 py-0.5 rounded">hanzo</code> CLI.
            Then <code className="text-neutral-400 bg-white/5 px-1 py-0.5 rounded">hanzo auth login</code> to get a key.
          </p>
        </div>

        {/* The three doors, in descending order of how much you type. The same
            three the docs masthead offers, so the choice a reader makes here is
            the one they keep. Replaces the stats bar: 67 / 436 / 600+ / 7 asked a
            reader to be impressed before they knew what the thing was, and the
            counts went stale the moment a service shipped. */}
        {/* Three across at `sm`, where there is no sidebar yet, and again from
            `lg`. Between those the sidebar has appeared but the viewport has not
            grown to pay for it: at 768 the column is 500px and a third of it put
            "Build with App" on three lines. Stacked is the honest layout there. */}
        <div className="relative mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {[
            {
              eyebrow: 'No code',
              title: 'Build with App',
              body: 'Describe it in English and watch it build. Chat, agents and MCP tools in the browser.',
              href: 'https://hanzo.app',
              external: true,
            },
            {
              eyebrow: 'In your terminal',
              title: 'Build with Dev',
              body: 'Our coding agent, in your repo. Or bring Claude Code and Codex — they work here too.',
              href: '/docs/cli',
            },
            {
              eyebrow: 'Lower level',
              title: 'Build with API',
              body: 'Over 400 models behind one REST endpoint, with SDKs for every language we ship.',
              href: '/docs/openapi',
            },
          ].map((d) => (
            <Link
              key={d.title}
              href={d.href}
              {...(d.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <span className="mb-2 text-xs font-medium text-neutral-300">
                {d.eyebrow}
              </span>
              <span className="mb-1.5 flex items-center gap-1.5 text-lg font-semibold text-white">
                {d.title}
                <ArrowRight className="size-4 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
              <span className="text-sm leading-relaxed text-neutral-300">{d.body}</span>
            </Link>
          ))}
        </div>

      </section>

      <div className="mx-auto w-full max-w-5xl px-6 md:px-8 space-y-24">

        {/* -- Quick Start Guide ------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Quick Start
          </h2>
          <p className="text-neutral-300 text-sm mb-8">
            Install the CLI, log in, and reach every capability from your terminal.
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <CodeBlock
              code={`# Install the Hanzo CLI
curl -fsSL hanzo.sh | sh

# Sign in (opens a browser)
hanzo auth login

# You're ready — try some things:
hanzo "explain quantum computing"
hanzo models list
hanzo projects list
hanzo projects deploy my-app`}
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

        {/* -- Nine domains -- category-first ------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            One binary. The whole platform.
          </h2>
          <p className="text-neutral-300 text-sm mb-8">
            Every capability has one name and one route. Browse by domain — click any card to go deep.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {domains.map((item) => {
              const isExternal = !!(item as { external?: boolean }).external;
              const linkProps = isExternal
                ? { target: '_blank' as const, rel: 'noreferrer noopener' }
                : {};
              return (
                <Card
                  key={item.name}
                  className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl min-h-[140px] sm:min-h-[160px]"
                >
                  {/* The whole card is the click target, so the link has no text
                      of its own — it takes its accessible name from the card
                      title it covers. Without this a screen reader announces a
                      bare "link". */}
                  {isExternal ? (
                    <a
                      href={item.href}
                      {...linkProps}
                      aria-label={item.name}
                      className="absolute inset-0 z-10"
                    />
                  ) : (
                    <Link href={item.href} aria-label={item.name} className="absolute inset-0 z-10" />
                  )}
                  <CardHeader className="p-5 sm:p-6 pb-0 gap-0 grid-rows-none">
                    <div className="flex items-center justify-between mb-3">
                      <div className="rounded-xl bg-white/[0.06] p-2">
                        <item.icon className="size-5 text-neutral-400 group-hover:text-white transition-colors" />
                      </div>
                      <Badge variant="ghost" className="text-[11px] text-neutral-400 font-medium border-none px-0">
                        {item.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold text-white mb-1.5">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-200 transition-colors">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-5 sm:p-6 pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400 group-hover:text-white transition-colors">
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
          <p className="text-neutral-300 text-sm mb-8">
            SDKs, APIs, and protocols for every stack.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {devLinks.map((t) => (
              <Card
                key={t.name}
                className="group relative border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 shadow-none py-0 gap-0 rounded-2xl"
              >
                <Link href={t.href} aria-label={t.name} className="absolute inset-0 z-10" />
                <CardContent className="p-6">
                  <t.icon className="size-5 text-neutral-400 mb-4 group-hover:text-white transition-colors" />
                  <CardTitle className="font-semibold text-sm text-white mb-1">{t.name}</CardTitle>
                  <CardDescription className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors">{t.desc}</CardDescription>
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
          <p className="text-neutral-300 text-sm mb-8">
            Over 400 models across every major provider — call any of them with one credential, one request shape.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
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
                  <div className="text-[10px] text-neutral-400">{p.spec}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* -- SDKs + connectors ------------------------------------------- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="size-5 text-neutral-400" />
                <CardTitle className="text-xl font-bold tracking-tight">SDKs in every language</CardTitle>
              </div>
              <CardDescription className="text-xs text-neutral-400 mb-6">
                Generated from one contract — the same <code className="font-mono">/v1</code> surface, typed for your stack.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {['Python', 'TypeScript', 'Go', 'Rust', 'C++', 'Dart'].map((l) => (
                  <span key={l} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
                    {l}
                  </span>
                ))}
              </div>
              <Link href="/docs/sdks" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors">
                SDK reference <ArrowRight className="size-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/[0.08] bg-white/[0.02] shadow-none py-0 gap-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <Workflow className="size-5 text-neutral-400" />
                <CardTitle className="text-xl font-bold tracking-tight">Every tool, one MCP surface</CardTitle>
              </div>
              <CardDescription className="text-xs text-neutral-400 mb-6">
                Native connectors + the open MCP registry — Slack, GitHub, Notion, Stripe, and more — exposed as MCP tools any agent can call.
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                {['Slack', 'GitHub', 'Notion', 'Stripe', 'Google', 'Linear', '+700 more'].map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
                    {c}
                  </span>
                ))}
              </div>
              <Link href="/docs/mcp" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors">
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
                <Terminal className="size-5 text-neutral-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  The <code className="font-mono">hanzo</code> CLI
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400 mt-0.5">A ~15 MB Rust client for any live cloud — prod, laptop, or self-host</CardDescription>
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
                    <div className="text-[11px] text-neutral-400">{item.desc}</div>
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
              <Sparkles className="size-5 text-neutral-400" />
              <CardTitle className="text-2xl font-bold tracking-tight">
                Zen
              </CardTitle>
              <Badge variant="secondary" className="text-xs text-neutral-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border-transparent">
                44 models
              </Badge>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl mb-6">
              Frontier AI models from 4B edge to 1T+ reasoning. MoDE (Mixture of Diverse Experts) architecture.
              Text, code, vision, audio, video, 3D, and safety. Open weights on HuggingFace.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
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
                    <div className="text-[10px] text-neutral-400">{m.spec}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://zenlm.org"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'rounded-full border-white/20 text-white hover:bg-white/5 bg-transparent text-xs px-4 py-2 h-auto',
                )}
              >
                zenlm.org &rarr;
              </a>
              <a
                href="https://huggingface.co/zenlm"
                target="_blank"
                rel="noreferrer noopener"
                className="text-xs text-neutral-400 hover:text-white transition-colors"
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
          <p className="relative text-neutral-400 text-sm mb-3">
            Free tier with generous limits. No credit card required.
          </p>
          <div className="relative font-mono text-sm text-neutral-400 mb-8">
            curl hanzo.sh | sh
          </div>
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
              className={cn(
                buttonVariants({ variant: 'primary', size: 'lg' }),
                'rounded-full bg-white px-8 text-black hover:bg-neutral-200',
              )}
            >
              Sign Up Free
              <ArrowRight className="size-4 ml-1" />
            </a>
            <Link
              href="/docs"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'rounded-full border-white/15 px-8 text-white hover:bg-white/5 bg-transparent',
              )}
            >
              Browse Documentation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
