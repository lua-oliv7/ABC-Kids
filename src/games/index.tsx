import React, { useState } from "react"
import { GAMES, Character, PlayResult } from "../lib/store"
import { useApp } from "../lib/app"
import { GameProps, GameRecorderCtx } from "./shell"
import { Game01, Game02, Game03, Game04 } from "./part1"
import { Game05, Game06, Game07, Game08 } from "./part2"
import { Game09, Game10, Game11 } from "./part3"
import { Game12 } from "./part4"

const MAP: Record<number, (p: GameProps) => React.ReactNode> = {
  1: (p) => <Game01 {...p} />,
  2: (p) => <Game02 {...p} />,
  3: (p) => <Game03 {...p} />,
  4: (p) => <Game04 {...p} />,
  5: (p) => <Game05 {...p} />,
  6: (p) => <Game06 {...p} />,
  7: (p) => <Game07 {...p} />,
  8: (p) => <Game08 {...p} />,
  9: (p) => <Game09 {...p} />,
  10: (p) => <Game10 {...p} />,
  11: (p) => <Game11 {...p} />,
  12: (p) => <Game12 {...p} />,
}

export function GamePlayer({
  id,
  character,
  onHome,
  onAdvance,
  level = "silabico",
}: {
  id: number
  character: Character
  onHome: () => void
  onAdvance: () => void
  level?: "silabico" | "alfabetico"
}) {
  const meta = GAMES.find((g) => g.id === id)!
  const { recordPlay } = useApp()
  const [lastResult, setLastResult] = useState<PlayResult | null>(null)

  const record = (r: PlayResult) => {
    setLastResult(r)
    recordPlay(id, r)
  }

  const Comp = MAP[id]
  if (!Comp) return null

  return (
    <GameRecorderCtx.Provider value={{ rounds: meta.rounds, record, lastResult }}>
      <Comp
        character={character}
        accent={meta.colors[0]}
        accent2={meta.colors[1]}
        onHome={onHome}
        onAdvance={onAdvance}
        isLast={id === 12}
        level={level}
      />
    </GameRecorderCtx.Provider>
  )
}
