import { useEffect, useState } from "react"
import { PALETTE, speak } from "../lib/store"
import { shade } from "../components/kit"
import {
  GameProps,
  GameShell,
  OutcomeOverlay,
  ProgressDots,
  SpeakButton,
  useOutcome,
} from "./shell"

/* ============================= GAME 13 — ALIMENTE O MONSTRINHO ============================= */

interface MonsterRound {
  syllable: string   // syllable to find
  words: { text: string; hasIt: boolean }[]  // words shown on screen
  hint: string
}

const ROUNDS: MonsterRound[] = [
  {
    syllable: "MA",
    words: [
      { text: "MAMÃO", hasIt: true },
      { text: "BOLA", hasIt: false },
      { text: "MACACO", hasIt: true },
      { text: "GATO", hasIt: false },
      { text: "MALA", hasIt: true },
      { text: "CASA", hasIt: false },
    ],
    hint: "MA aparece em MAMÃO, MACACO e MALA!",
  },
  {
    syllable: "CA",
    words: [
      { text: "CASA", hasIt: true },
      { text: "BOLA", hasIt: false },
      { text: "CACHORRO", hasIt: true },
      { text: "SOL", hasIt: false },
      { text: "CAMA", hasIt: true },
      { text: "PATO", hasIt: false },
    ],
    hint: "CA aparece em CASA, CACHORRO e CAMA!",
  },
  {
    syllable: "BA",
    words: [
      { text: "BALA", hasIt: true },
      { text: "GATO", hasIt: false },
      { text: "BANCO", hasIt: true },
      { text: "SOL", hasIt: false },
      { text: "BATA", hasIt: true },
      { text: "LIVRO", hasIt: false },
    ],
    hint: "BA aparece em BALA, BANCO e BATA!",
  },
  {
    syllable: "SA",
    words: [
      { text: "SAPO", hasIt: true },
      { text: "BOLA", hasIt: false },
      { text: "SAPATO", hasIt: true },
      { text: "GATO", hasIt: false },
      { text: "SALA", hasIt: true },
      { text: "CASA", hasIt: false },
    ],
    hint: "SA aparece em SAPO, SAPATO e SALA!",
  },
  {
    syllable: "BO",
    words: [
      { text: "BOLA", hasIt: true },
      { text: "SAPO", hasIt: false },
      { text: "BONECA", hasIt: true },
      { text: "LIVRO", hasIt: false },
      { text: "BORBOLETA", hasIt: true },
      { text: "CASA", hasIt: false },
    ],
    hint: "BO aparece em BOLA, BONECA e BORBOLETA!",
  },
]

/* ---- Monster SVG ---- */
function Monster({ happy, eating, color }: { happy: boolean; eating: boolean; color: string }) {
  const eyeY = happy ? 38 : 36
  const mouthD = happy
    ? "M 26 55 Q 40 68 54 55"
    : eating
    ? "M 22 52 Q 40 72 58 52 Q 40 44 22 52Z"
    : "M 28 56 Q 40 52 52 56"

  return (
    <svg width="110" height="120" viewBox="0 0 80 90">
      {/* Body */}
      <ellipse cx="40" cy="52" rx="32" ry="30" fill={color} />
      {/* Head bumps */}
      <ellipse cx="40" cy="28" rx="26" ry="22" fill={color} />
      {/* Horns */}
      <polygon points="20,20 15,4 26,16" fill={shade(color, -20)} />
      <polygon points="60,20 65,4 54,16" fill={shade(color, -20)} />
      {/* Eyes */}
      <circle cx="28" cy={eyeY} r="8" fill="#fff" />
      <circle cx="52" cy={eyeY} r="8" fill="#fff" />
      <circle cx={happy ? 30 : 29} cy={eyeY} r="4" fill="#1a1a2e" />
      <circle cx={happy ? 54 : 53} cy={eyeY} r="4" fill="#1a1a2e" />
      {/* Shine */}
      <circle cx={happy ? 31 : 30} cy={eyeY - 2} r="1.5" fill="#fff" />
      <circle cx={happy ? 55 : 54} cy={eyeY - 2} r="1.5" fill="#fff" />
      {/* Mouth */}
      <path d={mouthD} fill={eating ? "#1a1a2e" : "none"}
        stroke={eating ? "none" : "#1a1a2e"} strokeWidth="2.5" strokeLinecap="round" />
      {/* Teeth when eating */}
      {eating && (
        <>
          <rect x="27" y="52" width="6" height="7" rx="2" fill="#fff" />
          <rect x="37" y="52" width="6" height="7" rx="2" fill="#fff" />
          <rect x="47" y="52" width="6" height="7" rx="2" fill="#fff" />
        </>
      )}
      {/* Arms */}
      <ellipse cx="10" cy="55" rx="8" ry="12" fill={color} transform="rotate(-20 10 55)" />
      <ellipse cx="70" cy="55" rx="8" ry="12" fill={color} transform="rotate(20 70 55)" />
      {/* Belly spots */}
      <circle cx="34" cy="60" r="4" fill={shade(color, 20)} opacity="0.5" />
      <circle cx="46" cy="65" r="3" fill={shade(color, 20)} opacity="0.5" />
      <circle cx="40" cy="72" r="3.5" fill={shade(color, 20)} opacity="0.5" />
    </svg>
  )
}

