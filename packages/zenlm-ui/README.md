# @zenlm/ui

React components for the Zen LM model library — model cards, comparison tables, and browsable catalog.

Works with any React/Next.js app. Uses Tailwind CSS and shadcn/ui CSS variables.

## Install

```bash
npm install @zenlm/ui @zenlm/models lucide-react
```

## Usage

### Full Model Library

```tsx
import { ModelLibrary } from '@zenlm/ui'
import { allModels, families } from '@zenlm/models'

export default function ModelsPage() {
  return (
    <ModelLibrary
      allModels={allModels}
      families={families}
      linkPrefix="/models/"
      chatBaseUrl="https://hanzo.chat"
    />
  )
}
```

### Model Cards

```tsx
import { ModelCard } from '@zenlm/ui'
import { allModels } from '@zenlm/models'

const zen5 = allModels.find(m => m.id === 'zen5')!

export default function FeaturedModel() {
  return <ModelCard model={zen5} chatBaseUrl="https://hanzo.chat" />
}
```

### Model Table

```tsx
import { ModelTable } from '@zenlm/ui'
import { zen5Models } from '@zenlm/models'

export default function ComparisonTable() {
  return <ModelTable models={zen5Models} showPricing showContext />
}
```

## Components

| Component | Description |
|-----------|-------------|
| `ModelLibrary` | Full browsable catalog with family sections and filter toggle |
| `ModelFamilySection` | Single model family section with cards grid |
| `ModelCard` | Rich card with spec, status badge, and action buttons |
| `ModelTable` | Compact table view with pricing and context columns |
| `ZenEnso` | Animated Zen enso circle logo |

## Requirements

- React 18+ or 19+
- Tailwind CSS with shadcn/ui CSS variables (`--primary`, `--border`, `--muted`, etc.)
- lucide-react

## Links

- [zenlm.org](https://zenlm.org)
- [GitHub](https://github.com/hanzoai/docs/tree/main/packages/zenlm-ui)
