import Link from 'next/link';

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://hanzo.id/login?redirect_uri=https://console.hanzo.ai"
        className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
      >
        Sign In
      </a>
      <a
        href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai"
        className="rounded-lg bg-[#fd4444] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#fd4444]/90 transition-colors"
      >
        Sign Up
      </a>
    </div>
  );
}
