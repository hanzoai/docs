# Pulsar Documentation

Documentation site for [Pulsar](https://github.com/luxfi/pulsar) — threshold ML-DSA-65, the NIST MPTC submission package by Lux Industries.

Built with [Hanzo Docs](https://docs.hanzo.ai).

## Development

```bash
pnpm install
pnpm --filter=pulsar-docs dev    # http://localhost:3008
pnpm --filter=pulsar-docs build  # static export to ./out
```

## Structure

```
apps/pulsar-docs/
├── app/                    Next.js app directory
│   ├── (home)/             Landing page
│   └── docs/               Documentation pages
├── content/docs/           MDX content
│   ├── index.mdx
│   ├── getting-started.mdx
│   ├── protocol/           2-round threshold, FIPS 204, DKG, parameters
│   ├── proofs/             EasyCrypt, Lean bridge, axiom inventory, extraction
│   ├── reference/          API, KAT, interop
│   ├── security.mdx
│   ├── nist-mptc.mdx
│   ├── postmortem.mdx
│   └── changelog.mdx
├── lib/                    Utilities
└── source.config.ts        MDX configuration (KaTeX wired)
```

## Source of truth

Content is authored from `~/work/lux/pulsar/main` (README, EasyCrypt README, Lean ↔ EC bridge, byte-walk roadmaps, BLOCKERS, CHANGELOG, SUBMISSION, SECURITY). Math is rendered with KaTeX.

## Links

- [GitHub: luxfi/pulsar](https://github.com/luxfi/pulsar)
- [Spec PDF](https://github.com/luxfi/pulsar/blob/main/spec/pulsar.pdf)
- [luxfi/corona — R-LWE sibling](https://github.com/luxfi/corona)
