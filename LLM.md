# Hanzo Docs Framework

Fork of [Hanzo Docs](https://github.com/hanzoai/docs) with all packages renamed to `@hanzo/docs-*` namespace.

## How this ships

**Full runbook: [`RELEASE.md`](./RELEASE.md)** — every path that can publish, the
credential each one needs, and the exact edit that makes an image live. What
follows is the shape; that file is the detail.

    push  ->  github.com/hanzo-docs/docs       origin
              .github/workflows/cicd.yml       hanzoai/ci, workflow_dispatch only
      ->  git.hanzo.ai/hanzo-docs/docs         a PULL mirror
              .hanzo/workflows/lint.yml        oxfmt, tsc, oxlint
              .hanzo/workflows/test.yml        vitest
              .hanzo/workflows/release.yml     publishes the npm packages
              .hanzo/workflows/sync-zen-pricing.yml  the daily pricing commit
              .hanzo/workflows/deploy.yml      builds ghcr.io/hanzoai/docs
      ->  POST /v1/runner                      the fabric that built what is live
      ->  hanzoai/universe                     charts/app/values/hanzo/docs.yaml
                                               names what is live; cd.automated
      ->  hanzoai/static behind hanzoai/ingress serves docs.hanzo.ai

Every build, check, publish and deploy is a workflow under `.hanzo/workflows/`,
which the forge reads. `.hanzo/workflows` uses GitHub Actions syntax, so a
workflow moves between the two directories and nothing else changes — which is how
all of these got here, `runs-on: hanzo-docs-build-linux-amd64` and all.

These DO run. The git-runners pick up `hanzoai/docs` off git.hanzo.ai — task
31188 built it at 2026-08-04T04:35Z. The earlier claim here that nothing could
run (a `hanzo-docs/docs` pull mirror with no Actions unit) named a repo that is
not the one the runners poll, and reading it as "docs cannot build" sends you
looking for a build lane that already exists.

`.github/workflows/cicd.yml` is the other lane: seven lines importing hanzoai/ci,
configured by the root `hanzo.yml`. It is `workflow_dispatch`-only, because two
push-triggered builders for one image means one commit yields two images under two
tag schemes. It also cannot schedule yet — Actions is enabled and the repo is
public, but every runner we own answers to git.hanzo.ai and not to github.com,
and GitHub-hosted runners are not something we build on.

`deploy.yml` builds and pushes, and stops. Its predecessor patched `app docs` with
kubectl and waited on the rollout, and it built the image from a heredoc pinned to
`static:0.4.1` while this repo's `Dockerfile` — the one the fabric builds — pinned
`v0.5.1`. The recipe lives in the `Dockerfile` alone now; a workflow only runs it.

**The export gate is in the Dockerfile**, not in any workflow. This site fails by
exporting nothing — a valid layer, a valid image, a 404 — and no builder can
notice that. `scripts/check-export.sh` says what a site is and
`apps/<app>/export.require` names the sections that must not silently vanish
(`docs/studio/` is a submodule; a checkout that does not recurse drops it while
page count and nav stay green). A failed gate means no image exists, so no lane
can push past it.

The tag that goes live is set by hand in `hanzoai/universe`
`charts/app/values/hanzo/docs.yaml`, which carries `cd.automated: true` — so that
commit IS the rollout. Note that the file pins a `digest:` beside the `tag:`, and
the digest is what actually gets pulled: moving the tag alone changes nothing.

### The nine sibling sites still on Cloudflare Pages

`deploy-base-docs`, `-bootnode-docs`, `-bot-docs`, `-cloud`, `-dev-docs`,
`-gui-docs`, `-insights-docs`, `-zen-docs`, `-zt-docs` each `wrangler pages
deploy` their app. Each is the ONLY deploy of its host, so they moved to
`.hanzo/workflows/` unchanged rather than being deleted: deleting one strands a
host with no failing run to show it, which is exactly how admin.hanzo.ai went
stale for a day.

They are not done. To finish one:

1. `docker build --build-arg APP=<app> .` — the root `Dockerfile` takes `APP`, so
   no new Dockerfile is needed for any of them. Two things are true of `apps/docs`
   and of none of the siblings yet, and both stop this build: only
   `apps/docs/next.config.mts` honours `NEXT_EXPORT` with `output: 'export'`, so a
   sibling writes no `out/` at all; and the export gate's floor of 50 pages is the
   hub's shape, which a seven-page sibling will not clear. Give the sibling
   `output: 'export'` first, then reconcile the floor —
   `scripts/check-export.sh` is where it is stated, once, for everything.
2. Add `infra/k8s/operator/crs/<name>.yaml` in hanzoai/universe, copying
   `hips.yaml`: `containerPort 3000` / `servicePort 80`, `HANZO_STATIC_CSP`,
   `imagePullSecrets: ghcr-secret`, **empty tag**, and **not** listed in
   `kustomization.yaml`. Inert until an image exists.
3. Publish an image, set the tag, add the kustomization line, confirm the pod.
4. Only then repoint DNS off Pages and delete that wrangler workflow.

**The blocker is the host, not the build.** `infra/cf-zones/hanzo-ai.yaml`
declares only three of the nine (`dev`, `docs-insights`, `zerotrust`); the rest
are CF Pages custom domains set outside declared config. An App CR with a guessed
host is wrong even while inert, so each host must be confirmed against Cloudflare
before its CR is written.

Two known snags in that set: `dev.hanzo.ai` already 404s, so its Pages project is
broken independently of this migration; and `deploy-bot-docs.yml` contradicts
universe `crs/bot-docs.yaml`, which already serves `docs.hanzo.bot` in-cluster
from `ghcr.io/hanzoai/bot-docs` — bot-docs has two deploy paths today, and the
wrangler one is the one to retire.

`infra/cf-zones/hanzo-ai.yaml` also still declares `docs -> hanzo-docs.pages.dev`,
which is stale: docs.hanzo.ai answers from the cluster.

## Canonical model — the one way to do docs

Full ADR: `apps/docs/content/docs/contributing/docs-architecture.mdx` (rendered
at docs.hanzo.ai/docs/contributing/docs-architecture). Summary:

- **docs.hanzo.ai is the hub.** ONE Fumadocs build (`apps/docs`) → ONE CF Pages
  project `hanzo-docs`. The federated per-section deploy is **retired** (stale
  origins 530'd). Do not reintroduce per-section builds.
- **IA is category-first (V8 · Open Edition, HIP-0127).** The docs sidebar
  (`content/docs/meta.json`) is grouped by the **eight movements** — Identity &
  Trust · Intelligence · Data · Streams · Observability · Commerce · Platform ·
  Applications — the exact taxonomy in `~/work/hanzo/openapi/capabilities.yaml`
  (`domains`, 67 capabilities). Movements are icon-bearing separators
  (`---[Icon]Name---`, resolved by `lucideIconsPlugin`), NOT folder moves —
  files stay flat so URLs/openapi back-links don't break. **API reference and
  SDKs are separated surfaces** (`/docs/openapi`, `/docs/sdks`) reached via the
  top nav (`components/layouts/shared.tsx`), deliberately NOT in the root
  sidebar descent. The landing (`app/(landing)/page.tsx` — its own route group,
  because it carries the docs chrome from `components/layouts/docs.tsx` while
  `(home)` keeps the marketing chrome for /blog) + docs home
  (`content/docs/index.mdx`) lead with the decentralized spine ("the AI cloud
  you can run yourself"); `content/docs/network.mdx` = self-host/hanzo.network,
  `content/docs/architecture/philosophy.mdx` = the engineering pedagogy. Landing
  breadth stats trace to real sources: 67/8 (`capabilities.yaml`), 157 models
  (`ai/conf/models.yaml`), 706 connectors (`cloud/clients/automations/catalog/
  catalog.json`), 6 SDK langs (`openapi/CLAUDE.md`). Count from data, never invent.
- **One canonical home per doc.** Content enters the single build via exactly one
  of three orthogonal mechanisms, chosen by *kind*:
  1. **Authored** (first-party prose) → MDX under `content/docs/<section>/`.
     Small/core sections live in-repo; team-owned sections live in a
     `hanzo-docs/<team>` content repo mounted as a **git submodule** at
     `content/docs/<team>/`. Exemplar: `hanzo-docs/studio-docs` → `content/docs/studio/`.
  2. **Generated** (never hand-written, `.gitignore`d) → API reference from
     `hanzoai/cloud`'s `openapi.yaml` at the release `openapi-specs/.spec-lock`
     pins, via `scripts/sync-openapi.sh` + `scripts/gen-openapi-pages.ts`
     (source-derived: an endpoint's sentence is written next to its handler and
     travels here unaltered); SDK reference from the ZAP SDK generator into
     `content/docs/sdks/<lang>/`. Every reader of the document goes through
     `scripts/openapi-doc.ts`, which owns the path — no script names the file.
     A generated MDX **fragment** is the third shape here, for a fact an authored
     page needs mid-sentence: `scripts/gen-key-types.ts` writes
     `generated/key-types.mdx` and `content/docs/api-keys.mdx` pulls it in with
     `<include>`. It sits outside `content/` because source.config globs
     `**/*.mdx` there and would give a fragment its own URL — and the path is
     relative to the INCLUDING file, so from `content/docs/` it is
     `../../generated/`. One directory short renders the page body empty with
     the frontmatter and chrome intact, which looks like a working page.
  3. **Ported** (upstream OSS, mirrored with attribution, `.gitignore`d) →
     `scripts/sync-project-docs.ts` into `content/docs/projects/<upstream>/`.
     Port, don't re-author. Carry upstream LICENSE + NOTICE. GPL stays GPL.
- **Repos:** `hanzo-docs/docs` = framework + hub (canonical; `hanzoai/docs`
  redirects here). `hanzo-docs/<team>` = authored content only, NO framework.
  `hanzoai/cloud` `openapi.yaml` = the API source of truth; `hanzoai/openapi`'s
  `hanzo.yaml` was a projection of it on its own clock and this repo no longer
  reads it. All docs live in the `hanzo-docs`
  org: the hub at `hanzo-docs/docs`, each team's content at `hanzo-docs/<team>`.
- **Standalone vs hub:** default is a hub section. Standalone deploy only if ALL
  of: ≈150+ pages or fast OSS-upstream churn, independent versioning, direct
  audience. Standalone runs its own copy of this framework; the hub links out,
  never copies.
- **Serving:** `ghcr.io/hanzoai/docs` behind hanzoai/ingress for docs.hanzo.ai.
  The nine sibling hosts below are still CF Pages `hanzo-docs` (token from KMS,
  never hard-coded). No nginx/caddy.

**Known dedup debt (rollout, not done):** the `apps/*-docs` legacy apps
(base-docs, bootnode-docs, bot-docs, cloud, dev-docs, dns-docs, flow, gui-docs,
insights-docs, platform, pulsar-docs, spec, tasks-docs, team, visor, zen-docs,
zt-docs) predate the unified `content/docs/` model — migrate their content into
`content/docs/<section>/` (or a `hanzo-docs/<team>` submodule) then archive the
app.

## Two build guards, and why prose needs them

`scripts/pre-build.ts` ends with two checks that fail the build. Both exist for
the same reason: a generated page cannot be wrong about the API, an authored one
can, and a reader cannot tell which kind of page they are on.

- **`check-endpoints.ts`** — no page may name a `/v1/…` route on `api.hanzo.ai`
  that the document does not serve.
- **`check-keys.ts`** — no page may spell an API key a way cloud does not mint,
  and `api-keys.mdx` must teach every class the document carries. Both
  directions, so renaming, adding or removing a key class in cloud stops the
  build here instead of publishing a stale page.

The key classes come from `Document.keys` (`openapi-doc.ts`), read out of the
`/v1/keys` prose — cloud's own Go doc comments, lifted by zipdoc. `secretKey(doc)`
is the one accessor generators use for "the key a server presents"; three of them
had it as a literal, which is how three GENERATED pages came to teach `hk-`.

**What was wrong:** docs.hanzo.ai documented three key types — `hk-` "API Key",
`sk-` "Secret Key", `hz-` "Widget Key". Cloud mints two (`cloud.APIKeyPrefixes`:
`pk-`, `sk-`) and refuses anything else, so a reader's first call failed asking
for a key nobody can issue. `hk-`/`hz-` were on 149 files. Note the shape of the
mistake: `sk-` was *present* and *described wrongly* (as an org-level provider
credential; it resolves to the USER), so a find-and-replace would have left the
page confidently wrong. Cloud's `apps/platform/secretshape.go` still lists `hk-`
in its secret-DETECTION table — harmless, it only scans, but it is where the
invention came from.

## Branch Convention

- **`main`** — Production branch. docs.hanzo.ai is built from here and served
  in-cluster from `ghcr.io/hanzoai/docs`; landing on `main` does not publish, a
  build plus a pin in universe does (`RELEASE.md`). All Hanzo work lands here.
- **`dev`** — Tracks upstream `Hanzo Docs/dev`. Used for upstream sync merges only.
- **`upstream`** remote — points to `hanzoai/docs`

## Architecture

pnpm workspace monorepo with turbo. Two apps, 24 packages, 24 examples.

```
~/work/hanzo/docs/
├── apps/
│   ├── docs/           # Main docs site (hanzoai.github.io/docs)
│   └── zap-docs/       # Zap protocol docs
├── packages/
│   ├── core/           # @hanzo/docs-core - source loading, search, i18n
│   ├── mdx/            # @hanzo/docs-mdx - MDX processing, collections
│   ├── base-ui/        # @hanzo/docs-base-ui - headless UI (@base-ui/react)
│   ├── radix-ui/       # @hanzo/docs-ui - full UI with Radix primitives
│   ├── openapi/        # @hanzo/docs-openapi - OpenAPI docs generation
│   ├── typescript/     # @hanzo/docs-typescript - auto type tables
│   ├── twoslash/       # @hanzo/docs-twoslash - TypeScript code hints
│   ├── cli/            # @hanzo/docs-cli - scaffolding & customization
│   ├── story/          # @hanzo/docs-story - component stories
│   ├── tailwind/       # @hanzo/docs-tailwind - Tailwind CSS utils
│   ├── press/          # @hanzo/docs-press - minimal setup
│   ├── hanzo-docs/     # @hanzo/docs - unified wrapper re-exporting all
│   ├── content-collections/ # @hanzo/docs-content-collections
│   ├── mdx-remote/     # @hanzo/docs-mdx-remote - remote MDX
│   ├── obsidian/       # @hanzo/docs-obsidian - Obsidian vault adapter
│   ├── python/         # @hanzo/docs-python - Python docgen
│   ├── doc-gen/        # @hanzo/docs-docgen - doc generation
│   ├── create-app/     # @hanzo/docs-create-app - project scaffolding
│   ├── create-app-versions/ # version tracking for create-app
│   ├── shared/         # shared utilities
│   ├── stf/            # @hanzo/docs-stf (upstream dependency)
│   ├── mdx-runtime/    # @hanzo/mdx-runtime
│   ├── eslint-config-custom/ # shared ESLint config
│   └── tsconfig/       # shared TypeScript config
└── examples/           # 24 example apps (Next.js, Astro, React Router, etc.)
```

## Package Naming Convention

One brand: every workspace package publishes under `@hanzo/docs-*`. The
rename rule (applied when merging from the upstream fork) drops the upstream
prefix and re-scopes to `@hanzo/docs-`:

- `<basename>` (unscoped upstream) → `@hanzo/docs-<basename>`
- `@<scope>/<basename>` (scoped upstream) → `@hanzo/docs-<basename>`

Canonical workspace packages and their paths:

| Hanzo name | Path |
|------------|------|
| `@hanzo/docs-core` | packages/core |
| `@hanzo/docs-mdx` | packages/mdx |
| `@hanzo/docs-ui` | packages/radix-ui |
| `@hanzo/docs-base-ui` | packages/base-ui |
| `@hanzo/docs-openapi` | packages/openapi |
| `@hanzo/docs-preview` | packages/preview |
| `@hanzo/docs-typescript` | packages/typescript |
| `@hanzo/docs-twoslash` | packages/twoslash |
| `@hanzo/docs-cli` | packages/cli |
| `@hanzo/docs-story` | packages/story |
| `@hanzo/docs-tailwind` | packages/tailwind |
| `@hanzo/docs-language` | packages/language |
| `@hanzo/docs-local-md` | packages/local-md |
| `@hanzo/docs-sanity` | packages/sanity |
| `@hanzo/docs-vite` | packages/vite |
| `@hanzo/docs-basehub` | packages/basehub |
| `@hanzo/docs-mdx-remote` | packages/mdx-remote |
| `@hanzo/docs-stf` | packages/stf |
| `@hanzo/create-docs` | packages/create-app |
| `@hanzo/docs-create-versions` | packages/create-app-versions |

**Important**: `packages/radix-ui` publishes as `@hanzo/docs-ui` (Radix
variant). The `base-ui` variant (`@hanzo/docs-base-ui`) uses `@base-ui/react`
instead of Radix.

**External deps kept verbatim** (real upstream npm packages, NOT renamed):
`fuma-cli`, `fuma-content`, `@fumari/json-schema-ts`, and the third-party
search adapters (typesense / trieve) documented under `apps/docs`.

## Upstream Sync

Remote `upstream` points to the upstream fork. Local `dev` tracks `upstream/dev`.

To merge upstream changes:

```bash
git checkout dev && git pull upstream dev
git checkout -b merge-upstream-YYYY-MM-DD main
git merge dev
# Resolve conflicts, then re-apply the package rename (table above)
# Merge into main when ready
```

After merge, re-apply the rename with the canonical script
(`scripts/rebrand-packages.mjs` — masks the external KEEP-list, then maps
each upstream name to its `@hanzo/docs-*` form).

## Key Patterns

### Source Config (`source.config.ts`)
```typescript
import { defineConfig, defineDocs } from '@hanzo/docs-mdx/config';
```

### Source Loader (`lib/source.ts`)
```typescript
import { docs } from '@/.source';
import { loader } from '@hanzo/docs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toHanzoDocsSource(), // API name kept from upstream
});
```

### Page Component
```tsx
import { DocsPage, DocsBody } from '@hanzo/docs-ui/layouts/docs/page';
import defaultMdxComponents from '@hanzo/docs-ui/mdx';
```

### The docs grid is three columns

`layouts/docs/slots/container.tsx` (both UI packages — they are parallel forks,
so a change to one without the other diverges them): `var(--fd-sidebar-col)
minmax(0, 1fr) var(--fd-toc-width)`. Rails pin to the edges, the page takes what
is between them.

It was five columns, with `minmax(min-content, 1fr)` gutters centring a band
capped at `--fd-layout-width`, and the sidebar AREA spanned the leading gutter as
well as its own column. Measured on the live site at `/docs/api-keys`: at 1920
the columns were `176.5 232 1052 268 176.5` and the nav — 232px, right-aligned in
its area by `items-end` — began 176px from the left edge; at 2560 it began 496px
in. The empty strip was inside the sidebar's own bordered, filled card, so every
pixel a wider display gained went there. Now `232 1405 268` and `232 2045 268`,
nav at x=0.

`--fd-layout-width` no longer bounds this grid. It was doing two jobs at once —
bounding the reading measure and bounding the band — and the page slot already
owns the first (`max-w-[900px]`), so what was left was only the job that made the
gap. The article therefore stays 900px and does not move; what moved is the nav
(flush left) and the toc (flush right), and the page COLUMN absorbed the gutters.
Widening the article past 900px is a separate typography decision, untaken.

Narrow viewports are unchanged by construction: below `md`, `--fd-sidebar-width`
is 0 and the sidebar is a fixed drawer outside the grid, and `--fd-toc-width` is
0 until a toc exists.

### Layouts
- `@hanzo/docs-ui/layouts/docs` - Standard docs layout
- `@hanzo/docs-ui/layouts/home` - Homepage layout
- `@hanzo/docs-ui/layouts/notebook` - Notebook layout
- `@hanzo/docs-ui/layouts/flux` - Alternative flux layout (new)

## Build

```bash
pnpm install          # Install deps
pnpm build            # Build all packages + apps
pnpm dev              # Dev server

# Individual packages
pnpm build --filter @hanzo/docs-core
pnpm build --filter @hanzo/docs-ui
```

Build tool: `tsdown` (all packages except `hanzo-docs` wrapper which uses `tsup`).

## Compatibility

- Next.js 15-16+ with App Router
- React 19+
- Tailwind CSS 4+ (see "UI framework debt" — this is the thing being removed)
- pnpm 10+

## UI framework debt — where the tailwind actually is

House rule is that `@hanzo/gui` is the only UI framework: it compiles to React
Native, so an app built on it runs on web, iOS and Android. Tailwind classes and
Radix primitives are DOM-only and cap an app at the browser. This repo is the
furthest thing from compliant, and the reason is structural, so measure before
planning anything.

**Tailwind here is LIVE, not inert.** 21 apps each carry a real
`postcss.config.mjs` with `@tailwindcss/postcss`, 60 CSS entrypoints begin
`@import "tailwindcss"`, and 66 package.json files declare a tailwind dep. Two of
those entrypoints — `packages/radix-ui/css/style.css` and
`packages/base-ui/css/style.css` — ship inside the published npm tarballs, so the
framework's *product* is tailwind. Counted with a utility-token regex over tracked
files: **39,433 class tokens across 537 source files.**

**The blocker is that the UI layer is two parallel forks of Fumadocs.**
`packages/radix-ui` publishes as `@hanzo/docs-ui` (Radix) and `packages/base-ui`
as `@hanzo/docs-base-ui` (Base UI) — ~110 files / 13.5k lines each, the same
components twice, kept in step by `.cursor/skills/radix-base-ui-sync`. Both names
are banned by the house rule, `apps/docs` depends on **both at once**, and every
app and example in the workspace consumes them. Complying means rebuilding that
layer once on `@hanzo/gui` and deleting both — a Fumadocs rewrite, not a patch.
Do not start it piecemeal: swapping one primitive inside a component whose markup
is still tailwind lowers a grep count and changes nothing real.

**Radix → @hanzo/gui primitive map** (checked against `~/work/hanzo/gui/pkgs/ui`,
not guessed). Present: `presence`→`animate-presence`, `popover`, `select`,
`dialog`, `accordion`, `tabs`, `collapsible`, `tooltip`, `direction`→
`core/use-direction`. **Genuinely missing: `navigation-menu` and `scroll-area`**
(`scroll-view` is the React Native scroller, not a custom-scrollbar area). Those
two must be built in `@hanzo/gui` before `packages/radix-ui` can be retired.
`collapsible` exists but `apps/gui-docs` has no page for it — a docs gap here,
not a missing primitive.

**`@zenlm/ui` ships classes that style nothing.** `packages/zenlm-ui` publishes
`dist/` as JS + d.ts with **no CSS at all**, declares no tailwind dep and has no
postcss config, yet styles its four components entirely with tailwind utilities
(and shadcn's `bg-muted` / `text-muted-foreground` tokens). Inside `apps/zen-docs`
they happen to resolve because that app compiles tailwind; for any other npm
consumer they are dead strings. Note `apps/zen-docs` pins `@zenlm/ui: ^1.0.6` from
the registry, not `workspace:*`, so pnpm 11 (`link-workspace-packages` defaults to
false) serves the published tarball — editing `packages/zenlm-ui` does not change
what zen-docs renders until a release. Converting it to `@hanzo/gui` style props
is the highest-value next increment and fixes the inertness by construction,
because style props travel with the component.

**Out of scope when counting:** `content/docs/projects/**` is gitignored and
regenerated by `sync-project-docs.ts` from upstream repos, so tailwind there is
upstream's and edits are overwritten. Two more grep hits are not tailwind at all —
the Java/Spring IAM guide uses **Bootstrap** in a Thymeleaf template, and the IAM
login-customization guide uses custom class names with their own `<style>` blocks.

**Shadcn is gone** (`packages/shadcn` + `examples/next-shadcn` deleted). It
existed to emit `npx shadcn@latest add ...` into rendered docs, which puts a
DOM-only library in the reader's app.

**Authored docs are converted.** The commerce recipes/storefront pages and
`zen5.mdx` teach `@hanzo/gui` now. Keep it that way: a snippet teaching tailwind
produces tailwind in someone's app, so examples count as shipping surface.

### Baseline when touching this repo

`pnpm types:check` is **not green and never was**: 50 of 72 tasks fail at rest.
`npx vitest run` is 13 failed / 203 passed. Judge a change by the *delta* against
those sets, not by a clean run you will never get. And `docs#types:check` failing
tells you nothing about whether a page renders — MDX compile errors do not surface
in tsc. `zen5.mdx` typechecked clean while the loader skipped the entire page
(`<50ms` in a table parses as a JSX tag; fence such values in backticks). Run the
app and look at it.

## Landing Apps (Moved Out)

Landing page apps were moved to their ecosystem repos:
- Hanzo apps → `~/work/hanzo/apps/`
- Lux apps → `~/work/lux/apps/`
- Zoo apps → `~/work/zoo/apps/`

`apps/zap-docs` and `apps/liquid` are gone; their deploy workflows were deleted
because they built directories that do not exist. See `apps/` for what is here.
