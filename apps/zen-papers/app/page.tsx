import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import type { LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';
import type { ReactNode } from 'react';

// ── Logo (matches zenlm.org exactly) ──────────────────────────────────────
const ZenLogo: ReactNode = (
  <>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
      <path d="M32 8 C32 8 27 22 27 34 C27 39 29 44 32 48 C35 44 37 39 37 34 C37 22 32 8 32 8Z" fill="#A855F7"/>
      <path d="M32 48 C29 44 22 40 17 38 C12 36 7 37 4 40 C7 47 14 52 21 52 C27 52 31 50 32 48Z" fill="#C084FC" opacity="0.9"/>
      <path d="M32 48 C35 44 42 40 47 38 C52 36 57 37 60 40 C57 47 50 52 43 52 C37 52 33 50 32 48Z" fill="#C084FC" opacity="0.9"/>
      <path d="M10 55 C18 52 26 50 32 50 C38 50 46 52 54 55" stroke="#9333EA" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
    <span className="text-lg font-bold">Zen LM</span>
  </>
);

const GitHubIcon = (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const links: LinkItemType[] = [
  { text: 'Models', url: 'https://zenlm.org/docs/models', external: true },
  { text: 'API', url: 'https://zenlm.org/docs/api', external: true },
  { text: 'Pricing', url: 'https://zenlm.org/docs/api/pricing', external: true },
  {
    type: 'icon',
    url: 'https://github.com/zenlm',
    label: 'GitHub',
    text: 'GitHub',
    icon: GitHubIcon,
    external: true,
  },
  { text: 'Login', url: 'https://hanzo.id', external: true },
  { type: 'button', text: 'Try Zen', url: 'https://hanzo.chat', external: true },
];

// ── Paper data ─────────────────────────────────────────────────────────────
const PDF_BASE = 'https://github.com/zenlm/papers/blob/main/pdfs/';

interface Paper {
  id: string;
  title: string;
  subtitle: string;
  abstract: string;
  pdfUrl: string;
  githubUrl: string;
  date: string;
  tags: string[];
  relatedLinks?: { label: string; url: string }[];
}

interface Category {
  name: string;
  papers: Paper[];
}

const categories: Category[] = [
  {
    name: 'Foundation Papers',
    papers: [
      {
        id: 'family-overview',
        title: 'The Zen AI Model Family',
        subtitle: 'Democratizing AI Through Efficient Architecture',
        abstract: 'Technical overview of the full Zen model family and architecture whitepaper covering 600M to 1T+ parameters.',
        pdfUrl: `${PDF_BASE}zen_family_overview.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-15',
        tags: ['Overview', 'Architecture', 'Model Family'],
        relatedLinks: [
          { label: 'Model Hub', url: 'https://huggingface.co/zenlm' },
          { label: 'Documentation', url: 'https://zenlm.org' },
        ],
      },
      {
        id: 'technical-paper',
        title: 'Zen Technical Paper',
        subtitle: 'Deep Architecture and Training Methodology',
        abstract: 'Deep technical architecture overview covering Zen MoDE modifications, training methodology, and benchmark results.',
        pdfUrl: `${PDF_BASE}zen-technical-paper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-20',
        tags: ['Technical', 'Architecture', 'Training'],
      },
      {
        id: 'training-methodology',
        title: 'Zen Training Methodology',
        subtitle: 'Pre-training, Fine-tuning, and RLHF Pipeline',
        abstract: 'Comprehensive training pipeline including pre-training data curation, supervised fine-tuning, and reinforcement learning from human feedback.',
        pdfUrl: `${PDF_BASE}zen-training-methodology.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-05',
        tags: ['Training', 'RLHF', 'Pre-training'],
      },
      {
        id: 'alignment',
        title: 'Zen Alignment',
        subtitle: 'Value Alignment and Constitutional AI',
        abstract: 'Alignment techniques ensuring Zen models follow human values, including constitutional AI approaches and red-teaming methodologies.',
        pdfUrl: `${PDF_BASE}zen-alignment.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-08',
        tags: ['Alignment', 'Safety', 'Constitutional AI'],
      },
      {
        id: 'mixture-of-experts',
        title: 'Zen Mixture of Distilled Experts',
        subtitle: 'Zen MoDE Architecture',
        abstract: 'The Zen MoDE (Mixture of Distilled Experts) architecture enabling efficient scaling from 600M to 480B parameters with sparse activation.',
        pdfUrl: `${PDF_BASE}zen-mixture-of-experts.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-10',
        tags: ['MoE', 'Architecture', 'Scaling'],
      },
      {
        id: 'synthetic-data',
        title: 'Zen Synthetic Data Generation',
        subtitle: 'Scalable Data Pipelines for LLM Training',
        abstract: 'Synthetic data generation techniques for training data augmentation, including self-play, verification, and quality filtering pipelines.',
        pdfUrl: `${PDF_BASE}zen-synthetic-data.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-12',
        tags: ['Synthetic Data', 'Training', 'Data Pipeline'],
      },
      {
        id: 'safety-evaluation',
        title: 'Zen Safety Evaluation',
        subtitle: 'Red-Teaming and Adversarial Robustness',
        abstract: 'Comprehensive safety evaluation framework covering red-teaming, adversarial robustness, and harm mitigation across the Zen model family.',
        pdfUrl: `${PDF_BASE}zen-safety-evaluation.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-15',
        tags: ['Safety', 'Red-Teaming', 'Evaluation'],
      },
    ],
  },
  {
    name: 'Core Models',
    papers: [
      {
        id: 'zen-base',
        title: 'Zen-Base',
        subtitle: 'Foundation Language Model',
        abstract: 'The Zen-Base foundation model: pre-training corpus, architecture decisions, and evaluation across reasoning, knowledge, and language tasks.',
        pdfUrl: `${PDF_BASE}zen-base_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-01',
        tags: ['Base Model', 'Pre-training', 'Foundation'],
      },
      {
        id: 'eco',
        title: 'Zen-Eco: Consumer Hardware Models',
        subtitle: 'Optimized for Consumer-Grade Hardware',
        abstract: 'Models optimized for consumer-grade hardware with excellent quality-to-compute ratio.',
        pdfUrl: `${PDF_BASE}zen-eco_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-11-25',
        tags: ['Eco', 'Consumer', 'Efficient'],
      },
      {
        id: 'nano',
        title: 'Zen-Nano: Mobile and IoT Intelligence',
        subtitle: 'Ultra-Efficient Models for Edge Deployment',
        abstract: 'Ultra-efficient models for mobile and IoT deployment with minimal resource requirements.',
        pdfUrl: `${PDF_BASE}zen-nano_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-10-15',
        tags: ['Nano', 'Mobile', 'Edge'],
      },
      {
        id: 'zen-pro',
        title: 'Zen-Pro',
        subtitle: 'Professional-Grade Language Model',
        abstract: 'Zen-Pro delivers professional-grade capabilities with enhanced reasoning, instruction following, and domain knowledge at 32B parameters.',
        pdfUrl: `${PDF_BASE}zen-pro_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-18',
        tags: ['Pro', 'Reasoning', 'Professional'],
      },
      {
        id: 'zen-max',
        title: 'Zen-Max',
        subtitle: 'Maximum Capability Flagship Model',
        abstract: 'The Zen-Max flagship: maximum capability at 72B+ parameters with extended context, advanced reasoning, and state-of-the-art benchmark performance.',
        pdfUrl: `${PDF_BASE}zen-max_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-20',
        tags: ['Max', 'Flagship', '72B'],
      },
      {
        id: 'omni',
        title: 'Zen-Omni: Multimodal Text Model',
        subtitle: 'Multimodal Text Understanding and Generation',
        abstract: 'Multimodal text understanding and generation across modalities in a unified architecture.',
        pdfUrl: `${PDF_BASE}zen-omni_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-22',
        tags: ['Omni', 'Multimodal', 'Text'],
      },
      {
        id: 'next',
        title: 'Zen-Next: Flagship Model',
        subtitle: 'Next-Generation Frontier Model',
        abstract: 'Flagship model technical report covering architecture innovations and benchmark results.',
        pdfUrl: `${PDF_BASE}zen-next_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-01',
        tags: ['Flagship', 'Next-Gen', 'Model'],
      },
      {
        id: 'reranker',
        title: 'Zen-Reranker: 7680-Dim Embeddings',
        subtitle: 'Semantic Optimization with BitDelta Compression',
        abstract: 'High-dimensional embeddings with native 7680-dim output and BitDelta compression for DSO networks, achieving 94.7% Recall@5 cross-model retrieval.',
        pdfUrl: `${PDF_BASE}zen-reranker.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-10-01',
        tags: ['Reranker', 'Embeddings', 'BitDelta', 'DSO'],
      },
    ],
  },
  {
    name: 'Zen4 Generation',
    papers: [
      {
        id: 'zen4',
        title: 'Zen4',
        subtitle: 'Fourth-Generation Architecture',
        abstract: 'The Zen4 fourth-generation architecture: scaled MoDE with improved training efficiency, extended context to 128K tokens, and frontier benchmark results.',
        pdfUrl: `${PDF_BASE}zen4_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-01',
        tags: ['Zen4', 'Architecture', 'Fourth-Gen'],
      },
      {
        id: 'zen4-pro',
        title: 'Zen4-Pro',
        subtitle: 'Zen4 Professional Edition',
        abstract: 'Zen4-Pro professional edition with enhanced instruction following, tool use, and agentic capabilities for enterprise deployment.',
        pdfUrl: `${PDF_BASE}zen4-pro_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-15',
        tags: ['Zen4', 'Pro', 'Enterprise'],
      },
      {
        id: 'zen4-max',
        title: 'Zen4-Max',
        subtitle: 'Zen4 Maximum Scale',
        abstract: 'Zen4-Max at maximum scale: 480B total parameters with 36B active via MoDE routing, achieving state-of-the-art across all major benchmarks.',
        pdfUrl: `${PDF_BASE}zen4-max_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-07-01',
        tags: ['Zen4', 'Max', '480B', 'MoDE'],
      },
      {
        id: 'zen4-ultra',
        title: 'Zen4-Ultra',
        subtitle: 'Zen4 Ultra Long-Context Edition',
        abstract: 'Zen4-Ultra with 1M token context window, optimized for document-level reasoning, long-form code analysis, and multi-document synthesis.',
        pdfUrl: `${PDF_BASE}zen4-ultra_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-07-15',
        tags: ['Zen4', 'Ultra', 'Long Context', '1M tokens'],
      },
      {
        id: 'zen4-mini',
        title: 'Zen4-Mini',
        subtitle: 'Zen4 Efficient Edge Edition',
        abstract: 'Zen4-Mini delivers fourth-generation capabilities at 3B parameters, optimized for edge deployment, mobile inference, and latency-sensitive applications.',
        pdfUrl: `${PDF_BASE}zen4-mini_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-08-01',
        tags: ['Zen4', 'Mini', 'Edge', '3B'],
      },
      {
        id: 'zen4-thinking',
        title: 'Zen4-Thinking',
        subtitle: 'Extended Chain-of-Thought Reasoning',
        abstract: 'Zen4-Thinking with extended chain-of-thought and test-time compute scaling, achieving OpenAI o1-level performance on math, science, and coding benchmarks.',
        pdfUrl: `${PDF_BASE}zen4-thinking_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-08-15',
        tags: ['Zen4', 'Thinking', 'CoT', 'Reasoning'],
      },
    ],
  },
  {
    name: 'Code Models',
    papers: [
      {
        id: 'coder',
        title: 'Zen Coder: Agentic Code Generation',
        subtitle: '4B–1T Parameter Code Generation',
        abstract: 'Code generation models with agentic capabilities across parameter scales from 4B to 1T.',
        pdfUrl: `${PDF_BASE}zen-coder_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-11-20',
        tags: ['Coder', 'Code Generation', 'Agentic'],
      },
      {
        id: 'zen-coder-flash',
        title: 'Zen Coder Flash',
        subtitle: 'Ultra-Fast Code Completion',
        abstract: 'Zen Coder Flash: optimized for sub-100ms code completion latency with speculative decoding and KV-cache prefill for IDE integration.',
        pdfUrl: `${PDF_BASE}zen-coder-flash_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-15',
        tags: ['Coder', 'Flash', 'Latency', 'IDE'],
      },
      {
        id: 'zen-code',
        title: 'Zen Code',
        subtitle: 'Full-Stack Development Assistant',
        abstract: 'Zen Code: full-stack development assistant with repository-level understanding, multi-file editing, test generation, and debugging capabilities.',
        pdfUrl: `${PDF_BASE}zen-code_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-01',
        tags: ['Code', 'Full-Stack', 'Repository'],
      },
      {
        id: 'zen4-coder',
        title: 'Zen4-Coder',
        subtitle: 'Fourth-Generation Code Intelligence',
        abstract: 'Zen4-Coder fourth-generation code model with 200K context, multi-language support across 50+ languages, and agentic software engineering capabilities.',
        pdfUrl: `${PDF_BASE}zen4-coder_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-20',
        tags: ['Zen4', 'Coder', 'Multi-Language'],
      },
      {
        id: 'zen4-coder-pro',
        title: 'Zen4-Coder-Pro',
        subtitle: 'Professional Software Engineering Agent',
        abstract: 'Zen4-Coder-Pro for professional software engineering: SWE-bench top performance, autonomous PR creation, and multi-agent code review workflows.',
        pdfUrl: `${PDF_BASE}zen4-coder-pro_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-07-05',
        tags: ['Zen4', 'Coder', 'Pro', 'SWE-bench'],
      },
      {
        id: 'zen4-coder-flash',
        title: 'Zen4-Coder-Flash',
        subtitle: 'Real-Time Code Completion at Scale',
        abstract: 'Zen4-Coder-Flash: real-time code completion at scale with speculative decoding achieving <50ms p99 latency for inline code suggestions.',
        pdfUrl: `${PDF_BASE}zen4-coder-flash_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-08-10',
        tags: ['Zen4', 'Coder', 'Flash', 'Real-Time'],
      },
    ],
  },
  {
    name: 'Zen3 Specialized',
    papers: [
      {
        id: 'zen3-nano',
        title: 'Zen3-Nano',
        subtitle: 'Third-Generation Edge Intelligence',
        abstract: 'Zen3-Nano at 0.6B parameters: third-generation efficiency for extreme edge deployment with INT4 quantization and neural architecture search.',
        pdfUrl: `${PDF_BASE}zen3-nano_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-10',
        tags: ['Zen3', 'Nano', 'Edge', '0.6B'],
      },
      {
        id: 'zen3-omni',
        title: 'Zen3-Omni',
        subtitle: 'Third-Generation Multimodal Model',
        abstract: 'Zen3-Omni: third-generation multimodal model unifying vision, audio, and text with real-time streaming capabilities.',
        pdfUrl: `${PDF_BASE}zen3-omni_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-20',
        tags: ['Zen3', 'Omni', 'Multimodal', 'Streaming'],
      },
      {
        id: 'zen3-vl',
        title: 'Zen3-VL',
        subtitle: 'Third-Generation Vision-Language',
        abstract: 'Zen3-VL vision-language model with improved visual grounding, chart understanding, and OCR capabilities for document intelligence.',
        pdfUrl: `${PDF_BASE}zen3-vl_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-01',
        tags: ['Zen3', 'Vision', 'Language', 'OCR'],
      },
      {
        id: 'zen3-guard',
        title: 'Zen3-Guard',
        subtitle: 'Third-Generation Safety Model',
        abstract: 'Zen3-Guard safety model with multilingual content moderation, real-time streaming classification, and 97.3% precision on toxicity detection.',
        pdfUrl: `${PDF_BASE}zen3-guard_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-10',
        tags: ['Zen3', 'Guard', 'Safety', 'Moderation'],
      },
      {
        id: 'zen3-embedding',
        title: 'Zen3-Embedding',
        subtitle: 'Third-Generation Semantic Embeddings',
        abstract: 'Zen3-Embedding with 4096-dim representations, optimized for semantic search, RAG pipelines, and cross-lingual retrieval at billion-document scale.',
        pdfUrl: `${PDF_BASE}zen3-embedding_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-20',
        tags: ['Zen3', 'Embedding', 'Retrieval', 'RAG'],
      },
    ],
  },
  {
    name: 'Vision & Image',
    papers: [
      {
        id: 'vl',
        title: 'Zen-VL: Vision-Language Model',
        subtitle: 'Unified Vision and Language Understanding',
        abstract: 'Zen-VL unified vision-language model with chart understanding, document OCR, and visual question answering across diverse image types.',
        pdfUrl: `${PDF_BASE}zen-vl_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-10',
        tags: ['VL', 'Vision', 'Language', 'Multimodal'],
      },
      {
        id: 'artist',
        title: 'Zen-Artist: Text-to-Image Generation',
        subtitle: 'High-Quality Image Synthesis',
        abstract: 'Text-to-image generation model with high-quality synthesis and fine-grained artistic control.',
        pdfUrl: `${PDF_BASE}zen-artist_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-10',
        tags: ['Artist', 'Text-to-Image', 'Generation'],
      },
      {
        id: 'artist-edit',
        title: 'Zen-Artist-Edit: Image Editing',
        subtitle: 'Instruction-Following Image Editing and Inpainting',
        abstract: 'Image editing and inpainting with instruction-following for precise, controllable modifications.',
        pdfUrl: `${PDF_BASE}zen-artist-edit_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-15',
        tags: ['Artist', 'Image Editing', 'Inpainting'],
      },
      {
        id: 'designer-instruct',
        title: 'Zen-Designer: Design Generation',
        subtitle: 'Instruction-Following Design Model',
        abstract: 'Instruction-following design generation for professional creative workflows.',
        pdfUrl: `${PDF_BASE}zen-designer-instruct_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-20',
        tags: ['Designer', 'Instruct', 'Design'],
      },
      {
        id: 'designer-thinking',
        title: 'Zen-Designer-Thinking: Visual Reasoning',
        subtitle: 'Visual Reasoning and Design Analysis',
        abstract: 'Visual reasoning and analysis for design tasks with chain-of-thought design understanding.',
        pdfUrl: `${PDF_BASE}zen-designer-thinking_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-05',
        tags: ['Designer', 'Visual Reasoning', 'Analysis'],
      },
    ],
  },
  {
    name: 'Video Models',
    papers: [
      {
        id: 'director',
        title: 'Zen-Director: Video Scene Generation',
        subtitle: 'Storyboarding and Shot Composition',
        abstract: 'Video scene generation with storyboarding, shot composition, and cinematic direction for professional video production workflows.',
        pdfUrl: `${PDF_BASE}zen-director.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-15',
        tags: ['Director', 'Video', 'Storyboarding'],
      },
      {
        id: 'video',
        title: 'Zen-Video: Video Generation',
        subtitle: 'Frame Interpolation and Video Understanding',
        abstract: 'Video generation, frame interpolation, and temporal coherence for high-quality video synthesis from text and image prompts.',
        pdfUrl: `${PDF_BASE}zen-video.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-20',
        tags: ['Video', 'Generation', 'Temporal'],
      },
      {
        id: 'video-i2v',
        title: 'Zen-Video-I2V: Image-to-Video',
        subtitle: 'Image Animation and Video Synthesis',
        abstract: 'Image-to-video synthesis: animate static images into temporally coherent video clips with physics-aware motion priors.',
        pdfUrl: `${PDF_BASE}zen-video-i2v_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-05',
        tags: ['Video', 'I2V', 'Animation'],
      },
      {
        id: 'voyager',
        title: 'Zen-Voyager: Exploration Model',
        subtitle: 'Curiosity-Driven Open-Ended Learning',
        abstract: 'Open-ended exploration and curiosity-driven learning for novel task discovery in dynamic environments.',
        pdfUrl: `${PDF_BASE}zen-voyager.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-20',
        tags: ['Voyager', 'Exploration', 'RL'],
      },
    ],
  },
  {
    name: 'Audio & Speech',
    papers: [
      {
        id: 'scribe',
        title: 'Zen-Scribe: Speech Recognition',
        subtitle: 'Multi-Language Speech-to-Text',
        abstract: 'Speech recognition and transcription with multi-language support and high accuracy.',
        pdfUrl: `${PDF_BASE}zen-scribe_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-11-15',
        tags: ['Scribe', 'Speech', 'Transcription'],
      },
      {
        id: 'dub',
        title: 'Zen-Dub: Voice Dubbing',
        subtitle: 'Cross-Language Voice Synthesis and Dubbing',
        abstract: 'Cross-language voice dubbing with speaker identity preservation, lip-sync alignment, and prosody transfer for media localization.',
        pdfUrl: `${PDF_BASE}zen-dub_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-25',
        tags: ['Dub', 'Voice', 'Dubbing', 'Localization'],
      },
      {
        id: 'dub-live',
        title: 'Zen-Dub-Live: Real-Time Dubbing',
        subtitle: 'Streaming Voice Translation with <200ms Latency',
        abstract: 'Real-time streaming voice dubbing with <200ms end-to-end latency for live broadcasts, video calls, and interactive media.',
        pdfUrl: `${PDF_BASE}zen-dub-live_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-15',
        tags: ['Dub', 'Live', 'Streaming', 'Real-Time'],
      },
      {
        id: 'translator',
        title: 'Zen-Translator: Speech Translation',
        subtitle: '100+ Language Speech-to-Speech Translation',
        abstract: 'End-to-end speech translation across 100+ languages with speaker voice preservation and cultural adaptation for global communication.',
        pdfUrl: `${PDF_BASE}zen-translator_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-20',
        tags: ['Translator', 'Speech', 'Multilingual'],
      },
      {
        id: 'foley',
        title: 'Zen-Foley: Audio Effects Generation',
        subtitle: 'Spatial Audio and Sound Effects',
        abstract: 'AI-generated Foley sound effects with spatial audio, video-synchronized generation, and physics-based acoustic modeling.',
        pdfUrl: `${PDF_BASE}zen-foley.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-25',
        tags: ['Foley', 'Audio', 'Sound Effects'],
      },
      {
        id: 'musician',
        title: 'Zen-Musician: Music Composition',
        subtitle: 'Multi-Genre Music Generation and MIDI',
        abstract: 'Music composition across genres with MIDI generation, orchestral arrangement, and style transfer for professional music production.',
        pdfUrl: `${PDF_BASE}zen-musician.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-28',
        tags: ['Musician', 'Music', 'MIDI', 'Composition'],
      },
      {
        id: 'live',
        title: 'Zen-Live: Real-Time Streaming AI',
        subtitle: 'Low-Latency Multimodal Live Interaction',
        abstract: 'Zen-Live for real-time streaming AI interactions: sub-100ms audio-visual response with continuous context and interruption handling.',
        pdfUrl: `${PDF_BASE}zen-live_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-05',
        tags: ['Live', 'Streaming', 'Real-Time', 'Multimodal'],
      },
    ],
  },
  {
    name: 'Multimodal & Creative',
    papers: [
      {
        id: 'zen-3d',
        title: 'Zen-3D: 3D Model Generation',
        subtitle: 'Mesh Generation and Texture Synthesis',
        abstract: '3D model generation with mesh optimization, PBR texture synthesis, and multi-view consistent generation from text or image prompts.',
        pdfUrl: `${PDF_BASE}zen-3d.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-10',
        tags: ['3D', 'Generation', 'Mesh', 'Texture'],
      },
      {
        id: 'world',
        title: 'Zen-World: World Model Simulation',
        subtitle: 'Physics-Aware Causal Reasoning',
        abstract: 'World model simulation with physics understanding and causal reasoning for embodied AI and robotics applications.',
        pdfUrl: `${PDF_BASE}zen-world.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-10',
        tags: ['World', 'Simulation', 'Physics', 'Causal'],
      },
      {
        id: 'agent',
        title: 'Zen-Agent: Autonomous Task Execution',
        subtitle: 'Tool Use, Planning, and Multi-Step Reasoning',
        abstract: 'Autonomous agent system with tool use, hierarchical planning, and multi-step reasoning for complex real-world task completion.',
        pdfUrl: `${PDF_BASE}zen-agent.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-01-30',
        tags: ['Agent', 'Autonomous', 'Planning', 'Tool Use'],
      },
    ],
  },
  {
    name: 'Safety',
    papers: [
      {
        id: 'guard',
        title: 'Zen-Guard: Safety Moderation',
        subtitle: 'Multilingual AI Safety and Content Moderation',
        abstract: 'Safety and content moderation across languages for responsible AI deployment.',
        pdfUrl: `${PDF_BASE}zen-guard_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2024-12-05',
        tags: ['Guard', 'Safety', 'Moderation'],
      },
      {
        id: 'guard-gen',
        title: 'Zen-Guard-Gen: Generative Safety',
        subtitle: 'Real-Time Safety for Generative Content',
        abstract: 'Generative safety model for real-time moderation of image, video, and audio generation outputs with 99.1% harmful content detection.',
        pdfUrl: `${PDF_BASE}zen-guard-gen_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-25',
        tags: ['Guard', 'Generative', 'Safety', 'Multimodal'],
      },
      {
        id: 'guard-stream',
        title: 'Zen-Guard-Stream: Streaming Safety',
        subtitle: 'Token-Level Real-Time Safety Classification',
        abstract: 'Streaming safety classification at token level for real-time LLM output moderation with <5ms per-token latency.',
        pdfUrl: `${PDF_BASE}zen-guard-stream_whitepaper.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-15',
        tags: ['Guard', 'Streaming', 'Real-Time', 'Token-Level'],
      },
    ],
  },
  {
    name: 'Infrastructure',
    papers: [
      {
        id: 'inference-optimization',
        title: 'Zen Inference Optimization',
        subtitle: 'Speculative Decoding and KV-Cache Compression',
        abstract: 'Inference optimization techniques: speculative decoding, KV-cache compression, continuous batching, and PagedAttention for high-throughput serving.',
        pdfUrl: `${PDF_BASE}zen-inference-optimization.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-05',
        tags: ['Inference', 'Optimization', 'Serving', 'Latency'],
      },
      {
        id: 'embeddings-retrieval',
        title: 'Zen Embeddings and Retrieval',
        subtitle: 'Vector Databases and RAG Architectures',
        abstract: 'Embedding model deployment, vector database integration, and retrieval-augmented generation architectures for production AI systems.',
        pdfUrl: `${PDF_BASE}zen-embeddings-retrieval.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-20',
        tags: ['Embeddings', 'RAG', 'Vector DB', 'Retrieval'],
      },
      {
        id: 'hardware-optimization',
        title: 'Zen Hardware Optimization',
        subtitle: 'GPU, TPU, and Custom Silicon Deployment',
        abstract: 'Hardware-specific optimization for H100/A100 GPU clusters, TPU v4/v5, and custom AI accelerators with kernel fusion and mixed-precision training.',
        pdfUrl: `${PDF_BASE}zen-hardware-optimization.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-01',
        tags: ['Hardware', 'GPU', 'TPU', 'Optimization'],
      },
      {
        id: 'enterprise-deployment',
        title: 'Zen Enterprise Deployment',
        subtitle: 'Production Deployment and SLA Management',
        abstract: 'Enterprise deployment guide: multi-region serving, SLA management, cost optimization, and compliance frameworks for regulated industries.',
        pdfUrl: `${PDF_BASE}zen-enterprise-deployment.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-10',
        tags: ['Enterprise', 'Deployment', 'SLA', 'Production'],
      },
      {
        id: 'context-extension',
        title: 'Zen Context Extension',
        subtitle: 'Long-Context Training and Inference',
        abstract: 'Context extension to 1M+ tokens: YaRN positional interpolation, ring attention, and memory-efficient attention for long-document processing.',
        pdfUrl: `${PDF_BASE}zen-context-extension.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-01',
        tags: ['Context', 'Long-Context', 'Attention', '1M tokens'],
      },
      {
        id: 'finetuning',
        title: 'Zen Fine-Tuning',
        subtitle: 'LoRA, QLoRA, and Full Fine-Tuning Recipes',
        abstract: 'Fine-tuning methodology: LoRA, QLoRA, full fine-tuning recipes, dataset preparation, and evaluation frameworks for domain adaptation.',
        pdfUrl: `${PDF_BASE}zen-finetuning.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-10',
        tags: ['Fine-Tuning', 'LoRA', 'QLoRA', 'Adaptation'],
      },
    ],
  },
  {
    name: 'Research',
    papers: [
      {
        id: 'quantization',
        title: 'Zen Quantization',
        subtitle: 'BitDelta and Post-Training Quantization',
        abstract: 'Quantization research: BitDelta 1-bit delta compression, GPTQ, AWQ, and SmoothQuant applied to Zen models with <1% accuracy degradation.',
        pdfUrl: `${PDF_BASE}zen-quantization.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-02-28',
        tags: ['Quantization', 'BitDelta', 'Compression'],
      },
      {
        id: 'distributed-training',
        title: 'Zen Distributed Training',
        subtitle: 'Multi-Node Training at Scale',
        abstract: 'Distributed training infrastructure: 3D parallelism (tensor, pipeline, data), ZeRO optimization, and fault-tolerant training for 10,000+ GPU clusters.',
        pdfUrl: `${PDF_BASE}zen-distributed-training.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-05',
        tags: ['Distributed', 'Training', 'Parallelism', 'Scale'],
      },
      {
        id: 'multimodal-architecture',
        title: 'Zen Multimodal Architecture',
        subtitle: 'Unified Modality Fusion Design',
        abstract: 'Multimodal architecture design: modality-specific encoders, cross-attention fusion, and unified token space for vision, audio, and text.',
        pdfUrl: `${PDF_BASE}zen-multimodal-architecture.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-12',
        tags: ['Multimodal', 'Architecture', 'Fusion'],
      },
      {
        id: 'vision-architecture',
        title: 'Zen Vision Architecture',
        subtitle: 'Visual Encoder Design and Training',
        abstract: 'Vision encoder architecture: ViT variants, patch embedding, dynamic resolution, and vision-language alignment training at scale.',
        pdfUrl: `${PDF_BASE}zen-vision-architecture.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-18',
        tags: ['Vision', 'Architecture', 'ViT', 'Encoder'],
      },
      {
        id: 'audio-architecture',
        title: 'Zen Audio Architecture',
        subtitle: 'Speech and Audio Encoder Design',
        abstract: 'Audio encoder architecture: Whisper-inspired design, mel-spectrogram processing, streaming inference, and audio-text alignment.',
        pdfUrl: `${PDF_BASE}zen-audio-architecture.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-03-22',
        tags: ['Audio', 'Architecture', 'Speech', 'Encoder'],
      },
      {
        id: 'agent-framework',
        title: 'Zen Agent Framework',
        subtitle: 'Multi-Agent Orchestration and Tool Use',
        abstract: 'Agent framework design: ReAct planning, tool use APIs, multi-agent coordination, memory systems, and long-horizon task execution.',
        pdfUrl: `${PDF_BASE}zen-agent-framework.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-05',
        tags: ['Agent', 'Framework', 'Multi-Agent', 'Tool Use'],
      },
      {
        id: 'mathematical-reasoning',
        title: 'Zen Mathematical Reasoning',
        subtitle: 'Formal Proofs and Symbolic Computation',
        abstract: 'Mathematical reasoning capabilities: formal proof verification, symbolic computation integration, and competition-level mathematics performance.',
        pdfUrl: `${PDF_BASE}zen-mathematical-reasoning.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-12',
        tags: ['Math', 'Reasoning', 'Formal Proofs'],
      },
      {
        id: 'code-benchmarks',
        title: 'Zen Code Benchmarks',
        subtitle: 'HumanEval, SWE-bench, and CodeContests',
        abstract: 'Comprehensive code benchmark evaluation: HumanEval+, SWE-bench, CodeContests, and LiveCodeBench across all Zen code model variants.',
        pdfUrl: `${PDF_BASE}zen-code-benchmarks.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-18',
        tags: ['Code', 'Benchmarks', 'Evaluation', 'HumanEval'],
      },
      {
        id: 'chain-of-thought',
        title: 'Zen Chain-of-Thought',
        subtitle: 'Reasoning Chains and Test-Time Compute',
        abstract: 'Chain-of-thought training and inference: process reward models, tree search, and test-time compute scaling for improved reasoning.',
        pdfUrl: `${PDF_BASE}zen-chain-of-thought.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-04-25',
        tags: ['CoT', 'Reasoning', 'Test-Time Compute'],
      },
      {
        id: 'reward-modeling',
        title: 'Zen Reward Modeling',
        subtitle: 'RLHF and Process Reward Models',
        abstract: 'Reward model design for RLHF: outcome reward models, process reward models, and constitutional AI reward signals for alignment.',
        pdfUrl: `${PDF_BASE}zen-reward-modeling.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-01',
        tags: ['RLHF', 'Reward', 'Alignment', 'PRM'],
      },
      {
        id: 'knowledge-distillation',
        title: 'Zen Knowledge Distillation',
        subtitle: 'Teacher-Student Training at Scale',
        abstract: 'Knowledge distillation techniques: token-level KL divergence, feature alignment, and DeltaSoup for efficient small-model training from large teachers.',
        pdfUrl: `${PDF_BASE}zen-knowledge-distillation.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-10',
        tags: ['Distillation', 'DeltaSoup', 'Compression'],
      },
      {
        id: 'hallucination-reduction',
        title: 'Zen Hallucination Reduction',
        subtitle: 'Factuality and Grounding Techniques',
        abstract: 'Hallucination reduction techniques: retrieval augmentation, self-consistency checking, uncertainty calibration, and factuality fine-tuning.',
        pdfUrl: `${PDF_BASE}zen-hallucination-reduction.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-20',
        tags: ['Hallucination', 'Factuality', 'Grounding'],
      },
    ],
  },
  {
    name: 'Protocols & Standards',
    papers: [
      {
        id: 'aso-protocol',
        title: 'ASO Protocol (HIP-002)',
        subtitle: 'Active Semantic Optimization',
        abstract: 'Active Semantic Optimization protocol (HIP-002): enabling LLMs to improve through shared semantic experiences rather than gradient updates in decentralized networks.',
        pdfUrl: `${PDF_BASE}zen-aso-protocol.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-25',
        tags: ['ASO', 'Protocol', 'HIP-002', 'Decentralized'],
      },
      {
        id: 'dso-protocol',
        title: 'DSO Protocol (ZIP-001)',
        subtitle: 'Decentralized Semantic Optimization',
        abstract: 'Decentralized Semantic Optimization protocol (ZIP-001): cross-model knowledge sharing via Byzantine-robust aggregation and BitDelta compression.',
        pdfUrl: `${PDF_BASE}zen-dso-protocol.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-01',
        tags: ['DSO', 'Protocol', 'ZIP-001', 'Byzantine'],
      },
      {
        id: 'benchmark-suite',
        title: 'Zen Benchmark Suite',
        subtitle: 'Comprehensive Evaluation Framework',
        abstract: 'The Zen benchmark suite: standardized evaluation across reasoning, knowledge, code, math, safety, and multimodal tasks for fair model comparison.',
        pdfUrl: `${PDF_BASE}zen-benchmark-suite.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-10',
        tags: ['Benchmark', 'Evaluation', 'Standards'],
      },
    ],
  },
  {
    name: 'Domain Applications',
    papers: [
      {
        id: 'medical-ai',
        title: 'Zen Medical AI',
        subtitle: 'Clinical Decision Support and Medical Reasoning',
        abstract: 'Zen models for healthcare: clinical decision support, medical imaging analysis, drug interaction prediction, and HIPAA-compliant deployment.',
        pdfUrl: `${PDF_BASE}zen-medical-ai.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-05',
        tags: ['Medical', 'Healthcare', 'Clinical', 'HIPAA'],
      },
      {
        id: 'financial-ai',
        title: 'Zen Financial AI',
        subtitle: 'Quantitative Analysis and Risk Modeling',
        abstract: 'Financial AI applications: quantitative analysis, risk modeling, regulatory compliance, earnings prediction, and SEC filing analysis.',
        pdfUrl: `${PDF_BASE}zen-financial-ai.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-12',
        tags: ['Finance', 'Risk', 'Compliance', 'Quantitative'],
      },
      {
        id: 'legal-ai',
        title: 'Zen Legal AI',
        subtitle: 'Contract Analysis and Legal Research',
        abstract: 'Legal AI applications: contract analysis, case law research, regulatory compliance mapping, and legal document generation.',
        pdfUrl: `${PDF_BASE}zen-legal-ai.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-18',
        tags: ['Legal', 'Contracts', 'Compliance', 'Research'],
      },
      {
        id: 'privacy-federated',
        title: 'Zen Privacy and Federated Learning',
        subtitle: 'Differential Privacy and On-Device Training',
        abstract: 'Privacy-preserving AI: differential privacy mechanisms, federated learning across devices, secure aggregation, and on-device fine-tuning.',
        pdfUrl: `${PDF_BASE}zen-privacy-federated.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-05-28',
        tags: ['Privacy', 'Federated', 'Differential Privacy'],
      },
      {
        id: 'multilingual',
        title: 'Zen Multilingual',
        subtitle: '100+ Language Support and Cross-Lingual Transfer',
        abstract: 'Multilingual capabilities across 100+ languages: cross-lingual transfer learning, low-resource language support, and culturally-aware generation.',
        pdfUrl: `${PDF_BASE}zen-multilingual.pdf`,
        githubUrl: 'https://github.com/zenlm/papers',
        date: '2025-06-05',
        tags: ['Multilingual', 'Cross-Lingual', '100+ Languages'],
      },
    ],
  },
];

// Flatten all papers for counting
const totalPapers = categories.reduce((sum, c) => sum + c.papers.length, 0);

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="group flex flex-col rounded-xl border border-fd-border bg-fd-card overflow-hidden transition-colors hover:border-fd-primary/50">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-violet-400" />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Date */}
        <p className="text-xs text-fd-muted-foreground">{formatDate(paper.date)}</p>

        {/* Title + subtitle */}
        <div>
          <h3 className="text-base font-semibold leading-snug text-fd-foreground group-hover:text-fd-primary transition-colors">
            {paper.title}
          </h3>
          <p className="text-sm text-fd-muted-foreground mt-0.5">{paper.subtitle}</p>
        </div>

        {/* Abstract */}
        <p className="text-sm text-fd-muted-foreground leading-relaxed flex-1">{paper.abstract}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md bg-fd-accent/60 px-2 py-0.5 text-xs font-medium text-fd-accent-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Read PDF
          </a>
          <a
            href={paper.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-fd-border bg-fd-muted px-4 py-2 text-sm font-medium text-fd-foreground hover:border-fd-primary/50 hover:text-fd-primary transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Related links */}
        {'relatedLinks' in paper && paper.relatedLinks && paper.relatedLinks.length > 0 && (
          <div className="pt-1 border-t border-fd-border">
            <p className="text-xs text-fd-muted-foreground mb-1">Related:</p>
            <div className="flex flex-col gap-0.5">
              {paper.relatedLinks.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-fd-primary hover:underline"
                >
                  {l.label} →
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <HomeLayout
      nav={{ title: ZenLogo, url: 'https://zenlm.org' }}
      links={links}
      themeSwitch={{ enabled: false }}
    >
      <div className="container max-w-[1200px] mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl">
            Research Papers
          </h1>
          <p className="mt-4 text-lg text-fd-muted-foreground max-w-2xl mx-auto">
            {totalPapers} technical whitepapers for the Zen model family — frontier AI from 600M to 1T+ parameters,
            co-developed by Hanzo AI and Zoo Labs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://github.com/zenlm/papers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-muted px-4 py-2 text-sm font-medium text-fd-foreground hover:border-fd-primary/50 hover:text-fd-primary transition-colors"
            >
              {GitHubIcon && (
                <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4 flex items-center">{GitHubIcon}</span>
              )}
              zenlm/papers
            </a>
            <a
              href="https://huggingface.co/zenlm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors"
            >
              Model Hub →
            </a>
          </div>
        </div>

        {/* Papers by category */}
        <div className="space-y-14">
          {categories.map((cat) => (
            <section key={cat.name}>
              <h2 className="text-xl font-semibold text-fd-foreground mb-5 pb-2 border-b border-fd-border">
                {cat.name}
                <span className="ml-2 text-sm font-normal text-fd-muted-foreground">
                  ({cat.papers.length} papers)
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.papers.map((p) => (
                  <PaperCard key={p.id} paper={p} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center border-t border-fd-border pt-8">
          <p className="text-sm text-fd-muted-foreground">
            All papers © Hanzo AI Inc and Zoo Labs Foundation.{' '}
            <a href="https://zenlm.org" className="text-fd-primary hover:underline">
              zenlm.org
            </a>
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
