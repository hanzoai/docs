# hanzo-docs — turborepo (turbo.json + pnpm-workspace.yaml). Every target CALLS
# a root package.json script, which is where the fan-out across the workspace
# already lives; make adds no second orchestrator.

PNPM ?= pnpm

.PHONY: help build dev test lint clean

help: ## Show this help.
	@awk 'BEGIN{FS=":.*##";printf "\nUsage: make <target>\n\nTargets:\n"} /^[a-zA-Z_-]+:.*##/{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: node_modules ## Build every package and app (turbo run build).
	$(PNPM) build

dev: node_modules ## Run the dev servers (turbo run dev).
	$(PNPM) dev

test: node_modules ## Run the vitest suite.
	$(PNPM) test

lint: node_modules ## Lint every package (turbo run lint).
	$(PNPM) lint

# The repo already HAS a clean — per-package `rimraf dist` / `rimraf .next out`,
# fanned out by turbo — so this calls it instead of carrying a second idea of
# what this repo generates. Which matters more than DRY usually does here:
# packages/{openapi,obsidian} keep TRACKED fixtures under test/out/, and a
# hand-rolled `find -name out` would eat them. Those two packages clean `dist`
# and nothing else, so the tracked files were never in reach.
clean: node_modules ## Remove build output (turbo run clean). Keeps node_modules.
	$(PNPM) clean

node_modules: ## Install deps (pnpm install --frozen-lockfile).
	$(PNPM) install --frozen-lockfile
