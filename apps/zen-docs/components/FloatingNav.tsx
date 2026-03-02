'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ZenEnso } from '@/components/ZenEnso';

const NAV_LINKS = [
  { text: 'Models', href: '/docs/models' },
  { text: 'API', href: '/docs/api' },
  { text: 'Pricing', href: '/docs/api/pricing' },
  { text: 'Training', href: '/docs/training' },
];

export function FloatingNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
      {/* Pill container */}
      <div
        className={`
          border border-white/10 bg-black/80 backdrop-blur-md
          transition-all duration-200
          ${open ? 'rounded-2xl' : 'rounded-full'}
        `}
      >
        {/* Main bar */}
        <div className="flex items-center h-12 px-4 gap-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 mr-2"
            onClick={() => setOpen(false)}
          >
            <ZenEnso size={24} animate={false} />
            <span className="text-sm font-semibold text-white">Zen LM</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Right side: spacer on mobile, login + CTA on desktop */}
          <div className="flex-1 md:flex-none" />

          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://hanzo.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              Login
            </a>
            <a
              href="https://hanzo.chat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-white/90 transition-colors"
            >
              Try Zen
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/5"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2">
              <a
                href="https://hanzo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-2 text-sm text-center text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                Login
              </a>
              <a
                href="https://hanzo.chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 text-sm font-semibold text-center bg-white text-black rounded-full hover:bg-white/90 transition-colors"
                onClick={() => setOpen(false)}
              >
                Try Zen
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
