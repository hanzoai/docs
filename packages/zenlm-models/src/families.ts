/**
 * @hanzo/zen-models — Model family groupings for display purposes.
 */

import type { ModelFamily } from './types'

export const families: ModelFamily[] = [
  {
    id: 'zen5',
    name: 'Zen 5',
    description: 'Next-generation agentic models with native chain-of-thought.',
    icon: 'Rocket',
    models: ['zen5', 'zen5-pro', 'zen5-max', 'zen5-ultra', 'zen5-mini'],
  },
  {
    id: 'zen4',
    name: 'Zen 4',
    description: 'Latest generation production models with MoDE architecture.',
    icon: 'Sparkles',
    models: ['zen4-max', 'zen4.1', 'zen4', 'zen4-ultra', 'zen4-pro', 'zen4-thinking', 'zen4-mini'],
  },
  {
    id: 'code',
    name: 'Code',
    description: 'Specialized models for code generation, review, and debugging.',
    icon: 'Code',
    models: ['zen4-coder', 'zen4-coder-flash', 'zen4-coder-pro', 'zen-coder', 'zen-coder-flash', 'zen-code'],
  },
  {
    id: 'zen3',
    name: 'Zen 3',
    description: 'Previous generation API models — language, vision, multimodal, and safety.',
    icon: 'Eye',
    models: ['zen3-omni', 'zen3-vl', 'zen3-nano', 'zen3-guard'],
  },
  {
    id: 'embedding',
    name: 'Embedding & Retrieval',
    description: 'Text embeddings and search reranking via API.',
    icon: 'Search',
    models: [
      'zen3-embedding', 'zen3-embedding-medium', 'zen3-embedding-small',
      'zen3-reranker', 'zen3-reranker-medium', 'zen3-reranker-small',
      'zen-embedding', 'zen-reranker',
    ],
  },
  {
    id: 'image',
    name: 'Image Generation',
    description: 'Text-to-image generation via API.',
    icon: 'Image',
    models: [
      'zen3-image', 'zen3-image-max', 'zen3-image-dev', 'zen3-image-fast',
      'zen3-image-sdxl', 'zen3-image-playground', 'zen3-image-ssd', 'zen3-image-jp',
    ],
  },
  {
    id: 'audio',
    name: 'Audio & Speech',
    description: 'Speech-to-text, text-to-speech, and streaming ASR.',
    icon: 'Mic',
    models: [
      'zen3-audio', 'zen3-audio-fast', 'zen3-asr', 'zen3-asr-v1',
      'zen3-tts', 'zen3-tts-hd', 'zen3-tts-fast',
    ],
  },
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'General-purpose open-weight models from 0.6B to 235B parameters.',
    icon: 'Brain',
    models: ['zen-nano', 'zen-eco', 'zen', 'zen-pro', 'zen-max', 'zen-next'],
  },
  {
    id: 'vision',
    name: 'Vision (Open Weights)',
    description: 'Vision-language and multimodal open-weight models.',
    icon: 'Eye',
    models: ['zen-vl', 'zen-omni'],
  },
  {
    id: 'safety',
    name: 'Safety',
    description: 'Content moderation and safety guardrail models.',
    icon: 'Shield',
    models: ['zen3-guard', 'zen-guard'],
  },
  {
    id: 'agents',
    name: 'Agents',
    description: 'Agent-optimized models for tool use and planning.',
    icon: 'Network',
    models: ['zen-agent'],
  },
]
