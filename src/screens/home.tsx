import React from "react"
import { AnimalAvatar, Sparkle, Star } from "../components/art"
import { ExitButton, Screen, shade } from "../components/kit"
import { PALETTE, Student, playTone } from "../lib/store"
import { Logo } from "./onboarding"

export function Home({
  student,
  onOpenLevel,
  onOpenAlphabet,
  onOpenNumbers,
  onExit,
}: {
  student: Student
  onOpenLevel: (level: "silabico" | "alfabetico") => void
  onOpenAlphabet: () => void
  onOpenNumbers: () => void
  onExit: () => void
}) {
  const { name, character } = student
  return (
    <Screen pad={false}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-8">
        {/* Top brand row + SAIR */}
        <div className="mb-2 flex items-center justify-between">
          <div style={{ transform: "scale(0.42)", transformOrigin: "left center" }} className="-my-3">
            <Logo />
          </div>
          <ExitButton onClick={onExit} />
        </div>

        {/* Student character */}
        <div className="relative flex flex-col items-center pt-2 pb-4">
          <Sparkle size={16} className="anim-twinkle absolute left-10 top-2" color={PALETTE.yellow} />
          <Star size={14} className="anim-twinkle absolute right-12 top-4" style={{ animationDelay: "0.7s" }} />
          <div className="anim-float">
            <AnimalAvatar animal={character.animal} character={character} size={150} happy />
          </div>
          <div
            className="mx-auto -mt-3 h-6 rounded-full"
            style={{ width: 130, background: PALETTE.green, opacity: 0.5, filter: "blur(2px)" }}
          />
          <h1 className="mt-2 text-3xl font-bold" style={{ color: PALETTE.blueDeep }}>
            {name.toUpperCase()}
          </h1>
          <span
            className="mt-1 rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{ background: PALETTE.blue }}
          >
            ABC KIDS
          </span>
        </div>

        {/* ===== LEVEL SELECTION ===== */}
        <div className="mb-3">
          <h2 className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>
            NÍVEL DE APRENDIZAGEM
          </h2>
          <p className="text-sm font-medium" style={{ color: PALETTE.blue }}>
            SELECIONE O SEU NÍVEL:
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {/* Silábico-Alfabético — always unlocked */}
          <LevelCard
            label="SILÁBICO-ALFABÉTICO"
            subtitle="Nível atual"
            color={PALETTE.turquoise}
            unlocked
            active
            onClick={() => { playTone("tap"); onOpenLevel("silabico") }}
          />
          {/* Alfabético — locked until teacher unlocks */}
          <LevelCard
            label="ALFABÉTICO"
            subtitle="Bloqueado"
            color={PALETTE.lilac}
            unlocked={!!student.alphabeticoUnlocked}
            active={false}
            onClick={student.alphabeticoUnlocked ? () => { playTone("tap"); onOpenLevel("alfabetico") } : undefined}
          />
        </div>

        {/* Knowledge Hub */}
        <div className="mb-3">
          <h2 className="text-xl font-bold" style={{ color: PALETTE.blueDeep }}>
            ÁREA DE CONHECIMENTO
          </h2>
          <p className="text-sm font-medium" style={{ color: PALETTE.blue }}>
            APRENDA COM OS MÓDULOS ESPECIAIS!
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <ModuleCard
            label="ALFABETO"
            subtitle="A a Z com sons"
            color={PALETTE.lilac}
            icon={
              <div className="flex items-center gap-0.5">
                {["A", "B", "C"].map((l, i) => (
                  <span
                    key={l}
                    className="text-xl font-bold text-white"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", animationDelay: `${i * 0.1}s` }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            }
            onClick={onOpenAlphabet}
          />
          <ModuleCard
            label="NÚMEROS"
            subtitle="Letras e símbolos"
            color={PALETTE.turquoise}
            icon={
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>1</span>
                <span className="text-xl font-bold text-white opacity-75">A</span>
                <span className="text-xl font-bold text-white opacity-50">+</span>
              </div>
            }
            onClick={onOpenNumbers}
          />
        </div>

      </div>
    </Screen>
  )
}

function LevelCard({
  label,
  subtitle,
  color,
  unlocked,
  active,
  onClick,
}: {
  label: string
  subtitle: string
  color: string
  unlocked: boolean
  active: boolean
  onClick?: () => void
}) {
  const Tag = onClick ? "button" : "div"
  return (
    <Tag
      onClick={onClick}
      className={`relative flex flex-col items-center overflow-hidden rounded-[22px] p-4 text-center${onClick ? " tap-shrink" : ""}`}
      style={{
        background: unlocked ? color : "#B0C4D4",
        boxShadow: unlocked
          ? `0 6px 0 ${shade(color, -26)}, 0 10px 20px ${color}55`
          : "0 4px 0 #8AAABB, 0 8px 14px rgba(0,0,0,0.12)",
        opacity: unlocked ? 1 : 0.72,
      }}
    >
      {/* Lock icon for locked state */}
      {!unlocked && (
        <div
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.22)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#fff" opacity="0.9" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Active star badge */}
      {active && unlocked && (
        <div
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: PALETTE.yellow }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 18l-6.2 3 1.2-6.8L2 9.3l6.9-1L12 2z" fill="#fff" />
          </svg>
        </div>
      )}

      {/* Icon area */}
      <div
        className="mb-2 flex h-14 w-full items-center justify-center rounded-xl"
        style={{ background: "rgba(255,255,255,0.22)" }}
      >
        {unlocked ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 18l-6.2 3 1.2-6.8L2 9.3l6.9-1L12 2z"
              fill="#fff" opacity="0.9" />
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#fff" opacity="0.55" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          </svg>
        )}
      </div>

      <div className="text-[13px] font-bold text-white leading-tight" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.18)" }}>
        {label}
      </div>
      <div className="mt-0.5 text-[10px] font-bold text-white/75 uppercase tracking-wide">
        {unlocked ? (active ? "EM PROGRESSO" : "DISPONÍVEL") : "BLOQUEADO"}
      </div>
      {onClick && unlocked && (
        <div className="mt-1 text-[10px] font-bold text-white/90 uppercase tracking-widest">JOGAR ▶</div>
      )}
    </Tag>
  )
}

function ModuleCard({
  label,
  subtitle,
  color,
  icon,
  onClick,
}: {
  label: string
  subtitle: string
  color: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={() => { playTone("tap"); onClick() }}
      className="tap-shrink flex flex-col items-center gap-2 overflow-hidden rounded-[22px] p-4 text-center"
      style={{
        background: color,
        boxShadow: `0 6px 0 ${shade(color, -26)}, 0 10px 18px ${color}66`,
      }}
    >
      <div
        className="flex h-16 w-full items-center justify-center rounded-xl"
        style={{ background: "rgba(255,255,255,0.22)" }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold text-white leading-tight">{label}</div>
        <div className="text-[11px] text-white/80 font-medium">{subtitle.toUpperCase()}</div>
      </div>
    </button>
  )
}
