/**
 * Hanzo IAM (OIDC) client for the docs site — the ONE place the SDK is configured.
 *
 * The login page, the callback page and the header buttons all went through their
 * own hand-rolled copy of this, and the copies disagreed with reality in three ways
 * at once: they imported `BrowserIamSdk` (no such export — the class is `IAM`, so
 * `new undefined()` threw and every sign-in fell into "Failed to load
 * authentication"), they defaulted to the client `hanzo-docs-client-id` (IAM answers
 * "the application does not exist" — the registered app is `hanzo-docs`), and they
 * read the session straight out of `sessionStorage`, which is per-tab, so a second
 * tab was always signed out.
 *
 * One module, one config, one token store — the SDK's. It defaults to `localStorage`
 * (@hanzo/iam >= 0.21.6), so the session belongs to the browser rather than to one
 * tab. Nothing here passes `storage`; that decision lives in the SDK, where every
 * Hanzo surface inherits it.
 *
 * `/callback` (not `/auth/callback`) is deliberate here and is the registered URI for
 * this app: it is the docs site's actual route, `app/callback/page.tsx`.
 */
import { IAM } from '@hanzo/iam/browser'

const SERVER_URL = process.env.NEXT_PUBLIC_IAM_SERVER_URL || 'https://hanzo.id'
const CLIENT_ID = process.env.NEXT_PUBLIC_IAM_CLIENT_ID || 'hanzo-docs'

/** Path IAM redirects back to after authorize — this app's own `/callback` route. */
export const CALLBACK_PATH = '/callback'

let sdk: IAM | null = null

/** The browser IAM singleton. Browser-only — the SDK reads Web Storage. */
export function iam(): IAM {
  if (typeof window === 'undefined') throw new Error('IAM SDK is browser-only')
  if (!sdk) {
    sdk = new IAM({
      serverUrl: SERVER_URL,
      clientId: CLIENT_ID,
      redirectUri: `${window.location.origin}${CALLBACK_PATH}`,
      scope: 'openid profile email',
    })
  }
  return sdk
}

/**
 * The signed-in user, or null. Asks the SDK — never a storage key by hand.
 *
 * The header used to read `hanzo_iam_user_info`, a key NO version of the SDK has
 * ever written, and required it alongside the token before rendering a name. So the
 * signed-in state was unreachable even when the token was present. Identity comes
 * from the userinfo endpoint via `getUser()`; there is no second copy to go stale.
 */
export async function currentUser(): Promise<{ email?: string; name?: string } | null> {
  try {
    if (!iam().getAccessToken()) return null
    const u = await iam().getUser()
    return u ? { email: u.email, name: u.name } : null
  } catch {
    return null
  }
}
