/* ---------------- Palette (fixed for the whole app) ---------------- */
export const PALETTE = {
  sky: "#8FD8F4",
  skySoft: "#B8E8FA",
  blue: "#4A9FE8",
  blueDeep: "#315477",
  yellow: "#FFD85A",
  orange: "#FF9F55",
  pink: "#F58FB2",
  green: "#72D6A1",
  lilac: "#B9A4E8",
  coral: "#F47F73",
  cream: "#FFF8EA",
  turquoise: "#6FD6D0",
  white: "#FFFFFF",
} as const

/* ---------------- Animal identities ---------------- */
export type AnimalType =
  | "cachorro"
  | "gato"
  | "pinguim"
  | "girafa"
  | "tigre"
  | "raposa"
  | "coelho"
  | "panda"
  | "coala"
  | "macaco"
  | "sapo"
  | "leao"

export const ANIMALS: { type: AnimalType; label: string; base: string }[] = [
  { type: "cachorro", label: "Cachorro", base: "#E9B27C" },
  { type: "gato", label: "Gato", base: "#F6A96B" },
  { type: "pinguim", label: "Pinguim", base: "#3D5673" },
  { type: "girafa", label: "Girafa", base: "#F4C752" },
  { type: "tigre", label: "Tigre", base: "#FF9F55" },
  { type: "raposa", label: "Raposa", base: "#FF9F55" },
  { type: "coelho", label: "Coelho", base: "#F58FB2" },
  { type: "panda", label: "Panda", base: "#FFFFFF" },
  { type: "coala", label: "Coala", base: "#B7C3CC" },
  { type: "macaco", label: "Macaco", base: "#C89168" },
  { type: "sapo", label: "Sapo", base: "#72D6A1" },
  { type: "leao", label: "Leão", base: "#F4C267" },
]

/* ---------------- Customization ---------------- */
export type HatId =
  | "none"
  | "bone"
  | "explorador"
  | "coroa"
  | "gorro"
  | "festa"
  | "cowboy"
  | "tiara"
export type FaceId =
  | "none"
  | "oculos"
  | "oculos-cor"
  | "oculos-estrela"
  | "mascara"
  | "sardinhas"
  | "bigode"
export type AccessoryId =
  | "none"
  | "laco"
  | "gravata"
  | "mochila"
  | "cachecol"
  | "fones"
  | "colar"
  | "capa"

export const HATS: { id: HatId; label: string }[] = [
  { id: "none", label: "Nenhum" },
  { id: "bone", label: "Boné" },
  { id: "explorador", label: "Explorador" },
  { id: "coroa", label: "Coroa" },
  { id: "gorro", label: "Gorro" },
  { id: "festa", label: "Festa" },
  { id: "cowboy", label: "Cowboy" },
  { id: "tiara", label: "Tiara" },
]
export const FACES: { id: FaceId; label: string }[] = [
  { id: "none", label: "Nenhum" },
  { id: "oculos", label: "Óculos" },
  { id: "oculos-cor", label: "Coloridos" },
  { id: "oculos-estrela", label: "Estrela" },
  { id: "mascara", label: "Máscara" },
  { id: "sardinhas", label: "Sardinhas" },
  { id: "bigode", label: "Bigodinho" },
]
export const ACCESSORIES: { id: AccessoryId; label: string }[] = [
  { id: "none", label: "Nenhum" },
  { id: "laco", label: "Laço" },
  { id: "gravata", label: "Gravata" },
  { id: "mochila", label: "Mochila" },
  { id: "cachecol", label: "Cachecol" },
  { id: "fones", label: "Fones" },
  { id: "colar", label: "Colar" },
  { id: "capa", label: "Capa" },
]

export const COLOR_SWATCHES = [
  "",
  PALETTE.orange,
  PALETTE.pink,
  PALETTE.blue,
  PALETTE.green,
  PALETTE.lilac,
  PALETTE.yellow,
  PALETTE.turquoise,
]

export interface Character {
  animal: AnimalType
  hat: HatId
  face: FaceId
  accessory: AccessoryId
  tint: string
}

export const DEFAULT_CHARACTER: Character = {
  animal: "raposa",
  hat: "none",
  face: "none",
  accessory: "none",
  tint: "",
}

