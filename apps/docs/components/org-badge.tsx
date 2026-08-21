'use client'

import { useEffect, useState } from 'react'

import { currentUser } from '@/lib/iam'

/**
 * The organization the reader is acting in, in the top bar.
 *
 * The bar used to carry the whole auth surface — sign in, get an API key, email,
 * sign out, console — five controls answering two different questions. The
 * account moved to the foot of the sidebar; what stays here is the one fact a
 * reader needs while reading: WHICH tenant these examples and keys belong to,
 * which is the thing that is wrong when a curl from the docs 403s.
 *
 * It renders nothing for a signed-out reader. There is no org to name, and an
 * empty chip is a control that looks broken.
 */
export function OrgBadge() {
  const [org, setOrg] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    currentUser().then((u) => live && setOrg(u?.owner || null))
    return () => {
      live = false
    }
  }, [])

  if (!org) return null

  return (
    <span
      title={`Signed in to ${org}`}
      className="hidden shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs text-fd-muted-foreground md:inline-block"
    >
      {org}
    </span>
  )
}
