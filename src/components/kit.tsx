import React, { useEffect, useState } from "react"
import { AnimalAvatar, SkyBackground, Sparkle, Star } from "./art"
import { Character, PALETTE, playTone } from "../lib/store"

/* 9:16 phone canvas, centered, with soft device frame. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-[#cfe9f7] p-2 sm:p-5">
      <div
        className="relative overflow-hidden bg-white shadow-[0_30px_80px_rgba(49,84,119,0.35)]"
        style={{
          width: "min(430px, 100%)",
          aspectRatio: "9 / 16",
          maxHeight: "calc(100vh - 24px)",
          borderRadius: 40,
          border: "8px solid #ffffff",
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Vertically scrolling screen area within the phone, respecting safe area padding. */
export function Screen({
  children,
  variant = "day",
  className = "",
  pad = true,
}: {
  children: React.ReactNode
  variant?: "day" | "night"
  className?: string
  pad?: boolean
}) {
  return (
    <div className="relative h-full w-full">
      <SkyBackground variant={variant} />
      <div
        className={`relative flex h-full w-full flex-col ${pad ? "px-6 pt-7 pb-7" : ""} ${className}`}
      >
        {children}
      </div>
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  color = PALETTE.blue,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  color?: string
  className?: string
}) {
  return (
    <button
      onClick={() => {
        if (disabled) return
        playTone("tap")
        onClick?.()
      }}
      disabled={disabled}
      className={`tap-shrink w-full rounded-full py-4 text-center text-xl font-bold text-white ${className}`}
      style={{
        background: disabled ? "#C4D3DE" : color,
        boxShadow: disabled
          ? "none"
          : `0 8px 0 ${shade(color, -26)}, 0 14px 22px ${color}66`,
        opacity: disabled ? 0.75 : 1,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={() => {
        playTone("tap")
        onClick?.()
      }}
      className={`tap-shrink w-full rounded-full py-3.5 text-center text-lg font-semibold ${className}`}
      style={{
        background: PALETTE.cream,
        color: PALETTE.blueDeep,
        boxShadow: "0 5px 0 #E7DCC6",
      }}
    >
      {children}
    </button>
  )
}

/** Round back button — always returns to a given target. */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={() => {
        playTone("tap")
        onClick()
      }}
      aria-label="Voltar"
      className="tap-shrink flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: PALETTE.blue, boxShadow: `0 5px 0 ${shade(PALETTE.blue, -26)}` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

/** Standard game header: back (→ Home) + game name + child avatar. */
export function GameHeader({
  title,
  onBack,
  character,
  accent,
}: {
  title: string
  onBack: () => void
  character: Character
  accent: string
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <BackButton onClick={onBack} />
      <div
        className="flex-1 truncate rounded-full px-4 py-2 text-center text-lg font-bold text-white"
        style={{ background: accent, boxShadow: `0 4px 0 ${shade(accent, -24)}` }}
      >
        {title}
      </div>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white"
        style={{ boxShadow: "0 4px 10px rgba(49,84,119,0.2)" }}
      >
        <AnimalAvatar animal={character.animal} character={character} size={40} happy />
      </div>
    </div>
  )
}

/** Small "SAIR" pill for the top-right of student/teacher areas. */
export function ExitButton({ onClick, dark = false }: { onClick: () => void; dark?: boolean }) {
  return (
    <button
      onClick={() => {
        playTone("tap")
        onClick()
      }}
      className="tap-shrink flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
      style={{
        background: dark ? "#ffffff" : PALETTE.coral,
        color: dark ? PALETTE.coral : "#fff",
        boxShadow: dark ? "0 3px 8px rgba(49,84,119,0.15)" : `0 4px 0 ${shade(PALETTE.coral, -26)}`,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 4h3a1 1 0 011 1v14a1 1 0 01-1 1h-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8l-4 4 4 4M6 12h9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      SAIR
    </button>
  )
}

/** Confirmation dialog: "Tem certeza que deseja sair?" */
export function ConfirmExit({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6">
      <div className="absolute inset-0" style={{ background: "rgba(49,84,119,0.35)" }} onClick={onCancel} />
      <div
        className="anim-pop relative w-full max-w-sm rounded-[30px] bg-white p-6 text-center"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <h3 className="text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
          Tem certeza que deseja sair?
        </h3>
        <p className="mt-2 mb-5 text-sm font-medium" style={{ color: PALETTE.blue }}>
          Seus dados ficam salvos com segurança.
        </p>
        <div className="flex flex-col gap-2">
          <SecondaryButton onClick={onCancel}>CANCELAR</SecondaryButton>
          <PrimaryButton color={PALETTE.coral} onClick={onConfirm}>
            SAIR
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

/** Big celebratory / retry feedback overlay. */
export function Feedback({
  state,
  onNext,
  character,
  message,
  nextLabel = "PRÓXIMO",
  onRetry,
  onReplay,
  score,
}: {
  state: "correct" | "wrong" | null
  onNext?: () => void
  onRetry?: () => void
  onReplay?: () => void
  character: Character
  message?: string
  nextLabel?: string
  score?: { acertos: number; tentativas: number; pct: number } | null
}) {
  useEffect(() => {
    if (state === "correct") playTone("correct")
    if (state === "wrong") playTone("wrong")
  }, [state])

  if (!state) return null
  const correct = state === "correct"
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(49,84,119,0.28)" }}
        onClick={correct ? undefined : onRetry}
      />
      {correct && <Confetti />}
      <div
        className="anim-rise relative m-4 w-full max-w-sm rounded-[34px] bg-white p-6 text-center"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <div className="mx-auto -mt-24 mb-2 w-fit">
          <div className={correct ? "anim-bounce" : "anim-shake"}>
            <AnimalAvatar animal={character.animal} character={character} size={110} happy={correct} />
          </div>
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          {correct && <Star size={26} />}
          <h3 className="text-2xl font-bold" style={{ color: correct ? PALETTE.green : PALETTE.blue }}>
            {message || (correct ? "MUITO BEM!" : "Quase lá!")}
          </h3>
          {correct && <Star size={26} />}
        </div>
        {!correct && (
          <p className="mb-4 text-base font-medium" style={{ color: PALETTE.blueDeep }}>
            Vamos tentar de novo?
          </p>
        )}
        {correct && score && (
          <div className="mb-4">
            <p className="text-base font-semibold" style={{ color: PALETTE.blueDeep }}>
              Você acertou {score.acertos} de {score.tentativas}!
            </p>
            <div
              className="mx-auto mt-2 w-fit rounded-full px-4 py-1 text-lg font-bold text-white"
              style={{ background: PALETTE.green }}
            >
              {score.pct}% de aproveitamento
            </div>
          </div>
        )}
        {correct ? (
          <div className="flex flex-col gap-2">
            <PrimaryButton color={PALETTE.green} onClick={onNext}>
              {nextLabel} →
            </PrimaryButton>
            {onReplay && (
              <SecondaryButton onClick={onReplay}>JOGAR NOVAMENTE</SecondaryButton>
            )}
          </div>
        ) : (
          <PrimaryButton color={PALETTE.blue} onClick={onRetry}>
            TENTAR DE NOVO
          </PrimaryButton>
        )}
      </div>
    </div>
  )
}

export function Confetti() {
  const colors = [PALETTE.yellow, PALETTE.pink, PALETTE.green, PALETTE.blue, PALETTE.orange, PALETTE.lilac]
  const bits = React.useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.6 + Math.random() * 1.2,
        color: colors[i % colors.length],
        size: 7 + Math.random() * 8,
        rot: Math.random() * 360,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: -20,
            left: `${b.left}%`,
            width: b.size,
            height: b.size * 0.6,
            background: b.color,
            borderRadius: 2,
            transform: `rotate(${b.rot}deg)`,
            animation: `abc-confetti-fall ${b.dur}s ${b.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

/** Small floating decorative sparkles layer. */
export function FloatingBits() {
  return (
    <>
      <Sparkle size={20} className="anim-twinkle absolute left-6 top-24" color={PALETTE.yellow} />
      <Sparkle size={14} className="anim-twinkle absolute right-10 top-40" style={{ animationDelay: "0.8s" }} color="#fff" />
      <Star size={18} className="anim-twinkle absolute right-8 top-20" style={{ animationDelay: "1.2s" }} />
    </>
  )
}

/** Toggle-reset helper hook so a game round can be replayed. */
export function useRound() {
  const [round, setRound] = useState(0)
  return { round, reset: () => setRound((r) => r + 1) }
}

export function shade(hex: string, amt: number) {
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
