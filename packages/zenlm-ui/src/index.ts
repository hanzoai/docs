'use client'

/**
 * @zenlm/ui — React components for the Zen LM model library
 *
 * Provides ready-to-use, data-agnostic components for displaying
 * Zen models in any React/Next.js application.
 *
 * @example
 * ```tsx
 * import { ModelLibrary } from '@zenlm/ui'
 * import { allModels, families } from '@zenlm/models'
 *
 * export default function ModelsPage() {
 *   return (
 *     <ModelLibrary
 *       allModels={allModels}
 *       families={families}
 *       chatBaseUrl="https://hanzo.chat"
 *     />
 *   )
 * }
 * ```
 */

export { ModelCard } from './ModelCard'
export { ModelTable } from './ModelTable'
export { ModelLibrary, ModelFamilySection } from './ModelLibrary'
export { ZenEnso } from './ZenEnso'

export type {
  ZenModelLike,
  ModelFamilyLike,
  ModelSpecLike,
  ModelPricingLike,
} from './types'

export type { ModelCardProps } from './ModelCard'
export type { ModelTableProps } from './ModelTable'
export type { ModelLibraryProps, ModelFamilySectionProps } from './ModelLibrary'
