'use client';

import { HanzoFooter } from '@hanzogui/shell';

/**
 * The shared 6-column ecosystem footer, byte-identical across every Hanzo
 * property, so a reader crossing from one docs site to another lands on the
 * same chrome.
 */
export function Footer() {
  return <HanzoFooter />;
}
