'use client'

import { useEffect, useState } from 'react'

const IAM_SERVER = process.env.NEXT_PUBLIC_IAM_SERVER_URL || 'https://hanzo.id'
const CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || 'hanzo-docs-client-id'

export default function CallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    import('@hanzo/iam/browser').then(({ BrowserIamSdk }) => {
      const sdk = new BrowserIamSdk({
        serverUrl: IAM_SERVER,
        clientId: CLIENT_ID,
        redirectUri: `${window.location.origin}/callback`,
      })
      sdk.handleCallback(window.location.href)
        .then(() => {
          window.location.href = '/docs'
        })
        .catch(() => {
          setError('Authentication failed. Please try again.')
        })
    }).catch(() => {
      setError('Failed to load authentication. Please try again.')
    })
  }, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-semibold text-white">Sign In Failed</h2>
          <p className="mb-4 text-sm text-neutral-400">{error}</p>
          <a
            href="/login"
            className="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="text-sm text-neutral-400">Signing in...</p>
      </div>
    </div>
  )
}
