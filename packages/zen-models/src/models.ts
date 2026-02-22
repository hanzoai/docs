/**
 * @hanzo/zen-models — The single source of truth for all Zen model definitions.
 *
 * Every Hanzo site (hanzo.ai, hanzo.industries, zenlm.org, etc.) imports from here.
 * Never duplicate model specs elsewhere.
 *
 * Zen MoDE (Mixture of Distilled Experts) — curating the best open-source
 * foundations and fusing them into a unified, high-performance family.
 */

import type { ZenModel } from './types.js'

// ---------------------------------------------------------------------------
// Zen4 Generation — Production API Models
// ---------------------------------------------------------------------------

export const zen4: ZenModel = {
  id: 'zen4',
  name: 'Zen4',
  fullName: 'Zen4 — Flagship',
  description: 'Flagship model. Optimal for complex reasoning and multi-domain tasks.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '744B',
    activeParams: '40B',
    context: 202_000,
    arch: 'MoE',
  },
  pricing: { input: 3, output: 9.6, cacheRead: null, cacheWrite: null },
  features: ['202K context window', 'Flagship intelligence'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4',
  github: 'https://github.com/zenlm/zen4',
  aliases: [],
}

export const zen4Pro: ZenModel = {
  id: 'zen4-pro',
  name: 'Zen4 Pro',
  fullName: 'Zen4 Pro — High Capability',
  description: 'High-capability model with efficient MoE architecture for demanding workloads.',
  generation: 'zen4',
  tier: 'ultra',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '80B',
    activeParams: '3B',
    context: 131_000,
    arch: 'MoE',
  },
  pricing: { input: 2.7, output: 2.7, cacheRead: null, cacheWrite: null },
  features: ['131K context window', 'MoE architecture'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-pro',
  github: 'https://github.com/zenlm/zen4-pro',
  aliases: [],
}

export const zen4Max: ZenModel = {
  id: 'zen4-max',
  name: 'Zen4 Max',
  fullName: 'Zen4 Max — Maximum Scale',
  description: 'Trillion-parameter frontier model with deep reasoning capabilities.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '1.04T',
    activeParams: '32B',
    context: 256_000,
    arch: 'MoE',
  },
  pricing: { input: 3.6, output: 3.6, cacheRead: null, cacheWrite: null },
  features: ['256K context window', '1.04T MoE parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-max',
  github: 'https://github.com/zenlm/zen-max',
  aliases: ['zen-max'],
}

