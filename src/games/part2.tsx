import React, { useMemo, useState } from "react"
import { ObjectIcon } from "../components/art"
import { PALETTE, speak } from "../lib/store"
import { shade } from "../components/kit"
import {
  GameProps,
  GameShell,
  Instruction,
  OutcomeOverlay,
  ProgressDots,
  Slot,
  SpeakButton,
  Tile,
  useOutcome,
} from "./shell"

/* ===== GAME 05 — CAÇA-SÍLABAS ===== */
interface Ex05 { target: string; pool: string[]; hint: string }

const EX05: Ex05[] = [
  { target: "MA", pool: ["MA","BO","LA","TA","CA","RA"], hint: "A sílaba de MAMÃE começa assim: MA!" },
  { target: "BO", pool: ["CA","BO","LA","RA","TA","MA"], hint: "BOLA começa com BO! Bola é redonda!" },
  { target: "CA", pool: ["LA","BO","CA","TA","RA","MA"], hint: "CASA começa com CA! Onde moramos!" },
  { target: "PA", pool: ["MA","BO","LA","PA","CA","RA"], hint: "PATO começa com PA! Pato nada!" },
  { target: "SO", pool: ["CA","BO","SO","TA","RA","MA"], hint: "SOL começa com SO! Brilha no céu!" },
  { target: "TA", pool: ["LA","BO","CA","TA","RA","MA"], hint: "TATU tem TA! Tatu fica no chão!" },
  { target: "RA", pool: ["MA","BO","RA","TA","CA","LA"], hint: "RATO começa com RA! Rato é pequenininho!" },
  { target: "LA", pool: ["CA","LA","BO","TA","RA","MA"], hint: "LAGO começa com LA! Lago tem água!" },
]

const EX05_ALFA: Ex05[] = [
  { target: "TRA", pool: ["TRA","BLA","GRI","FLO","CRE","PLE"], hint: "TRA está em TRATOR e TRABALHO! Letras TR juntas!" },
  { target: "BLO", pool: ["TRA","BLO","GRI","FLA","CRE","PLE"], hint: "BLO está em BLOCO! Letras BL juntas!" },
  { target: "GRI", pool: ["TRA","BLA","GRI","FLO","CRE","PLE"], hint: "GRI está em GRIPE! Letras GR juntas!" },
  { target: "FLA", pool: ["TRA","FLA","GRI","FLO","CRE","PLE"], hint: "FLA está em FLAUTA! Letras FL juntas!" },
  { target: "CRE", pool: ["TRA","BLA","GRI","FLO","CRE","BRE"], hint: "CRE está em CRESCER! Letras CR juntas!" },
  { target: "PLE", pool: ["TRA","BLA","GRI","PLE","CRE","BRE"], hint: "PLE está em COMPLETAR! Letras PL juntas!" },
  { target: "FRE", pool: ["FRE","BLA","GRI","FLO","CRE","PLE"], hint: "FRE está em FREIO e FRENTE! Letras FR juntas!" },
  { target: "BRA", pool: ["TRA","BRA","GRI","FLO","CRE","PLE"], hint: "BRA está em BRAÇO e BRAVO! Letras BR juntas!" },
]

export function Game05({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX05_ALFA : EX05
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [found, setFound] = useState(false)
  const ex = DATA[idx]

  const pick = (syl: string) => {
    if (found || o.state) return
    speak(syl)
    if (syl === ex.target) {
      setFound(true)
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((i) => i + 1); setFound(false) }
      }, 700)
    } else {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else { setIdx((i) => i + 1); setFound(false) }
      }
      o.wrong(advance, ex.target)
    }
  }

  return (
    <GameShell title="Caça-Sílabas" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <Instruction>ENCONTRE A SÍLABA!</Instruction>
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="rounded-[28px] bg-white/95 px-10 py-4 text-center" style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.18)" }}>
            <span className="text-5xl font-bold" style={{ color: accent }}>{ex.target}</span>
          </div>
          <SpeakButton text={ex.target} label="OUVIR SÍLABA" />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-3 pb-3">
          {ex.pool.map((syl, i) => (
            <Tile key={i} color={syl === ex.target && found ? PALETTE.green : accent2} size={72}
              speakText={syl} onClick={() => pick(syl)} disabled={found}>
              {syl}
            </Tile>
          ))}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setFound(false) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 06 — LEGENDAS (word-image matching) ===== */
interface Ex06 { img: string; word: string; opts: string[]; hint: string }

