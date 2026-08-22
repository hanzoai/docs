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
// Who is signed in, asked once and answered the same way wherever it is asked.
// Two components render this — the rail and the top bar — and a second copy of
// the question is how they come to show different people on one screen.
function useDocsUser() {
  const [user, setUser] = useState<DocsUser | null>(null)

  useEffect(() => {
    let live = true
    currentUser().then((u) => live && setUser(u))
    return () => {
      live = false
    }
  }, [])

  return [user, setUser] as const
}

export function SidebarAccount() {
  const [user, setUser] = useDocsUser()

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

/**
 * The same control, in the top bar, for the two states where the rail is not
 * showing it: a collapsed rail on desktop, and mobile, where the rail is a
 * drawer behind a button. Without it "Get an API key" simply vanishes on the
 * front page and on every phone.
 *
 * It is deliberately the SHORT label. The bar is a fixed 56px row and the full
 * phrase is the widest thing on the page — it is what reflowed to three lines
 * and spilled out of the bar between 768 and 805px, which is why the long form
 * lives in a column and this one does not.
 */
export function NavAccount() {
  const [user] = useDocsUser()

  if (user)
    return (
      <a
        href="https://console.hanzo.ai"
        title={user.name || user.email || 'Account'}
        className="grid size-7 place-items-center rounded-full bg-fd-primary text-xs font-medium text-fd-primary-foreground"
      >
        {(user.name || user.email || 'A').slice(0, 1).toUpperCase()}
      </a>
    )

  return (
    <a
      href="https://console.hanzo.ai"
      className="rounded-lg bg-fd-primary px-2.5 py-1.5 text-sm font-medium text-fd-primary-foreground whitespace-nowrap transition-colors hover:opacity-90"
    >
      API key
    </a>
  )
}
