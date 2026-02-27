/**
 * @hanzo/zen-models — The single source of truth for the Zen model family.
 *
 * "There should be one — and preferably only one — obvious way to do it."
 *
 * Every Hanzo site imports model definitions from this package.
 * Never duplicate model specs elsewhere.
 */

// Types
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

// All models (named exports)
export * from './models'

// Model families
export { families } from './families'

// Pricing
export {
  MARKUP,
  ZEN_MULTIPLIER,
  tools,
  compute,
  gpu,
  thirdPartyModels,
  fetchPricing,
  fetchModelPricing,
} from './pricing'

export type {
  PricingData,
  PricingApiModel,
  PricingApiThirdParty,
} from './pricing'
