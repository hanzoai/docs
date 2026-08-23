'use client';

import { useEffect, useState } from 'react';
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

/**
 * The ENVELOPE: brightest at top centre, gone by the edges — the shape the CSS
 * `radial-gradient(ellipse 600px 300px at 50% 0%, …)` had. `Dots`'s own default
 * is SWELL, a DIAGONAL wave, which is ambient texture for a left-aligned surface
 * but reads as a smudge off to one side under a centred headline.
 *
 * Separated from the motion below because it is the half that must not move: it
 * is what keeps the field dim where the type sits.
 */
const envelope = (x: number, y: number) => {
  const r = Math.hypot((x - 0.5) / 0.45, y / 0.5);
  return Math.max(0, 1 - r) ** 1.5;
};

/**
 * One slow ring travelling outward from the same origin the envelope falls off
 * from — so the field reads as emanating from behind the headline rather than
 * drifting past it. A diagonal or a scroll would have a DIRECTION, and a
 * direction under centred type points somewhere the page does not go.
 *
 * The three constants are the whole character and each is bounded on purpose:
 *
 *   0.20  the amplitude, so the wave rides between 0.60 and 1.00 of the envelope
 *         — a 40% swing peak to trough. It MODULATES and never extinguishes: the
 *         shape is always the shape, and at its brightest it is exactly the
 *         static field this replaced. Measured across the field over a full
 *         period, the ratio to the envelope stays within [0.600, 1.000] and the
 *         value never leaves [0, 1]. Deeper and the dots visibly switch on and
 *         off, which reads as a loading state rather than as atmosphere.
 *   6.5   the ring count, about two visible across the field. More becomes a
 *         moiré against the 7px cell pitch, which shimmers rather than breathes.
 *   0.5   the speed: one ring every 12.6s. Slow enough that nothing in peripheral
 *         vision demands attention while a reader is reading.
 *
 * Where the headline sits the field peaks at 0.35 of full ink across the whole
 * cycle, so the motion never competes with the type it sits behind.
 */
const HERO = (x: number, y: number, t: number) =>
  envelope(x, y) * (0.8 + 0.2 * Math.cos(Math.hypot((x - 0.5) / 0.45, y / 0.5) * 6.5 - t * 0.5));

/**
 * Whether this reader has asked for less motion. Read once on mount and watched
 * after: the setting is changed while a page is open often enough — a system
 * theme flip carries it — that a value sampled once goes stale in place.
 *
 * It starts TRUE so the first paint is the still field. The alternative starts
 * animating and stops, which is the one outcome the setting exists to prevent.
 */
function useStill() {
  const [still, setStill] = useState(true);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setStill(q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);
  return still;
}

/**
 * Decorative: hidden from assistive tech, and it cannot take a pointer.
 *
 * It ANIMATES now. It did not, on the argument that a full-hero canvas
 * repainting every frame is a real battery cost on a page whose job is to be
 * read — which is true, and is why the motion is a 12-second breath at a fifth
 * of the envelope's depth rather than anything a reader has to look away from.
 * Frozen, the field was a gradient drawn out of dots; moving, the dots are the
 * reason it is dots.
 *
 * Reduced motion still gets the still field, and gets it on the FIRST paint —
 * which is also what a reader sees if JavaScript never runs.
 */
export function HeroField() {
  const still = useStill();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Dots
        field={HERO}
        animate={!still}
        cell={7}
        color="rgb(255 255 255 / 0.18)"
        fade={{ top: 0.06, bottom: 0.45, left: 0.1, right: 0.1 }}
      />
    </div>
  );
}
