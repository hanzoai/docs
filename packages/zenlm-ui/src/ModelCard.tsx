'use client'

import { MessageSquare, Github, FileText, ExternalLink } from 'lucide-react'
import type { ZenModelLike } from './types'

/** HuggingFace logo SVG — uses currentColor for theming. */
function HuggingFaceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 95 88"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M47.21 76.7c14.46 0 26.18-11.72 26.18-26.18 0-14.45-11.72-26.17-26.18-26.17S21.04 36.07 21.04 50.52 32.76 76.7 47.21 76.7zm0-46.65c11.34 0 20.51 9.17 20.51 20.51 0 11.34-9.17 20.51-20.51 20.51S26.7 61.9 26.7 50.56s9.17-20.51 20.51-20.51z M31.66 49.8c1.83 0 3.32-1.49 3.32-3.32s-1.49-3.32-3.32-3.32-3.32 1.49-3.32 3.32 1.48 3.32 3.32 3.32zm31.59 0c1.83 0 3.32-1.49 3.32-3.32s-1.49-3.32-3.32-3.32-3.32 1.49-3.32 3.32 1.49 3.32 3.32 3.32zM38.39 58c-2.95 4.39 2.06 9.4 6.49 9.43h.13c4.43-.03 9.46-5.05 6.49-9.43-1.06-1.55-3.71-2.36-6.55-2.36-2.84 0-5.48.81-6.56 2.36zM85.78 56.91c.46-2.65.84-5.21.84-5.21s.84.86 1.45 1.71c1.94 2.71 1.86 6.62-1.34 8.71-.36.24-.7.42-.95.48zM7.4 56.91c-.46-2.65-.84-5.21-.84-5.21s-.84.86-1.45 1.71c-1.94 2.71-1.86 6.62 1.34 8.71.36.24.7.42.95.48z"
      />
    </svg>
  )
}

function fmtCtx(ctx: number | undefined): string {
  if (!ctx) return ''
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(ctx % 1_000_000 === 0 ? 0 : 1)}M ctx`
  if (ctx >= 1000) return `${Math.round(ctx / 1000)}K ctx`
  return `${ctx} ctx`
}

function statusInfo(status: string): {
  label: string
  className: string
} | null {
  switch (status) {
    case 'preview':
      return {
        label: 'PREVIEW',
        className: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      }
    case 'coming-soon':
      return {
        label: 'SOON',
        className: 'bg-muted text-muted-foreground',
      }
    case 'contact-sales':
      return {
        label: 'EARLY ACCESS',
        className: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      }
    default:
      return null
  }
}

function isFeaturedModel(id: string, featuredIds?: string[]): boolean {
  if (featuredIds) return featuredIds.includes(id)
  return ['zen4-max', 'zen-max', 'zen5', 'zen4'].includes(id)
}

export interface ModelCardProps {
  model: ZenModelLike
  /**
   * Called when the card is clicked.
   * If not provided, card is not clickable (no cursor-pointer).
   */
  onNavigate?: (id: string) => void
  /** URL prefix for model detail pages. Default: /docs/models/ */
  linkPrefix?: string
  /** Base URL for the "Chat" button. Default: https://hanzo.chat */
  chatBaseUrl?: string
  /** URL for "Request Access" (contact-sales models). Default: https://hanzo.ai/contact */
  requestAccessUrl?: string
  /** Model IDs to highlight as featured. Default: zen4-max, zen-max, zen5, zen4 */
  featuredIds?: string[]
}

/**
 * ModelCard — Rich model card with status badges, spec, and action buttons.
 *
 * Works in any Next.js / React app. Pass `onNavigate` to enable whole-card click.
 */
export function ModelCard({
  model,
  onNavigate,
  linkPrefix = '/docs/models/',
  chatBaseUrl = 'https://hanzo.chat',
  requestAccessUrl = 'https://hanzo.ai/contact',
  featuredIds,
}: ModelCardProps) {
  const status = model.status
  const featured = isFeaturedModel(model.id, featuredIds)
  const badge = statusInfo(status)

  const specParts = [
    model.spec.params && model.spec.params !== 'N/A' && model.spec.params !== 'TBA' && model.spec.params !== 'TBD'
      ? model.spec.params
      : null,
    model.spec.activeParams ? `(${model.spec.activeParams} active)` : null,
    model.spec.arch ?? null,
  ].filter(Boolean)

  const specStr = specParts.join(' ')
  const ctxStr = fmtCtx(model.spec.context)
  const fullSpec = [specStr, ctxStr].filter(Boolean).join(' · ')

  const cardBg =
    featured
      ? 'border-primary/30 bg-primary/5'
      : status === 'coming-soon'
        ? 'border-border bg-muted/30 opacity-75'
        : status === 'contact-sales'
          ? 'border-purple-500/20 bg-purple-500/5'
          : 'border-border bg-background'

  const isClickable = !!onNavigate
  const handleClick = () => onNavigate?.(model.id)
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') handleClick()
  }

  return (
    <div
      role={isClickable ? 'link' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKey : undefined}
      className={`rounded-lg border p-4 transition hover:border-primary/40 ${cardBg} ${isClickable ? 'cursor-pointer' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm">{model.id}</span>
        {badge && (
          <span className={`text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Spec */}
      {fullSpec && (
        <div className="text-xs font-mono text-muted-foreground mb-2">{fullSpec}</div>
      )}

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3">{model.description}</p>

      {/* Action buttons — Chat is the primary text CTA; HF + GitHub are
          icon-only buttons with generous tap targets (h-8 w-8 / 32x32px).
          Always visible so they don't depend on hover state. */}
      <div className="flex items-center gap-2 mt-auto">
        {status === 'contact-sales' && (
          <a
            href={requestAccessUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation() }}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 h-8 rounded-md hover:bg-purple-500/30 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Request access
          </a>
        )}
        {(status === 'available' || status === 'preview' || status === 'cloud-only') && (
          <a
            href={`${chatBaseUrl}?model=${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { e.stopPropagation() }}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 h-8 rounded-md hover:opacity-90 transition"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chat
          </a>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {model.huggingface && (
            <a
              href={model.huggingface}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation() }}
              aria-label={`Download ${model.id} weights on HuggingFace`}
              title="HuggingFace weights"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5 transition"
            >
              <HuggingFaceIcon className="h-4 w-4" />
            </a>
          )}
          {model.github && (
            <a
              href={model.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation() }}
              aria-label={`${model.id} source code on GitHub`}
              title="GitHub source"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5 transition"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {model.paper && (
            <a
              href={model.paper}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation() }}
              aria-label={`${model.id} paper`}
              title="Paper"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5 transition"
            >
              <FileText className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModelCard
