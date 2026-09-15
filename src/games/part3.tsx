import { useEffect, useMemo, useRef, useState } from "react"
import { ObjectIcon } from "../components/art"
import { PALETTE, speak } from "../lib/store"
import { shade } from "../components/kit"
import {
  GameProps,
  GameShell,
  Instruction,
  OutcomeOverlay,
  ProgressDots,
  SpeakButton,
  Tile,
  useOutcome,
} from "./shell"

/* ===== GAME 09 — RIMA OU NÃO RIMA ===== */
interface Ex09 { word: string; img: string; opts: { text: string; rhymes: boolean; img: string }[]; hint: string }

const EX09: Ex09[] = [
  { word: "BOLA", img: "ball",  hint: "BOLA rima com MOLA e COLA! Terminam com -OLA!",
    opts: [{ text:"MOLA", rhymes:true, img:"ball" },{ text:"GATO", rhymes:false, img:"cat" },{ text:"COLA", rhymes:true, img:"glue" }] },
  { word: "PATO", img: "cat",   hint: "PATO rima com GATO e RATO! Terminam com -ATO!",
    opts: [{ text:"GATO", rhymes:true, img:"cat" },{ text:"BOLA", rhymes:false, img:"ball" },{ text:"RATO", rhymes:true, img:"dog" }] },
  { word: "SOL",  img: "sun",   hint: "SOL rima com FAROL e LENÇOL! Terminam com -OL!",
    opts: [{ text:"FAROL", rhymes:true, img:"sun" },{ text:"CASA", rhymes:false, img:"house" },{ text:"LENÇOL", rhymes:true, img:"ball" }] },
  { word: "CASA", img: "house", hint: "CASA rima com VASA e RASA! Terminam com -ASA!",
    opts: [{ text:"VASA", rhymes:true, img:"ball" },{ text:"LIVRO", rhymes:false, img:"book" },{ text:"RASA", rhymes:true, img:"ball" }] },
  { word: "FLOR", img: "star",  hint: "FLOR rima com DOR e COR! Terminam com -OR!",
    opts: [{ text:"DOR", rhymes:true, img:"ball" },{ text:"MESA", rhymes:false, img:"house" },{ text:"COR", rhymes:true, img:"star" }] },
  { word: "PÃO",  img: "apple", hint: "PÃO rima com MÃO e AVIÃO! Terminam com -ÃO!",
    opts: [{ text:"MÃO", rhymes:true, img:"ball" },{ text:"GATO", rhymes:false, img:"cat" },{ text:"AVIÃO", rhymes:true, img:"ball" }] },
  { word: "MALA", img: "ball",  hint: "MALA rima com SALA e BALA! Terminam com -ALA!",
    opts: [{ text:"SALA", rhymes:true, img:"house" },{ text:"CARRO", rhymes:false, img:"ball" },{ text:"BALA", rhymes:true, img:"ball" }] },
  { word: "FACA", img: "knife", hint: "FACA rima com VACA e PACA! Terminam com -ACA!",
    opts: [{ text:"VACA", rhymes:true, img:"dog" },{ text:"DADO", rhymes:false, img:"ball" },{ text:"PACA", rhymes:true, img:"ball" }] },
  { word: "AMOR", img: "star",  hint: "AMOR rima com DOR e CALOR! Terminam com -OR!",
    opts: [{ text:"CALOR", rhymes:true, img:"sun" },{ text:"PATO", rhymes:false, img:"cat" },{ text:"VAPOR", rhymes:true, img:"ball" }] },
  { word: "DOCE", img: "apple", hint: "DOCE rima com VOCÊ e POSSE! Terminam com -OCE!",
    opts: [{ text:"VOCÊ", rhymes:true, img:"ball" },{ text:"LIVRO", rhymes:false, img:"book" },{ text:"POSSE", rhymes:true, img:"ball" }] },
]

