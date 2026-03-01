/**
 * @hanzo/zen-models — Canonical type definitions for the Zen model family.
 *
 * There should be one — and preferably only one — obvious place to define these.
 */

export type ModelGeneration = 'zen3' | 'zen4' | 'zen5' | 'foundation'

export type ModelTier =
  | 'pro'
  | 'pro max'
  | 'ultra'
  | 'ultra max'

export type ModelArchitecture =
  | 'Dense'
  | 'MoE'
  | 'MoE + CoT'
  | 'MoDE + CoT'
  | 'MoDE + Deep CoT'
  | 'Dense BF16'
  | 'Dense Multimodal'
  | 'MoE Vision-Language'
  | 'Embedding'
  | 'Reranker'
  | 'Diffusion'
  | 'ASR'
  | 'Streaming ASR'
  | 'TTS'
  | 'TTS HD'

export type ModelCategory =
  | 'foundation'
  | 'flagship'
  | 'code'
  | 'vision'
  | 'video'
  | 'audio'
  | 'spatial'
  | 'safety'
  | 'embedding'
  | 'agents'

export type ModelModality =
  | 'text'
  | 'code'
  | 'vision'
  | 'video'
  | 'audio'
  | '3d'
  | 'agents'
  | 'math'
  | 'safety'
  | 'embedding'

export type ModelStatus = 'available' | 'cloud-only' | 'coming-soon' | 'preview' | 'contact-sales'

export interface ModelPricing {
  /** Cost per 1M input tokens in USD */
  input: number
  /** Cost per 1M output tokens in USD */
  output: number
  /** Cost per 1M cached read tokens (null if not supported) */
  cacheRead: number | null
  /** Cost per 1M cached write tokens (null if not supported) */
  cacheWrite: number | null
}

export interface ModelSpec {
  /** Total parameters (e.g., "744B", "4B", "1.04T") */
  params: string
  /** Active parameters for MoE models (e.g., "40B", "3B") — null for dense */
  activeParams: string | null
  /** Context window in tokens */
  context: number
  /** Architecture type */
  arch: ModelArchitecture
}

export interface ZenModel {
  /** Model ID used in API calls (e.g., "zen4", "zen4-coder-flash") */
  id: string
  /** Display name (e.g., "Zen4", "Zen4 Coder Flash") */
  name: string
  /** Full marketing name (e.g., "Zen4 — Flagship") */
  fullName: string
  /** Short description */
  description: string
  /** Model generation */
  generation: ModelGeneration
  /** Pricing tier */
  tier: ModelTier
  /** Primary category */
  category: ModelCategory
  /** Supported modalities */
  modalities: ModelModality[]
  /** Technical specifications */
  spec: ModelSpec
  /** API pricing (null for local-only models) */
  pricing: ModelPricing | null
  /** Key feature bullets */
  features: string[]
  /** Model status */
  status: ModelStatus
  /** HuggingFace URL (null if no public weights) */
  huggingface: string | null
  /** GitHub URL (null if none) */
  github: string | null
  /** Technical paper / report URL (null if none) */
  paper?: string | null
  /** Brand aliases (e.g., zen-max → zen4-max) */
  aliases: string[]
}

/**
 * Model family grouping for display.
 */
export interface ModelFamily {
  /** Family ID */
  id: string
  /** Display name */
  name: string
  /** Description */
  description: string
  /** Icon name (lucide icon) */
  icon: string
  /** Member model IDs */
  models: string[]
}