/* ---------------- Performance model ---------------- */
export interface PlayResult {
  acertos: number
  erros: number
  tentativas: number
  pct: number
}
export interface Play extends PlayResult {
  gameId: number
  date: string
}
export interface Student {
  id: string
  name: string
  password: string
  character: Character
  characterCustomized: boolean
  plays: Play[]
  createdAt: string
  alphabeticoUnlocked?: boolean
}

export interface Profile {
  name: string
  character: Character
}

/* ---------------- Teacher & Classroom ---------------- */
export interface Teacher {
  id: string
  name: string
  password: string
  createdAt: string
}

export interface Classroom {
  id: string
  name: string
  studentIds: string[]
  createdAt: string
}

/* ---------------- Psicogênese da Escrita ---------------- */
export type PsicogenesLevel =
  | "Pré-Silábico"
  | "Silábico SVS"
  | "Silábico CVS"
  | "Silábico-Alfabético"
  | "Alfabético"

export const PSICOGENESE_LEVELS: {
  level: PsicogenesLevel
  min: number
  max: number
  color: string
  short: string
}[] = [
  { level: "Pré-Silábico", min: 0, max: 19, color: PALETTE.coral, short: "PRÉ-SIL." },
  { level: "Silábico SVS", min: 20, max: 39, color: PALETTE.orange, short: "SIL. SVS" },
  { level: "Silábico CVS", min: 40, max: 59, color: PALETTE.yellow, short: "SIL. CVS" },
  { level: "Silábico-Alfabético", min: 60, max: 79, color: PALETTE.turquoise, short: "SIL.-ALF." },
  { level: "Alfabético", min: 80, max: 100, color: PALETTE.green, short: "ALFABÉTICO" },
]

export function psicogenese(pct: number | null): PsicogenesLevel {
  if (pct === null || pct < 20) return "Pré-Silábico"
  if (pct < 40) return "Silábico SVS"
  if (pct < 60) return "Silábico CVS"
  if (pct < 80) return "Silábico-Alfabético"
  return "Alfabético"
}

export function psicogeneseColor(pct: number | null): string {
  const lvl = psicogenese(pct)
  return PSICOGENESE_LEVELS.find((l) => l.level === lvl)?.color ?? PALETTE.blue
}

/* ---------------- Stat helpers (derived, pure) ---------------- */
export interface GameStats {
  gameId: number
  plays: number
  acertos: number
  erros: number
  tentativas: number
  pct: number | null
  lastDate: string | null
  evolution: number[]
}

export function gameStats(student: Student, gameId: number): GameStats {
  const list = student.plays.filter((p) => p.gameId === gameId)
  if (list.length === 0) {
    return { gameId, plays: 0, acertos: 0, erros: 0, tentativas: 0, pct: null, lastDate: null, evolution: [] }
  }
  const acertos = list.reduce((a, p) => a + p.acertos, 0)
  const erros = list.reduce((a, p) => a + p.erros, 0)
  const tentativas = list.reduce((a, p) => a + p.tentativas, 0)
  return {
    gameId,
    plays: list.length,
    acertos,
    erros,
    tentativas,
    pct: tentativas ? Math.round((acertos / tentativas) * 100) : null,
    lastDate: list[list.length - 1].date,
    evolution: list.map((p) => p.pct),
  }
}

export interface StudentOverview {
  overallPct: number | null
  gamesPlayed: number
  totalActivities: number
  best: GameStats | null
  worst: GameStats | null
}

export function studentOverview(student: Student): StudentOverview {
  const all = GAMES.map((g) => gameStats(student, g.id))
  const played = all.filter((s) => s.pct !== null)
  const acertos = student.plays.reduce((a, p) => a + p.acertos, 0)
  const tentativas = student.plays.reduce((a, p) => a + p.tentativas, 0)
  const sorted = [...played].sort((a, b) => (b.pct! - a.pct!))
  return {
    overallPct: tentativas ? Math.round((acertos / tentativas) * 100) : null,
    gamesPlayed: played.length,
    totalActivities: student.plays.length,
    best: sorted[0] ?? null,
    worst: sorted.length ? sorted[sorted.length - 1] : null,
  }
}

