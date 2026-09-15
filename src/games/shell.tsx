import React, { createContext, useContext, useRef, useState } from "react"
import { AnimalAvatar, ObjectIcon, Sparkle } from "../components/art"
import { Feedback, GameHeader, PrimaryButton, Screen, shade } from "../components/kit"
import { Character, PALETTE, PlayResult, playTone, speak } from "../lib/store"

export interface GameProps {
  character: Character
  accent: string
  accent2: string
  onHome: () => void
  onAdvance: () => void
  isLast: boolean
  level?: "silabico" | "alfabetico"
}

export const GameRecorderCtx = createContext<{
  rounds: number
  record: (r: PlayResult) => void
  lastResult: PlayResult | null
}>({ rounds: 1, record: () => {}, lastResult: null })

export function GameShell({
  title,
  character,
  accent,
  onHome,
  children,
  variant = "day",
}: {
  title: string
  character: Character
  accent: string
  onHome: () => void
  children: React.ReactNode
  variant?: "day" | "night"
}) {
  return (
    <Screen variant={variant}>
      <GameHeader title={title} onBack={onHome} character={character} accent={accent} />
      <div className="min-h-0 flex-1">{children}</div>
    </Screen>
  )
}

/**
 * Two-attempt mechanic:
 *   1st wrong  → "hint" state  — dica, player retries, no answer shown
 *   2nd wrong  → "revealed" state — correct answer shown, auto-advance after 2.6 s, 0 acertos for this exercise
 *   correct    → "correct" state — records score (acertos reduced by number of 2nd-wrong failures)
 */
export function useOutcome() {
  const ctx = useContext(GameRecorderCtx)
  const [state, setState] = useState<"correct" | "hint" | "revealed" | null>(null)
  const wrongScore = useRef(0)       // total wrong taps (for scoring)
  const wrongAttempt = useRef(0)     // attempt gate per exercise (resets between exercises)
  const failedExercises = useRef(0)  // how many exercises were auto-failed (2nd wrong)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return {
    state,

    correct: () => {
      const rounds = ctx.rounds
      const passed = Math.max(0, rounds - failedExercises.current)
      const w = wrongScore.current
      const tentativas = rounds + w
      ctx.record({
        acertos: passed,
        erros: w,
        tentativas,
        pct: rounds > 0 ? Math.round((passed / tentativas) * 100) : 0,
      })
      setState("correct")
      wrongAttempt.current = 0
      failedExercises.current = 0
    },

    /**
     * @param advance  — called automatically 2.6 s after the 2nd wrong (move to next exercise or end game)
     * @param answer   — the correct answer text, shown in the revealed card
     */
    wrong: (advance?: () => void, answer?: string) => {
      wrongScore.current += 1
      wrongAttempt.current += 1
      playTone("wrong")

      if (wrongAttempt.current <= 1) {
        // first wrong: show hint only
        setState("hint")
      } else {
        // second wrong: mark exercise failed, show answer, auto-advance
        wrongAttempt.current = 0
        failedExercises.current += 1
        setState(`revealed:${answer ?? ""}` as any)   // encode answer in state string

        if (advance) {
          if (autoTimer.current) clearTimeout(autoTimer.current)
          autoTimer.current = setTimeout(() => {
            setState(null)
            advance()
          }, 2700)
        }
      }
    },

    clear: () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
      setState(null)
    },

    /** Call between exercises (correct passage) — resets the 2-attempt gate. */
    advanceExercise: () => {
      wrongAttempt.current = 0
      setState(null)
    },
  }
}

/* Helper: decode state */
function parseState(state: string | null) {
  if (!state) return { kind: null as null, answer: "" }
  if (state === "correct") return { kind: "correct" as const, answer: "" }
  if (state === "hint") return { kind: "hint" as const, answer: "" }
  if (state.startsWith("revealed:")) return { kind: "revealed" as const, answer: state.slice(9) }
  return { kind: null as null, answer: "" }
}

/* ---- Hint card — 1st wrong ---- */
function HintCard({ character, hint, onDismiss }: { character: Character; hint?: string; onDismiss: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(49,84,119,0.28)" }} onClick={onDismiss} />
      <div
        className="anim-rise relative m-4 w-full max-w-sm rounded-[34px] bg-white p-6 text-center"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <div className="mx-auto -mt-24 mb-3 w-fit">
          <div className="anim-shake">
            <AnimalAvatar animal={character.animal} character={character} size={100} happy={false} />
          </div>
        </div>
        <div
          className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white"
          style={{ background: PALETTE.orange }}
        >
          <Sparkle size={14} color="#fff" />
          DICA
        </div>
        <h3 className="mb-2 text-xl font-bold uppercase" style={{ color: PALETTE.blueDeep }}>
          QUASE LÁ! MAIS UMA CHANCE!
        </h3>
        <div
          className="mb-4 rounded-2xl p-3 text-sm font-semibold uppercase"
          style={{ background: PALETTE.cream, color: PALETTE.blueDeep }}
        >
          💡 {hint ?? "OUÇA BEM O SOM DAS LETRAS E TENTE DE NOVO!"}
        </div>
        <PrimaryButton color={PALETTE.blue} onClick={onDismiss}>
          TENTAR DE NOVO →
        </PrimaryButton>
      </div>
    </div>
  )
}

