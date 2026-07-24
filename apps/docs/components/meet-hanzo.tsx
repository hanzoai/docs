'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MeetHanzoMenu } from '@hanzogui/shell';

/**
 * The one shared "Meet Hanzo" affordance — a nav trigger that opens the
 * universal <MeetHanzoMenu> (the ecosystem mega-menu driven by HANZO_FLAGSHIP +
 * MEET_HANZO_GROUPS). Replaces the bespoke try-hanzo-dropdown so docs discovers
 * the whole ecosystem the same way every other Hanzo property does.
 *
 * `anchor` (56px) matches the Fumadocs nav row height so the panel drops
 * flush beneath the header.
 */
export function MeetHanzo() {
  const [open, setOpen] = useState(false);
  const panelId = 'meet-hanzo-menu';

  return (
    <>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
      >
        Meet Hanzo
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <MeetHanzoMenu
        id={panelId}
        open={open}
        onClose={() => setOpen(false)}
        anchor={56}
      />
    </>
  );
}