export interface ClassGameAvg {
  gameId: number
  pct: number | null
  playedBy: number
}

export function classAverages(students: Student[]): {
  overallPct: number | null
  perGame: ClassGameAvg[]
} {
  const perGame: ClassGameAvg[] = GAMES.map((g) => {
    const stats = students.map((s) => gameStats(s, g.id)).filter((s) => s.pct !== null)
    const pct = stats.length
      ? Math.round(stats.reduce((a, s) => a + (s.pct as number), 0) / stats.length)
      : null
    return { gameId: g.id, pct, playedBy: stats.length }
  })
  const overalls = students
    .map((s) => studentOverview(s).overallPct)
    .filter((p): p is number => p !== null)
  const overallPct = overalls.length
    ? Math.round(overalls.reduce((a, p) => a + p, 0) / overalls.length)
    : null
  return { overallPct, perGame }
}

export function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${dd}/${mm}`
}

/* ---------------- The 12 games (fixed order & themes) ---------------- */
export interface GameMeta {
  id: number
  title: string
  colors: [string, string]
  icon: string
  rounds: number
}

export const GAMES: GameMeta[] = [
  { id: 1, title: "Complete a Palavra", colors: [PALETTE.blue, PALETTE.yellow], icon: "plate", rounds: 10 },
  { id: 2, title: "Coloque a Letra", colors: [PALETTE.orange, PALETTE.blue], icon: "envelope", rounds: 10 },
  { id: 3, title: "Batalha de Sílabas", colors: [PALETTE.pink, PALETTE.lilac], icon: "shield", rounds: 6 },
  { id: 4, title: "Troca-Letras", colors: [PALETTE.green, PALETTE.yellow], icon: "ball", rounds: 5 },
  { id: 5, title: "Caça-Sílabas", colors: [PALETTE.turquoise, PALETTE.blue], icon: "dog", rounds: 6 },
  { id: 6, title: "Legendas", colors: [PALETTE.pink, PALETTE.skySoft], icon: "camera", rounds: 6 },
  { id: 7, title: "Letras Móveis", colors: [PALETTE.orange, PALETTE.yellow], icon: "monkey", rounds: 6 },
  { id: 8, title: "Escute a Palavra", colors: [PALETTE.lilac, PALETTE.blue], icon: "speaker", rounds: 8 },
  { id: 9, title: "Complete as Letras", colors: [PALETTE.green, PALETTE.yellow], icon: "cat", rounds: 10 },
  { id: 10, title: "Caça-Palavras", colors: [PALETTE.blue, PALETTE.orange], icon: "magnify", rounds: 5 },
  { id: 11, title: "Lanterna Mágica", colors: [PALETTE.blueDeep, PALETTE.lilac], icon: "lantern", rounds: 5 },
  { id: 12, title: "Alimente o Monstrinho", colors: [PALETTE.green, PALETTE.pink], icon: "monster", rounds: 5 },
]

/* ---------------- Audio helpers ---------------- */
let audioCtx: AudioContext | null = null

export function playTone(kind: "correct" | "wrong" | "tap" | "win") {
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as any).webkitAudioContext)()
    const ac = audioCtx
    const now = ac.currentTime
    const notes =
      kind === "correct"
        ? [523.25, 659.25, 783.99]
        : kind === "win"
          ? [523.25, 659.25, 783.99, 1046.5]
          : kind === "wrong"
            ? [311.13, 261.63]
            : [660]
    notes.forEach((f, i) => {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = "sine"
      o.frequency.value = f
      const t = now + i * 0.1
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      o.connect(g).connect(ac.destination)
      o.start(t)
      o.stop(t + 0.25)
    })
  } catch { /* audio not available */ }
}

/* Real speech synthesis — speaks text in Portuguese */
export function speak(text: string, slow = false) {
  if (!("speechSynthesis" in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = "pt-BR"
  u.rate = slow ? 0.6 : 0.85
  u.pitch = 1.1
  u.volume = 1
  synth.speak(u)
}

export function speakSlow(text: string) {
  speak(text, true)
}

/* Speaks a single letter phonetically (letter name in Portuguese) */
export function playLetter(letter: string) {
  speak(letter)
}
