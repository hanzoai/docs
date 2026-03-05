'use client'

import { useEffect, useState } from 'react'

const IAM_SERVER = process.env.NEXT_PUBLIC_IAM_SERVER_URL || 'https://hanzo.id'
const CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || 'hanzo-docs-client-id'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = sessionStorage.getItem('hanzo_iam_access_token')
    if (token) {
      window.location.href = '/docs'
      return
    }

    import('@hanzo/iam/browser').then(({ BrowserIamSdk }) => {
      const sdk = new BrowserIamSdk({
        serverUrl: IAM_SERVER,
        clientId: CLIENT_ID,
        redirectUri: `${window.location.origin}/callback`,
      })
      sdk.signinRedirect()
    }).catch(() => {
      setError('Failed to load authentication. Please try again.')
    })
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
