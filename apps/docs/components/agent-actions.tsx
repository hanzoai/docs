'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Check, ChevronDown, Sparkles } from 'lucide-react'

import { AGENT_SETUP_PROMPT } from '@/lib/agent-setup-prompt'

/**
 * One control for "give this page to an agent", in the top bar, on every page.
 *
 * It replaced three: a Copy Markdown button, an Open menu, and a Copy prompt
 * button that existed only on the front page. Three controls for one intention
 * is three things to read before you can act, and two of them were unreachable
 * from the page a reader was actually on.
 *
 * Everything it offers is derived from the PATHNAME, so it works on any page
 * without being handed the page — which is what lets it live in the bar rather
 * than being rebuilt into each route.
 */

const SKILLS = 'https://hanzoskills.com'

function markdownUrlFor(pathname: string) {
  // /docs/a/b -> /llms.mdx/docs/a/b/content.md, the route app/llms.mdx serves.
  const clean = pathname.replace(/\/+$/, '')
  return `/llms.mdx${clean || '/docs'}/content.md`
}

// The setup prompt is written once, in lib/agent-setup-prompt — a second copy
// here would be a second thing to keep true. This only adds where the reader is
// standing and where the skills live.
function promptFor(url: string) {
  return `${AGENT_SETUP_PROMPT}

---

Then read ${url} — that is the page I am on — and help me use it. Skills for every
Hanzo capability are published at ${SKILLS}.`
}

export function AgentActions() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  // Every page can be handed to an agent; only a doc page has a markdown twin.
  // This returned null off /docs, which took the control off the FRONT PAGE —
  // the one page a reader is most likely to hand over.
  const hasMarkdown = pathname.startsWith('/docs')
  const md = markdownUrlFor(pathname)
  const here = typeof window === 'undefined' ? `https://docs.hanzo.ai${pathname}` : window.location.href

  const flash = (what: string) => {
    setDone(what)
    setTimeout(() => setDone(null), 1600)
  }

  const copyMarkdown = async () => {
    const text = await fetch(md).then((r) => r.text())
    await navigator.clipboard.writeText(text)
    flash('markdown')
    setOpen(false)
  }

  // hanzo dev takes the prompt as its argument, so this is the same intention
  // as "open in ChatGPT" for the agent that runs where the code is.
  const copyDev = async () => {
    await navigator.clipboard.writeText(`hanzo dev ${JSON.stringify(promptFor(here))}`)
    flash('dev')
    setOpen(false)
  }

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(promptFor(here))
    flash('prompt')
    setOpen(false)
  }

  const item =
    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm text-fd-popover-foreground transition-colors hover:bg-fd-accent'

  return (
    <div ref={box} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
      >
        {done ? <Check className="size-3.5" /> : <Sparkles className="size-3.5" />}
        <span className="max-sm:hidden">{done ? 'Copied' : 'Use Agent'}</span>
        <ChevronDown className="size-3 opacity-60 max-sm:hidden" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-lg border bg-fd-popover p-1 shadow-lg"
        >
          <button role="menuitem" onClick={copyPrompt} className={item}>
            Copy prompt
          </button>
          {hasMarkdown && (
            <>
              <button role="menuitem" onClick={copyMarkdown} className={item}>
                Copy page as Markdown
              </button>
              <a role="menuitem" href={md} className={item}>
                View as Markdown
              </a>
            </>
          )}
          <div className="my-1 border-t" />
          <a
            role="menuitem"
            target="_blank"
            rel="noreferrer"
            href={`https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q: promptFor(here) })}`}
            className={item}
          >
            Open in ChatGPT
          </a>
          <a
            role="menuitem"
            target="_blank"
            rel="noreferrer"
            href={`https://claude.ai/new?${new URLSearchParams({ q: promptFor(here) })}`}
            className={item}
          >
            Open in Claude
          </a>
          <div className="my-1 border-t" />
          {/* Our own agent, which runs in the reader's terminal against their
              repo — so it takes a command rather than a URL. */}
          <button role="menuitem" onClick={copyDev} className={item}>
            Open in Hanzo Dev
          </button>
          <div className="my-1 border-t" />
          {/* The skill for whatever this page is about, so an agent can pick up
              the capability rather than only this one page's text. */}
          <a role="menuitem" target="_blank" rel="noreferrer" href={SKILLS} className={item}>
            Hanzo Skills →
          </a>
        </div>
      )}
    </div>
  )
}
