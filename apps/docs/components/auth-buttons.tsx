import Link from 'next/link';

export function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <a
        href="https://hanzo.id/login?redirect_uri=https://console.hanzo.ai"
        className="text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
      >
        Sign In
      </a>
      <a
        href="https://console.hanzo.ai"
        className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-neutral-200 transition-colors"
      >
        Get API Key
      </a>
    </div>
  );
}
