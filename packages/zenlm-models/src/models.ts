/**
 * @hanzo/zen-models — The single source of truth for all Zen model definitions.
 *
 * Every Hanzo site (hanzo.ai, hanzo.industries, zenlm.org, etc.) imports from here.
 * Never duplicate model specs elsewhere.
 *
 * Zen MoDE (Mixture of Distilled Experts) — curating the best open-source
 * foundations and fusing them into a unified, high-performance family.
 */

import type { ZenModel } from './types'

// ---------------------------------------------------------------------------
// Zen4 Generation — Production API Models
// ---------------------------------------------------------------------------

export const zen4: ZenModel = {
  id: 'zen4',
  name: 'Zen4',
  fullName: 'Zen4 — Flagship',
  description: 'Flagship MoE model for complex reasoning and multi-domain tasks.',
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
  features: ['202K context window', 'Flagship intelligence', '100+ languages'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4',
  github: 'https://github.com/zenlm/zen4',
  aliases: [],
}

export const zen4Pro: ZenModel = {
  id: 'zen4-pro',
  name: 'Zen4 Pro',
  fullName: 'Zen4 Pro — High Capability',
  description: 'Efficient MoE model for demanding workloads with strong reasoning at production-grade cost.',
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
  fullName: 'Zen4 Max — Maximum Intelligence',
  description: 'Most capable model for complex reasoning, analysis, and agentic tasks. 1M token context window.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 1_000_000,
    arch: 'Dense',
  },
  pricing: { input: 3.6, output: 3.6, cacheRead: null, cacheWrite: null },
  features: ['1M context window', 'Maximum intelligence', 'Agentic coding'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: ['zen-max'],
}

export const zen4_1: ZenModel = {
  id: 'zen4.1',
  name: 'Zen4.1',
  fullName: 'Zen4.1 — Extended Context',
  description: 'High-performance 1M context model for long-document analysis, large codebase reasoning, and agentic workflows. Best balance of intelligence and cost at million-token scale.',
  generation: 'zen4',
  tier: 'ultra',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 1_000_000,
    arch: 'Dense',
  },
  pricing: { input: 3.6, output: 3.6, cacheRead: null, cacheWrite: null },
  features: ['1M context window', 'Agentic coding', 'Long-document analysis', 'Cost efficient'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen4Mini: ZenModel = {
  id: 'zen4-mini',
  name: 'Zen4 Mini',
  fullName: 'Zen4 Mini — Fast & Efficient',
  description: 'Ultra-fast lightweight model optimized for speed and cost efficiency. Ideal for free tier.',
  generation: 'zen4',
  tier: 'pro',
  category: 'flagship',
  modalities: ['text', 'code'],
  spec: {
    params: 'N/A',
    activeParams: null,
    context: 128_000,
    arch: 'Dense',
  },
  pricing: { input: 0.6, output: 0.6, cacheRead: null, cacheWrite: null },
  features: ['128K context window', 'Ultra-fast inference', 'Free tier'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-mini',
  github: 'https://github.com/zenlm/zen4-mini',
  aliases: [],
}

export const zen4Ultra: ZenModel = {
  id: 'zen4-ultra',
  name: 'Zen4 Ultra',
  fullName: 'Zen4 Ultra — Maximum Reasoning',
  description: 'Maximum reasoning capability with extended chain-of-thought on MoE architecture.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: '744B',
    activeParams: '40B',
    context: 262_000,
    arch: 'MoE + CoT',
  },
  pricing: { input: 3, output: 9.6, cacheRead: null, cacheWrite: null },
  features: ['262K context window', 'Deep reasoning', 'Chain-of-thought'],
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
  description: 'Code-specialized MoE model for generation, review, debugging, and agentic programming.',
  generation: 'zen4',
  tier: 'ultra',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '480B',
    activeParams: '35B',
    context: 163_000,
    arch: 'MoE',
  },
  pricing: { input: 3.6, output: 3.6, cacheRead: null, cacheWrite: null },
  features: ['163K context window', 'All major languages'],
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
  description: 'Full-precision BF16 code model for maximum accuracy on complex codebases.',
  generation: 'zen4',
  tier: 'ultra max',
  category: 'code',
  modalities: ['text', 'code'],
  spec: {
    params: '480B',
    activeParams: null,
    context: 131_000,
    arch: 'Dense BF16',
  },
  pricing: { input: 4.5, output: 4.5, cacheRead: null, cacheWrite: null },
  features: ['131K context window', 'BF16 full precision'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen4-coder-pro',
  github: 'https://github.com/zenlm/zen4-coder-pro',
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Generation — Production API Models (Chat)
// ---------------------------------------------------------------------------

export const zen3Omni: ZenModel = {
  id: 'zen3-omni',
  name: 'Zen3 Omni',
  fullName: 'Zen3 Omni — Hypermodal',
  description: 'Multimodal model supporting text, vision, audio, and structured output.',
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
  features: ['202K context window', 'Text + Vision + Audio'],
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
    context: 262_000,
    arch: 'MoE Vision-Language',
  },
  pricing: { input: 0.45, output: 1.8, cacheRead: null, cacheWrite: null },
  features: ['262K context window', 'Vision + Language'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Nano: ZenModel = {
  id: 'zen3-nano',
  name: 'Zen3 Nano',
  fullName: 'Zen3 Nano — Edge',
  description: 'Ultra-lightweight model for edge deployment and low-latency tasks. Available on free tier.',
  generation: 'zen3',
  tier: 'pro',
  category: 'flagship',
  modalities: ['text', 'code'],
  spec: {
    params: '8B',
    activeParams: null,
    context: 128_000,
    arch: 'Dense',
  },
  pricing: { input: 0.3, output: 0.3, cacheRead: null, cacheWrite: null },
  features: ['128K context window', '8B parameters', 'Free tier'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Guard: ZenModel = {
  id: 'zen3-guard',
  name: 'Zen3 Guard',
  fullName: 'Zen3 Guard — Content Safety',
  description: 'Content safety classifier for moderation and guardrails. 9 safety categories, 119 languages.',
  generation: 'zen3',
  tier: 'pro',
  category: 'safety',
  modalities: ['text', 'safety'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 65_000,
    arch: 'Dense',
  },
  pricing: { input: 0.3, output: 0.3, cacheRead: null, cacheWrite: null },
  features: ['65K context window', 'Safety classifier', '119 languages'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Embedding — via /v1/embeddings
// ---------------------------------------------------------------------------

export const zen3Embedding: ZenModel = {
  id: 'zen3-embedding',
  name: 'Zen3 Embedding',
  fullName: 'Zen3 Embedding — Text Embeddings',
  description: 'High-quality text embeddings for RAG, search, and classification.',
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

export const zen3EmbeddingMedium: ZenModel = {
  id: 'zen3-embedding-medium',
  name: 'Zen3 Embedding Medium',
  fullName: 'Zen3 Embedding Medium',
  description: 'Balanced embedding model for cost-effective retrieval workloads.',
  generation: 'zen3',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 40_000,
    arch: 'Embedding',
  },
  pricing: null,
  features: ['40K context window', '4B parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen3-embedding-medium',
  github: null,
  aliases: [],
}

export const zen3EmbeddingSmall: ZenModel = {
  id: 'zen3-embedding-small',
  name: 'Zen3 Embedding Small',
  fullName: 'Zen3 Embedding Small',
  description: 'Lightweight embedding model for high-throughput, low-cost applications.',
  generation: 'zen3',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '0.6B',
    activeParams: null,
    context: 32_000,
    arch: 'Embedding',
  },
  pricing: null,
  features: ['32K context window', '0.6B parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen3-embedding-small',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Reranker — via /v1/rerank
// ---------------------------------------------------------------------------

export const zen3Reranker: ZenModel = {
  id: 'zen3-reranker',
  name: 'Zen3 Reranker',
  fullName: 'Zen3 Reranker',
  description: 'High-quality reranker for improving retrieval accuracy in RAG pipelines.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '8B',
    activeParams: null,
    context: 40_000,
    arch: 'Reranker',
  },
  pricing: null,
  features: ['40K context window', '8B parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen3-reranker',
  github: null,
  aliases: [],
}

export const zen3RerankerMedium: ZenModel = {
  id: 'zen3-reranker-medium',
  name: 'Zen3 Reranker Medium',
  fullName: 'Zen3 Reranker Medium',
  description: 'Balanced reranker for cost-effective retrieval quality improvement.',
  generation: 'zen3',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '4B',
    activeParams: null,
    context: 40_000,
    arch: 'Reranker',
  },
  pricing: null,
  features: ['40K context window', '4B parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen3-reranker-medium',
  github: null,
  aliases: [],
}

export const zen3RerankerSmall: ZenModel = {
  id: 'zen3-reranker-small',
  name: 'Zen3 Reranker Small',
  fullName: 'Zen3 Reranker Small',
  description: 'Lightweight reranker for high-throughput reranking at minimal cost.',
  generation: 'zen3',
  tier: 'pro',
  category: 'embedding',
  modalities: ['text', 'embedding'],
  spec: {
    params: '0.6B',
    activeParams: null,
    context: 40_000,
    arch: 'Reranker',
  },
  pricing: null,
  features: ['40K context window', '0.6B parameters'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen3-reranker-small',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Image — via /v1/images/generations
// ---------------------------------------------------------------------------

export const zen3Image: ZenModel = {
  id: 'zen3-image',
  name: 'Zen3 Image',
  fullName: 'Zen3 Image',
  description: 'Best general-purpose image generation.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Image editing'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageMax: ZenModel = {
  id: 'zen3-image-max',
  name: 'Zen3 Image Max',
  fullName: 'Zen3 Image Max',
  description: 'Maximum quality image generation for professional creative work.',
  generation: 'zen3',
  tier: 'ultra max',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Maximum quality'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageDev: ZenModel = {
  id: 'zen3-image-dev',
  name: 'Zen3 Image Dev',
  fullName: 'Zen3 Image Dev',
  description: 'Development model for experimentation and iteration.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Development'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageFast: ZenModel = {
  id: 'zen3-image-fast',
  name: 'Zen3 Image Fast',
  fullName: 'Zen3 Image Fast',
  description: 'Fastest image model for real-time generation.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Ultra-fast'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageSdxl: ZenModel = {
  id: 'zen3-image-sdxl',
  name: 'Zen3 Image SDXL',
  fullName: 'Zen3 Image SDXL',
  description: 'High-resolution image generation at 1024px.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', '1024px'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImagePlayground: ZenModel = {
  id: 'zen3-image-playground',
  name: 'Zen3 Image Playground',
  fullName: 'Zen3 Image Playground',
  description: 'Aesthetic model for artistic image generation.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Aesthetic'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageSsd: ZenModel = {
  id: 'zen3-image-ssd',
  name: 'Zen3 Image SSD',
  fullName: 'Zen3 Image SSD',
  description: 'Fastest diffusion model for real-time generation.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: '1B', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Fastest'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3ImageJp: ZenModel = {
  id: 'zen3-image-jp',
  name: 'Zen3 Image JP',
  fullName: 'Zen3 Image JP',
  description: 'Japanese-specialized image generation model.',
  generation: 'zen3',
  tier: 'pro',
  category: 'vision',
  modalities: ['vision'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Diffusion' },
  pricing: null,
  features: ['Text-to-image', 'Japanese'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 Audio — Speech-to-Text via /v1/audio/transcriptions
// ---------------------------------------------------------------------------

export const zen3Audio: ZenModel = {
  id: 'zen3-audio',
  name: 'Zen3 Audio',
  fullName: 'Zen3 Audio',
  description: 'Best quality speech-to-text transcription. 100+ languages.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: '1.5B', activeParams: null, context: 0, arch: 'ASR' },
  pricing: null,
  features: ['Multi-language', 'Best accuracy', '100+ languages'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3AudioFast: ZenModel = {
  id: 'zen3-audio-fast',
  name: 'Zen3 Audio Fast',
  fullName: 'Zen3 Audio Fast',
  description: 'Fastest speech-to-text transcription for high-throughput workloads.',
  generation: 'zen3',
  tier: 'pro',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: '809M', activeParams: null, context: 0, arch: 'ASR' },
  pricing: null,
  features: ['Multi-language', 'Fastest', 'Batch optimized'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3Asr: ZenModel = {
  id: 'zen3-asr',
  name: 'Zen3 ASR',
  fullName: 'Zen3 ASR',
  description: 'Real-time streaming speech recognition for live transcription and voice agents.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Streaming ASR' },
  pricing: null,
  features: ['Streaming', 'Real-time', 'Sub-500ms latency'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3AsrV1: ZenModel = {
  id: 'zen3-asr-v1',
  name: 'Zen3 ASR v1',
  fullName: 'Zen3 ASR v1',
  description: 'First-generation streaming ASR for legacy compatibility.',
  generation: 'zen3',
  tier: 'pro',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'Streaming ASR' },
  pricing: null,
  features: ['Streaming', 'Legacy'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen3 TTS — Text-to-Speech via /v1/audio/speech
// ---------------------------------------------------------------------------

export const zen3Tts: ZenModel = {
  id: 'zen3-tts',
  name: 'Zen3 TTS',
  fullName: 'Zen3 TTS',
  description: 'High-quality text-to-speech with natural prosody. 40+ voices, 8 languages.',
  generation: 'zen3',
  tier: 'pro max',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: '82M', activeParams: null, context: 0, arch: 'TTS' },
  pricing: null,
  features: ['40+ voices', '8 languages', 'Natural prosody'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3TtsHd: ZenModel = {
  id: 'zen3-tts-hd',
  name: 'Zen3 TTS HD',
  fullName: 'Zen3 TTS HD',
  description: 'Maximum fidelity text-to-speech for broadcast-quality audio production.',
  generation: 'zen3',
  tier: 'ultra max',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: 'N/A', activeParams: null, context: 0, arch: 'TTS HD' },
  pricing: null,
  features: ['HD quality', 'Broadcast-grade', '48kHz output'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen3TtsFast: ZenModel = {
  id: 'zen3-tts-fast',
  name: 'Zen3 TTS Fast',
  fullName: 'Zen3 TTS Fast',
  description: 'Low-latency text-to-speech for real-time voice agents and interactive applications.',
  generation: 'zen3',
  tier: 'pro',
  category: 'audio',
  modalities: ['audio', 'text'],
  spec: { params: '82M', activeParams: null, context: 0, arch: 'TTS' },
  pricing: null,
  features: ['Low latency', 'Real-time', 'Voice agents'],
  status: 'available',
  huggingface: null,
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Zen5 Generation — Next-gen frontier models (Early Access)
// ---------------------------------------------------------------------------

export const zen5: ZenModel = {
  id: 'zen5',
  name: 'Zen5',
  fullName: 'Zen5 — Next Generation',
  description: 'Next-generation agentic frontier model trained on 10B+ tokens of real-world tool use, multi-step reasoning, and production workflows. 1M+ token context with native chain-of-thought.',
  generation: 'zen5',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBA',
    activeParams: null,
    context: 1_048_576,
    arch: 'MoDE + CoT',
  },
  pricing: null,
  features: ['1M+ context window', 'Agentic-trained', 'Native CoT', 'Tool use', 'Multimodal native'],
  status: 'contact-sales',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen5Pro: ZenModel = {
  id: 'zen5-pro',
  name: 'Zen5 Pro',
  fullName: 'Zen5 Pro — Advanced',
  description: 'High-throughput agentic model for demanding production workloads. Trained on real-world development patterns with deep chain-of-thought reasoning.',
  generation: 'zen5',
  tier: 'ultra',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBA',
    activeParams: null,
    context: 524_288,
    arch: 'MoDE + CoT',
  },
  pricing: null,
  features: ['512K context window', 'Agentic-trained', 'Native CoT', 'Production optimized'],
  status: 'contact-sales',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen5Max: ZenModel = {
  id: 'zen5-max',
  name: 'Zen5 Max',
  fullName: 'Zen5 Max — Extended',
  description: 'Maximum context agentic model for document-scale analysis. Trained on 10B+ tokens of real-world workflows with extended chain-of-thought.',
  generation: 'zen5',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBA',
    activeParams: null,
    context: 2_097_152,
    arch: 'MoDE + CoT',
  },
  pricing: null,
  features: ['2M context window', 'Agentic-trained', 'Extended CoT', 'Document-scale'],
  status: 'contact-sales',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen5Ultra: ZenModel = {
  id: 'zen5-ultra',
  name: 'Zen5 Ultra',
  fullName: 'Zen5 Ultra — Deep Reasoning',
  description: 'Deepest reasoning model in the Zen family. Multi-pass chain-of-thought with self-verification.',
  generation: 'zen5',
  tier: 'ultra max',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBA',
    activeParams: null,
    context: 1_048_576,
    arch: 'MoDE + Deep CoT',
  },
  pricing: null,
  features: ['1M context window', 'Agentic-trained', 'Deep CoT', 'Self-verification'],
  status: 'contact-sales',
  huggingface: null,
  github: null,
  aliases: [],
}

export const zen5Mini: ZenModel = {
  id: 'zen5-mini',
  name: 'Zen5 Mini',
  fullName: 'Zen5 Mini — Efficient',
  description: 'Efficient agentic model delivering zen5-class intelligence at a fraction of the cost.',
  generation: 'zen5',
  tier: 'pro',
  category: 'flagship',
  modalities: ['text', 'code', 'math'],
  spec: {
    params: 'TBA',
    activeParams: null,
    context: 262_144,
    arch: 'MoDE + CoT',
  },
  pricing: null,
  features: ['256K context window', 'Agentic-trained', 'Native CoT', 'Cost efficient'],
  status: 'contact-sales',
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
  spec: { params: '0.6B', activeParams: null, context: 32_000, arch: 'Dense' },
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
  spec: { params: '4B', activeParams: null, context: 32_000, arch: 'Dense' },
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
  spec: { params: '8–32B', activeParams: null, context: 32_000, arch: 'Dense' },
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
  spec: { params: '32B', activeParams: null, context: 32_000, arch: 'Dense' },
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
  spec: { params: '235B', activeParams: '22B', context: 131_000, arch: 'MoE' },
  pricing: null,
  features: ['131K context', '14K tokens/sec', '48–128GB memory'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-max',
  github: 'https://github.com/zenlm/zen-max',
  aliases: [],
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
  spec: { params: 'TBD', activeParams: null, context: 256_000, arch: 'Dense' },
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
  spec: { params: '32B', activeParams: null, context: 131_000, arch: 'Dense' },
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
  spec: { params: '7B', activeParams: null, context: 32_000, arch: 'Dense' },
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
  spec: { params: '14B', activeParams: null, context: 32_000, arch: 'Dense' },
  pricing: null,
  features: ['32K context'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-code',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Vision & Image Models (Open Weights)
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
  spec: { params: '32B', activeParams: null, context: 32_000, arch: 'Dense Multimodal' },
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
  spec: { params: '72B', activeParams: null, context: 131_000, arch: 'Dense Multimodal' },
  pricing: null,
  features: ['131K context', 'Multimodal'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-omni',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Safety Models (Open Weights)
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
  spec: { params: '8B', activeParams: null, context: 32_000, arch: 'Dense' },
  pricing: null,
  features: ['Content moderation', 'Guardrails'],
  status: 'available',
  huggingface: 'https://huggingface.co/zenlm/zen-guard',
  github: null,
  aliases: [],
}

// ---------------------------------------------------------------------------
// Embedding Models (Open Weights)
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
  spec: { params: '3072 dimensions', activeParams: null, context: 8_000, arch: 'Embedding' },
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
  spec: { params: '568M', activeParams: null, context: 8_000, arch: 'Reranker' },
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
  spec: { params: '32B', activeParams: null, context: 131_000, arch: 'Dense' },
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
  zen4, zen4Pro, zen4Max, zen4_1, zen4Mini, zen4Ultra, zen4Thinking,
  zen4Coder, zen4CoderFlash, zen4CoderPro,
  // Zen3 production API models (chat)
  zen3Omni, zen3Vl, zen3Nano, zen3Guard,
  // Zen3 embedding & reranker
  zen3Embedding, zen3EmbeddingMedium, zen3EmbeddingSmall,
  zen3Reranker, zen3RerankerMedium, zen3RerankerSmall,
  // Zen3 image
  zen3Image, zen3ImageMax, zen3ImageDev, zen3ImageFast,
  zen3ImageSdxl, zen3ImagePlayground, zen3ImageSsd, zen3ImageJp,
  // Zen3 audio
  zen3Audio, zen3AudioFast, zen3Asr, zen3AsrV1,
  // Zen3 TTS
  zen3Tts, zen3TtsHd, zen3TtsFast,
  // Zen5 next-gen (contact sales)
  zen5, zen5Pro, zen5Max, zen5Ultra, zen5Mini,
  // Foundation local models
  zenNano, zenEco, zen, zenPro, zenMax, zenNext,
  // Code
  zenCoder, zenCoderFlash, zenCode,
  // Vision & Image (open weights)
  zenVl, zenOmni,
  // Safety
  zenGuard,
  // Embedding (open weights)
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
export const zen5Models: ZenModel[] = allModels.filter(m => m.generation === 'zen5')
export const foundationModels: ZenModel[] = allModels.filter(m => m.generation === 'foundation')

/** Lookup by ID. */
export const modelById = new Map<string, ZenModel>(
  allModels.flatMap(m => [[m.id, m] as const, ...m.aliases.map(a => [a, m] as const)])
)

/** Get model by ID or alias. */
export function getModel(id: string): ZenModel | undefined {
  return modelById.get(id)
}
