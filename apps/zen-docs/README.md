# Zen LM Documentation

Documentation site for [Zen LM](https://zenlm.org) - frontier AI models for code, reasoning, and multimodal understanding.

Built with [Hanzo Docs](https://docs.hanzo.ai) (fumadocs-based).

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Structure

```
docs/
├── app/                    # Next.js app directory
│   ├── (home)/            # Landing page
│   ├── docs/              # Documentation pages
│   └── api/               # API routes
├── content/docs/          # MDX content
│   ├── index.mdx          # Introduction
│   ├── getting-started/   # Quickstart guides
│   ├── models/            # Model documentation
│   └── training/          # Training guides
├── lib/                   # Utilities
└── source.config.ts       # MDX configuration
```

## Models

- **zen-max** - 671B MoE (71.3% SWE-bench)
- **zen-coder-flash** - 31B MoE (59.2% SWE-bench) ⭐ Flagship
- **zen-omni** - 7B multimodal
- **zen-vl** - Vision-language (4B/8B/30B)
- **zen-nano** - 0.6B edge

## Links

- [HuggingFace](https://huggingface.co/zenlm)
- [GitHub](https://github.com/zenlm)
- [Website](https://zenlm.org)
