import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// ─── Arrow cursor SVG ────────────────────────────────────────────────────────
function CursorIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 1.5L2 19.5L6.8 14.4L10 22L13 20.5L9.8 13L18 13L2 1.5Z"
        fill="rgba(26,26,28,0.88)"
        stroke="#787878"
        strokeWidth="1.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Three animated typing dots ──────────────────────────────────────────────
function TypingDots({ active }: { active: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {([0, 0.22, 0.44] as const).map((delay, i) => (
        <motion.div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
          }}
          animate={
            active
              ? {
                  backgroundColor: '#00cc55',
                  scale: [0.75, 1.2, 0.75],
                  opacity: [0.65, 1, 0.65],
                }
              : {
                  backgroundColor: '#555558',
                  scale: [0.88, 1.02, 0.88],
                  opacity: [0.42, 0.62, 0.42],
                }
          }
          transition={{
            duration: 1.15,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Agent config ─────────────────────────────────────────────────────────────
// x = left edge of bubble within the 556px canvas
// Cursors sit ~(cursorSize + 18)px to the left of each bubble
const AGENTS = [
  { bubbleW: 176, bubbleH: 46, cursorSize: 30, x: 298 }, // large  – right side
  { bubbleW: 148, bubbleH: 40, cursorSize: 24, x: 148 }, // medium – left side
  { bubbleW: 108, bubbleH: 34, cursorSize: 18, x: 248 }, // small  – center
]

// Scroll geometry (canvas height = 598px)
const SCROLL_DURATION_S = 12
const FROM_Y = 635  // start below canvas
const TO_Y = -140   // end above canvas

const ACTIVE_DURATION_MS = 4000

// ─── Main component ───────────────────────────────────────────────────────────
export default function App() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % AGENTS.length),
      ACTIVE_DURATION_MS,
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="canvas">
      <div className="dot-grid" />

      {AGENTS.map((agent, i) => {
        // Stagger: agent i starts as if (i * 4)s have already elapsed
        const delayS = -((i * SCROLL_DURATION_S) / AGENTS.length)
        const isActive = activeIdx === i

        return (
          <div
            key={i}
            className="agent-track"
            style={{
              left: agent.x,
              animationDelay: `${delayS}s`,
              // Width is just the bubble; cursor overflows to the left via absolute
              width: agent.bubbleW,
            }}
          >
            {/* Cursor – positioned left of the bubble */}
            <div
              style={{
                position: 'absolute',
                left: -(agent.cursorSize + 18),
                top: (agent.bubbleH - Math.round(agent.cursorSize * 1.2)) / 2,
                pointerEvents: 'none',
              }}
            >
              <CursorIcon size={agent.cursorSize} />
            </div>

            {/* Typing bubble */}
            <motion.div
              style={{
                width: agent.bubbleW,
                height: agent.bubbleH,
                borderRadius: agent.bubbleH / 2,
                border: '1.5px solid',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              animate={{
                borderColor: isActive ? '#00cc55' : '#393939',
                backgroundColor: isActive
                  ? 'rgba(0, 204, 85, 0.055)'
                  : '#252528',
                boxShadow: isActive
                  ? '0 0 0 1px rgba(0,204,85,0.13), 0 0 22px rgba(0,204,85,0.38)'
                  : '0 0 0px rgba(0,204,85,0)',
              }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <TypingDots active={isActive} />
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
