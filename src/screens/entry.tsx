import { FloatingBits, Screen, shade } from "../components/kit"
import { PALETTE, playTone } from "../lib/store"
import React from "react"

export function Entry({
  onAluno,
  onProfessor,
}: {
  onAluno: () => void
  onProfessor: () => void
}) {
  return (
    <Screen>
      <FloatingBits />

      {/* Hero — large centered wordmark, no animals */}
      <div className="flex flex-1 flex-col items-center justify-center gap-2 pb-4">
        <HeroBrand />
        <p
          className="mt-3 rounded-full bg-white/80 px-6 py-2 text-center text-base font-semibold"
          style={{ color: PALETTE.blueDeep }}
        >
          Como você deseja entrar?
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        <RoleButton
          label="ALUNO"
          hint="Jogar e aprender"
          color={PALETTE.green}
          onClick={onAluno}
          icon={
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#fff" />
              <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="#fff" />
            </svg>
          }
        />
        <RoleButton
          label="PROFESSOR"
          hint="Acompanhar a turma"
          color={PALETTE.blue}
          onClick={onProfessor}
          icon={
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="12" rx="2" fill="#fff" />
              <rect x="7" y="7" width="10" height="1.6" rx="0.8" fill={PALETTE.blue} />
              <rect x="7" y="10.4" width="7" height="1.6" rx="0.8" fill={PALETTE.blue} />
              <path d="M9 20h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
        />
      </div>
    </Screen>
  )
}

/* ---- Hero wordmark ---- */
function HeroBrand() {
  const colors = [PALETTE.orange, PALETTE.blue, PALETTE.green]
  const shad = (c: string) => shade(c, -32)

  return (
    <div className="flex flex-col items-center select-none">
      {/* ABC letters — very large, 3-D effect */}
      <div className="flex items-end gap-3">
        {["A", "B", "C"].map((ch, i) => (
          <span
            key={ch}
            className="anim-float inline-block font-bold leading-none"
            style={{
              fontSize: 108,
              color: colors[i],
              WebkitTextStroke: "5px #fff",
              paintOrder: "stroke fill",
              textShadow: `0 10px 0 ${shad(colors[i])}, 0 16px 28px ${colors[i]}55`,
              animationDelay: `${i * 0.18}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      {/* KIDS subtitle — proportionally sized */}
      <span
        className="font-bold tracking-[0.22em]"
        style={{
          fontSize: 52,
          marginTop: -10,
          color: PALETTE.blueDeep,
          WebkitTextStroke: "3px #fff",
          paintOrder: "stroke fill",
          textShadow: "0 6px 16px rgba(49,84,119,.3)",
        }}
      >
        KIDS
      </span>
      {/* Tagline pill */}
      <div
        className="mt-4 rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
        style={{ background: PALETTE.orange, boxShadow: `0 4px 0 ${shad(PALETTE.orange)}` }}
      >
        APRENDER É DIVERTIDO!
      </div>
    </div>
  )
}

function RoleButton({
  label,
  hint,
  color,
  icon,
  onClick,
}: {
  label: string
  hint: string
  color: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={() => { playTone("tap"); onClick() }}
      className="tap-shrink flex w-full items-center gap-4 rounded-[28px] px-5 py-4 text-left text-white"
      style={{ background: color, boxShadow: `0 8px 0 ${shade(color, -26)}, 0 14px 22px ${color}55` }}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "rgba(255,255,255,0.22)" }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-none">{label}</div>
        <div className="mt-1 text-sm font-medium opacity-90">{hint}</div>
      </div>
      <svg className="ml-auto shrink-0" width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M9 5l7 7-7 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
