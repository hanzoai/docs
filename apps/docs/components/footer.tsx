'use client';

import { HanzoFooter } from '@hanzogui/shell';

/**
 * The shared 6-column ecosystem footer (HANZO_FOOTER_COLUMNS + bottom legal
 * bar), byte-identical across every Hanzo property. Docs is hanzo.ai-adjacent
 * and is not itself a flagship product, so `currentProductId` stays unset.
 */
export function Footer() {
  return <HanzoFooter />;
}
