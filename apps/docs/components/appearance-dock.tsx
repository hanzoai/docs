'use client';

/**
 * Help and appearance, from a small mark in the bottom-right corner of every
 * page — the same control hanzo.ai carries, so a reader who crosses from the
 * site to the docs finds the theme where they left it.
 *
 * Theme is the one preference this file owns. RootProvider already runs
 * next-themes for the document, so this reads and writes that provider rather
 * than keeping a second answer to which theme is in effect; the rail's own
 * toggle is switched off in the docs layout so there is one control, here.
 *
 * Closed it is a 28px mark. Nothing inside is mounted until it is asked for.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { HanzoMark } from '@hanzogui/shell';

/** Where a reader goes when the page is not enough. Real destinations only. */
const HELP = [
  { label: 'Get help', href: '/docs/support' },
  { label: 'Console', href: 'https://console.hanzo.ai' },
  { label: 'Contact us', href: 'https://hanzo.ai/contact' },
];

const THEMES = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="help-section">
      <h2 className="help-title">{title}</h2>
      {children}
    </section>
  );
}

export function AppearanceDock() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  // next-themes resolves on the client, so the selected option is unknown on the
  // server. Rendering one as selected anyway hydrates wrong; waiting one paint
  // costs nothing on a control nobody has opened.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Close on outside press and on Escape — a panel that traps you is worse
  // than no panel.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  return (
    <div ref={box} className="help-dock">
      {open && (
        <div className="help-panel" role="dialog" aria-label="Help and appearance">
          <div className="help-head">
            <h2 className="help-title">Help</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="help-close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="help-links">
            {HELP.map((l) => {
              const away = l.href.startsWith('http');
              return (
                <a
                  key={l.label}
                  href={l.href}
                  {...(away ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="help-link"
                >
                  {l.label}
                  {away ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M7 17L17 7M8 7h9v9" />
                    </svg>
                  ) : null}
                </a>
              );
            })}
          </nav>

          <Section title="Appearance">
            <div className="help-row">
              <span>Theme</span>
              <div className="help-track">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={ready ? theme === t.value : undefined}
                    data-on={ready && theme === t.value ? '' : undefined}
                    onClick={() => setTheme(t.value)}
                    className="help-choice"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Help and appearance"
        className="help-button"
      >
        <HanzoMark size={14} />
      </button>
    </div>
  );
}
