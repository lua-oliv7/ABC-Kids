import React, { useState } from "react"
import { BackButton, PrimaryButton, Screen, shade } from "../components/kit"
import { PALETTE, playTone, speak } from "../lib/store"

/* ============================================================= *
 *  Simple letter illustrations (compact inline SVGs)
 * ============================================================= */
function LetterIllustration({ letter, size = 56 }: { letter: string; size?: number }) {
  const s = size
  const illustrations: Record<string, React.ReactNode> = {
    A: ( // ABACAXI
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="36" rx="14" ry="18" fill={PALETTE.yellow} stroke="#E9B800" strokeWidth="1.5" />
        <path d="M22 18 q6 -14 12 0" stroke={PALETTE.green} strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="20" y="24" width="16" height="14" rx="2" fill="#E9B800" opacity="0.5" />
      </svg>
    ),
    B: ( // BOLA
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="28" cy="30" r="20" fill="#fff" stroke={PALETTE.blueDeep} strokeWidth="2" />
        <path d="M28 12 l6 8 -4 6 h-8 l-4-6z" fill={PALETTE.blueDeep} />
        <path d="M28 48 l-8-4 4-8h8l4 8z" fill={PALETTE.blue} opacity="0.5" />
      </svg>
    ),
    C: ( // CACHORRO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="16" cy="24" rx="7" ry="10" fill="#E9B27C" transform="rotate(-18 16 24)" />
        <ellipse cx="40" cy="24" rx="7" ry="10" fill="#E9B27C" transform="rotate(18 40 24)" />
        <circle cx="28" cy="32" r="18" fill="#E9B27C" />
        <ellipse cx="28" cy="40" rx="10" ry="8" fill={PALETTE.cream} />
        <circle cx="21" cy="28" r="3" fill="#3A3A4A" />
        <circle cx="35" cy="28" r="3" fill="#3A3A4A" />
      </svg>
    ),
    D: ( // DADO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <rect x="12" y="16" width="32" height="32" rx="6" fill={PALETTE.cream} stroke={PALETTE.blue} strokeWidth="2.5" />
        <circle cx="20" cy="24" r="3" fill={PALETTE.blue} />
        <circle cx="36" cy="24" r="3" fill={PALETTE.blue} />
        <circle cx="28" cy="32" r="3" fill={PALETTE.blue} />
        <circle cx="20" cy="40" r="3" fill={PALETTE.blue} />
        <circle cx="36" cy="40" r="3" fill={PALETTE.blue} />
      </svg>
    ),
    E: ( // ELEFANTE
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="30" rx="20" ry="16" fill="#B7C3CC" />
        <path d="M10 36 q-8 4 -6 14 q4 -6 8 -4z" fill="#B7C3CC" />
        <circle cx="20" cy="24" r="4" fill="#fff" /><circle cx="21" cy="24" r="2" fill="#3A3A4A" />
        <circle cx="36" cy="24" r="4" fill="#fff" /><circle cx="37" cy="24" r="2" fill="#3A3A4A" />
        <ellipse cx="14" cy="22" rx="6" ry="8" fill="#B7C3CC" />
        <ellipse cx="42" cy="22" rx="6" ry="8" fill="#B7C3CC" />
      </svg>
    ),
    F: ( // FLOR
      <svg width={s} height={s} viewBox="0 0 56 56">
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <ellipse key={i} cx={28 + Math.cos(a * Math.PI / 180) * 14} cy={28 + Math.sin(a * Math.PI / 180) * 14} rx="8" ry="10"
            fill={i % 2 === 0 ? PALETTE.pink : PALETTE.lilac}
            transform={`rotate(${a} ${28 + Math.cos(a * Math.PI / 180) * 14} ${28 + Math.sin(a * Math.PI / 180) * 14})`}
          />
        ))}
        <circle cx="28" cy="28" r="9" fill={PALETTE.yellow} />
      </svg>
    ),
    G: ( // GATO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <path d="M14 18 L20 28 L10 28Z" fill="#F6A96B" />
        <path d="M42 18 L46 28 L36 28Z" fill="#F6A96B" />
        <circle cx="28" cy="34" r="18" fill="#F6A96B" />
        <circle cx="20" cy="30" r="3" fill="#3A3A4A" />
        <circle cx="36" cy="30" r="3" fill="#3A3A4A" />
        <path d="M22 40 q6 4 12 0" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    H: ( // HIPOPÓTAMO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="36" rx="22" ry="16" fill="#B7C3CC" />
        <ellipse cx="18" cy="28" rx="7" ry="7" fill="#B7C3CC" />
        <ellipse cx="38" cy="28" rx="7" ry="7" fill="#B7C3CC" />
        <circle cx="16" cy="26" r="3" fill="#fff" /><circle cx="17" cy="26" r="1.5" fill="#3A3A4A" />
        <circle cx="36" cy="26" r="3" fill="#fff" /><circle cx="37" cy="26" r="1.5" fill="#3A3A4A" />
        <path d="M18 42 q10 8 20 0" stroke="#9AAABB" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    I: ( // IGLU
      <svg width={s} height={s} viewBox="0 0 56 56">
        <path d="M8 42 a20 20 0 0 1 40 0Z" fill="#DFF4FC" stroke={PALETTE.sky} strokeWidth="2" />
        <rect x="22" y="34" width="12" height="10" rx="6" fill="#fff" stroke={PALETTE.sky} strokeWidth="2" />
        <path d="M6 42 h44" stroke={PALETTE.sky} strokeWidth="2.5" strokeLinecap="round" />
        {[14, 28, 42].map((cx, i) => (
          <path key={i} d="M0 -6 q4 -6 8 0" fill="none" stroke={PALETTE.sky} strokeWidth="1.5" transform={`translate(${cx-4} 24)`} />
        ))}
      </svg>
    ),
    J: ( // JANELA
      <svg width={s} height={s} viewBox="0 0 56 56">
        <rect x="10" y="12" width="36" height="36" rx="3" fill={PALETTE.sky} stroke={PALETTE.blueDeep} strokeWidth="2.5" />
        <path d="M28 12 v36 M10 30 h36" stroke={PALETTE.blueDeep} strokeWidth="2.5" />
        <rect x="13" y="15" width="12" height="12" fill="#fff" opacity="0.5" />
        <rect x="31" y="15" width="12" height="12" fill="#fff" opacity="0.3" />
      </svg>
    ),
    K: ( // KIWI
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="30" rx="18" ry="20" fill="#6B8C3E" />
        <ellipse cx="28" cy="30" rx="14" ry="16" fill="#9DC057" />
        <ellipse cx="28" cy="30" rx="10" ry="12" fill="#C5E08A" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i} x1="28" y1="30" x2={28 + Math.cos(a * Math.PI / 180) * 10} y2={30 + Math.sin(a * Math.PI / 180) * 12}
            stroke="#6B8C3E" strokeWidth="1" opacity="0.6" />
        ))}
        <circle cx="28" cy="30" r="3" fill="#fff" />
      </svg>
    ),
    L: ( // LEÃO
      <svg width={s} height={s} viewBox="0 0 56 56">
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a, i) => (
          <circle key={i} cx={28 + Math.cos(a * Math.PI / 180) * 18} cy={30 + Math.sin(a * Math.PI / 180) * 18} r="6" fill={PALETTE.orange} />
        ))}
        <circle cx="28" cy="30" r="16" fill="#F4C267" />
        <circle cx="22" cy="27" r="2.5" fill="#3A3A4A" />
        <circle cx="34" cy="27" r="2.5" fill="#3A3A4A" />
        <path d="M22 36 q6 4 12 0" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    M: ( // MACACO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="12" cy="30" r="8" fill="#C89168" /><circle cx="12" cy="30" r="4.5" fill={PALETTE.cream} />
        <circle cx="44" cy="30" r="8" fill="#C89168" /><circle cx="44" cy="30" r="4.5" fill={PALETTE.cream} />
        <circle cx="28" cy="32" r="18" fill="#C89168" />
        <path d="M28 22 C18 22 17 36 28 42 C39 36 38 22 28 22Z" fill={PALETTE.cream} />
        <circle cx="22" cy="28" r="2.5" fill="#3A3A4A" />
        <circle cx="34" cy="28" r="2.5" fill="#3A3A4A" />
      </svg>
    ),
    N: ( // NUVEM
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="32" rx="20" ry="14" fill="#fff" stroke={PALETTE.sky} strokeWidth="2" />
        <ellipse cx="18" cy="28" rx="10" ry="9" fill="#fff" stroke={PALETTE.sky} strokeWidth="2" />
        <ellipse cx="38" cy="28" rx="11" ry="9" fill="#fff" stroke={PALETTE.sky} strokeWidth="2" />
        <ellipse cx="28" cy="24" rx="10" ry="9" fill="#fff" stroke={PALETTE.sky} strokeWidth="2" />
      </svg>
    ),
    O: ( // ÓCULOS
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="20" cy="30" r="10" fill="none" stroke={PALETTE.blue} strokeWidth="3" />
        <circle cx="36" cy="30" r="10" fill="none" stroke={PALETTE.blue} strokeWidth="3" />
        <path d="M30 30 h6" stroke={PALETTE.blue} strokeWidth="3" />
        <path d="M10 28 l-6 -3" stroke={PALETTE.blue} strokeWidth="3" strokeLinecap="round" />
        <path d="M46 28 l6 -3" stroke={PALETTE.blue} strokeWidth="3" strokeLinecap="round" />
        <circle cx="20" cy="30" r="5" fill={PALETTE.sky} opacity="0.4" />
        <circle cx="36" cy="30" r="5" fill={PALETTE.sky} opacity="0.4" />
      </svg>
    ),
    P: ( // PATO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="36" rx="16" ry="14" fill={PALETTE.yellow} />
        <circle cx="28" cy="22" r="10" fill={PALETTE.yellow} />
        <path d="M38 22 l8 2 -8 4Z" fill={PALETTE.orange} />
        <circle cx="24" cy="20" r="2" fill="#3A3A4A" />
        <path d="M18 46 q10 8 20 0" stroke="#E9B800" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Q: ( // QUEIJO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <path d="M8 42 L28 14 L48 42 Z" fill={PALETTE.yellow} stroke="#E9B800" strokeWidth="2" />
        <circle cx="22" cy="36" r="4" fill="#E9B800" opacity="0.5" />
        <circle cx="34" cy="30" r="3.5" fill="#E9B800" opacity="0.5" />
        <circle cx="28" cy="40" r="3" fill="#E9B800" opacity="0.5" />
      </svg>
    ),
    R: ( // RATO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="22" cy="20" rx="6" ry="9" fill="#B7C3CC" />
        <ellipse cx="34" cy="20" rx="6" ry="9" fill="#B7C3CC" />
        <circle cx="28" cy="34" r="18" fill="#B7C3CC" />
        <circle cx="22" cy="30" r="3" fill="#3A3A4A" />
        <circle cx="34" cy="30" r="3" fill="#3A3A4A" />
        <path d="M44 42 q10 0 6 8" stroke="#B7C3CC" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="40" r="3" fill={PALETTE.pink} />
      </svg>
    ),
    S: ( // SAPO
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="18" cy="18" r="10" fill={PALETTE.green} />
        <circle cx="38" cy="18" r="10" fill={PALETTE.green} />
        <circle cx="18" cy="16" r="5" fill="#fff" /><circle cx="19" cy="16" r="2.5" fill="#3A3A4A" />
        <circle cx="38" cy="16" r="5" fill="#fff" /><circle cx="39" cy="16" r="2.5" fill="#3A3A4A" />
        <ellipse cx="28" cy="38" rx="20" ry="14" fill={PALETTE.green} />
        <path d="M16 40 q12 10 24 0" stroke={shade(PALETTE.green, -30)} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    T: ( // TIGRE
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="16" cy="20" r="8" fill={PALETTE.orange} />
        <circle cx="40" cy="20" r="8" fill={PALETTE.orange} />
        <circle cx="28" cy="32" r="18" fill={PALETTE.orange} />
        <path d="M22 18 v8 M28 16 v10 M34 18 v8" stroke="#3A3A4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="28" r="2.5" fill="#3A3A4A" />
        <circle cx="34" cy="28" r="2.5" fill="#3A3A4A" />
        <ellipse cx="28" cy="38" rx="10" ry="7" fill={PALETTE.cream} />
      </svg>
    ),
    U: ( // UVA
      <svg width={s} height={s} viewBox="0 0 56 56">
        {[[28, 16], [18, 24], [38, 24], [12, 34], [28, 34], [44, 34], [20, 44], [36, 44]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" fill={PALETTE.lilac} stroke={shade(PALETTE.lilac, -20)} strokeWidth="1" />
        ))}
        <path d="M28 10 l4 -8" stroke={PALETTE.green} strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    V: ( // VACA
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="34" rx="20" ry="16" fill="#fff" stroke="#D0D0D0" strokeWidth="2" />
        <circle cx="16" cy="22" r="6" fill="#fff" stroke="#D0D0D0" strokeWidth="2" />
        <circle cx="40" cy="22" r="6" fill="#fff" stroke="#D0D0D0" strokeWidth="2" />
        <circle cx="22" cy="30" r="4" fill="#3A3A4A" opacity="0.3" />
        <circle cx="36" cy="26" r="5" fill="#3A3A4A" opacity="0.2" />
        <circle cx="20" cy="26" r="2.5" fill="#3A3A4A" />
        <circle cx="36" cy="30" r="2.5" fill="#3A3A4A" />
        <path d="M22 38 q6 5 12 0" stroke="#3A3A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    W: ( // WAFFLE
      <svg width={s} height={s} viewBox="0 0 56 56">
        <rect x="10" y="18" width="36" height="28" rx="5" fill="#D4956A" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect key={`${row}-${col}`} x={13 + col * 12} y={21 + row * 8} width="9" height="6" rx="2" fill="#C07A4A" />
          ))
        )}
        <path d="M10 14 q18 -8 36 0" stroke={PALETTE.yellow} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
    X: ( // XÍCARA
      <svg width={s} height={s} viewBox="0 0 56 56">
        <path d="M14 26 q0 18 14 18 q14 0 14 -18Z" fill={PALETTE.pink} stroke={shade(PALETTE.pink, -20)} strokeWidth="2" />
        <path d="M42 30 q8 0 8 8 q0 8 -8 6" fill="none" stroke={shade(PALETTE.pink, -20)} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="28" cy="26" rx="14" ry="5" fill={shade(PALETTE.pink, -10)} />
        <path d="M22 18 q6 -6 12 0" stroke={PALETTE.sky} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        <rect x="14" y="44" width="28" height="5" rx="2.5" fill={shade(PALETTE.pink, -20)} />
      </svg>
    ),
    Y: ( // IOGURTE (Y de Yoga → iogurte in BR context, or yoyo)
      <svg width={s} height={s} viewBox="0 0 56 56">
        <circle cx="20" cy="22" r="10" fill={PALETTE.turquoise} stroke={shade(PALETTE.turquoise, -20)} strokeWidth="2" />
        <circle cx="36" cy="22" r="10" fill={PALETTE.turquoise} stroke={shade(PALETTE.turquoise, -20)} strokeWidth="2" />
        <line x1="20" y1="22" x2="36" y2="22" stroke={PALETTE.blueDeep} strokeWidth="2.5" />
        <line x1="28" y1="22" x2="28" y2="42" stroke={PALETTE.blueDeep} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    Z: ( // ZEBRA
      <svg width={s} height={s} viewBox="0 0 56 56">
        <ellipse cx="28" cy="34" rx="20" ry="16" fill="#fff" stroke="#3A3A4A" strokeWidth="2" />
        <ellipse cx="16" cy="22" rx="6" ry="8" fill="#fff" stroke="#3A3A4A" strokeWidth="2" />
        <ellipse cx="40" cy="22" rx="6" ry="8" fill="#fff" stroke="#3A3A4A" strokeWidth="2" />
        <path d="M18 28 h8 M22 34 h10 M20 40 h8" stroke="#3A3A4A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="27" r="2" fill="#3A3A4A" />
        <circle cx="34" cy="27" r="2" fill="#3A3A4A" />
      </svg>
    ),
  }

  return (
    <div className="flex items-center justify-center">
      {illustrations[letter] ?? (
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{ width: s, height: s, background: PALETTE.skySoft }}
        >
          <span className="text-2xl font-bold" style={{ color: PALETTE.blue }}>
            {letter}
          </span>
        </div>
      )}
    </div>
  )
}

