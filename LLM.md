# LLM.md - Hanzo Docs Framework

Fork of [fumadocs](https://github.com/fuma-nama/fumadocs) with all packages renamed to `@hanzo/docs-*` namespace.

## Branch Convention

- **`main`** — Production branch. CF Pages deploys docs.hanzo.ai from here. All Hanzo work lands here.
- **`dev`** — Tracks upstream `fumadocs/dev`. Used for upstream sync merges only.
- **`upstream`** remote — points to `fuma-nama/fumadocs`

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
│   ├── stf/            # @fumari/stf (upstream dependency)
│   ├── mdx-runtime/    # @hanzo/mdx-runtime
│   ├── eslint-config-custom/ # shared ESLint config
│   └── tsconfig/       # shared TypeScript config
└── examples/           # 24 example apps (Next.js, Astro, React Router, etc.)
```

## Package Naming Convention

All upstream `fumadocs-*` and `@fumadocs/*` packages are renamed:

| Upstream | Hanzo Fork |
|----------|-----------|
| `fumadocs-core` | `@hanzo/docs-core` |
| `fumadocs-mdx` | `@hanzo/docs-mdx` |
| `fumadocs-ui` / `@fumadocs/radix-ui` | `@hanzo/docs-ui` (in packages/radix-ui) |
| `@fumadocs/base-ui` | `@hanzo/docs-base-ui` |
| `fumadocs-openapi` | `@hanzo/docs-openapi` |
| `fumadocs-typescript` | `@hanzo/docs-typescript` |
| `fumadocs-twoslash` | `@hanzo/docs-twoslash` |
| `@fumadocs/cli` | `@hanzo/docs-cli` |
| `@fumadocs/story` | `@hanzo/docs-story` |
| `@fumadocs/tailwind` | `@hanzo/docs-tailwind` |

**Important**: `packages/radix-ui` publishes as `@hanzo/docs-ui` (drop-in replacement for the old `fumadocs-ui`). The `base-ui` variant uses `@base-ui/react` instead of Radix.

## Upstream Sync

Remote `upstream` points to `fuma-nama/fumadocs`. Local `dev` tracks `upstream/dev`.

To merge upstream changes:

```bash
git checkout dev && git pull upstream dev
git checkout -b merge-upstream-YYYY-MM-DD main
git merge dev
# Resolve conflicts, then rename fumadocs-* → @hanzo/docs-*
# Merge into main when ready
```

After merge, do bulk rename:
```bash
find packages/ apps/ examples/ -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.json' -o -name '*.mdx' \) \
  ! -path '*/node_modules/*' ! -path '*/dist/*' \
  -exec sed -i '' \
  -e 's|fumadocs-core|@hanzo/docs-core|g' \
  -e 's|fumadocs-ui|@hanzo/docs-ui|g' \
  -e 's|@fumadocs/base-ui|@hanzo/docs-base-ui|g' \
  # ... etc for all packages
  {} +
```

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
  source: docs.toFumadocsSource(), // API name kept from upstream
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
