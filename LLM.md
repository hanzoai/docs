# Hanzo Docs Framework

Fork of [Hanzo Docs](https://github.com/hanzoai/docs) with all packages renamed to `@hanzo/docs-*` namespace.

## Branch Convention

- **`main`** — Production branch. CF Pages deploys docs.hanzo.ai from here. All Hanzo work lands here.
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
| `@hanzo/docs-shadcn` | packages/shadcn |
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
- Tailwind CSS 4+
- pnpm 10+

## Landing Apps (Moved Out)

Landing page apps were moved to their ecosystem repos:
- Hanzo apps → `~/work/hanzo/apps/`
- Lux apps → `~/work/lux/apps/`
- Zoo apps → `~/work/zoo/apps/`

Only `docs` and `zap-docs` remain in this repo.

---

*Last updated: 2026-02-08*