/* ---- Revealed card — 2nd wrong: show answer + countdown ---- */
function RevealedCard({ character, answer }: { character: Character; answer: string }) {
  const [count, setCount] = React.useState(3)
  React.useEffect(() => {
    const t = setInterval(() => setCount((c) => Math.max(0, c - 1)), 900)
    return () => clearInterval(t)
  }, [])
  React.useEffect(() => {
    if (answer) speak(answer, true)
  }, [answer])

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center">
      <div className="absolute inset-0" style={{ background: "rgba(30,20,50,0.55)" }} />
      <div
        className="anim-rise relative m-4 w-full max-w-sm rounded-[34px] bg-white p-6 text-center"
        style={{ boxShadow: "0 20px 60px rgba(49,84,119,0.45)" }}
      >
        <div className="mx-auto -mt-24 mb-3 w-fit">
          <AnimalAvatar animal={character.animal} character={character} size={100} happy={false} />
        </div>
        <div
          className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white"
          style={{ background: PALETTE.coral }}
        >
          ⚡ LIMITE DE TENTATIVAS
        </div>
        <h3 className="mb-2 text-base font-bold uppercase" style={{ color: PALETTE.blueDeep }}>
          A RESPOSTA CORRETA ERA:
        </h3>
        {answer && (
          <div
            key={answer}
            className="anim-pop mx-auto mb-3 inline-block rounded-2xl px-6 py-3 text-3xl font-bold text-white"
            style={{ background: PALETTE.green, boxShadow: `0 6px 0 ${shade(PALETTE.green, -28)}` }}
          >
            {answer}
          </div>
        )}
        <p className="mt-1 text-sm font-medium" style={{ color: PALETTE.blue }}>
          Avançando em <strong>{count}</strong>...
        </p>
      </div>
    </div>
  )
}

export function OutcomeOverlay({
  state,
  character,
  clear,
  onAdvance,
  isLast,
  hint,
}: {
  state: string | null
  character: Character
  clear: () => void
  onAdvance: () => void
  isLast: boolean
  hint?: string
}) {
  const { lastResult } = useContext(GameRecorderCtx)
  const parsed = parseState(state)

  if (parsed.kind === "hint") {
    return <HintCard character={character} hint={hint} onDismiss={clear} />
  }
  if (parsed.kind === "revealed") {
    return <RevealedCard character={character} answer={parsed.answer} />
  }

  return (
    <Feedback
      state={parsed.kind}
      character={character}
      onRetry={clear}
      onReplay={clear}
      onNext={onAdvance}
      nextLabel={isLast ? "FINALIZAR ⭐" : "PRÓXIMO"}
      message={parsed.kind === "correct" ? "MUITO BEM!" : "Quase lá!"}
      score={parsed.kind === "correct" ? lastResult : undefined}
    />
  )
}

/* ---------- Progress dots ---------- */
export function ProgressDots({ total, current, color }: { total: number; current: number; color: string }) {
  return (
    <div className="mb-2 flex justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? 18 : 10,
            height: 10,
            background: i < current ? color : i === current ? color : "#ffffff55",
            opacity: i === current ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  )
}

/* ---------- SpeakButton ---------- */
export function SpeakButton({ text, label = "OUVIR", slow = false }: { text: string; label?: string; slow?: boolean }) {
  return (
    <button
      onClick={() => speak(text, slow)}
      className="tap-shrink flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-white"
      style={{ background: PALETTE.blue, boxShadow: `0 4px 0 ${shade(PALETTE.blue, -26)}` }}
    >
      <ObjectIcon name="speaker" size={18} />
      {label}
    </button>
  )
}

/* ---------- Tile ---------- */
export function Tile({
  children,
  onClick,
  color = PALETTE.blue,
  size = 64,
  faded = false,
  active = false,
  disabled = false,
  className = "",
  speakText,
}: {
  children: React.ReactNode
  onClick?: () => void
  color?: string
  size?: number
  faded?: boolean
  active?: boolean
  disabled?: boolean
  className?: string
  speakText?: string
}) {
  return (
    <button
      onClick={() => {
        if (disabled) return
        if (speakText) speak(speakText)
        else playTone("tap")
        onClick?.()
      }}
      disabled={disabled}
      className={`tap-shrink flex items-center justify-center rounded-2xl font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: faded ? "#ffffffcc" : color,
        color: faded ? PALETTE.blueDeep : "#fff",
        border: active ? "4px solid #fff" : "none",
        boxShadow: faded ? "inset 0 2px 6px rgba(49,84,119,0.12)" : `0 5px 0 ${shade(color, -28)}`,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  )
}

export function Slot({
  letter,
  color = PALETTE.yellow,
  size = 64,
  onClick,
  highlight,
}: {
  letter?: string
  color?: string
  size?: number
  onClick?: () => void
  highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-2xl font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: letter ? color : "#ffffff",
        color: letter ? "#fff" : PALETTE.blue,
        border: `4px dashed ${highlight ? PALETTE.blue : PALETTE.sky}`,
        boxShadow: letter ? `0 5px 0 ${shade(color, -28)}` : "none",
      }}
    >
      {letter || ""}
    </button>
  )
}

export function Instruction({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mx-auto mb-4 w-fit rounded-full bg-white/85 px-5 py-2 text-center text-base font-bold uppercase"
      style={{ color: PALETTE.blueDeep }}
    >
      {children}
    </p>
  )
}