const EX06: Ex06[] = [
  { img: "cat",   word: "GATO",     opts: ["GATO","RATO","PATO","MATO"],    hint: "Faz MIAU e gosta de leite: GATO!" },
  { img: "dog",   word: "CACHORRO", opts: ["CACHORRO","CAVALO","COELHO","CARNEIRO"], hint: "Faz AU AU e abana o rabo: CACHORRO!" },
  { img: "ball",  word: "BOLA",     opts: ["BOLA","MOLA","COLA","SOLA"],    hint: "Redonda e jogamos no recreio: BOLA!" },
  { img: "house", word: "CASA",     opts: ["CASA","MESA","VACA","RASA"],    hint: "Onde moramos e dormimos: CASA!" },
  { img: "sun",   word: "SOL",      opts: ["SOL","SAL","SOM","SÓ"],         hint: "Brilha no céu e aquece a gente: SOL!" },
  { img: "book",  word: "LIVRO",    opts: ["LIVRO","LITRO","LIXO","LIMPO"], hint: "Cheio de histórias e palavras: LIVRO!" },
  { img: "star",  word: "ESTRELA",  opts: ["ESTRELA","ESCADA","ESCOLA","ESPADA"], hint: "Brilha à noite no céu: ESTRELA!" },
  { img: "apple", word: "MAÇÃ",     opts: ["MAÇÃ","MANGA","MELÃO","MAMÃO"], hint: "Fruta vermelha e crocante: MAÇÃ!" },
]

const EX06_ALFA: Ex06[] = [
  { img: "ball",  word: "BICICLETA", opts: ["BICICLETA","BICILETA","BISCICLETA","BICICRETA"], hint: "Anda com pedais e duas rodas: BICICLETA!" },
  { img: "cat",   word: "BORBOLETA", opts: ["BORBOLETA","BORBILETA","BURBOLETA","BOLBOLETA"], hint: "Inseto colorido que voa: BORBOLETA!" },
  { img: "dog",   word: "CACHORRO",  opts: ["CACHORRO","CACHORO","CACHARO","CACORRO"],        hint: "Animal que faz AU AU: CACHORRO!" },
  { img: "sun",   word: "GIRASSOL",  opts: ["GIRASSOL","GIRASOL","JIRASSOL","GIRAZOL"],       hint: "Flor que segue o sol: GIRASSOL!" },
  { img: "star",  word: "ELEFANTE",  opts: ["ELEFANTE","ELEFANTI","ELEFANTA","ELAFANTE"],     hint: "Maior animal terrestre: ELEFANTE!" },
  { img: "house", word: "TARTARUGA", opts: ["TARTARUGA","TARTAROGA","TATARUGA","TARTARUJA"],  hint: "Réptil de casca dura: TARTARUGA!" },
  { img: "apple", word: "CHOCOLATE", opts: ["CHOCOLATE","CHOCOLETE","CHOCOLATI","XOCOLATE"],  hint: "Doce feito de cacau: CHOCOLATE!" },
  { img: "book",  word: "BORRACHA",  opts: ["BORRACHA","BORACHA","BORRAXA","BURRACHA"],       hint: "Apaga o lápis: BORRACHA!" },
]

export function Game06({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX06_ALFA : EX06
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const ex = DATA[idx]

  const pick = (w: string) => {
    if (chosen || o.state) return
    speak(w)
    if (w === ex.word) {
      setChosen(w)
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((i) => i + 1); setChosen(null) }
      }, 800)
    } else {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else { setIdx((i) => i + 1); setChosen(null) }
      }
      o.wrong(advance, ex.word)
    }
  }

  return (
    <GameShell title="Legendas" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <Instruction>QUAL PALAVRA DESCREVE A IMAGEM?</Instruction>
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-[28px] bg-white/95 p-3" style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.18)" }}>
            <ObjectIcon name={ex.img} size={108} />
          </div>
          <SpeakButton text={ex.word} label="DICA" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-3 pb-3">
          {ex.opts.map((w) => {
            const isChosen = chosen === w
            const isCorrect = w === ex.word
            const bg = isChosen && isCorrect ? PALETTE.green : isChosen ? PALETTE.coral : accent2
            return (
              <button key={w} onClick={() => pick(w)} disabled={!!chosen}
                className="tap-shrink rounded-2xl px-2 py-3 text-sm font-bold text-white uppercase"
                style={{ background: bg, boxShadow: `0 4px 0 ${shade(bg, -26)}`, opacity: chosen && !isChosen ? 0.5 : 1 }}>
                {w}
              </button>
            )
          })}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setChosen(null) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 07 — LETRAS MÓVEIS ===== */
