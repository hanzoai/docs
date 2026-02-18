# Hanzo Docs

The documentation framework for Hanzo AI, Lux Network, Zoo Labs Foundation, and Zen LM.

A powerful React.js documentation framework built for the Hanzo ecosystem.

## Features

- **Multi-Brand Support**: Unified framework supporting Hanzo, Lux, Zoo, and Zen documentation
- **Next.js 15+**: Built on the latest Next.js with App Router
- **MDX**: Write documentation in MDX with full component support
- **Search**: Built-in search with Orama and Algolia support
- **TypeScript**: Full TypeScript support with auto-generated API docs
- **OpenAPI**: Generate interactive API documentation from OpenAPI specs
- **i18n**: Internationalization support for multiple languages
- **Themes**: Customizable themes with dark mode support

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
.
├── apps/
│   ├── docs/              # Main documentation site
│   ├── dev-docs/          # Hanzo Dev CLI docs
│   ├── zen-docs/          # Zen LM model docs (zenlm.org)
│   ├── zap-docs/          # ZAP protocol docs
│   └── bot-docs/          # Bot documentation
├── packages/
│   ├── brand/             # Brand configuration (Hanzo, Lux, Zoo)
│   ├── core/              # Core functionality
│   ├── ui/                # UI components
│   ├── mdx/               # MDX processing
│   ├── openapi/           # OpenAPI integration
│   └── ...                # Other packages
└── examples/              # Example implementations
```

## Brand Configuration

Set the brand via environment variable:

```bash
# .env.local
NEXT_PUBLIC_BRAND=hanzo  # or 'lux', 'zoo', or 'zen'
```

### Available Brands

| Brand | Organization | Documentation |
|-------|-------------|---------------|
| `hanzo` | Hanzo AI Inc | [hanzoai.github.io/docs](https://hanzoai.github.io/docs) |
| `lux` | Lux Network | [docs.lux.network](https://docs.lux.network) |
| `zoo` | Zoo Labs Foundation | [docs.zoo.ngo](https://docs.zoo.ngo) |
| `zen` | Zen LM | [zenlm.org](https://zenlm.org) |

## Development

### Prerequisites

- Node.js 18.17+
- pnpm 10+

### Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode
pnpm dev:all          # Start docs app only
pnpm dev:examples     # Start example apps

# Build
pnpm build            # Build all packages
pnpm clean            # Clean build artifacts

# Quality
pnpm lint             # Run ESLint
pnpm lint:prettier    # Check formatting
pnpm prettier         # Fix formatting
pnpm test             # Run tests
pnpm types:check      # Type check
```

## Documentation Sites

### Hanzo Docs (hanzoai.github.io/docs)

Documentation for Hanzo AI infrastructure including:
- LLM Gateway
- Agent SDK
- MCP Tools
- Chat Platform
- Python/JS SDKs

### Lux Docs (docs.lux.network)

Documentation for Lux Network including:
- Architecture & Consensus
- Node Operation
- SDK & CLI
- Smart Contracts
- Post-Quantum Security

### Zoo Docs (docs.zoo.ngo)

Documentation for Zoo Labs Foundation including:
- DSO Protocol
- Proof of AI (PoAI)
- Zen Model Family
- Gym SDK
- Training Infrastructure

## Forking for New Brands

1. Clone this repository
2. Create brand config in `packages/brand/src/brands/`
3. Add CSS in `packages/brand/css/`
4. Update the brands registry
5. Set `NEXT_PUBLIC_BRAND` environment variable

## Contributing

Please read the [Contributing Guide](/.github/contributing.md) before submitting a pull request.

## License

MIT © Hanzo AI Inc

---

Built with Hanzo Docs