const EX09_ALFA: Ex09[] = [
  { word: "ESCOLA",  img: "book",   hint: "ESCOLA rima com BOLA e GOLA! Terminam com -OLA!",
    opts: [{ text:"BOLA",   rhymes:true,  img:"ball"  },{ text:"LIVRO",  rhymes:false, img:"book"  },{ text:"GOLA",   rhymes:true,  img:"ball"  }] },
  { word: "ESTRELA", img: "star",   hint: "ESTRELA rima com JANELA e VELA! Terminam com -ELA!",
    opts: [{ text:"JANELA", rhymes:true,  img:"house" },{ text:"PORTA",  rhymes:false, img:"house" },{ text:"VELA",   rhymes:true,  img:"star"  }] },
  { word: "FORTE",   img: "shield", hint: "FORTE rima com MORTE e SORTE! Terminam com -ORTE!",
    opts: [{ text:"MORTE",  rhymes:true,  img:"ball"  },{ text:"BOLA",   rhymes:false, img:"ball"  },{ text:"SORTE",  rhymes:true,  img:"star"  }] },
  { word: "PROVA",   img: "book",   hint: "PROVA rima com NOVA e COVA! Terminam com -OVA!",
    opts: [{ text:"NOVA",   rhymes:true,  img:"star"  },{ text:"CASA",   rhymes:false, img:"house" },{ text:"COVA",   rhymes:true,  img:"ball"  }] },
  { word: "PLANTA",  img: "apple",  hint: "PLANTA rima com SANTA e MANTA! Terminam com -ANTA!",
    opts: [{ text:"SANTA",  rhymes:true,  img:"star"  },{ text:"LIVRO",  rhymes:false, img:"book"  },{ text:"MANTA",  rhymes:true,  img:"ball"  }] },
  { word: "TROCA",   img: "ball",   hint: "TROCA rima com BOCA e FOCA! Terminam com -OCA!",
    opts: [{ text:"BOCA",   rhymes:true,  img:"dog"   },{ text:"GATO",   rhymes:false, img:"cat"   },{ text:"FOCA",   rhymes:true,  img:"ball"  }] },
  { word: "BRANCO",  img: "star",   hint: "BRANCO rima com BANCO e FRANCO! Terminam com -ANCO!",
    opts: [{ text:"BANCO",  rhymes:true,  img:"house" },{ text:"LIVRO",  rhymes:false, img:"book"  },{ text:"FRANCO", rhymes:true,  img:"ball"  }] },
  { word: "PRATO",   img: "plate",  hint: "PRATO rima com RATO e GRATO! Terminam com -ATO!",
    opts: [{ text:"RATO",   rhymes:true,  img:"dog"   },{ text:"BOLA",   rhymes:false, img:"ball"  },{ text:"GRATO",  rhymes:true,  img:"star"  }] },
  { word: "GRÃO",    img: "apple",  hint: "GRÃO rima com MÃO e AVIÃO! Terminam com -ÃO!",
    opts: [{ text:"MÃO",    rhymes:true,  img:"ball"  },{ text:"CASA",   rhymes:false, img:"house" },{ text:"AVIÃO",  rhymes:true,  img:"ball"  }] },
  { word: "BLOCO",   img: "book",   hint: "BLOCO rima com FOCO e TOCO! Terminam com -OCO!",
    opts: [{ text:"FOCO",   rhymes:true,  img:"sun"   },{ text:"LIVRO",  rhymes:false, img:"book"  },{ text:"TOCO",   rhymes:true,  img:"ball"  }] },
]

