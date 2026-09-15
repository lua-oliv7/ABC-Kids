import React from "react"
import {
  AccessoryId,
  AnimalType,
  Character,
  FaceId,
  HatId,
  PALETTE,
} from "../lib/store"

/* ============================================================= *
 *  Decorative bits
 * ============================================================= */
export function Star({
  size = 24,
  color = PALETTE.yellow,
  className = "",
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path
        d="M12 1.6l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 8.5l6.6-.9z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Sparkle({
  size = 16,
  color = "#fff",
  className = "",
  style,
}: {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}>
      <path
        d="M12 2c.6 4.8 2.6 6.8 8 8-5.4 1.2-7.4 3.2-8 8-.6-4.8-2.6-6.8-8-8 5.4-1.2 7.4-3.2 8-8z"
        fill={color}
      />
    </svg>
  )
}

function Cloud({ x, y, s = 1, opacity = 1 }: { x: number; y: number; s?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <ellipse cx="0" cy="0" rx="34" ry="20" fill="#fff" />
      <ellipse cx="-26" cy="6" rx="20" ry="14" fill="#fff" />
      <ellipse cx="26" cy="6" rx="22" ry="15" fill="#fff" />
    </g>
  )
}

/** Full-bleed sunny sky background used across screens. */
export function SkyBackground({
  variant = "day",
  children,
}: {
  variant?: "day" | "night"
  children?: React.ReactNode
}) {
  const night = variant === "night"
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: night
            ? "linear-gradient(180deg,#2b3d63 0%,#3a4f7a 55%,#4a5f8a 100%)"
            : "linear-gradient(180deg,#8FD8F4 0%,#B8E8FA 60%,#DFF4FC 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        {night ? (
          <>
            {Array.from({ length: 26 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 73) % 400}
                cy={(i * 129) % 640}
                r={i % 3 === 0 ? 2.4 : 1.4}
                fill="#FFF6D6"
                opacity={0.8}
              />
            ))}
          </>
        ) : (
          <>
            <Cloud x={70} y={110} s={1} opacity={0.95} />
            <Cloud x={320} y={180} s={0.8} opacity={0.9} />
            <Cloud x={120} y={300} s={0.6} opacity={0.7} />
            {[
              [40, 70],
              [360, 90],
              [200, 60],
              [300, 260],
            ].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx} ${cy})`}>
                <path
                  d="M0 -8l2.4 5 5.4.7-4 3.8 1 5.4L0 9.4 -4.8 12l1-5.4-4-3.8 5.4-.7z"
                  fill="#FFD85A"
                  opacity="0.9"
                />
              </g>
            ))}
          </>
        )}
      </svg>
      {children}
    </div>
  )
}

/* ============================================================= *
 *  Animal faces (12 originals) — drawn in a 100×100 space
 * ============================================================= */
function shade(hex: string, amt: number) {
  const h = hex.replace("#", "")
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16)
  let r = (n >> 16) + amt
  let g = ((n >> 8) & 0xff) + amt
  let b = (n & 0xff) + amt
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

function Eyes({ y = 48, dx = 13, r = 7, happy = false }: { y?: number; dx?: number; r?: number; happy?: boolean }) {
  if (happy) {
    return (
      <g stroke={PALETTE.blueDeep} strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d={`M${50 - dx - 5} ${y} q5 -6 10 0`} />
        <path d={`M${50 + dx - 5} ${y} q5 -6 10 0`} />
      </g>
    )
  }
  return (
    <g>
      {[50 - dx, 50 + dx].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx} cy={y} rx={r} ry={r + 1} fill="#3A3A4A" />
          <circle cx={cx + 2} cy={y - 2.5} r={r / 2.6} fill="#fff" />
        </g>
      ))}
    </g>
  )
}

function Blush({ y = 60 }: { y?: number }) {
  return (
    <g fill={PALETTE.pink} opacity="0.55">
      <ellipse cx="30" cy={y} rx="6" ry="4" />
      <ellipse cx="70" cy={y} rx="6" ry="4" />
    </g>
  )
}

type FaceProps = { base: string; happy?: boolean }

const FACE_ART: Record<AnimalType, (p: FaceProps) => React.ReactNode> = {
  cachorro: ({ base, happy }) => (
    <g>
      <ellipse cx="24" cy="40" rx="12" ry="18" fill={shade(base, -30)} transform="rotate(-18 24 40)" />
      <ellipse cx="76" cy="40" rx="12" ry="18" fill={shade(base, -30)} transform="rotate(18 76 40)" />
      <circle cx="50" cy="52" r="34" fill={base} />
      <ellipse cx="50" cy="66" rx="20" ry="16" fill={PALETTE.cream} />
      <Eyes happy={happy} />
      <ellipse cx="50" cy="60" rx="5.5" ry="4.5" fill="#3A3A4A" />
      <path d="M50 64 v6" stroke="#3A3A4A" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M50 70 q-6 5 -11 1 M50 70 q6 5 11 1" stroke="#3A3A4A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Blush y={62} />
    </g>
  ),
  gato: ({ base, happy }) => (
    <g>
      <path d="M22 26 L34 46 L14 46 Z" fill={base} />
      <path d="M78 26 L86 46 L66 46 Z" fill={base} />
      <path d="M24 30 L31 44 L18 44 Z" fill={PALETTE.pink} />
      <path d="M76 30 L82 44 L69 44 Z" fill={PALETTE.pink} />
      <circle cx="50" cy="54" r="33" fill={base} />
      <Eyes happy={happy} y={50} />
      <path d="M50 58 l-4 4 h8 z" fill={PALETTE.pink} />
      <path d="M50 62 v3 M50 65 q-5 4 -9 1 M50 65 q5 4 9 1" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g stroke="#3A3A4A" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
        <path d="M30 58 h-14 M30 62 h-13 M70 58 h14 M70 62 h13" />
      </g>
      <Blush y={62} />
    </g>
  ),
  pinguim: ({ base, happy }) => (
    <g>
      <ellipse cx="50" cy="55" rx="35" ry="38" fill={base} />
      <ellipse cx="50" cy="62" rx="23" ry="28" fill="#fff" />
      <Eyes happy={happy} y={48} dx={11} r={6} />
      <path d="M50 56 l-8 6 8 4 8-4 z" fill={PALETTE.orange} />
      <Blush y={64} />
    </g>
  ),
  girafa: ({ base, happy }) => (
    <g>
      <rect x="44" y="14" width="5" height="14" rx="2.5" fill={shade(base, -20)} />
      <rect x="51" y="14" width="5" height="14" rx="2.5" fill={shade(base, -20)} />
      <circle cx="46.5" cy="14" r="4" fill={PALETTE.orange} />
      <circle cx="53.5" cy="14" r="4" fill={PALETTE.orange} />
      <ellipse cx="24" cy="42" rx="8" ry="12" fill={base} transform="rotate(-20 24 42)" />
      <ellipse cx="76" cy="42" rx="8" ry="12" fill={base} transform="rotate(20 76 42)" />
      <circle cx="50" cy="54" r="32" fill={base} />
      <circle cx="34" cy="46" r="6" fill={shade(base, -25)} opacity="0.6" />
      <circle cx="66" cy="64" r="7" fill={shade(base, -25)} opacity="0.6" />
      <Eyes happy={happy} y={50} />
      <ellipse cx="50" cy="66" rx="16" ry="12" fill={PALETTE.orange} opacity="0.6" />
      <ellipse cx="44" cy="66" rx="2.4" ry="3.4" fill="#3A3A4A" />
      <ellipse cx="56" cy="66" rx="2.4" ry="3.4" fill="#3A3A4A" />
      <Blush y={60} />
    </g>
  ),
  tigre: ({ base, happy }) => (
    <g>
      <circle cx="26" cy="34" r="11" fill={base} />
      <circle cx="74" cy="34" r="11" fill={base} />
      <circle cx="26" cy="34" r="5" fill={PALETTE.pink} />
      <circle cx="74" cy="34" r="5" fill={PALETTE.pink} />
      <circle cx="50" cy="54" r="34" fill={base} />
      <g stroke="#3A3A4A" strokeWidth="3" strokeLinecap="round">
        <path d="M50 22 v10 M36 24 l3 9 M64 24 l-3 9 M20 52 l10 3 M80 52 l-10 3" />
      </g>
      <ellipse cx="50" cy="64" rx="18" ry="14" fill={PALETTE.cream} />
      <Eyes happy={happy} y={50} />
      <path d="M50 58 l-4 4 h8 z" fill={PALETTE.pink} />
      <path d="M50 62 v3 M50 65 q-5 4 -9 1 M50 65 q5 4 9 1" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  raposa: ({ base, happy }) => (
    <g>
      <path d="M18 22 L40 44 L20 52 Z" fill={base} />
      <path d="M82 22 L60 44 L80 52 Z" fill={base} />
      <path d="M22 28 L37 44 L26 48 Z" fill={PALETTE.cream} />
      <path d="M78 28 L63 44 L74 48 Z" fill={PALETTE.cream} />
      <path d="M50 24 C24 30 20 60 50 88 C80 60 76 30 50 24Z" fill={base} />
      <path d="M50 52 C38 56 36 74 50 86 C64 74 62 56 50 52Z" fill={PALETTE.cream} />
      <Eyes happy={happy} y={52} dx={13} r={6} />
      <path d="M50 70 l-5 5 h10 z" fill="#3A3A4A" />
      <Blush y={64} />
    </g>
  ),
  coelho: ({ base, happy }) => (
    <g>
      <ellipse cx="38" cy="24" rx="9" ry="22" fill={base} />
      <ellipse cx="62" cy="24" rx="9" ry="22" fill={base} />
      <ellipse cx="38" cy="26" rx="4.5" ry="15" fill={PALETTE.pink} opacity="0.8" />
      <ellipse cx="62" cy="26" rx="4.5" ry="15" fill={PALETTE.pink} opacity="0.8" />
      <circle cx="50" cy="58" r="32" fill={base} />
      <Eyes happy={happy} y={54} />
      <path d="M50 62 l-3.5 3.5 h7 z" fill={PALETTE.pink} />
      <path d="M50 65.5 v3 M50 68.5 q-5 4 -9 1 M50 68.5 q5 4 9 1" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Blush y={66} />
    </g>
  ),
  panda: ({ base, happy }) => (
    <g>
      <circle cx="26" cy="30" r="12" fill="#3A3A4A" />
      <circle cx="74" cy="30" r="12" fill="#3A3A4A" />
      <circle cx="50" cy="55" r="34" fill={base} />
      <ellipse cx="36" cy="52" rx="10" ry="13" fill="#3A3A4A" transform="rotate(-15 36 52)" />
      <ellipse cx="64" cy="52" rx="10" ry="13" fill="#3A3A4A" transform="rotate(15 64 52)" />
      {happy ? (
        <g stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M32 52 q5 -5 9 0" />
          <path d="M59 52 q5 -5 9 0" />
        </g>
      ) : (
        <g>
          <circle cx="37" cy="53" r="4" fill="#fff" />
          <circle cx="63" cy="53" r="4" fill="#fff" />
        </g>
      )}
      <ellipse cx="50" cy="66" rx="4.5" ry="3.5" fill="#3A3A4A" />
      <path d="M50 70 q-6 5 -10 1 M50 70 q6 5 10 1" stroke="#3A3A4A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <Blush y={64} />
    </g>
  ),
  coala: ({ base, happy }) => (
    <g>
      <circle cx="22" cy="42" r="16" fill={base} />
      <circle cx="78" cy="42" r="16" fill={base} />
      <circle cx="22" cy="42" r="9" fill={PALETTE.pink} opacity="0.6" />
      <circle cx="78" cy="42" r="9" fill={PALETTE.pink} opacity="0.6" />
      <circle cx="50" cy="55" r="32" fill={base} />
      <Eyes happy={happy} y={52} />
      <ellipse cx="50" cy="64" rx="8" ry="10" fill="#4A4A55" />
      <Blush y={64} />
    </g>
  ),
  macaco: ({ base, happy }) => (
    <g>
      <circle cx="22" cy="48" r="12" fill={base} />
      <circle cx="78" cy="48" r="12" fill={base} />
      <circle cx="22" cy="48" r="7" fill={PALETTE.cream} />
      <circle cx="78" cy="48" r="7" fill={PALETTE.cream} />
      <circle cx="50" cy="54" r="33" fill={base} />
      <path d="M50 40 C28 40 26 62 50 74 C74 62 72 40 50 40Z" fill={PALETTE.cream} />
      <Eyes happy={happy} y={48} />
      <ellipse cx="50" cy="60" rx="10" ry="7" fill={PALETTE.cream} />
      <ellipse cx="45" cy="59" rx="2" ry="2.6" fill="#3A3A4A" />
      <ellipse cx="55" cy="59" rx="2" ry="2.6" fill="#3A3A4A" />
      <path d="M44 65 q6 5 12 0" stroke="#3A3A4A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  ),
  sapo: ({ base, happy }) => (
    <g>
      <circle cx="32" cy="30" r="14" fill={base} />
      <circle cx="68" cy="30" r="14" fill={base} />
      <circle cx="32" cy="28" r="7" fill="#fff" />
      <circle cx="68" cy="28" r="7" fill="#fff" />
      {happy ? (
        <g stroke="#3A3A4A" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M28 30 q4 -5 8 0" /><path d="M64 30 q4 -5 8 0" />
        </g>
      ) : (
        <g>
          <circle cx="33" cy="30" r="3.5" fill="#3A3A4A" />
          <circle cx="69" cy="30" r="3.5" fill="#3A3A4A" />
        </g>
      )}
      <ellipse cx="50" cy="60" rx="34" ry="28" fill={base} />
      <path d="M28 62 q22 18 44 0" stroke={shade(base, -40)} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="38" cy="58" r="2.2" fill="#3A3A4A" />
      <circle cx="62" cy="58" r="2.2" fill="#3A3A4A" />
      <Blush y={62} />
    </g>
  ),
  leao: ({ base, happy }) => (
    <g>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <circle
            key={i}
            cx={50 + Math.cos(a) * 34}
            cy={54 + Math.sin(a) * 34}
            r="11"
            fill={PALETTE.orange}
          />
        )
      })}
      <circle cx="50" cy="54" r="32" fill={base} />
      <Eyes happy={happy} y={50} />
      <ellipse cx="50" cy="62" rx="14" ry="10" fill={PALETTE.cream} />
      <path d="M50 58 l-4 4 h8 z" fill="#3A3A4A" />
      <path d="M50 62 v3 M50 65 q-5 4 -9 1 M50 65 q5 4 9 1" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
}

/* ---- Accessory overlays ---- */
function HatArt({ id }: { id: HatId }) {
  switch (id) {
    case "bone":
      return (
        <g>
          <path d="M20 30 q30 -26 60 0 q-30 -8 -60 0Z" fill={PALETTE.blue} />
          <path d="M50 30 q22 -3 34 5 q-6 4 -18 3Z" fill={PALETTE.blueDeep} />
        </g>
      )
    case "explorador":
      return (
        <g>
          <ellipse cx="50" cy="32" rx="42" ry="9" fill={PALETTE.green} />
          <path d="M26 32 q24 -30 48 0Z" fill={shade(PALETTE.green, -20)} />
          <rect x="26" y="27" width="48" height="6" rx="3" fill={PALETTE.cream} />
        </g>
      )
    case "coroa":
      return (
        <g>
          <path d="M22 32 L30 12 L40 26 L50 8 L60 26 L70 12 L78 32 Z" fill={PALETTE.yellow} stroke="#E9B800" strokeWidth="1.5" />
          <circle cx="50" cy="18" r="3" fill={PALETTE.coral} />
          <circle cx="30" cy="16" r="2.4" fill={PALETTE.green} />
          <circle cx="70" cy="16" r="2.4" fill={PALETTE.blue} />
        </g>
      )
    case "gorro":
      return (
        <g>
          <path d="M22 34 q28 -34 56 0Z" fill={PALETTE.coral} />
          <rect x="20" y="30" width="60" height="9" rx="4.5" fill={PALETTE.cream} />
          <circle cx="50" cy="8" r="6" fill={PALETTE.cream} />
        </g>
      )
    case "festa":
      return (
        <g>
          <path d="M50 4 L66 34 H34 Z" fill={PALETTE.pink} />
          <path d="M50 4 L58 20 L42 20 Z" fill={PALETTE.yellow} />
          <circle cx="50" cy="4" r="4" fill={PALETTE.lilac} />
        </g>
      )
    case "cowboy":
      return (
        <g>
          <ellipse cx="50" cy="34" rx="46" ry="8" fill={PALETTE.orange} />
          <path d="M30 34 q4 -26 20 -26 q16 0 20 26Z" fill={shade(PALETTE.orange, -20)} />
          <rect x="30" y="30" width="40" height="5" rx="2.5" fill={PALETTE.blueDeep} />
        </g>
      )
    case "tiara":
      return (
        <g>
          <path d="M26 32 q24 -14 48 0" stroke={PALETTE.lilac} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M50 10 l4 8 8 1 -6 6 2 8 -8-4 -8 4 2-8 -6-6 8-1z" fill={PALETTE.yellow} transform="scale(0.7) translate(21 8)" />
        </g>
      )
    default:
      return null
  }
}

function FaceArt({ id }: { id: FaceId }) {
  switch (id) {
    case "oculos":
    case "oculos-cor":
    case "oculos-estrela": {
      const c = id === "oculos-cor" ? PALETTE.coral : id === "oculos-estrela" ? PALETTE.lilac : PALETTE.blueDeep
      return (
        <g fill="none" stroke={c} strokeWidth="3">
          <circle cx="37" cy="50" r="10" fill="#ffffff55" />
          <circle cx="63" cy="50" r="10" fill="#ffffff55" />
          <path d="M47 50 h6" />
          <path d="M27 48 l-6 -3 M73 48 l6 -3" strokeLinecap="round" />
          {id === "oculos-estrela" && (
            <>
              <path d="M37 46 l1.4 3 3.2.3-2.4 2.2.7 3.2-2.9-1.7-2.9 1.7.7-3.2-2.4-2.2 3.2-.3z" fill={PALETTE.yellow} stroke="none" />
              <path d="M63 46 l1.4 3 3.2.3-2.4 2.2.7 3.2-2.9-1.7-2.9 1.7.7-3.2-2.4-2.2 3.2-.3z" fill={PALETTE.yellow} stroke="none" />
            </>
          )}
        </g>
      )
    }
    case "mascara":
      return (
        <path
          d="M18 46 q32 -12 64 0 q-4 14 -18 14 q-8 0 -14 -6 q-6 6 -14 6 q-14 0 -18 -14Z"
          fill={PALETTE.blueDeep}
          opacity="0.85"
        />
      )
    case "sardinhas":
      return (
        <g fill={PALETTE.orange}>
          {[
            [30, 58],
            [36, 62],
            [42, 59],
            [58, 59],
            [64, 62],
            [70, 58],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.8" />
          ))}
        </g>
      )
    case "bigode":
      return (
        <path
          d="M50 66 q-10 -6 -18 0 q8 3 18 -1 q10 4 18 1 q-8 -6 -18 0Z"
          fill={PALETTE.blueDeep}
        />
      )
    default:
      return null
  }
}

function AccessoryArt({ id }: { id: AccessoryId }) {
  switch (id) {
    case "laco":
      return (
        <g transform="translate(50 88)">
          <path d="M0 0 L-14 -8 L-14 8 Z" fill={PALETTE.pink} />
          <path d="M0 0 L14 -8 L14 8 Z" fill={PALETTE.pink} />
          <circle cx="0" cy="0" r="4" fill={shade(PALETTE.pink, -25)} />
        </g>
      )
    case "gravata":
      return (
        <g transform="translate(50 84)">
          <path d="M0 0 L-5 4 L0 8 L5 4 Z" fill={PALETTE.blue} />
          <path d="M-4 8 L4 8 L7 24 L0 30 L-7 24 Z" fill={PALETTE.blue} />
        </g>
      )
    case "mochila":
      return (
        <g stroke={PALETTE.green} strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M30 78 q20 10 40 0" />
        </g>
      )
    case "cachecol":
      return (
        <g transform="translate(50 84)">
          <path d="M-22 0 q22 12 44 0 l0 8 q-22 10 -44 0Z" fill={PALETTE.coral} />
          <rect x="14" y="4" width="8" height="22" rx="3" fill={PALETTE.coral} transform="rotate(10 18 10)" />
        </g>
      )
    case "fones":
      return (
        <g fill={PALETTE.lilac} stroke={shade(PALETTE.lilac, -30)} strokeWidth="1.5">
          <path d="M16 52 a34 34 0 0 1 68 0" fill="none" stroke={PALETTE.lilac} strokeWidth="5" />
          <rect x="10" y="48" width="12" height="18" rx="5" />
          <rect x="78" y="48" width="12" height="18" rx="5" />
        </g>
      )
    case "colar":
      return (
        <g transform="translate(50 84)">
          <path d="M-20 0 q20 14 40 0" stroke={PALETTE.yellow} strokeWidth="3" fill="none" />
          <path d="M0 12 l2 4 4.4.4-3.3 3 .9 4.3-4-2.3-4 2.3.9-4.3-3.3-3 4.4-.4z" fill={PALETTE.yellow} />
        </g>
      )
    case "capa":
      return (
        <g>
          <path d="M22 74 q28 22 56 0 l-6 22 q-22 12 -44 0Z" fill={PALETTE.coral} opacity="0.9" />
        </g>
      )
    default:
      return null
  }
}

/** The composed child avatar / any animal, with optional accessories. */
export function AnimalAvatar({
  animal,
  character,
  size = 120,
  happy = false,
  className = "",
  style,
  baseOverride,
}: {
  animal: AnimalType
  character?: Partial<Character>
  size?: number
  happy?: boolean
  className?: string
  style?: React.CSSProperties
  baseOverride?: string
}) {
  const meta = ANIMAL_BASE[animal]
  const base = baseOverride || character?.tint || meta
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={style}>
      {character?.accessory && character.accessory !== "none" && (
        <AccessoryArt id={character.accessory} />
      )}
      {FACE_ART[animal]({ base, happy })}
      {character?.face && character.face !== "none" && <FaceArt id={character.face} />}
      {character?.hat && character.hat !== "none" && <HatArt id={character.hat} />}
    </svg>
  )
}

const ANIMAL_BASE: Record<AnimalType, string> = {
  cachorro: "#E9B27C",
  gato: "#F6A96B",
  pinguim: "#3D5673",
  girafa: "#F4C752",
  tigre: "#FF9F55",
  raposa: "#FF9F55",
  coelho: "#F58FB2",
  panda: "#FFFFFF",
  coala: "#B7C3CC",
  macaco: "#C89168",
  sapo: "#72D6A1",
  leao: "#F4C267",
}

/* ============================================================= *
 *  The three ABC KIDS mascots
 * ============================================================= */
export function Mascots({ size = 220 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 260 180">
      {/* Corujinha (owl, blue) — left */}
      <g transform="translate(28 60)" className="anim-float" style={{ animationDelay: "0.3s" }}>
        <ellipse cx="30" cy="46" rx="30" ry="34" fill={PALETTE.blue} />
        <path d="M6 20 L18 34 L2 34Z" fill={PALETTE.blue} />
        <path d="M54 20 L58 34 L42 34Z" fill={PALETTE.blue} />
        <ellipse cx="30" cy="52" rx="18" ry="22" fill={PALETTE.skySoft} />
        <circle cx="20" cy="36" r="11" fill="#fff" />
        <circle cx="40" cy="36" r="11" fill="#fff" />
        <circle cx="20" cy="37" r="5" fill="#3A3A4A" />
        <circle cx="40" cy="37" r="5" fill="#3A3A4A" />
        <path d="M30 44 l-4 5 h8z" fill={PALETTE.yellow} />
      </g>
      {/* Raposinha (fox, orange) — center, holding a book */}
      <g transform="translate(96 24)" className="anim-float">
        <AnimalAvatar animal="raposa" size={110} happy />
        <g transform="translate(18 92)">
          <rect x="0" y="0" width="74" height="20" rx="4" fill={PALETTE.blue} />
          <rect x="4" y="3" width="31" height="14" rx="2" fill="#fff" />
          <rect x="39" y="3" width="31" height="14" rx="2" fill={PALETTE.cream} />
          <path d="M37 3 v14" stroke={PALETTE.blueDeep} strokeWidth="2" />
        </g>
      </g>
      {/* Coelhinho (rabbit, pink) — right */}
      <g transform="translate(196 54)" className="anim-float" style={{ animationDelay: "0.6s" }}>
        <AnimalAvatar animal="coelho" size={92} happy />
      </g>
    </svg>
  )
}

/* ============================================================= *
 *  Word / object illustrations for the games
 * ============================================================= */
export function ObjectIcon({
  name,
  size = 120,
}: {
  name: string
  size?: number
}) {
  const common = { width: size, height: size, viewBox: "0 0 100 100" } as const

  // Animals reuse the avatar art.
  const animalMap: Record<string, AnimalType> = {
    dog: "cachorro",
    cachorro: "cachorro",
    cat: "gato",
    gato: "gato",
    monkey: "macaco",
    macaco: "macaco",
  }
  if (animalMap[name]) {
    return <AnimalAvatar animal={animalMap[name]} size={size} happy />
  }

  switch (name) {
    case "plate": // PRATO
      return (
        <svg {...common}>
          <ellipse cx="50" cy="55" rx="40" ry="30" fill="#fff" stroke={PALETTE.blue} strokeWidth="3" />
          <ellipse cx="50" cy="53" rx="26" ry="19" fill={PALETTE.skySoft} />
          <ellipse cx="50" cy="52" rx="14" ry="10" fill={PALETTE.blue} opacity="0.4" />
        </svg>
      )
    case "envelope": // CARTA
      return (
        <svg {...common}>
          <rect x="16" y="30" width="68" height="44" rx="6" fill={PALETTE.cream} stroke={PALETTE.orange} strokeWidth="3" />
          <path d="M16 34 L50 56 L84 34" fill="none" stroke={PALETTE.orange} strokeWidth="3" />
          <path d="M56 24 l3 6 6 .8-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-.8z" fill={PALETTE.yellow} />
        </svg>
      )
    case "ball": // BOLA
      return (
        <svg {...common}>
          <circle cx="50" cy="52" r="34" fill="#fff" stroke={PALETTE.blueDeep} strokeWidth="2.5" />
          <path d="M50 24 l10 8 -4 12 h-12 l-4-12z" fill={PALETTE.blueDeep} />
          <path d="M50 80 l-14-6 4-10 h20 l4 10z" fill={PALETTE.blue} opacity="0.5" />
        </svg>
      )
    case "glue": // COLA
      return (
        <svg {...common}>
          <rect x="38" y="34" width="24" height="42" rx="6" fill={PALETTE.orange} />
          <rect x="42" y="18" width="16" height="18" rx="4" fill={PALETTE.blue} />
          <rect x="44" y="44" width="12" height="20" rx="2" fill="#fff" />
        </svg>
      )
    case "spring": // MOLA
      return (
        <svg {...common}>
          <g stroke={PALETTE.lilac} strokeWidth="7" fill="none" strokeLinecap="round">
            <path d="M32 30 h36 M30 42 h40 M32 54 h36 M34 66 h32" />
          </g>
        </svg>
      )
    case "house": // CASA
      return (
        <svg {...common}>
          <path d="M50 20 L86 50 H14 Z" fill={PALETTE.coral} />
          <rect x="26" y="50" width="48" height="34" rx="4" fill={PALETTE.cream} />
          <rect x="44" y="62" width="12" height="22" rx="2" fill={PALETTE.blue} />
          <rect x="32" y="58" width="10" height="10" rx="2" fill={PALETTE.sky} />
        </svg>
      )
    case "horse": // CAVALO
      return (
        <svg {...common}>
          <path d="M30 84 V54 q0 -22 22 -26 l6 -10 6 4 -4 8 q14 6 14 24 v30 h-8 V58 q0 -14 -16 -14 t-16 14 v26z" fill={PALETTE.orange} />
          <circle cx="60" cy="30" r="3" fill="#3A3A4A" />
          <path d="M58 20 l-6 -8 4 12z" fill={PALETTE.blueDeep} />
        </svg>
      )
    case "banana": // BANANA
      return (
        <svg {...common}>
          <path d="M22 40 q6 44 52 40 q6 -2 4 -8 q-34 6 -46 -34 q-2 -6 -10 2z" fill={PALETTE.yellow} stroke="#E9B800" strokeWidth="2" />
          <path d="M74 78 l4 -4" stroke={PALETTE.blueDeep} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case "sun": // SOL
      return (
        <svg {...common}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 26}
                y1={52 + Math.sin(a) * 26}
                x2={50 + Math.cos(a) * 38}
                y2={52 + Math.sin(a) * 38}
                stroke={PALETTE.yellow}
                strokeWidth="6"
                strokeLinecap="round"
              />
            )
          })}
          <circle cx="50" cy="52" r="22" fill={PALETTE.yellow} />
          <circle cx="43" cy="50" r="3" fill="#E99500" />
          <circle cx="57" cy="50" r="3" fill="#E99500" />
          <path d="M43 58 q7 6 14 0" stroke="#E99500" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )
    case "camera":
      return (
        <svg {...common}>
          <rect x="18" y="34" width="64" height="46" rx="8" fill={PALETTE.pink} />
          <rect x="36" y="26" width="20" height="10" rx="3" fill={PALETTE.pink} />
          <circle cx="50" cy="57" r="16" fill={PALETTE.cream} />
          <circle cx="50" cy="57" r="9" fill={PALETTE.blue} />
          <circle cx="72" cy="44" r="3" fill={PALETTE.yellow} />
        </svg>
      )
    case "speaker":
      return (
        <svg {...common}>
          <path d="M24 42 h12 l14 -12 v44 l-14 -12 h-12z" fill={PALETTE.lilac} />
          <g stroke={PALETTE.blue} strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M60 42 q8 10 0 20" />
            <path d="M70 34 q16 18 0 36" />
          </g>
        </svg>
      )
    case "magnify":
      return (
        <svg {...common}>
          <circle cx="44" cy="44" r="22" fill={PALETTE.skySoft} stroke={PALETTE.blue} strokeWidth="5" />
          <circle cx="44" cy="44" r="12" fill="#fff" opacity="0.6" />
          <rect x="60" y="60" width="26" height="9" rx="4.5" transform="rotate(45 60 60)" fill={PALETTE.orange} />
        </svg>
      )
    case "shield":
      return (
        <svg {...common}>
          <path d="M50 18 L80 28 V52 Q80 76 50 86 Q20 76 20 52 V28 Z" fill={PALETTE.lilac} stroke={PALETTE.pink} strokeWidth="3" />
          <path d="M50 34 l5 10 11 1 -8 8 2 11 -10-6 -10 6 2-11 -8-8 11-1z" fill={PALETTE.yellow} />
        </svg>
      )
    case "lantern":
      return (
        <svg {...common}>
          <rect x="40" y="24" width="20" height="14" rx="4" fill={PALETTE.blueDeep} />
          <path d="M34 38 h32 l10 24 h-52z" fill={PALETTE.lilac} />
          <circle cx="50" cy="52" r="9" fill={PALETTE.yellow} />
          <path d="M50 62 L30 86 M50 62 L70 86" stroke={PALETTE.yellow} strokeWidth="6" opacity="0.4" strokeLinecap="round" />
        </svg>
      )
    case "monster":
      return (
        <svg {...common}>
          <path d="M50 20 q30 0 30 34 q0 26 -30 26 q-30 0 -30 -26 q0 -34 30 -34z" fill={PALETTE.green} />
          <circle cx="38" cy="42" r="9" fill="#fff" />
          <circle cx="62" cy="42" r="9" fill="#fff" />
          <circle cx="39" cy="43" r="4" fill="#3A3A4A" />
          <circle cx="61" cy="43" r="4" fill="#3A3A4A" />
          <path d="M34 58 q16 14 32 0 q-16 6 -32 0z" fill={PALETTE.blueDeep} />
          <rect x="40" y="58" width="4" height="6" fill="#fff" />
          <rect x="52" y="58" width="4" height="6" fill="#fff" />
          <path d="M32 22 l-4 -10 M50 18 v-10 M68 22 l4 -10" stroke={PALETTE.pink} strokeWidth="3" strokeLinecap="round" />
          <circle cx="28" cy="12" r="3" fill={PALETTE.pink} />
          <circle cx="50" cy="8" r="3" fill={PALETTE.orange} />
          <circle cx="72" cy="12" r="3" fill={PALETTE.pink} />
        </svg>
      )
    case "pencil":
      return (
        <svg {...common}>
          <rect x="30" y="18" width="16" height="50" rx="3" transform="rotate(20 38 40)" fill={PALETTE.yellow} />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="30" fill={PALETTE.skySoft} />
        </svg>
      )
  }
}
