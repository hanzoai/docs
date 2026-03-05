'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const IAM_SERVER = process.env.NEXT_PUBLIC_IAM_SERVER_URL || 'https://hanzo.id'
const CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || 'hanzo-docs-client-id'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('hanzo_iam_access_token')
    if (token) {
      router.replace('/docs')
      return
    }

    // Auto-redirect to IAM login
    import('@hanzo/iam/browser').then(({ BrowserIamSdk }) => {
      const sdk = new BrowserIamSdk({
        serverUrl: IAM_SERVER,
        clientId: CLIENT_ID,
        redirectUri: `${window.location.origin}/callback`,
      })
      sdk.signinRedirect()
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="text-sm text-neutral-400">Redirecting to sign in...</p>
      </div>
    </div>
  )
}
