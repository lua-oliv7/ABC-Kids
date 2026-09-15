import React from "react"
import { ObjectIcon } from "../components/art"
import { BackButton, Screen, shade } from "../components/kit"
import { GAMES, PALETTE, Student, gameStats, playTone } from "../lib/store"

export function LevelGames({
  student,
  level,
  onOpenGame,
  onBack,
}: {
  student: Student
  level: "silabico" | "alfabetico"
  onOpenGame: (id: number) => void
  onBack: () => void
}) {
  const isAlfa = level === "alfabetico"
  const accent = isAlfa ? PALETTE.lilac : PALETTE.turquoise
  const title = isAlfa ? "NÍVEL ALFABÉTICO" : "NÍVEL SILÁBICO-ALFABÉTICO"
  const subtitle = isAlfa ? "Jogos mais desafiadores!" : "Aprenda brincando!"

  return (
    <Screen pad={false}>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: PALETTE.blueDeep }}>
              {title}
            </h1>
            <p className="text-sm font-medium" style={{ color: PALETTE.blue }}>{subtitle}</p>
          </div>
        </div>

        {/* Level badge */}
        <div
          className="mb-5 flex items-center gap-3 rounded-[22px] px-4 py-3"
          style={{
            background: accent,
            boxShadow: `0 5px 0 ${shade(accent, -26)}, 0 8px 20px ${accent}55`,
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            {isAlfa ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#fff" opacity="0.9" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 18l-6.2 3 1.2-6.8L2 9.3l6.9-1L12 2z" fill="#fff" opacity="0.9" />
              </svg>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              {isAlfa ? "CONTEÚDO AVANÇADO" : "CONTEÚDO PADRÃO"}
            </div>
            <div className="text-xs text-white/80">
              {isAlfa ? "Grupos consonantais e palavras longas" : "Sílabas simples e palavras básicas"}
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="mb-3">
          <h2 className="text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
            ESCOLHA UM JOGO
          </h2>
          <p className="text-sm font-medium" style={{ color: PALETTE.blue }}>
            TOQUE PARA COMEÇAR A JOGAR!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {GAMES.map((g, i) => {
            const stats = gameStats(student, g.id)
            return (
              <button
                key={g.id}
                onClick={() => {
                  playTone("tap")
                  onOpenGame(g.id)
                }}
                className="tap-shrink anim-pop relative flex flex-col items-center overflow-hidden rounded-[26px] p-3 text-center"
                style={{
                  background: g.colors[0],
                  boxShadow: `0 7px 0 ${shade(g.colors[0], -26)}, 0 12px 20px ${g.colors[0]}55`,
                  animationDelay: `${i * 0.03}s`,
                }}
              >
                {stats.pct !== null && (
                  <span
                    className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ background: "#ffffff", color: shade(g.colors[0], -60) }}
                  >
                    {stats.pct}%
                  </span>
                )}
                <div
                  className="mb-2 flex h-[92px] w-full items-center justify-center rounded-2xl"
                  style={{ background: "#ffffffea" }}
                >
                  <ObjectIcon name={g.icon} size={78} />
                </div>
                <span
                  className="text-[13px] font-bold leading-tight text-white"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
                >
                  {g.title.toUpperCase()}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
