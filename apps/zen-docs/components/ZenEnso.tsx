'use client'

import type { CSSProperties } from 'react'

// Geometrically exact circle: r=172, center=(256,256), viewBox=512x512
const R = 172
const CIRC = Math.round(2 * Math.PI * R) // 1081

interface ZenEnsoProps {
  size?: number
  color?: string
  animate?: boolean
  loop?: boolean
  asLoader?: boolean
  className?: string
}

/**
 * ZenEnso — Perfect circle enso logo for Zen LM.
 * Uses SVG <circle> (not a bezier path) so it is geometrically exact.
 */
export function ZenEnso({
  size = 64,
  color = 'white',
  animate = true,
  loop = false,
  asLoader = false,
  className = '',
}: ZenEnsoProps) {
  const uid = Math.random().toString(36).slice(2, 7)
  const dur = loop ? '1.35s' : '1.25s'
  const iter = loop ? 'infinite' : '1'

  const spinStyle: CSSProperties = asLoader
    ? { animation: `zenSpin-${uid} 1.2s linear infinite` }
    : {}

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Zen LM"
      data-v="2"
    >
      <style>{`
        @keyframes zenDraw-${uid} {
          to { stroke-dashoffset: 0; }
        }
        @keyframes zenSpin-${uid} {
          to { transform: rotate(360deg); }
        }
        .zen-circle-${uid} {
          stroke-dasharray: ${CIRC};
          stroke-dashoffset: ${animate ? CIRC : 0};
          animation: ${animate
            ? `zenDraw-${uid} ${dur} cubic-bezier(.2,.9,.25,1) ${iter} forwards`
            : 'none'};
        }
      `}</style>
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        style={spinStyle}
      >
        {/* rotate(-90) starts the draw from 12 o'clock instead of 3 o'clock */}
        <circle
          className={`zen-circle-${uid}`}
          cx="256"
          cy="256"
          r={R}
          stroke={color}
          strokeWidth="26"
          strokeLinecap="round"
          transform="rotate(-90 256 256)"
        />
      </svg>
    </span>
  )
}

export default ZenEnso