export const zen4Mini: ZenModel = {
  id: 'zen4-mini',
  name: 'Zen4 Mini',
  fullName: 'Zen4 Mini — Fast & Efficient',
  description: 'Lightweight model optimized for speed and cost efficiency.',
  generation: 'zen4',
  tier: 'pro',
  category: 'flagship',
  modalities: ['text', 'code'],
  spec: {
    params: '8B',
    activeParams: null,
    context: 40_000,
    arch: 'Dense',
  },
  pricing: { input: 0.6, output: 0.6, cacheRead: null, cacheWrite: null },
  features: ['40K context window', 'Ultra-fast inference'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-mini',
  github: 'https://github.com/zenlm/zen4-mini',
  aliases: [],
}

export const zen4Ultra: ZenModel = {
  id: 'zen4-ultra',
  name: 'Zen4 Ultra',
  fullName: 'Zen4 Ultra — Maximum Reasoning',
  description: 'Maximum reasoning capability with extended thinking for complex problems.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '744B',
    activeParams: '40B',
    context: 202_000,
    arch: 'MoE + CoT',
  },
  pricing: { input: 3, output: 9.6, cacheRead: null, cacheWrite: null },
  features: ['202K context window', 'Deep reasoning'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-ultra',
  github: 'https://github.com/zenlm/zen4-ultra',
  aliases: [],
}

export const zen4Thinking: ZenModel = {
  id: 'zen4-thinking',
  name: 'Zen4 Thinking',
  fullName: 'Zen4 Thinking — Deep Reasoning',
  description: 'Dedicated reasoning model with explicit chain-of-thought capabilities.',
  generation: 'zen4',
  tier: 'pro max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '80B',
    activeParams: '3B',
    context: 131_000,
    arch: 'MoE + CoT',
  },
  pricing: { input: 2.7, output: 2.7, cacheRead: null, cacheWrite: null },
  features: ['131K context window', 'Chain-of-thought'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen4Coder: ZenModel = {
  id: 'zen4-coder',
  name: 'Zen4 Coder',
  fullName: 'Zen4 Coder — Code Generation',
  description: 'Code-specialized model for generation, review, and debugging.',
  generation: 'zen4',
  tier: 'ultra',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '480B',
    activeParams: '35B',
    context: 262_000,
    arch: 'MoE',
  },
  pricing: { input: 3.6, output: 3.6, cacheRead: null, cacheWrite: null },
  features: ['262K context window', '480B MoE parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-coder',
  github: 'https://github.com/zenlm/zen4-coder',
  aliases: [],
}

export const zen4CoderFlash: ZenModel = {
  id: 'zen4-coder-flash',
  name: 'Zen4 Coder Flash',
  fullName: 'Zen4 Coder Flash — Fast Code',
  description: 'Lightweight code model optimized for speed and inline completions.',
  generation: 'zen4',
  tier: 'pro max',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '30B',
    activeParams: '3B',
    context: 262_000,
    arch: 'MoE',
  },
  pricing: { input: 1.5, output: 1.5, cacheRead: null, cacheWrite: null },
  features: ['262K context window', 'Fast inference'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-coder-flash',
  github: 'https://github.com/zenlm/zen4-coder-flash',
  aliases: [],
}

export const zen4CoderPro: ZenModel = {
  id: 'zen4-coder-pro',
  name: 'Zen4 Coder Pro',
  fullName: 'Zen4 Coder Pro — Premium Code',
  description: 'Full-precision code model for maximum accuracy on complex codebases.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '480B',
    activeParams: null,
    context: 262_000,
    arch: 'Dense BF16',
  },
  pricing: { input: 4.5, output: 4.5, cacheRead: null, cacheWrite: null },
  features: ['262K context window', 'BF16 full precision'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-coder-pro',
  github: 'https://github.com/zenlm/zen4-coder-pro',
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Generation — Production API Models
// ---------------------------------------------------------------------------

export const zen3Omni: ZenModel = {
  id: 'zen3-omni',
  name: 'Zen3 Omni',
  fullName: 'Zen3 Omni — Hypermodal',
  description: 'Multimodal model supporting text, vision, and structured output.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'vision',
  modalities: ['text', 'vision', 'code'],
  spec: {
    params: '~200B',
    activeParams: null,
    context: 202_000,
    arch: 'Dense Multimodal',
  },
  pricing: { input: 1.8, output: 6.6, cacheRead: null, cacheWrite: null },
  features: ['202K context window', 'Multimodal'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Vl: ZenModel = {
  id: 'zen3-vl',
  name: 'Zen3 VL',
  fullName: 'Zen3 VL — Vision-Language',
  description: 'Vision-language model for image understanding and visual reasoning.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'vision',
  modalities: ['text', 'vision'],
  spec: {
    params: '30B',
    activeParams: '3B',
    context: 131_000,
    arch: 'MoE Vision-Language',
  },
  pricing: { input: 0.45, output: 1.8, cacheRead: null, cacheWrite: null },
  features: ['131K context window', 'Vision + language'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Nano: ZenModel = {
  id: 'zen3-nano',
  name: 'Zen3 Nano',
  fullName: 'Zen3 Nano — Edge',
  description: 'Ultra-lightweight model for edge deployment and low-latency tasks.',
  generation: 'zen3',
  tier: 'pro',
  category: 'foundation',
  modalities: ['text', 'code'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 40_000,
    arch: 'Dense',
  },
  pricing: { input: 0.3, output: 0.3, cacheRead: null, cacheWrite: null },
  features: ['40K context window', '4B parameters'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Guard: ZenModel = {
  id: 'zen3-guard',
  name: 'Zen3 Guard',
  fullName: 'Zen3 Guard — Content Safety',
  description: 'Content safety classifier for moderation and guardrails.',
  generation: 'zen3',
  tier: 'pro',
  category: 'safety',
  modalities: ['text', 'safety'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 40_000,
    arch: 'Dense',
  },
  pricing: { input: 0.3, output: 0.3, cacheRead: null, cacheWrite: null },
  features: ['40K context window', 'Safety classifier'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Embedding: ZenModel = {
  id: 'zen3-embedding',
  name: 'Zen3 Embedding',
  fullName: 'Zen3 Embedding — Text Embeddings',
  description: 'High-quality text embeddings for search, clustering, and retrieval.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '3072 dimensions',
    activeParams: null,
    context: 8_000,
    arch: 'Embedding',
  },
  pricing: { input: 0.39, output: 0.39, cacheRead: null, cacheWrite: null },
  features: ['8K context window', '3072 dimensions'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Foundation Models — Local Weights (HuggingFace)
// ---------------------------------------------------------------------------

export const zenNano: ZenModel = {
  id: 'zen-nano',
  name: 'Zen Nano',
  fullName: 'Zen Nano — 0.6B Edge',
  description: 'Ultra-lightweight LLM for edge and mobile deployment.',
  generation: 'foundation',
  tier: 'pro',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '0.6B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context', '44K tokens/sec', '0.4–1.2GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-nano-0.6b',
  github: null,
  aliases: [],
}

export const zenEco: ZenModel = {
  id: 'zen-eco',
  name: 'Zen Eco',
  fullName: 'Zen Eco — 4B Efficient',
  description: 'Efficient 4B model for general-purpose tasks.',
  generation: 'foundation',
  tier: 'pro',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context', '33K tokens/sec', '2–8GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-eco-4b',
  github: null,
  aliases: [],
}

export const zen: ZenModel = {
  id: 'zen',
  name: 'Zen',
  fullName: 'Zen — 8-32B Standard',
  description: 'Standard model available in 8B and 32B variants.',
  generation: 'foundation',
  tier: 'pro',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '8–32B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context', '28K tokens/sec', '4–64GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-8b',
  github: null,
  aliases: [],
}

export const zenPro: ZenModel = {
  id: 'zen-pro',
  name: 'Zen Pro',
  fullName: 'Zen Pro — 32B Professional',
  description: 'Professional-grade 32B dense model for demanding workloads.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '32B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context', '19K tokens/sec', '16–64GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-pro-32b',
  github: null,
  aliases: [],
}

export const zenMax: ZenModel = {
  id: 'zen-max',
  name: 'Zen Max',
  fullName: 'Zen Max — 235B MoE',
  description: 'High-capability MoE model with 235B parameters.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '235B',
    activeParams: '22B',
    context: 131_000,
    arch: 'MoE',
  },
  pricing: null,
  features: ['131K context', '14K tokens/sec', '48–128GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-max',
  github: 'https://github.com/zenlm/zen-max',
  aliases: ['zen4-max'],
}

export const zenNext: ZenModel = {
  id: 'zen-next',
  name: 'Zen Next',
  fullName: 'Zen Next — Preview',
  description: 'Next-generation preview model with cutting-edge capabilities.',
  generation: 'foundation',
  tier: 'ultra max',
  category: 'foundation',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBD',
    activeParams: null,
    context: 256_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['256K context', 'Preview'],
  status: 'preview',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Code Models — Local Weights
// ---------------------------------------------------------------------------

export const zenCoder: ZenModel = {
  id: 'zen-coder',
  name: 'Zen Coder',
  fullName: 'Zen Coder — Code Generation',
  description: 'Baseline code model for generation and completions.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '32B',
    activeParams: null,
    context: 131_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['131K context', 'Multi-language'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-coder',
  github: null,
  aliases: [],
}

export const zenCoderFlash: ZenModel = {
  id: 'zen-coder-flash',
  name: 'Zen Coder Flash',
  fullName: 'Zen Coder Flash — Fast Code',
  description: 'Fast code model for inline completions and suggestions.',
  generation: 'foundation',
  tier: 'pro',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '7B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context', 'Low latency'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-coder-flash',
  github: null,
  aliases: [],
}

export const zenCode: ZenModel = {
  id: 'zen-code',
  name: 'Zen Code',
  fullName: 'Zen Code — Legacy Code',
  description: 'Legacy code model (superseded by Zen4 Coder series).',
  generation: 'foundation',
  tier: 'pro',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '14B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['32K context'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-code',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Vision & Image Models
// ---------------------------------------------------------------------------

export const zenVl: ZenModel = {
  id: 'zen-vl',
  name: 'Zen VL',
  fullName: 'Zen VL — Vision-Language',
  description: 'Multi-modal vision-language model for image understanding.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'vision',
  modalities: ['text', 'vision'],
  spec: {
    params: '32B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense Multimodal',
  },
  pricing: null,
  features: ['32K context', 'Image understanding'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-vl',
  github: null,
  aliases: [],
}

export const zenOmni: ZenModel = {
  id: 'zen-omni',
  name: 'Zen Omni',
  fullName: 'Zen Omni — Multimodal',
  description: 'Hypermodal model combining text, vision, audio, and code.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'vision',
  modalities: ['text', 'vision', 'audio', 'code'],
  spec: {
    params: '72B',
    activeParams: null,
    context: 131_000,
    arch: 'Dense Multimodal',
  },
  pricing: null,
  features: ['131K context', 'Multimodal'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-omni',
  github: null,
  aliases: [],
}

export const zenArtist: ZenModel = {
  id: 'zen-artist',
  name: 'Zen Artist',
  fullName: 'Zen Artist — Image Generation',
  description: 'Image generation model for creative and professional artwork.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'vision',
  modalities: ['vision'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['High-resolution', 'Multiple styles'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenArtistEdit: ZenModel = {
  id: 'zen-artist-edit',
  name: 'Zen Artist Edit',
  fullName: 'Zen Artist Edit — Image Editing',
  description: 'Instruction-based image editing model.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'vision',
  modalities: ['vision'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Edit by instruction', 'Inpainting'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenDesigner: ZenModel = {
  id: 'zen-designer',
  name: 'Zen Designer',
  fullName: 'Zen Designer — Design Generation',
  description: 'Design-focused generation model for UI/UX and graphics.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'vision',
  modalities: ['vision'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['UI/UX design', 'Graphics'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Video Models
// ---------------------------------------------------------------------------

export const zenDirector: ZenModel = {
  id: 'zen-director',
  name: 'Zen Director',
  fullName: 'Zen Director — Video Generation',
  description: 'Text-to-video generation model for cinematic content.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'video',
  modalities: ['video'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Text-to-video', 'Cinematic quality'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenVideo: ZenModel = {
  id: 'zen-video',
  name: 'Zen Video',
  fullName: 'Zen Video — Video Understanding',
  description: 'Video understanding and analysis model.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'video',
  modalities: ['video', 'text'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Video understanding', 'Frame analysis'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenVideoI2v: ZenModel = {
  id: 'zen-video-i2v',
  name: 'Zen Video I2V',
  fullName: 'Zen Video I2V — Image to Video',
  description: 'Image-to-video generation model.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'video',
  modalities: ['video', 'vision'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Image-to-video', 'Animation'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenVoyager: ZenModel = {
  id: 'zen-voyager',
  name: 'Zen Voyager',
  fullName: 'Zen Voyager — World Model',
  description: 'World model for spatial and temporal reasoning in video.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'video',
  modalities: ['video', 'text'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 0,
    arch: 'Dense',
  },
  pricing: null,
  features: ['World model', 'Spatial reasoning'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Audio & Speech Models
// ---------------------------------------------------------------------------

export const zenMusician: ZenModel = {
  id: 'zen-musician',
  name: 'Zen Musician',
  fullName: 'Zen Musician — Music Generation',
  description: 'Music generation model for compositions and sound design.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'audio',
  modalities: ['audio'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Music generation', 'Multi-instrument'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenFoley: ZenModel = {
  id: 'zen-foley',
  name: 'Zen Foley',
  fullName: 'Zen Foley — Sound Effects',
  description: 'Sound effects generation from text descriptions.',
  generation: 'foundation',
  tier: 'pro',
  category: 'audio',
  modalities: ['audio'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Text-to-SFX', 'Foley art'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenDub: ZenModel = {
  id: 'zen-dub',
  name: 'Zen Dub',
  fullName: 'Zen Dub — Voice Synthesis',
  description: 'High-quality voice synthesis and dubbing.',
  generation: 'foundation',
  tier: 'pro max',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Voice synthesis', 'Multi-language dubbing'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenDubLive: ZenModel = {
  id: 'zen-dub-live',
  name: 'Zen Dub Live',
  fullName: 'Zen Dub Live — Real-time Voice',
  description: 'Real-time voice synthesis for live applications.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Real-time', 'Low latency'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenScribe: ZenModel = {
  id: 'zen-scribe',
  name: 'Zen Scribe',
  fullName: 'Zen Scribe — Speech-to-Text',
  description: 'High-accuracy speech-to-text transcription.',
  generation: 'foundation',
  tier: 'pro',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Transcription', 'Multi-language'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenTranslator: ZenModel = {
  id: 'zen-translator',
  name: 'Zen Translator',
  fullName: 'Zen Translator — Translation',
  description: 'Neural machine translation across 100+ languages.',
  generation: 'foundation',
  tier: 'pro',
  category: 'audio',
  modalities: ['text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['100+ languages', 'Context-aware'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenLive: ZenModel = {
  id: 'zen-live',
  name: 'Zen Live',
  fullName: 'Zen Live — Real-time Translation',
  description: 'Real-time speech translation for live communication.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Real-time', 'Bidirectional'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// 3D & Spatial Models
// ---------------------------------------------------------------------------

export const zen3d: ZenModel = {
  id: 'zen-3d',
  name: 'Zen 3D',
  fullName: 'Zen 3D — 3D Generation',
  description: '3D object and scene generation from text or images.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'spatial',
  modalities: ['3d', 'vision', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['Text-to-3D', 'Image-to-3D'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenWorld: ZenModel = {
  id: 'zen-world',
  name: 'Zen World',
  fullName: 'Zen World — World Simulation',
  description: 'World simulation model for spatial reasoning and navigation.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'spatial',
  modalities: ['3d', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Dense' },
  pricing: null,
  features: ['World simulation', 'Spatial reasoning'],
  status: 'coming-soon',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Safety Models
// ---------------------------------------------------------------------------

export const zenGuard: ZenModel = {
  id: 'zen-guard',
  name: 'Zen Guard',
  fullName: 'Zen Guard — Content Safety',
  description: 'Content safety and moderation classifier.',
  generation: 'foundation',
  tier: 'pro',
  category: 'safety',
  modalities: ['text', 'safety'],
  spec: {
    params: '8B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Content moderation', 'Guardrails'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-guard',
  github: null,
  aliases: [],
}

export const zenGuardGen: ZenModel = {
  id: 'zen-guard-gen',
  name: 'Zen Guard Gen',
  fullName: 'Zen Guard Gen — Generative Safety',
  description: 'Safety-aligned generation model with built-in guardrails.',
  generation: 'foundation',
  tier: 'pro',
  category: 'safety',
  modalities: ['text', 'safety'],
  spec: {
    params: '8B',
    activeParams: null,
    context: 32_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Safe generation', 'Built-in guardrails'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zenGuardStream: ZenModel = {
  id: 'zen-guard-stream',
  name: 'Zen Guard Stream',
  fullName: 'Zen Guard Stream — Streaming Safety',
  description: 'Real-time streaming content moderation.',
  generation: 'foundation',
  tier: 'pro',
  category: 'safety',
  modalities: ['text', 'safety'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 8_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Streaming moderation', 'Low latency'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Embedding Models
// ---------------------------------------------------------------------------

export const zenEmbedding: ZenModel = {
  id: 'zen-embedding',
  name: 'Zen Embedding',
  fullName: 'Zen Embedding — Text Embeddings',
  description: 'Foundation embedding model for search and retrieval.',
  generation: 'foundation',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '3072 dimensions',
    activeParams: null,
    context: 8_000,
    arch: 'Embedding',
  },
  pricing: null,
  features: ['3072 dimensions', 'Cosine similarity'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-embedding',
  github: null,
  aliases: [],
}

export const zenReranker: ZenModel = {
  id: 'zen-reranker',
  name: 'Zen Reranker',
  fullName: 'Zen Reranker — Search Reranking',
  description: 'Cross-encoder reranker for search result quality.',
  generation: 'foundation',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '568M',
    activeParams: null,
    context: 8_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Cross-encoder', 'Search reranking'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-reranker',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Agent Models
// ---------------------------------------------------------------------------

export const zenAgent: ZenModel = {
  id: 'zen-agent',
  name: 'Zen Agent',
  fullName: 'Zen Agent — Agentic AI',
  description: 'Agent-optimized model for multi-step tool use and planning.',
  generation: 'foundation',
  tier: 'ultra',
  category: 'agents',
  modalities: ['text', 'code', 'agents'],
  spec: {
    params: '32B',
    activeParams: null,
    context: 131_000,
    arch: 'Dense',
  },
  pricing: null,
  features: ['Tool use', 'Multi-step planning'],
  status: 'preview',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

/** All Zen models — the canonical list. */
export const allModels: ZenModel[] = [
  // Zen4 production API models
  zen4, zen4Pro, zen4Max, zen4Mini, zen4Ultra, zen4Thinking,
  zen4Coder, zen4CoderFlash, zen4CoderPro,
  // Zen3 production API models
  zen3Omni, zen3Vl, zen3Nano, zen3Guard, zen3Embedding,
  // Foundation local models
  zenNano, zenEco, zen, zenPro, zenMax, zenNext,
  // Code
  zenCoder, zenCoderFlash, zenCode,
  // Vision & Image
  zenVl, zenOmni, zenArtist, zenArtistEdit, zenDesigner,
  // Video
  zenDirector, zenVideo, zenVideoI2v, zenVoyager,
  // Audio & Speech
  zenMusician, zenFoley, zenDub, zenDubLive, zenScribe, zenTranslator, zenLive,
  // 3D & Spatial
  zen3d, zenWorld,
  // Safety
  zenGuard, zenGuardGen, zenGuardStream,
  // Embedding
  zenEmbedding, zenReranker,
  // Agents
  zenAgent,
]

/** Production API models (served via api.hanzo.ai). */
export const apiModels: ZenModel[] = allModels.filter(m => m.pricing !== null)

/** Local-weight models (available on HuggingFace). */
export const localModels: ZenModel[] = allModels.filter(m => m.huggingface !== null)

/** Models by generation. */
export const zen4Models: ZenModel[] = allModels.filter(m => m.generation === 'zen4')
export const zen3Models: ZenModel[] = allModels.filter(m => m.generation === 'zen3')
export const foundationModels: ZenModel[] = allModels.filter(m => m.generation === 'foundation')

/** Lookup by ID. */
export const modelById = new Map<string, ZenModel>(
  allModels.flatMap(m => [[m.id, m] as const, ...m.aliases.map(a => [a, m] as const)])
)

/** Get model by ID or alias. */
export function getModel(id: string): ZenModel | undefined {
  return modelById.get(id)
}