/* ---- Word bubble that floats around ---- */
function WordBubble({
  word,
  hasIt,
  x,
  y,
  eaten,
  wrong: isWrong,
  onTap,
  accent,
}: {
  word: string
  hasIt: boolean
  x: number
  y: number
  eaten: boolean
  wrong: boolean
  onTap: () => void
  accent: string
}) {
  if (eaten) return null
  return (
    <button
      onClick={onTap}
      className="tap-shrink absolute rounded-full font-bold text-white uppercase text-sm"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        background: isWrong ? PALETTE.coral : accent,
        boxShadow: `0 4px 0 ${shade(isWrong ? PALETTE.coral : accent, -26)}, 0 6px 16px rgba(0,0,0,0.2)`,
        padding: "8px 14px",
        border: "3px solid rgba(255,255,255,0.4)",
        animation: `float-${(x + y) % 3} 3s ease-in-out infinite`,
        animationDelay: `${(x * 0.07).toFixed(1)}s`,
        minWidth: 80,
      }}
    >
      {word}
    </button>
  )
}

/* Static layout positions for 6 bubbles — evenly spread */
const BUBBLE_POSITIONS = [
  { x: 18, y: 25 }, { x: 72, y: 22 }, { x: 82, y: 55 },
  { x: 65, y: 78 }, { x: 20, y: 75 }, { x: 10, y: 52 },
]

const ROUNDS_ALFA: MonsterRound[] = [
  {
    syllable: "GRA",
    words: [
      { text: "GRANDE",   hasIt: true },
      { text: "BOLA",     hasIt: false },
      { text: "GRAMA",    hasIt: true },
      { text: "GATO",     hasIt: false },
      { text: "GRAÇA",    hasIt: true },
      { text: "CASA",     hasIt: false },
    ],
    hint: "GRA aparece em GRANDE, GRAMA e GRAÇA!",
  },
  {
    syllable: "FLO",
    words: [
      { text: "FLOR",     hasIt: true },
      { text: "SAPO",     hasIt: false },
      { text: "FLOCO",    hasIt: true },
      { text: "LIVRO",    hasIt: false },
      { text: "FLORESTA", hasIt: true },
      { text: "GATO",     hasIt: false },
    ],
    hint: "FLO aparece em FLOR, FLOCO e FLORESTA!",
  },
  {
    syllable: "TRA",
    words: [
      { text: "TRATOR",   hasIt: true },
      { text: "BOLA",     hasIt: false },
      { text: "TRABALHO", hasIt: true },
      { text: "GATO",     hasIt: false },
      { text: "TRAGO",    hasIt: true },
      { text: "CASA",     hasIt: false },
    ],
    hint: "TRA aparece em TRATOR, TRABALHO e TRAGO!",
  },
  {
    syllable: "PRE",
    words: [
      { text: "PREGO",    hasIt: true },
      { text: "SAPO",     hasIt: false },
      { text: "PREVER",   hasIt: true },
      { text: "LIVRO",    hasIt: false },
      { text: "PRETO",    hasIt: true },
      { text: "BOLA",     hasIt: false },
    ],
    hint: "PRE aparece em PREGO, PREVER e PRETO!",
  },
  {
    syllable: "CRE",
    words: [
      { text: "CRENÇA",   hasIt: true },
      { text: "BOLA",     hasIt: false },
      { text: "CRESCER",  hasIt: true },
      { text: "GATO",     hasIt: false },
      { text: "CRENTE",   hasIt: true },
      { text: "CASA",     hasIt: false },
    ],
    hint: "CRE aparece em CRENÇA, CRESCER e CRENTE!",
  },
]

