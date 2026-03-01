/**
 * @zenlm/models — Zen model catalog
 *
 * The complete Zen LM model family: specs, pricing, families, and types.
 * All model data is statically embedded — no API calls required.
 *
 * @example
 * ```ts
 * import { allModels, families } from '@zenlm/models'
 * import type { ZenModel } from '@zenlm/models'
 *
 * const flagship = allModels.find(m => m.id === 'zen5')
 * ```
 */

export type {
  ZenModel,
  ModelFamily,
  ModelGeneration,
  ModelTier,
  ModelArchitecture,
  ModelCategory,
  ModelModality,
  ModelStatus,
  ModelPricing,
  ModelSpec,
} from './types'

// All named model exports + allModels array
export * from './models'

// Model families (grouped catalog)
export { families } from './families'
