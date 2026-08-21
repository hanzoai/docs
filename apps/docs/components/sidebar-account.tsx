'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronsUpDown } from 'lucide-react'

import { currentUser, iam, type DocsUser } from '@/lib/iam'

/**
 * Who you are, at the foot of the sidebar.
 *
 * These controls used to sit in the top bar, competing for a fixed 56px row
 * with the logo, six section links and the search trigger — and "Get API Key"
 * is the widest label on the page, so it was the thing that broke first: at
 * 768-805px it reflowed to three lines and spilled above and below the bar.
 *
 * The foot of the sidebar has the opposite properties. It is a column, so a
 * label that grows takes a row rather than overflowing a bar; it is stable
 * across pages; and it is where a reader already looks for "who am I" because
 * that is where every console puts it.
 */
export function SidebarAccount() {
  const [user, setUser] = useState<DocsUser | null>(null)

  useEffect(() => {
    let live = true
    currentUser().then((u) => live && setUser(u))
    return () => {
      live = false
    }
  }, [])

  // Signed-out is the state this renders until IAM says otherwise, rather than
  // nothing-until-resolved. A rail that renders nothing while a promise is in
  // flight is a rail with a hole in it if that promise never settles, and this
  // one is asked on every page of the site.
  return user ? <Account user={user} onSignOut={() => setUser(null)} /> : <SignedOut />
}

function SignedOut() {
  return (
    <div className="flex flex-col gap-2">
      <a
        href="https://console.hanzo.ai"
        className="rounded-lg bg-fd-primary px-3 py-1.5 text-center text-sm font-medium text-fd-primary-foreground transition-colors hover:opacity-90"
      >
        Get an API key
      </a>
      <Link
        href="/login"
        className="rounded-lg px-3 py-1.5 text-center text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        Sign in
      </Link>
    </div>
  )
}

function Account({ user, onSignOut }: { user: DocsUser; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const label = user.name || user.email || 'Account'

  // Dismiss on an outside click and on Escape. A menu that can only be closed
  // by the control that opened it traps a keyboard reader.
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

  const signOut = () => {
    // The SDK owns the token store and clears every key it wrote, including the
    // ones this component never knew about. Picking keys off by hand is how
    // `hanzo_iam_id_token` used to survive a sign-out.
    iam()
      .logout()
      .catch(() => iam().clearTokens())
      .finally(() => {
        onSignOut()
        window.location.reload()
      })
  }

  return (
    <div ref={box} className="relative">
      {open && (
        <div
          role="menu"
          className="absolute bottom-full mb-1 w-full overflow-hidden rounded-lg border bg-fd-popover p-1 shadow-lg"
        >
          <a
            role="menuitem"
            href="https://console.hanzo.ai"
            className="block rounded-md px-2 py-1.5 text-sm text-fd-popover-foreground transition-colors hover:bg-fd-accent"
          >
            Console
          </a>
          <a
            role="menuitem"
            href="https://console.hanzo.ai/settings"
            className="block rounded-md px-2 py-1.5 text-sm text-fd-popover-foreground transition-colors hover:bg-fd-accent"
          >
            Account settings
          </a>
          <button
            role="menuitem"
            onClick={signOut}
            className="block w-full rounded-md px-2 py-1.5 text-start text-sm text-fd-popover-foreground transition-colors hover:bg-fd-accent"
          >
            Sign out
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-fd-accent"
      >
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center rounded-full bg-fd-primary text-[0.6875rem] font-medium text-fd-primary-foreground"
        >
          {label.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-fd-foreground">{label}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-fd-muted-foreground" />
      </button>
    </div>
  )
}
