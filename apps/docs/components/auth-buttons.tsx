'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { currentUser, iam } from '@/lib/iam'

export function AuthButtons() {
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)

  useEffect(() => {
    let live = true
    currentUser().then((u) => {
      if (live) setUser(u)
    })
    return () => {
      live = false
    }
  }, [])

  const handleSignOut = () => {
    // The SDK owns the token store and clears every key it wrote — including the
    // ones this component never knew about. Picking keys off by hand is how
    // `hanzo_iam_id_token` and `hanzo_iam_expires_at` used to survive a sign-out.
    iam()
      .logout()
      .catch(() => iam().clearTokens())
      .finally(() => {
        setUser(null)
        window.location.reload()
      })
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-400 truncate max-w-[120px]">
          {user.email || user.name}
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-neutral-400 hover:text-neutral-50 transition-colors"
        >
          Sign Out
        </button>
        <a
          href="https://console.hanzo.ai"
          className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
        >
          Console
        </a>
      </div>
    )
  }

  // whitespace-nowrap + shrink-0: these are LABELS, not prose. The docs header is a
  // fixed 56px row, and from 768 the sidebar claims 268px of the width — so with
  // wrapping allowed "Get API Key" broke to three lines (72px) and spilled out of the
  // bar, above and below it, in the 768-805 band. A two-word button that reflows is
  // never what was wanted at any width; the row should overflow-scroll or the label
  // should shorten, but the one thing it must not do is grow taller than the bar it
  // sits in.
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Link
        href="/login"
        className="whitespace-nowrap text-sm text-neutral-400 hover:text-neutral-50 transition-colors"
      >
        Sign In
      </Link>
      <a
        href="https://console.hanzo.ai"
        className="whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
      >
        Get API Key
      </a>
    </div>
  )
}