export function Game12({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? ROUNDS_ALFA : ROUNDS
  const o = useOutcome()
  const [roundIdx, setRoundIdx] = useState(0)
  const [eaten, setEaten] = useState<number[]>([])
  const [wrongIdx, setWrongIdx] = useState<number | null>(null)
  const [monsterState, setMonsterState] = useState<"idle" | "eating" | "happy">("idle")
  const rd = DATA[roundIdx]
  const needed = rd.words.filter((w) => w.hasIt).length

  useEffect(() => {
    setTimeout(() => { speak(rd.syllable, true) }, 400)
  }, [roundIdx])

  const resetRound = (newIdx: number) => {
    setRoundIdx(newIdx)
    setEaten([])
    setWrongIdx(null)
    setMonsterState("idle")
  }

  const tapWord = (i: number) => {
    if (eaten.includes(i) || o.state) return
    const w = rd.words[i]
    speak(w.text)

    if (!w.hasIt) {
      setWrongIdx(i)
      setTimeout(() => setWrongIdx(null), 600)
      const advance = () => {
        if (roundIdx >= DATA.length - 1) onAdvance()
        else resetRound(roundIdx + 1)
      }
      o.wrong(advance, rd.words.filter((w) => w.hasIt).map((w) => w.text).join(", "))
      return
    }

    // Correct — eat the word
    setMonsterState("eating")
    const ne = [...eaten, i]
    setEaten(ne)
    setTimeout(() => setMonsterState("idle"), 500)

    if (ne.filter((idx) => rd.words[idx].hasIt).length >= needed) {
      setMonsterState("happy")
      speak(rd.syllable)
      setTimeout(() => {
        if (roundIdx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); resetRound(roundIdx + 1) }
      }, 900)
    }
  }

  const monsterColor = [PALETTE.green, PALETTE.blue, PALETTE.orange, PALETTE.pink, PALETTE.lilac][roundIdx % 5]
  const foundCount = eaten.filter((i) => rd.words[i].hasIt).length

  return (
    <GameShell title="Alimente o Monstrinho" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col">
        <ProgressDots total={DATA.length} current={roundIdx} color={accent} />

        {/* Syllable display */}
        <div className="mb-1 flex items-center justify-center gap-3">
          <div className="rounded-2xl bg-white/90 px-5 py-2" style={{ boxShadow: "0 6px 18px rgba(49,84,119,0.16)" }}>
            <span className="text-4xl font-bold" style={{ color: accent }}>{rd.syllable}</span>
          </div>
          <SpeakButton text={rd.syllable} label="OUVIR SÍLABA" />
        </div>

        <div
          className="text-center text-xs font-bold uppercase mb-1"
          style={{ color: PALETTE.blueDeep }}
        >
          PALAVRAS COM "{rd.syllable}": {foundCount}/{needed}
        </div>

        {/* Game arena — monster + floating words */}
        <div className="relative flex-1 rounded-[24px] overflow-hidden"
          style={{ background: "linear-gradient(180deg, #d4f0ff 0%, #f0fff8 100%)" }}>

          {/* Monster centered at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <Monster happy={monsterState === "happy"} eating={monsterState === "eating"} color={monsterColor} />
            <div
              className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold text-white"
              style={{ background: monsterColor, boxShadow: `0 3px 0 ${shade(monsterColor, -24)}` }}>
              {monsterState === "happy" ? "DELÍCIA! 🎉" : monsterState === "eating" ? "NOM NOM!" : "DÁ-ME A SÍLABA!"}
            </div>
          </div>

          {/* Floating word bubbles */}
          {rd.words.map((w, i) => (
            <WordBubble
              key={`${roundIdx}-${i}`}
              word={w.text}
              hasIt={w.hasIt}
              x={BUBBLE_POSITIONS[i % BUBBLE_POSITIONS.length].x}
              y={BUBBLE_POSITIONS[i % BUBBLE_POSITIONS.length].y}
              eaten={eaten.includes(i)}
              wrong={wrongIdx === i}
              onTap={() => tapWord(i)}
              accent={accent2}
            />
          ))}
        </div>
      </div>

      <OutcomeOverlay state={o.state} character={character} hint={rd.hint}
        clear={() => { o.clear(); setWrongIdx(null) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}