interface Ex07 { word: string; img: string; hint: string }

const EX07: Ex07[] = [
  { word: "BOLA",  img: "ball",  hint: "Começa com B! B-O-L-A = BOLA!" },
  { word: "GATO",  img: "cat",   hint: "G-A-T-O = GATO! Faz miau!" },
  { word: "CASA",  img: "house", hint: "C-A-S-A = CASA! Onde moramos!" },
  { word: "PATO",  img: "cat",   hint: "P-A-T-O = PATO! Nada na água!" },
  { word: "DADO",  img: "ball",  hint: "D-A-D-O = DADO! Tem seis faces!" },
  { word: "FACA",  img: "knife", hint: "F-A-C-A = FACA! Corta pão!" },
  { word: "MALA",  img: "ball",  hint: "M-A-L-A = MALA! Viajamos com ela!" },
  { word: "SAPO",  img: "dog",   hint: "S-A-P-O = SAPO! Vive perto de lagoa!" },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

const EX07_ALFA: Ex07[] = [
  { word: "BALEIA",  img: "ball",  hint: "B-A-L-E-I-A: maior animal do mar!" },
  { word: "JARDIM",  img: "house", hint: "J-A-R-D-I-M: lugar cheio de flores e plantas!" },
  { word: "GIRAFA",  img: "cat",   hint: "G-I-R-A-F-A: pescoço muito comprido!" },
  { word: "PLANETA", img: "sun",   hint: "P-L-A-N-E-T-A: a Terra é um planeta!" },
  { word: "GARRAFA", img: "ball",  hint: "G-A-R-R-A-F-A: guarda água e sucos!" },
  { word: "CAMELO",  img: "dog",   hint: "C-A-M-E-L-O: animal do deserto com corcova!" },
]

export function Game07({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX07_ALFA : EX07
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const ex = DATA[idx]
  const pool = useMemo(() => shuffle(ex.word.split("")), [idx])
  const [slots, setSlots] = useState<(string | null)[]>(ex.word.split("").map(() => null))
  const [used, setUsed] = useState<number[]>([])

  const resetEx = (newIdx: number) => {
    setSlots(DATA[newIdx].word.split("").map(() => null))
    setUsed([])
  }

  const nextEmpty = slots.findIndex((s) => s === null)

  const pickLetter = (ch: string, i: number) => {
    if (used.includes(i) || nextEmpty === -1 || o.state) return
    speak(ch)
    const expected = ex.word[nextEmpty]
    if (ch === expected) {
      const ns = [...slots]; ns[nextEmpty] = ch
      const nu = [...used, i]
      setSlots(ns); setUsed(nu)
      if (ns.every(Boolean)) {
        speak(ex.word)
        setTimeout(() => {
          if (idx >= DATA.length - 1) o.correct()
          else { o.advanceExercise(); resetEx(idx + 1); setIdx((i) => i + 1) }
        }, 700)
      }
    } else {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else { resetEx(idx + 1); setIdx((i) => i + 1) }
      }
      o.wrong(advance, ex.word)
    }
  }

  const clear = () => { o.clear(); setSlots(ex.word.split("").map(() => null)); setUsed([]) }

  return (
    <GameShell title="Letras Móveis" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-[24px] bg-white/90 p-2.5" style={{ boxShadow: "0 6px 18px rgba(49,84,119,0.14)" }}>
            <ObjectIcon name={ex.img} size={96} />
          </div>
          <SpeakButton text={ex.word} label="OUVIR" />
        </div>
        <Instruction>MONTE A PALAVRA!</Instruction>
        <div className="mb-4 flex gap-2">
          {slots.map((s, i) => <Slot key={i} letter={s || undefined} color={accent} size={56} highlight={i === nextEmpty} />)}
        </div>
        <div className="mt-auto flex flex-wrap justify-center gap-3 pb-3">
          {pool.map((ch, i) => (
            <Tile key={i} color={used.includes(i) ? "#C4D3DE" : accent2} size={60}
              disabled={used.includes(i)} speakText={ch} onClick={() => pickLetter(ch, i)}>
              {ch}
            </Tile>
          ))}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint} clear={clear} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 08 — ESCUTE A PALAVRA ===== */
interface Ex08 { word: string; opts: string[]; img: string; hint: string }

const EX08: Ex08[] = [
  { word: "PORTA",    opts: ["PORTA","TORTA","CARTA","HORTA"],   img: "house", hint: "Abre e fecha a casa: PORTA!" },
  { word: "GATO",     opts: ["PATO","GATO","MATO","RATO"],       img: "cat",   hint: "Faz miau e ronrona: GATO!" },
  { word: "LIVRO",    opts: ["LITRO","LIMPO","LIVRO","LIXO"],    img: "book",  hint: "Lemos histórias no: LIVRO!" },
  { word: "ESCOLA",   opts: ["ESCADA","ESCOLA","ESPADA","ESCOVA"],img:"house", hint: "Onde aprendemos a ler: ESCOLA!" },
  { word: "BORBOLETA",opts: ["BORBOLETA","BORRACHA","BORRÃO","BORDO"],img:"dog",hint:"Voa e é colorida: BORBOLETA!" },
  { word: "CACHORRO", opts: ["CARNEIRO","CAVALO","CACHORRO","COELHO"],img:"dog",hint:"Faz au-au: CACHORRO!" },
  { word: "TARTARUGA",opts: ["TARTARUGA","TARANTULA","TARTÁN","TARRAFA"],img:"dog",hint:"Anda devagar e tem casco: TARTARUGA!" },
  { word: "MARIPOSA", opts: ["MARIPOSA","MARGARIDA","MARAVILHA","MARISELA"],img:"dog",hint:"Parecida com borboleta, voa à noite: MARIPOSA!" },
]

const EX08_ALFA: Ex08[] = [
  { word: "BORBOLETA", opts: ["BORBOLETA","BORRACHA","BORRIFAR","BORRÃO"],     img: "cat",  hint: "Inseto com asas coloridas: BORBOLETA!" },
  { word: "ELEFANTE",  opts: ["ELEFANTE","ESTANTE","ELEGANTE","ELAFANTE"],     img: "dog",  hint: "Maior animal da floresta: ELEFANTE!" },
  { word: "CHOCOLATE", opts: ["CHOCOLATE","CHOCOLETE","CHOCALHO","XOCOLATE"],  img: "apple",hint: "Doce feito de cacau: CHOCOLATE!" },
  { word: "TARTARUGA", opts: ["TARTARUGA","TARTAROGA","TATARUGA","TARTARUJA"], img: "dog",  hint: "Réptil com casca dura: TARTARUGA!" },
  { word: "GIRASSOL",  opts: ["GIRASSOL","GIRASOL","JIRASSOL","GIRAZOL"],      img: "sun",  hint: "Flor que segue o sol: GIRASSOL!" },
  { word: "BICICLETA", opts: ["BICICLETA","BICILETA","BISCICLETA","BICICRETA"],img: "ball", hint: "Pedalar é muito divertido: BICICLETA!" },
  { word: "BORRACHA",  opts: ["BORRACHA","BORACHA","BORRAXA","BURRACHA"],      img: "book", hint: "Apaga o lápis no caderno: BORRACHA!" },
  { word: "BALEIA",    opts: ["BALEIA","BALEA","BALENA","VALEIA"],              img: "ball", hint: "Maior animal do mar: BALEIA!" },
]

export function Game08({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX08_ALFA : EX08
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const ex = DATA[idx]

  const pick = (w: string) => {
    if (chosen || o.state) return
    speak(w)
    if (w === ex.word) {
      setChosen(w)
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((i) => i + 1); setChosen(null) }
      }, 800)
    } else {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else { setIdx((i) => i + 1); setChosen(null) }
      }
      o.wrong(advance, ex.word)
    }
  }

  return (
    <GameShell title="Escute a Palavra" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-3 flex flex-col items-center gap-3">
          <div className="rounded-[28px] bg-white/95 p-4" style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.18)" }}>
            <ObjectIcon name={ex.img} size={108} />
          </div>
          <SpeakButton text={ex.word} label="OUVIR PALAVRA" slow />
        </div>
        <Instruction>QUAL PALAVRA VOCÊ OUVIU?</Instruction>
        <div className="mt-auto flex flex-col gap-2.5 pb-3 w-full px-2">
          {ex.opts.map((w) => {
            const isChosen = chosen === w
            const isCorrect = w === ex.word
            const bg = isChosen && isCorrect ? PALETTE.green : isChosen ? PALETTE.coral : accent2
            return (
              <button key={w} onClick={() => pick(w)} disabled={!!chosen}
                className="tap-shrink w-full rounded-2xl px-4 py-3 text-base font-bold uppercase text-white"
                style={{ background: bg, boxShadow: `0 4px 0 ${shade(bg, -26)}`, opacity: chosen && !isChosen ? 0.5 : 1 }}>
                {w}
              </button>
            )
          })}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setChosen(null) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}