export function Game09({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX09_ALFA : EX09
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number[]>([])
  const ex = DATA[idx]
  const rhymeCount = ex.opts.filter((op) => op.rhymes).length

  const pick = (i: number, op: (typeof ex.opts)[0]) => {
    if (picked.includes(i) || o.state) return
    speak(op.text)
    if (!op.rhymes) {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else { setIdx((n) => n + 1); setPicked([]) }
      }
      o.wrong(advance, ex.opts.filter((o) => o.rhymes).map((o) => o.text).join(" e "))
      return
    }
    const np = [...picked, i]
    setPicked(np)
    if (np.length >= rhymeCount) {
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((n) => n + 1); setPicked([]) }
      }, 600)
    }
  }

  return (
    <GameShell title="Rima ou Não Rima" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-[28px] bg-white/95 p-3" style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.18)" }}>
            <ObjectIcon name={ex.img} size={96} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-bold" style={{ color: accent }}>{ex.word}</span>
            <SpeakButton text={ex.word} label="OUVIR" />
          </div>
        </div>
        <Instruction>QUAIS RIMAM?</Instruction>
        <div className="mt-auto flex flex-col gap-3 pb-3 w-full px-2">
          {ex.opts.map((op, i) => {
            const done = picked.includes(i)
            const bg = done ? PALETTE.green : accent2
            return (
              <button key={i} onClick={() => pick(i, op)} disabled={done}
                className="tap-shrink w-full flex items-center gap-3 rounded-2xl px-4 py-2 text-left font-bold uppercase text-white"
                style={{ background: bg, boxShadow: `0 4px 0 ${shade(bg, -26)}`, opacity: done ? 0.7 : 1 }}>
                <ObjectIcon name={op.img} size={40} />
                <span className="text-lg">{op.text}</span>
                {done && <span className="ml-auto text-xl">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setPicked([]) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 10 — CAÇA-PALAVRAS ===== */
const WORD_POOLS: string[][] = [
  ["BOLA","GATO","SOL","MAR","FACA"],
  ["PATO","CASA","PAI","MÃE","SAL"],
  ["DADO","MALA","BOI","OVO","RUA"],
  ["SAPO","LIMA","CÃO","PÉ","LUA"],
  ["LIVRO","PORTA","LUZ","FIM","SÃO"],
]

type Dir = [number, number]
const DIRS: Dir[] = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]

function buildGrid(words: string[], size: number) {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""))
  const placements = new Map<string, [number, number, Dir]>()
  const LETTERS = "ABCDEFGHIJKLMNOPRSTUVZ"

  for (const word of words) {
    let placed = false
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
      const r = Math.floor(Math.random() * size)
      const c = Math.floor(Math.random() * size)
      let ok = true
      for (let k = 0; k < word.length; k++) {
        const nr = r + dir[0] * k, nc = c + dir[1] * k
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { ok = false; break }
        const cell = grid[nr][nc]
        if (cell !== "" && cell !== word[k]) { ok = false; break }
      }
      if (ok) {
        for (let k = 0; k < word.length; k++) {
          grid[r + dir[0] * k][c + dir[1] * k] = word[k]
        }
        placements.set(word, [r, c, dir])
        placed = true
      }
    }
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)]
    }
  }
  return { grid, placements }
}

function cellKey(r: number, c: number) { return `${r},${c}` }
function getWordCells(word: string, placement: [number, number, Dir]): Set<string> {
  const [r0, c0, dir] = placement
  const s = new Set<string>()
  for (let k = 0; k < word.length; k++) s.add(cellKey(r0 + dir[0] * k, c0 + dir[1] * k))
  return s
}

const WORD_POOLS_ALFA: string[][] = [
  ["BRANCO","ESCOLA","FLAUTA","GRIPE","CLUBE"],
  ["TRATOR","GRANDE","FLOCO","PRETO","GLOBO"],
  ["PLANETA","GIRAFA","BALEIA","JARDIM","FRASCO"],
  ["TREINO","BLUSA","CRAVO","PLANTA","FORTE"],
  ["CRENTE","PROVA","PRESO","TROCA","CLIMA"],
]

const ROUNDS = 5
const SIZE = 8

