# Zen LM Documentation

Documentation site for [Zen LM](https://zenlm.org) - frontier AI models for code, reasoning, and multimodal understanding.

Built with [Hanzo Docs](https://docs.hanzo.ai).

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

- **zen4-max** - 1.04T MoE, 256K context
- **zen4** - ~400B Dense flagship
- **zen4-coder** - 480B MoE code specialist
- **zen4-coder-flash** - Fast code generation
- **zen3-omni** - ~200B multimodal
- **zen3-nano** - 4B edge deployment

## Links

- [HuggingFace](https://huggingface.co/zenlm)
- [GitHub](https://github.com/zenlm)
- [Website](https://zenlm.org)
