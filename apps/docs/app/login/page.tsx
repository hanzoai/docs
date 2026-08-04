'use client'

import { useEffect, useState } from 'react'

import { iam } from '@/lib/iam'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Already signed in — including in ANOTHER tab, now that the session is not
    // scoped to this one.
    if (iam().getAccessToken()) {
      window.location.href = '/docs'
      return
    }
    iam()
      .signinRedirect()
      .catch(() => setError('Failed to load authentication. Please try again.'))
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-semibold text-white">Sign In Error</h2>
          <p className="mb-4 text-sm text-neutral-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="text-sm text-neutral-400">Redirecting to sign in...</p>
      </div>
    </div>
  )
}
