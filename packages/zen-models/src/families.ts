/**
 * @hanzo/zen-models — Model family groupings for display purposes.
 */

import type { ModelFamily } from './types.js'

export const families: ModelFamily[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'General-purpose models from 0.6B to 235B parameters.',
    icon: 'Brain',
    models: ['zen-nano', 'zen-eco', 'zen', 'zen-pro', 'zen-max', 'zen-next'],
  },
  {
    id: 'zen4',
    name: 'Zen 4',
    description: 'Latest generation production models with MoDE architecture.',
    icon: 'Sparkles',
    models: ['zen4-mini', 'zen4', 'zen4-pro', 'zen4-max', 'zen4-ultra', 'zen4-thinking'],
  },
  {
    id: 'code',
    name: 'Code',
    description: 'Specialized models for code generation, review, and debugging.',
    icon: 'Code',
    models: ['zen4-coder', 'zen4-coder-flash', 'zen4-coder-pro', 'zen-coder', 'zen-coder-flash', 'zen-code'],
  },
  {
    id: 'vision',
    name: 'Vision & Image',
    description: 'Visual understanding, generation, and editing models.',
    icon: 'Eye',
    models: ['zen-vl', 'zen-omni', 'zen-artist', 'zen-artist-edit', 'zen-designer'],
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Video generation, understanding, and world models.',
    icon: 'Video',
    models: ['zen-director', 'zen-video', 'zen-video-i2v', 'zen-voyager'],
  },
  {
    id: 'audio',
    name: 'Audio & Speech',
    description: 'Music, voice synthesis, transcription, and translation.',
    icon: 'Mic',
    models: ['zen-musician', 'zen-foley', 'zen-dub', 'zen-dub-live', 'zen-scribe', 'zen-translator', 'zen-live'],
  },
  {
    id: 'spatial',
    name: '3D & Spatial',
    description: '3D generation and world simulation models.',
    icon: 'Box',
    models: ['zen-3d', 'zen-world'],
  },
  {
    id: 'safety',
    name: 'Safety',
    description: 'Content moderation and safety guardrail models.',
    icon: 'Shield',
    models: ['zen-guard', 'zen-guard-gen', 'zen-guard-stream'],
  },
  {
    id: 'embedding',
    name: 'Embedding',
    description: 'Text embeddings and search reranking models.',
    icon: 'Search',
    models: ['zen-embedding', 'zen-reranker'],
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Agent-optimized models for tool use and planning.',
    icon: 'Network',
    models: ['zen-agent'],
  },
]