/* Word associations per letter */
const LETTER_WORDS: Record<string, string> = {
  A: "ABACAXI", B: "BOLA", C: "CACHORRO", D: "DADO", E: "ELEFANTE",
  F: "FLOR", G: "GATO", H: "HIPOPÓTAMO", I: "IGLU", J: "JANELA",
  K: "KIWI", L: "LEÃO", M: "MACACO", N: "NUVEM", O: "ÓCULOS",
  P: "PATO", Q: "QUEIJO", R: "RATO", S: "SAPO", T: "TIGRE",
  U: "UVA", V: "VACA", W: "WAFFLE", X: "XÍCARA", Y: "YOYÔ", Z: "ZEBRA",
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

/* Letter color cycle */
const LETTER_COLORS = [
  PALETTE.blue, PALETTE.orange, PALETTE.green, PALETTE.pink, PALETTE.lilac,
  PALETTE.turquoise, PALETTE.coral, PALETTE.yellow, PALETTE.blue, PALETTE.orange,
  PALETTE.green, PALETTE.pink, PALETTE.lilac, PALETTE.turquoise,
]

/* ============================================================= *
 *  ALPHABET MODULE
 * ============================================================= */
type AlphaTab = "grid" | "syllable" | "words"

export function AlphabetModule({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<AlphaTab>("grid")
  const [focusLetter, setFocusLetter] = useState<string | null>(null)

  const handleLetterClick = (l: string) => {
    speak(l)
    setFocusLetter(l)
  }

  return (
    <Screen>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
          MÓDULO DO ALFABETO
        </h1>
      </div>

      {/* Tab bar */}
      <div className="mb-4 flex gap-2">
        {([["grid", "🔤 A-Z"], ["syllable", "🔡 Sílabas"], ["words", "📝 Palavras"]] as [AlphaTab, string][]).map(
          ([t, label]) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); playTone("tap") }}
              className="tap-shrink flex-1 rounded-full py-2 text-sm font-bold"
              style={{
                background: activeTab === t ? PALETTE.blue : "#ffffffcc",
                color: activeTab === t ? "#fff" : PALETTE.blueDeep,
                boxShadow: activeTab === t ? `0 3px 0 ${shade(PALETTE.blue, -26)}` : "none",
              }}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-[24px] bg-white/85 p-3" style={{ boxShadow: "inset 0 2px 8px rgba(49,84,119,0.08)" }}>
        {activeTab === "grid" && (
          <>
            {/* Letter detail popup */}
            {focusLetter && (
              <div
                className="anim-pop mb-4 flex items-center gap-4 rounded-[20px] p-4"
                style={{ background: `${LETTER_COLORS[ALPHABET.indexOf(focusLetter)] ?? PALETTE.blue}22`, border: `2px solid ${LETTER_COLORS[ALPHABET.indexOf(focusLetter)] ?? PALETTE.blue}44` }}
              >
                <button
                  onClick={() => { speak(focusLetter); playTone("tap") }}
                  className="tap-shrink flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl font-bold text-white"
                  style={{ background: LETTER_COLORS[ALPHABET.indexOf(focusLetter)] ?? PALETTE.blue, boxShadow: `0 5px 0 ${shade(LETTER_COLORS[ALPHABET.indexOf(focusLetter)] ?? PALETTE.blue, -26)}` }}
                >
                  {focusLetter}
                </button>
                <div className="flex items-center gap-3">
                  <LetterIllustration letter={focusLetter} size={52} />
                  <div>
                    <div className="text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
                      {LETTER_WORDS[focusLetter]}
                    </div>
                    <button
                      onClick={() => speak(focusLetter)}
                      className="tap-shrink mt-1 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ background: PALETTE.blue }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5M13 7l6 5-6 5V7z" fill="#fff" />
                      </svg>
                      OUVIR
                    </button>
                  </div>
                </div>
                <button onClick={() => setFocusLetter(null)} className="ml-auto text-xl font-bold" style={{ color: PALETTE.blue }}>
                  ✕
                </button>
              </div>
            )}

            {/* A–Z Grid */}
            <div className="grid grid-cols-4 gap-2">
              {ALPHABET.map((l, i) => {
                const color = LETTER_COLORS[i % LETTER_COLORS.length]
                const isFocus = focusLetter === l
                return (
                  <button
                    key={l}
                    onClick={() => handleLetterClick(l)}
                    className="tap-shrink flex flex-col items-center gap-1 rounded-2xl p-2"
                    style={{
                      background: isFocus ? color : `${color}22`,
                      border: `2.5px solid ${isFocus ? color : `${color}55`}`,
                      boxShadow: isFocus ? `0 4px 0 ${shade(color, -26)}` : "none",
                    }}
                  >
                    <span className="text-2xl font-bold" style={{ color: isFocus ? "#fff" : color }}>
                      {l}
                    </span>
                    <LetterIllustration letter={l} size={36} />
                    <span className="text-[9px] font-bold leading-tight text-center" style={{ color: isFocus ? "#fff" : PALETTE.blueDeep }}>
                      {LETTER_WORDS[l]?.slice(0, 8)}
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {activeTab === "syllable" && <SyllableTab />}
        {activeTab === "words" && <WordFormationTab />}
      </div>
    </Screen>
  )
}

/* Syllable joining tab */
function SyllableTab() {
  const pairs = [
    { c: "B", v: "A", word: "BA", example: "BALA" },
    { c: "C", v: "A", word: "CA", example: "CASA" },
    { c: "M", v: "A", word: "MA", example: "MAMÃO" },
    { c: "P", v: "A", word: "PA", example: "PATO" },
    { c: "S", v: "O", word: "SO", example: "SORVETE" },
    { c: "B", v: "O", word: "BO", example: "BOLA" },
    { c: "G", v: "A", word: "GA", example: "GATO" },
    { c: "T", v: "O", word: "TO", example: "TOCO" },
  ]
  const [active, setActive] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-center text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
        TOQUE PARA OUVIR A SÍLABA!
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {pairs.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i)
              speak(p.word)
            }}
            className="tap-shrink flex flex-col items-center gap-2 rounded-2xl p-3"
            style={{
              background: active === i ? PALETTE.orange : "#fff",
              boxShadow: active === i ? `0 4px 0 ${shade(PALETTE.orange, -26)}` : "0 3px 8px rgba(49,84,119,0.1)",
            }}
          >
            <div className="flex items-center gap-1">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl font-bold text-white"
                style={{ background: PALETTE.blue, boxShadow: `0 3px 0 ${shade(PALETTE.blue, -26)}` }}
              >
                {p.c}
              </span>
              <span className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>+</span>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl font-bold text-white"
                style={{ background: PALETTE.pink, boxShadow: `0 3px 0 ${shade(PALETTE.pink, -26)}` }}
              >
                {p.v}
              </span>
              <span className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>=</span>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white"
                style={{ background: active === i ? "#fff" : PALETTE.green, color: active === i ? PALETTE.orange : "#fff", boxShadow: `0 3px 0 ${shade(PALETTE.green, -26)}` }}
              >
                {p.word}
              </span>
            </div>
            <span className="text-xs font-semibold" style={{ color: active === i ? "#fff" : PALETTE.blue }}>
              ex: {p.example}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* Word formation tab */
function WordFormationTab() {
  const words = [
    { word: "GATO", color: PALETTE.orange },
    { word: "BOLA", color: PALETTE.blue },
    { word: "CASA", color: PALETTE.green },
    { word: "PATO", color: PALETTE.pink },
    { word: "SAPO", color: PALETTE.turquoise },
    { word: "RATO", color: PALETTE.lilac },
  ]
  const [activeWord, setActiveWord] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
        TOQUE EM CADA LETRA PARA OUVIR!
      </p>
      {words.map((w) => {
        const isActive = activeWord === w.word
        return (
          <button
            key={w.word}
            onClick={() => {
              setActiveWord(w.word)
              speak(w.word, true)
            }}
            className="tap-shrink rounded-2xl p-3"
            style={{
              background: isActive ? `${w.color}22` : "#fff",
              border: `2.5px solid ${isActive ? w.color : "#E1E9F1"}`,
              boxShadow: "0 3px 8px rgba(49,84,119,0.08)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {w.word.split("").map((l, i) => (
                <div
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white"
                  style={{
                    background: w.color,
                    boxShadow: `0 4px 0 ${shade(w.color, -26)}`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-sm font-semibold" style={{ color: w.color }}>
              {isActive ? "🔊 OUVINDO..." : "TOQUE PARA OUVIR"}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ============================================================= *
 *  NUMBERS AND SYMBOLS MODULE
 * ============================================================= */
type Category = "LETRA" | "NÚMERO" | "SÍMBOLO"

interface CatItem {
  char: string
  correct: Category
  hint: string
}

const CAT_ITEMS: CatItem[] = [
  { char: "A", correct: "LETRA", hint: "É uma letra do alfabeto" },
  { char: "3", correct: "NÚMERO", hint: "É usado para contar" },
  { char: "+", correct: "SÍMBOLO", hint: "É um sinal de operação" },
  { char: "B", correct: "LETRA", hint: "É uma letra do alfabeto" },
  { char: "7", correct: "NÚMERO", hint: "É um numeral" },
  { char: "?", correct: "SÍMBOLO", hint: "É um sinal de pontuação" },
  { char: "Z", correct: "LETRA", hint: "Última letra do alfabeto" },
  { char: "5", correct: "NÚMERO", hint: "Vem depois do 4" },
  { char: "!", correct: "SÍMBOLO", hint: "Indica exclamação" },
  { char: "M", correct: "LETRA", hint: "É uma letra do alfabeto" },
  { char: "9", correct: "NÚMERO", hint: "Vem antes do 10" },
  { char: "@", correct: "SÍMBOLO", hint: "Símbolo usado em e-mails" },
  { char: "R", correct: "LETRA", hint: "É uma consoante" },
  { char: "2", correct: "NÚMERO", hint: "Vem depois do 1" },
  { char: "#", correct: "SÍMBOLO", hint: "Símbolo de numeral" },
]

const CAT_COLORS: Record<Category, string> = {
  LETRA: PALETTE.blue,
  NÚMERO: PALETTE.green,
  SÍMBOLO: PALETTE.orange,
}

export function NumbersModule({ onBack }: { onBack: () => void }) {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<Category | null>(null)
  const [score, setScore] = useState({ acertos: 0, total: 0 })
  const [done, setDone] = useState(false)

  const item = CAT_ITEMS[idx]

  const choose = (cat: Category) => {
    if (answered) return
    setAnswered(cat)
    speak(item.char)
    const correct = cat === item.correct
    if (correct) playTone("correct")
    else playTone("wrong")

    setScore((s) => ({ acertos: s.acertos + (correct ? 1 : 0), total: s.total + 1 }))

    setTimeout(() => {
      if (idx + 1 >= CAT_ITEMS.length) {
        setDone(true)
      } else {
        setIdx(idx + 1)
        setAnswered(null)
      }
    }, 1200)
  }

  const restart = () => {
    setIdx(0)
    setAnswered(null)
    setScore({ acertos: 0, total: 0 })
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score.acertos / score.total) * 100)
    return (
      <Screen>
        <div className="flex items-center gap-3 mb-4">
          <BackButton onClick={onBack} />
          <h1 className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>
            RESULTADO
          </h1>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-full text-5xl font-bold text-white"
            style={{ background: pct >= 70 ? PALETTE.green : PALETTE.orange, boxShadow: `0 8px 0 ${shade(pct >= 70 ? PALETTE.green : PALETTE.orange, -26)}` }}
          >
            {pct}%
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
              {pct >= 70 ? "MUITO BEM! ⭐" : "CONTINUE PRATICANDO!"}
            </h2>
            <p className="mt-1 text-base font-medium" style={{ color: PALETTE.blue }}>
              {score.acertos} DE {score.total} CORRETAS
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <PrimaryButton color={PALETTE.green} onClick={restart}>
              JOGAR DE NOVO
            </PrimaryButton>
            <PrimaryButton color={PALETTE.blue} onClick={onBack}>
              VOLTAR
            </PrimaryButton>
          </div>
        </div>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="flex items-center gap-3 mb-3">
        <BackButton onClick={onBack} />
        <h1 className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>
          NÚMEROS E SÍMBOLOS
        </h1>
      </div>

      {/* Progress */}
      <div className="mb-4 flex gap-1">
        {CAT_ITEMS.map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{ background: i < idx ? PALETTE.green : i === idx ? PALETTE.blue : "#ffffff88" }}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center gap-4">
        {/* Item display */}
        <div
          className="anim-pop flex h-40 w-40 items-center justify-center rounded-[32px] text-8xl font-bold text-white"
          key={idx}
          style={{
            background: answered
              ? answered === item.correct
                ? PALETTE.green
                : PALETTE.coral
              : PALETTE.blue,
            boxShadow: `0 10px 0 ${shade(answered ? (answered === item.correct ? PALETTE.green : PALETTE.coral) : PALETTE.blue, -26)}`,
          }}
        >
          {item.char}
        </div>

        {/* Category buttons */}
        <p className="text-center text-base font-bold" style={{ color: PALETTE.blueDeep }}>
          ISSO É UMA...
        </p>

        <div className="flex w-full flex-col gap-3">
          {(["LETRA", "NÚMERO", "SÍMBOLO"] as Category[]).map((cat) => {
            const isChosen = answered === cat
            const isCorrect = answered && cat === item.correct
            const isWrong = isChosen && answered !== item.correct
            return (
              <button
                key={cat}
                onClick={() => choose(cat)}
                disabled={!!answered}
                className="tap-shrink rounded-2xl py-4 text-xl font-bold text-white"
                style={{
                  background: isCorrect ? PALETTE.green : isWrong ? PALETTE.coral : CAT_COLORS[cat],
                  boxShadow: `0 6px 0 ${shade(isCorrect ? PALETTE.green : isWrong ? PALETTE.coral : CAT_COLORS[cat], -26)}`,
                  opacity: answered && !isChosen && cat !== item.correct ? 0.55 : 1,
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Hint on wrong */}
        {answered && answered !== item.correct && (
          <div
            className="anim-rise w-full rounded-2xl p-4 text-center"
            style={{ background: PALETTE.cream }}
          >
            <span className="text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
              💡 {item.hint}
            </span>
          </div>
        )}
      </div>
    </Screen>
  )
}
