# @zenlm/models

The canonical Zen LM model catalog — specs, pricing, and families for the complete Zen model family.

## Install

```bash
npm install @zenlm/models
```

## Usage

```ts
import { allModels, families } from '@zenlm/models'
import type { ZenModel } from '@zenlm/models'

// Get all available models
const available = allModels.filter(m => m.status === 'available')

// Find a specific model
const zen5 = allModels.find(m => m.id === 'zen5')

// Browse by family
console.log(families.map(f => f.name))
```

## API

### `allModels: ZenModel[]`
All models in the Zen family — 60+ models across generations.

### `families: ModelFamily[]`
Model families grouped by generation and capability.

### Types
- `ZenModel` — complete model definition
- `ModelSpec` — architecture and parameter spec
- `ModelPricing` — input/output cost per 1M tokens
- `ModelStatus` — `available | preview | coming-soon | contact-sales | cloud-only | deprecated`

## Links

- [zenlm.org](https://zenlm.org)
- [HuggingFace](https://huggingface.co/zenlm)
- [GitHub](https://github.com/hanzoai/docs/tree/main/packages/zenlm-models)
