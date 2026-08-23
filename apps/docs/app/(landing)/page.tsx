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
  Sparkle,
  Terminal,
  Workflow,
} from 'lucide-react';
import { Card, CardContent, CardTitle, XStack } from '@hanzo/ui';
import { Grid } from '@hanzo/ui/grid';
import { AgentActions } from '@/components/agent-actions';
import { Tabs, Tab } from '@hanzo/docs-base-ui/components/tabs';
import { HeroField } from '@/components/hero-field';
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
    icon: Sparkle,
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
      {/* One column, centred. It was `flex flex-col items-center`, which is the
          same picture drawn with the wrong primitive: a column of blocks IS a
          one-track grid, and saying so means `justifyItems` centres the children
          without each of them having to be told. */}
      <section
        className="relative mx-auto w-full max-w-5xl px-6 pt-24 pb-16 md:pt-36 md:pb-24"
        style={{ display: 'grid', justifyItems: 'center', textAlign: 'center' }}
      >
        {/* The atmosphere behind the headline, as dots rather than a gradient —
            the halftone IS the mark, and a gradient carries none of it. `fade`
            dissolves the canvas rectangle on both axes so the field ends in the
            page instead of on an edge you can see. It is its own client island
            because its shape is a function; see components/hero-field.tsx. */}
        <HeroField />

        {/* Enso first. The model is the reason to choose the platform; a
            capability count is the reason to choose nothing. */}
        <Link
          href="https://hanzo.ai/enso"
          target="_blank"
          rel="noreferrer"
          className="relative mb-8 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-400 backdrop-blur transition-colors hover:border-white/20 hover:text-white"
          style={{ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center', columnGap: 8 }}
        >
          <span className="rounded-full bg-white" style={{ width: 6, height: 6 }} />
          Meet Enso — our frontier model, default on every surface
          <ArrowRight className="size-3.5" />
        </Link>

        {/* Display optics, measured off hanzo.ai: leading 1.0 and tracking
            -0.025em are most of why that type reads as SET rather than merely
            large — at display size the default 1.05 opens a gap the eye reads as
            two lines instead of one block. The ink is #e5e5e5, not #fff: pure
            white halates against a near-black ground, thickening the stems. */}
        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
          <span className="text-[#e5e5e5]">Build anything<br className="hidden sm:block" /> with Hanzo.</span>
        </h1>
        <p className="relative mt-5 max-w-xl text-neutral-300 text-lg md:text-xl leading-relaxed">
          Every model. Every tool. One key. Start in the browser, ship from your
          terminal, and when you want it on your own hardware, take the whole thing
          with you — it is the same software we run in production.
        </p>

        {/* -- Install command -- the main CTA ------------------------------ */}
        <div className="relative mt-10 w-full max-w-lg">
          <Card
            backgroundColor="rgba(255,255,255,0.03)"
            borderColor="rgba(255,255,255,0.08)"
            borderRadius={16}
            padding={4}
            paddingVertical={4}
            gap={0}
          >
            {/* `$` then the command: a fixed leader and a track that takes the
                rest. The `flex-1` that used to be on the span was the child
                claiming the width; the track owns it now. */}
            <CardContent
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0, 1fr)',
                alignItems: 'center',
                columnGap: 12,
                borderRadius: 12,
                background: '#0a0a0a',
                padding: '16px 20px',
              }}
            >
              <span className="font-mono text-sm text-neutral-400 select-none">$</span>
              <span className="font-mono text-sm text-white" style={{ textAlign: 'left' }}>curl hanzo.sh | sh</span>
            </CardContent>
          </Card>
          <p className="text-xs text-neutral-400 mt-3">
            Installs the <code className="text-neutral-400 bg-white/5 px-1 py-0.5 rounded">hanzo</code> CLI.
            Then <code className="text-neutral-400 bg-white/5 px-1 py-0.5 rounded">hanzo auth login</code> to get a key.
          </p>
        </div>

        {/* -- The other way in: hand it to an agent ------------------------ */}
        {/* Beside the install line, because they are the two ways to start and a
            reader arriving with an agent open should not have to find that out
            further down. It is the SAME control the doc pages carry, so what it
            copies here is what it copies there — one prompt, one place it is
            written, and it sets the agent up to use Hanzo's models and skills
            rather than merely to call the API.

            It also has to be here rather than in the bar: this page has no table
            of contents, which is where the doc pages host it, so without this the
            the landing page offered no way to hand anything to an agent at all. */}
        <div className="relative mt-6" style={{ display: 'grid', justifyItems: 'center', rowGap: 8 }}>
          <AgentActions />
          <p className="text-xs text-neutral-400">
            Or hand this to your agent — it installs the CLI, the MCP server and
            the{' '}
            <Link
              href="https://hanzoskills.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 underline underline-offset-4 hover:text-white"
            >
              skills
            </Link>
            , then points its own model calls at Hanzo.
          </p>
        </div>

        {/* The three doors, in descending order of how much you type. The same
            three the docs masthead offers, so the choice a reader makes here is
            the one they keep. Replaces the stats bar: 67 / 436 / 600+ / 7 asked a
            reader to be impressed before they knew what the thing was, and the
            counts went stale the moment a service shipped. */}
        {/* The track floor is the whole responsive story: a column never goes
            below 260px, and there are never more than three. Breakpoints cannot
            express this, which is why the three they replaced read 3 → 1 → 3 —
            at 768 the sidebar has appeared but the viewport has not grown to pay
            for it, so a viewport query says "wide" while the column is 500px and
            a third of it put "Build with App" on three lines. `auto-fill`
            measures the COLUMN, so the sidebar is simply part of the arithmetic
            and the row is right at every width without being told about any. */}
        <Grid
          columns={{ min: 260, max: 3 }}
          gap={16}
          style={{ position: 'relative', marginTop: 48, width: '100%', maxWidth: 896 }}
        >
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
            // Three rows — eyebrow, title, body — so the gaps are declared once
            // on the card instead of as a margin on each child that has to know
            // what follows it.
            <Link
              key={d.title}
              href={d.href}
              {...(d.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
              style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto',
                alignContent: 'start',
                rowGap: 6,
                textAlign: 'left',
              }}
            >
              <span className="text-xs font-medium text-neutral-300">
                {d.eyebrow}
              </span>
              <span
                className="text-lg font-semibold text-white"
                style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', columnGap: 6 }}
              >
                {d.title}
                <ArrowRight className="size-4 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
              <span className="text-sm leading-relaxed text-neutral-300">{d.body}</span>
            </Link>
          ))}
        </Grid>

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
          {/* Install, then use — the same two steps /docs/quickstart shows, and
              the same order of tabs, so the front page and the quickstart do not
              teach different install lines. npm is first because it is the one
              most readers already have. */}
          <Tabs items={['npm', 'Script', 'Homebrew', 'pip']}>
            <Tab value="npm">
              <CodeBlock code={`npm i -g hanzo`} lang="bash" />
            </Tab>
            <Tab value="Script">
              <CodeBlock code={`curl -fsSL hanzo.sh | sh`} lang="bash" />
            </Tab>
            <Tab value="Homebrew">
              <CodeBlock code={`brew install hanzoai/tap/hanzo`} lang="bash" />
            </Tab>
            <Tab value="pip">
              <CodeBlock code={`pip install hanzo`} lang="bash" />
            </Tab>
          </Tabs>

          <p className="text-neutral-300 text-sm mt-6 mb-3">
            Sign in once, then reach every capability from the terminal — or from
            your own code.
          </p>

          <Tabs items={['CLI', 'TypeScript', 'Python', 'Go', 'Rust', 'HTTP']}>
            <Tab value="CLI">
              <CodeBlock
                code={`hanzo auth login\n\nhanzo "explain quantum computing"\nhanzo models list\nhanzo projects deploy my-app`}
                lang="bash"
              />
            </Tab>
            <Tab value="TypeScript">
              <CodeBlock
                code={`// npm i @hanzo/ai\nimport Hanzo from '@hanzo/ai'\n\nconst hanzo = new Hanzo() // reads HANZO_API_KEY\n\nconst r = await hanzo.chat.completions.create({\n  model: 'zen4',\n  messages: [{ role: 'user', content: 'Hello!' }],\n})\nconsole.log(r.choices[0].message.content)`}
                lang="typescript"
              />
            </Tab>
            <Tab value="Python">
              <CodeBlock
                code={`# pip install hanzoai\nfrom hanzoai import Hanzo\n\nclient = Hanzo()  # reads HANZO_API_KEY\n\nr = client.chat.completions.create(\n    model="zen4",\n    messages=[{"role": "user", "content": "Hello!"}],\n)\nprint(r.choices[0].message.content)`}
                lang="python"
              />
            </Tab>
            <Tab value="Go">
              <CodeBlock
                code={`// go get github.com/hanzoai/go-sdk\nimport "github.com/hanzoai/go-sdk"\n\nclient := hanzo.NewClient() // reads HANZO_API_KEY`}
                lang="go"
              />
            </Tab>
            <Tab value="Rust">
              <CodeBlock
                code={`// cargo add hanzo\nuse hanzo::Client;\n\nlet hanzo = Client::from_env()?; // reads HANZO_API_KEY`}
                lang="rust"
              />
            </Tab>
            <Tab value="HTTP">
              <CodeBlock
                code={`curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"zen4","messages":[{"role":"user","content":"Hello!"}]}'`}
                lang="bash"
              />
            </Tab>
          </Tabs>
        </section>

        {/* -- Nine domains -- category-first ------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            One binary. The whole platform.
          </h2>
          <p className="text-neutral-300 text-sm mb-8">
            Every capability has one name and one route. Browse by domain — click any card to go deep.
          </p>
          {/* 220, not 240: the column at 768 is 457px, and 240 needs 492 for a
              second track, so a 40px difference in one number is the whole gap
              between 2-up and 1-up there. Measured at the three real container
              widths — 342 / 457 / 960 — this gives 1 / 2 / 3. */}
          <Grid columns={{ min: 220, max: 3 }} gap={12}>
            {domains.map((item) => {
              const isExternal = !!(item as { external?: boolean }).external;
              const linkProps = isExternal
                ? { target: '_blank' as const, rel: 'noreferrer noopener' }
                : {};
              return (
                // Four rows: the icon/tag line, the name, the description, and
                // the footer pushed to the bottom by `1fr` on the description
                // row. Before, the footer was a separate flex child relying on
                // the frame's own gap; now the card states its own shape and the
                // minimum height has something to distribute.
                <Card
                  key={item.name}
                  className="group"
                  minHeight={140}
                  backgroundColor="rgba(255,255,255,0.02)"
                  borderColor="rgba(255,255,255,0.08)"
                  hoverStyle={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}
                  borderRadius={16}
                  paddingVertical={0}
                  gap={0}
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateRows: 'auto auto 1fr auto',
                    transition: 'all 300ms',
                  }}
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
                  <div
                    className="p-5 sm:p-6 pb-0"
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', marginBottom: 12 }}
                  >
                    <div className="rounded-xl bg-white/[0.06] p-2" style={{ justifySelf: 'start' }}>
                      <item.icon className="size-5 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-[11px] font-medium text-neutral-400">{item.tag}</span>
                  </div>
                  <CardTitle paddingHorizontal={24} fontSize={14} fontWeight="600" color="#ffffff" marginBottom={6}>
                    {item.name}
                  </CardTitle>
                  <p className="px-5 sm:px-6 text-xs text-neutral-400 leading-relaxed group-hover:text-neutral-200 transition-colors">
                    {item.desc}
                  </p>
                  <span
                    className="p-5 sm:p-6 pt-3 text-[10px] font-medium text-neutral-400 group-hover:text-white transition-colors"
                    style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', columnGap: 4 }}
                  >
                    {isExternal ? 'Visit' : 'View docs'} <ArrowRight className="size-3" />
                  </span>
                </Card>
              );
            })}
          </Grid>
        </section>

        {/* -- Developer Tools --------------------------------------------- */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Developer Tools
          </h2>
          <p className="text-neutral-300 text-sm mb-8">
            SDKs, APIs, and protocols for every stack.
          </p>
          {/* 230 is the 1 / 2 / 4 story the three breakpoints told, measured at
              the column rather than the window: 1-up on a phone, 2-up once the
              column clears ~476, and never more than four however wide it gets. */}
          <Grid columns={{ min: 230, max: 4 }} gap={16}>
            {devLinks.map((t) => (
              <Card
                key={t.name}
                className="group"
                backgroundColor="rgba(255,255,255,0.02)"
                borderColor="rgba(255,255,255,0.08)"
                hoverStyle={{ borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.04)' }}
                borderRadius={16}
                paddingVertical={0}
                gap={0}
                style={{ position: 'relative', transition: 'all 300ms' }}
              >
                <Link href={t.href} aria-label={t.name} className="absolute inset-0 z-10" />
                <CardContent
                  padding={24}
                  style={{ display: 'grid', gridTemplateRows: 'auto auto auto', justifyItems: 'start', rowGap: 4 }}
                >
                  <t.icon className="size-5 text-neutral-400 mb-3 group-hover:text-white transition-colors" />
                  <CardTitle fontSize={14} fontWeight="600" color="#ffffff">{t.name}</CardTitle>
                  <p className="text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </section>

        {/* -- Models & providers ------------------------------------------ */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Every model, one API
          </h2>
          <p className="text-neutral-300 text-sm mb-8">
            Over 400 models across every major provider — call any of them with one credential, one request shape.
          </p>
          <Grid columns={{ min: 120, max: 8 }} gap={12}>
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
              <Card
                key={p.name}
                backgroundColor="rgba(255,255,255,0.02)"
                borderColor="rgba(255,255,255,0.06)"
                borderRadius={8}
                paddingVertical={0}
                gap={0}
              >
                <CardContent style={{ display: 'grid', rowGap: 4, padding: '12px 16px', textAlign: 'center' }}>
                  <span className="text-xs font-semibold text-white">{p.name}</span>
                  <span className="text-[10px] text-neutral-400">{p.spec}</span>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </section>

        {/* -- SDKs + connectors ------------------------------------------- */}
        <Grid columns={{ min: 470, max: 2 }} gap={16}>
          {[
            {
              icon: Code2,
              title: 'SDKs in every language',
              body: (
                <>
                  Generated from one contract — the same <code className="font-mono">/v1</code> surface, typed for your stack.
                </>
              ),
              chips: ['Python', 'TypeScript', 'Go', 'Rust', 'C++', 'Dart'],
              href: '/docs/sdks',
              cta: 'SDK reference',
            },
            {
              icon: Workflow,
              title: 'Every tool, one MCP surface',
              body: 'Native connectors + the open MCP registry — Slack, GitHub, Notion, Stripe, and more — exposed as MCP tools any agent can call.',
              chips: ['Slack', 'GitHub', 'Notion', 'Stripe', 'Google', 'Linear', '+700 more'],
              href: '/docs/mcp',
              cta: 'MCP tools',
            },
          ].map((s) => (
            <Card
              key={s.title}
              backgroundColor="rgba(255,255,255,0.02)"
              borderColor="rgba(255,255,255,0.08)"
              borderRadius={16}
              paddingVertical={0}
              gap={0}
              overflow="hidden"
            >
              <CardContent
                padding={32}
                style={{ display: 'grid', gridTemplateRows: 'auto auto auto auto', justifyItems: 'start', rowGap: 8 }}
              >
                <span style={{ display: 'grid', gridAutoFlow: 'column', alignItems: 'center', columnGap: 12 }}>
                  <s.icon className="size-5 text-neutral-400" />
                  <CardTitle fontSize={20} fontWeight="700" letterSpacing={-0.4}>{s.title}</CardTitle>
                </span>
                <p className="text-xs text-neutral-400 mb-4">{s.body}</p>
                {/* A wrapping run of chips is the one place flex is still the
                    right answer — grid cannot wrap items of unequal intrinsic
                    width without giving them a track — so it is said with gui's
                    XStack, whose style props travel to native, rather than with
                    tailwind's. */}
                <XStack flexWrap="wrap" gap={8}>
                  {s.chips.map((c) => (
                    <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-neutral-400">
                      {c}
                    </span>
                  ))}
                </XStack>
                <Link
                  href={s.href}
                  className="mt-4 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                  style={{ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center', columnGap: 4 }}
                >
                  {s.cta} <ArrowRight className="size-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* -- What the CLI can do ----------------------------------------- */}
        <Card
          backgroundColor="rgba(255,255,255,0.02)"
          borderColor="rgba(255,255,255,0.08)"
          borderRadius={16}
          paddingVertical={0}
          gap={0}
          overflow="hidden"
        >
          <div className="p-8 md:p-10" style={{ display: 'grid', rowGap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'center', columnGap: 12 }}>
              <div className="rounded-xl bg-white/[0.06] p-2.5">
                <Terminal className="size-5 text-neutral-400" />
              </div>
              <div style={{ display: 'grid', rowGap: 2 }}>
                <CardTitle fontSize={24} fontWeight="700" letterSpacing={-0.5}>
                  The <code className="font-mono">hanzo</code> CLI
                </CardTitle>
                <span className="text-xs text-neutral-400">A ~15 MB Rust client for any live cloud — prod, laptop, or self-host</span>
              </div>
            </div>
            <Grid columns={{ min: 200, max: 3 }} gap={12}>
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
                <Card
                  key={item.cmd}
                  backgroundColor="rgba(255,255,255,0.02)"
                  borderColor="rgba(255,255,255,0.06)"
                  borderRadius={8}
                  paddingVertical={0}
                  gap={0}
                >
                  <CardContent style={{ display: 'grid', rowGap: 4, padding: '12px 16px' }}>
                    <span className="text-xs font-mono font-medium text-white">{item.cmd}</span>
                    <span className="text-[11px] text-neutral-400">{item.desc}</span>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </div>
        </Card>

        {/* -- Zen Models Banner ------------------------------------------- */}
        <Card
          backgroundColor="rgba(255,255,255,0.02)"
          borderColor="rgba(255,255,255,0.08)"
          borderRadius={16}
          paddingVertical={0}
          gap={0}
          overflow="hidden"
        >
          <div className="p-8 md:p-10" style={{ display: 'grid', rowGap: 24 }}>
            <div style={{ display: 'grid', gridAutoFlow: 'column', justifyContent: 'start', alignItems: 'center', columnGap: 12 }}>
              <Sparkle className="size-5 text-neutral-400" />
              <CardTitle fontSize={24} fontWeight="700" letterSpacing={-0.5}>
                Zen
              </CardTitle>
              <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-neutral-400">44 models</span>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl">
              Frontier AI models from 4B edge to 1T+ reasoning. MoDE (Mixture of Diverse Experts) architecture.
              Text, code, vision, audio, video, 3D, and safety. Open weights on HuggingFace.
            </p>
            <Grid columns={{ min: 130, max: 6 }} gap={12}>
              {[
                { name: 'zen4', spec: '~400B MoDE' },
                { name: 'zen4-coder', spec: '~200B MoDE' },
                { name: 'zen4-thinking', spec: 'Deep CoT' },
                { name: 'zen3-omni', spec: '72B Multimodal' },
                { name: 'zen3-nano', spec: '4B Edge' },
                { name: 'zen3-guard', spec: '8B Safety' },
              ].map((m) => (
                <Card
                  key={m.name}
                  backgroundColor="rgba(255,255,255,0.02)"
                  borderColor="rgba(255,255,255,0.06)"
                  borderRadius={8}
                  paddingVertical={0}
                  gap={0}
                >
                  <CardContent style={{ display: 'grid', rowGap: 4, padding: 12 }}>
                    <span className="text-xs font-mono font-medium text-white">{m.name}</span>
                    <span className="text-[10px] text-neutral-400">{m.spec}</span>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <XStack flexWrap="wrap" gap={12} alignItems="center">
              <a
                href="https://zenlm.org"
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-white/20 px-4 py-2 text-xs text-white transition-colors hover:bg-white/5"
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
            </XStack>
          </div>
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
          <XStack flexWrap="wrap" gap={12} alignItems="center" justifyContent="center" position="relative">
            <a
              href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
              className="rounded-full bg-white px-8 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
              style={{ display: 'inline-grid', gridAutoFlow: 'column', alignItems: 'center', columnGap: 4 }}
            >
              Sign Up Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/docs"
              className="rounded-full border border-white/15 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Browse Documentation
            </Link>
          </XStack>
        </section>
      </div>
    </main>
  );
}