export function Game10({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const POOLS = level === "alfabetico" ? WORD_POOLS_ALFA : WORD_POOLS
  const [round, setRound] = useState(0)
  const o = useOutcome()
  const { grid, placements, words } = useMemo(() => {
    const pool = POOLS[round % POOLS.length]
    const { grid, placements } = buildGrid(pool, SIZE)
    return { grid, placements, words: pool }
  }, [round])
  const [targetIdx, setTargetIdx] = useState(0)
  const [found, setFound] = useState<Set<string>>(new Set())
  const [selecting, setSelecting] = useState<string[]>([])
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set())
  // Brief flash for wrong taps — no limit, no overlay
  const [flashCell, setFlashCell] = useState<string | null>(null)
  const target = words[targetIdx]
  const placement = placements.get(target)

  useEffect(() => { if (target) setTimeout(() => speak(target), 400) }, [target])

  const tapCell = (r: number, c: number) => {
    if (!placement || o.state) return
    const key = cellKey(r, c)
    const wordCells = getWordCells(target, placement)
    if (!wordCells.has(key)) {
      // Unlimited attempts — just flash the cell briefly, no overlay
      setFlashCell(key)
      setTimeout(() => setFlashCell(null), 350)
      return
    }
    // Skip already-selecting cells
    if (selecting.includes(key)) return
    const ns = [...selecting, key]
    setSelecting(ns)
    speak(grid[r][c])
    if (ns.length === target.length) {
      const allFound = new Set(found)
      const wCells = new Set<string>()
      wordCells.forEach((k) => { allFound.add(k); wCells.add(k) })
      setFound(allFound)
      setHighlightedCells((prev) => { const n = new Set(prev); wCells.forEach((k) => n.add(k)); return n })
      setSelecting([])
      speak(target)
      setTimeout(() => {
        const nextI = targetIdx + 1
        if (nextI < words.length) { setTargetIdx(nextI) }
        else if (round >= ROUNDS - 1) { o.correct() }
        else { o.advanceExercise(); setRound((r) => r + 1); setTargetIdx(0); setFound(new Set()); setHighlightedCells(new Set()) }
      }, 800)
    }
  }

  const cellSize = Math.floor(260 / SIZE)
  const fs = Math.max(10, Math.floor(cellSize * 0.55))

  return (
    <GameShell title="Caça-Palavras" character={character} accent={accent} onHome={onHome} variant="night">
      <div className="flex h-full flex-col items-center py-1">
        <ProgressDots total={ROUNDS} current={round} color={accent} />
        <div className="mb-1 flex items-center gap-2">
          <span className="text-sm font-bold uppercase" style={{ color: "#fff9" }}>PROCURE:</span>
          <div className="rounded-xl bg-white/20 px-4 py-1.5">
            <span className="text-2xl font-bold text-white">{target}</span>
          </div>
          <SpeakButton text={target} label="OUVIR" />
        </div>
        <div className="mb-2 flex flex-wrap justify-center gap-1.5 px-1">
          {words.map((w, i) => (
            <span key={w} className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                background: i < targetIdx ? PALETTE.green : i === targetIdx ? accent : "rgba(255,255,255,0.15)",
                color: i <= targetIdx ? "#fff" : "rgba(255,255,255,0.55)",
                textDecoration: i < targetIdx ? "line-through" : "none",
              }}>
              {w}
            </span>
          ))}
        </div>
        <div className="overflow-auto">
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${cellSize}px)`, gap: 2 }}>
            {grid.map((row, r) =>
              row.map((ch, c) => {
                const key = cellKey(r, c)
                const isHighlighted = highlightedCells.has(key)
                const isSelecting = selecting.includes(key)
                const isFlash = flashCell === key
                return (
                  <button key={key} onClick={() => tapCell(r, c)}
                    className={`flex items-center justify-center rounded-lg font-bold text-white transition-colors ${isFlash ? "anim-shake" : ""}`}
                    style={{
                      width: cellSize, height: cellSize, fontSize: fs,
                      background: isHighlighted
                        ? PALETTE.green
                        : isSelecting
                        ? accent
                        : isFlash
                        ? `${PALETTE.coral}99`
                        : "rgba(255,255,255,0.12)",
                      boxShadow: isHighlighted ? `0 2px 0 ${shade(PALETTE.green, -26)}` : "none",
                    }}>
                    {ch}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
      {/* Only shown on successful completion — no wrong overlay for this game */}
      <OutcomeOverlay state={o.state} character={character}
        hint="Explore a grade e encontre todas as palavras!"
        clear={() => o.clear()} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 11 — LANTERNA MÁGICA (Floresta Escura) ===== */

interface LanternRound { word: string }

const LANTERN_ROUNDS: LanternRound[] = [
  { word: "BOLA" },
  { word: "GATO" },
  { word: "CASA" },
  { word: "PATO" },
  { word: "MALA" },
]

const LANTERN_ROUNDS_ALFA: LanternRound[] = [
  { word: "ESCOLA" },
  { word: "JARDIM" },
  { word: "GIRAFA" },
  { word: "TREINO" },
  { word: "BLUSA" },
]

interface LetterPos { ch: string; x: number; y: number; id: number }

function randomPositions(word: string, seed: number): LetterPos[] {
  // Place word letters + distractor letters randomly across a canvas
  const letters = word.split("")
  const distractors = ["M","B","R","T","S","L","N","D","V"].filter((l) => !letters.includes(l)).slice(0, 6)
  const all = [...letters, ...distractors]
  const positions: LetterPos[] = []
  const used: { x: number; y: number }[] = []
  const rng = (n: number, s: number) => ((n * 6364136223846793005 + s) >>> 0) / 0xffffffff

  all.forEach((ch, i) => {
    let x = 0, y = 0, attempts = 0
    do {
      x = 10 + rng(i * 17 + seed, i + 1) * 70
      y = 12 + rng(i * 31 + seed + 1, i + 2) * 72
      attempts++
    } while (attempts < 30 && used.some((u) => Math.hypot(u.x - x, u.y - y) < 14))
    used.push({ x, y })
    positions.push({ ch, x, y, id: i })
  })
  return positions
}

export function Game11({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const ROUNDS_DATA = level === "alfabetico" ? LANTERN_ROUNDS_ALFA : LANTERN_ROUNDS
  const o = useOutcome()
  const [roundIdx, setRoundIdx] = useState(0)
  const rd = ROUNDS_DATA[roundIdx]

  const positions = useMemo(() => randomPositions(rd.word, roundIdx * 137 + 42), [roundIdx])
  const [torch, setTorch] = useState<{ x: number; y: number } | null>(null)
  const [collected, setCollected] = useState<number[]>([]) // ids of collected letter positions
  const [shaking, setShaking] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const collectedWord = collected
    .map((id) => positions.find((p) => p.id === id)!.ch)
    .join("")
  const nextNeeded = rd.word[collectedWord.length] ?? null

  useEffect(() => { setTimeout(() => speak(rd.word), 500) }, [roundIdx])

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setTorch({ x, y })
  }

  const tapLetter = (pos: LetterPos) => {
    if (o.state) return
    speak(pos.ch)
    if (pos.ch === nextNeeded && !collected.includes(pos.id)) {
      const nc = [...collected, pos.id]
      setCollected(nc)
      if (nc.length === rd.word.length) {
        speak(rd.word)
        setTimeout(() => {
          if (roundIdx >= ROUNDS_DATA.length - 1) o.correct()
          else {
            o.advanceExercise()
            setRoundIdx((r) => r + 1)
            setCollected([])
            setTorch(null)
          }
        }, 800)
      }
    } else {
      setShaking(pos.id)
      setTimeout(() => setShaking(null), 500)
      const advance = () => {
        if (roundIdx >= ROUNDS_DATA.length - 1) onAdvance()
        else { o.advanceExercise(); setRoundIdx((r) => r + 1); setCollected([]); setTorch(null) }
      }
      o.wrong(advance, rd.word)
    }
  }

  const torchRadius = 26 // % of container

  return (
    <GameShell title="Lanterna Mágica" character={character} accent={accent} onHome={onHome} variant="night">
      <div className="flex h-full flex-col">
        <ProgressDots total={ROUNDS_DATA.length} current={roundIdx} color={accent} />

        {/* Word progress bar */}
        <div className="mb-2 flex flex-col items-center gap-1">
          <span className="text-xs font-bold uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>
            ENCONTRE AS LETRAS DE:
          </span>
          <div className="flex items-center gap-1.5">
            {rd.word.split("").map((ch, i) => (
              <div key={i}
                className="flex items-center justify-center rounded-xl font-bold text-xl"
                style={{
                  width: 44, height: 44,
                  background: collectedWord[i] ? accent : "rgba(255,255,255,0.08)",
                  color: collectedWord[i] ? "#fff" : "rgba(255,255,255,0.2)",
                  border: `3px dashed ${collectedWord[i] ? "transparent" : "rgba(255,255,255,0.2)"}`,
                }}>
                {collectedWord[i] ?? ""}
              </div>
            ))}
            <SpeakButton text={rd.word} label="OUVIR" />
          </div>
        </div>

        {/* Dark forest canvas */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden rounded-[20px]"
          style={{ background: "#05080f" }}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onTouchMove={(e) => {
            e.preventDefault()
            handleMove(e.touches[0].clientX, e.touches[0].clientY)
          }}
          onTouchStart={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        >
          {/* Forest silhouette */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Trees */}
            {[8,20,32,44,56,68,80,92].map((x, i) => (
              <polygon key={i}
                points={`${x-6},100 ${x},${60 - i%3*8} ${x+6},100`}
                fill={`hsl(140,${30+i*5}%,${5+i%3*3}%)`} opacity="0.9" />
            ))}
            {[14,26,38,50,62,74,86].map((x, i) => (
              <polygon key={`b${i}`}
                points={`${x-8},100 ${x},${48 - i%4*6} ${x+8},100`}
                fill={`hsl(140,25%,${3+i%2*4}%)`} opacity="0.8" />
            ))}
            {/* Stars */}
            {[15,25,40,55,70,85,30,65].map((sx, i) => (
              <circle key={`s${i}`} cx={sx} cy={8+i*3} r="0.5" fill="#fff" opacity={0.3+i*0.06} />
            ))}
          </svg>

          {/* Dark overlay with warm flashlight beam — amber glow reveals the illuminated zone */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: torch
                ? `radial-gradient(circle at ${torch.x}% ${torch.y}%,
                    rgba(255,230,120,0.38) 0%,
                    rgba(255,210,80,0.22) ${torchRadius * 0.45}%,
                    rgba(255,190,40,0.07) ${torchRadius * 0.85}%,
                    rgba(2,5,12,0.97) ${torchRadius + 14}%)`
                : "rgba(2,5,12,0.97)",
            }}
          />

          {/* Torch ring — visible flashlight lens that follows finger */}
          {torch && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${torch.x}%`,
                top: `${torch.y}%`,
                transform: "translate(-50%,-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "3px solid rgba(255,230,100,0.92)",
                boxShadow: "0 0 14px rgba(255,220,80,0.9), 0 0 30px rgba(255,190,40,0.55), 0 0 60px rgba(255,160,20,0.25)",
                zIndex: 20,
              }}
            />
          )}

          {/* Initial prompt when no torch yet */}
          {!torch && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <p className="rounded-2xl bg-black/70 px-4 py-2 text-center text-sm font-bold text-white">
                🔦 MOVA O DEDO PARA ILUMINAR!
              </p>
            </div>
          )}

          {/* Letters scattered in the forest — all same color, no visual hint for target */}
          {positions.map((pos) => {
            const isCollected = collected.includes(pos.id)
            const isInLight = torch && Math.hypot(torch.x - pos.x, torch.y - pos.y) < torchRadius + 8
            const visible = isCollected || isInLight

            return (
              <button
                key={pos.id}
                onClick={() => tapLetter(pos)}
                disabled={isCollected}
                className={`absolute flex items-center justify-center rounded-xl font-bold text-lg text-white transition-all ${shaking === pos.id ? "anim-shake" : ""}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%,-50%)",
                  width: 40, height: 40,
                  opacity: isCollected ? 0 : visible ? 1 : 0,
                  background: visible ? "rgba(255,255,255,0.18)" : "transparent",
                  boxShadow: "none",
                  pointerEvents: visible && !isCollected ? "auto" : "none",
                  transition: "opacity 0.15s, background 0.2s",
                }}>
                {pos.ch}
              </button>
            )
          })}
        </div>

        <div className="mt-2 pb-1 text-center text-xs font-bold uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
          PROCURANDO: <span style={{ color: accent }}>{nextNeeded ?? "✓"}</span>
        </div>
      </div>

      <OutcomeOverlay state={o.state} character={character}
        hint={`A palavra é ${rd.word}! Ilumine as letras com a lanterna!`}
        clear={() => o.clear()} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}
