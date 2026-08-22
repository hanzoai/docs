'use client';

import { Dots } from '@hanzo/ui/dots';

/**
 * The hero's halftone, as a client island.
 *
 * `Dots` takes its shape as `field`, a function of space and time — and a
 * function cannot cross the server/client boundary. The landing page is a
 * Server Component, so passing one there fails the build outright:
 *
 *   Functions cannot be passed directly to Client Components unless you
 *   explicitly expose it by marking it with "use server".
 *
 * So the function has to be DEFINED on the client side of the line, which is
 * what this file is. It is the whole reason the component exists.
 *
 * Module scope, not an inline arrow: `field` is a dependency of the effect that
 * paints, so a new identity every render would re-raster the canvas every
 * render.
 */
const HERO = (x: number, y: number) => {
  // The shape the CSS `radial-gradient(ellipse 600px 300px at 50% 0%, …)` had:
  // brightest at top centre, gone by the edges. `Dots`'s own default is SWELL,
  // a DIAGONAL wave — ambient texture for a left-aligned surface, but under a
  // centred headline it reads as a smudge off to one side.
  const r = Math.hypot((x - 0.5) / 0.45, y / 0.5);
  return Math.max(0, 1 - r) ** 1.5;
};

/**
 * Decorative: hidden from assistive tech, and it cannot take a pointer.
 *
 * `animate` is off because this replaces a static gradient, and a full-hero
 * canvas repainting every frame is a real battery cost on a page whose job is
 * to be read. Note that off is only correct WITH a field — frozen at t=0, SWELL
 * is very nearly empty.
 */
export function HeroField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Dots
        field={HERO}
        animate={false}
        cell={7}
        color="rgb(255 255 255 / 0.18)"
        fade={{ top: 0.06, bottom: 0.45, left: 0.1, right: 0.1 }}
      />
    </div>
  );
}
