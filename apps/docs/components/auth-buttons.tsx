'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function AuthButtons() {
  const [user, setUser] = useState<{ email?: string; displayName?: string } | null>(null)

  useEffect(() => {
    try {
      const token = sessionStorage.getItem('hanzo_iam_access_token')
      const userInfo = sessionStorage.getItem('hanzo_iam_user_info')
      if (token && userInfo) {
        setUser(JSON.parse(userInfo))
      }
    } catch {}
  }, [])

  const handleSignOut = () => {
    sessionStorage.removeItem('hanzo_iam_access_token')
    sessionStorage.removeItem('hanzo_iam_refresh_token')
    sessionStorage.removeItem('hanzo_iam_user_info')
    setUser(null)
    window.location.reload()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#a3a3a3] truncate max-w-[120px]">
          {user.email || user.displayName}
        </span>
        <button
          onClick={handleSignOut}
          className="text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
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

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
      >
        Sign In
      </Link>
      <a
        href="https://console.hanzo.ai"
        className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
      >
        Get API Key
      </a>
    </div>
  )
}
