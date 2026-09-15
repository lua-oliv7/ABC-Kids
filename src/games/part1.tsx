import { useState } from "react"
import { ObjectIcon } from "../components/art"
import { PALETTE, speak } from "../lib/store"
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

/* ===== GAME 01 — COMPLETE A PALAVRA ===== */
interface Ex01 { pre: string; post: string; answer: string; word: string; img: string; opts: string[]; hint: string }

const EX01: Ex01[] = [
  { pre: "P", post: "ATO", answer: "R", word: "PRATO", img: "plate", opts: ["R","A","L"], hint: "P-?-ATO: usamos para comer. A letra que treme: R!" },
  { pre: "B", post: "LA", answer: "O", word: "BOLA", img: "ball", opts: ["U","O","A"], hint: "B-?-LA: jogamos no recreio. Vogal redonda como a bola!" },
  { pre: "G", post: "TO", answer: "A", word: "GATO", img: "cat", opts: ["E","A","I"], hint: "G-?-TO: faz miau. A vogal mais usada do português!" },
  { pre: "C", post: "SA", answer: "A", word: "CASA", img: "house", opts: ["O","A","E"], hint: "C-?-SA: onde moramos. A vogal mais usada do português!" },
  { pre: "FA", post: "A", answer: "C", word: "FACA", img: "knife", opts: ["C","S","T"], hint: "FA-?-A: corta pão. Consoante do cachorro: C!" },
  { pre: "L", post: "VRO", answer: "I", word: "LIVRO", img: "book", opts: ["I","E","O"], hint: "L-?-VRO: cheio de histórias. Vogal no meio: I!" },
  { pre: "PA", post: "O", answer: "T", word: "PATO", img: "cat", opts: ["T","D","C"], hint: "PA-?-O: ave que nada. O som firme no meio: T!" },
  { pre: "S", post: "L", answer: "O", word: "SOL", img: "sun", opts: ["O","A","U"], hint: "S-?-L: brilha no céu. Vogal redonda como o sol!" },
  { pre: "CAR", post: "A", answer: "T", word: "CARTA", img: "envelope", opts: ["T","D","S"], hint: "CAR-?-A: mandamos pelo correio. Letra T!" },
  { pre: "D", post: "DO", answer: "A", word: "DADO", img: "ball", opts: ["A","E","O"], hint: "D-?-DO: tem seis faces. A vogal mais fácil: A!" },
]

const EX01_ALFA: Ex01[] = [
  { pre: "B",  post: "ANCO", answer: "R", word: "BRANCO", img: "star",     opts: ["R","L","N"], hint: "B_ANCO: branco como a neve. Grupo BR!" },
  { pre: "P",  post: "ANTA", answer: "L", word: "PLANTA", img: "apple",    opts: ["L","R","N"], hint: "P_ANTA: cresce no jardim. Grupo PL!" },
  { pre: "T",  post: "EINO", answer: "R", word: "TREINO", img: "ball",     opts: ["R","L","N"], hint: "T_EINO: prática esportiva. Grupo TR!" },
  { pre: "F",  post: "AUTA", answer: "L", word: "FLAUTA", img: "star",     opts: ["L","R","N"], hint: "F_AUTA: instrumento de sopro. Grupo FL!" },
  { pre: "G",  post: "IPE",  answer: "R", word: "GRIPE",  img: "sun",      opts: ["R","L","N"], hint: "G_IPE: doença comum. Grupo GR!" },
  { pre: "B",  post: "USA",  answer: "L", word: "BLUSA",  img: "envelope", opts: ["L","R","N"], hint: "B_USA: roupa confortável. Grupo BL!" },
  { pre: "C",  post: "AVO",  answer: "R", word: "CRAVO",  img: "star",     opts: ["R","L","N"], hint: "C_AVO: flor perfumada. Grupo CR!" },
  { pre: "D",  post: "AGÃO", answer: "R", word: "DRAGÃO", img: "cat",      opts: ["R","L","N"], hint: "D_AGÃO: criatura mágica. Grupo DR!" },
  { pre: "F",  post: "ASCO", answer: "R", word: "FRASCO", img: "ball",     opts: ["R","L","N"], hint: "F_ASCO: recipiente pequeno. Grupo FR!" },
  { pre: "ES", post: "OLA",  answer: "C", word: "ESCOLA", img: "book",     opts: ["C","G","R"], hint: "ES_OLA: onde aprendemos. Letra C!" },
]

export function Game01({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX01_ALFA : EX01
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState<string | null>(null)
  const ex = DATA[idx]

  const advance = () => {
    if (idx >= DATA.length - 1) onAdvance()
    else { setIdx((i) => i + 1); setPlaced(null) }
  }

  const choose = (l: string) => {
    if (placed || o.state) return
    speak(l)
    if (l === ex.answer) {
      setPlaced(l)
      setTimeout(() => speak(ex.word), 200)
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((i) => i + 1); setPlaced(null) }
      }, 900)
    } else {
      o.wrong(advance, ex.answer)
    }
  }

  return (
    <GameShell title="Complete a Palavra" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-[24px] bg-white/90 p-2.5" style={{ boxShadow: "0 6px 18px rgba(49,84,119,0.14)" }}>
            <ObjectIcon name={ex.img} size={96} />
          </div>
          <SpeakButton text={ex.word} label="OUVIR" />
        </div>
        <Instruction>QUAL LETRA ESTÁ FALTANDO?</Instruction>
        <div className="mb-2 flex items-center gap-1.5">
          {ex.pre.split("").map((c, i) => <Tile key={`p${i}`} faded size={50}>{c}</Tile>)}
          <Slot letter={placed || undefined} color={accent2} size={50} highlight={!placed} />
          {ex.post.split("").map((c, i) => <Tile key={`s${i}`} faded size={50}>{c}</Tile>)}
        </div>
        {placed
          ? <div className="anim-pop mb-2 text-2xl font-bold tracking-widest" style={{ color: accent }}>{ex.word}</div>
          : null
        }
        <div className="mt-auto flex gap-4 pb-2">
          {ex.opts.map((l) => (
            <Tile key={l} color={accent2} size={68} speakText={l} onClick={() => choose(l)} disabled={!!placed}>{l}</Tile>
          ))}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setPlaced(null) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 02 — COLOQUE A LETRA ===== */
interface Ex02 { word: string; blank: number; answer: string; img: string; opts: string[]; hint: string }

const EX02: Ex02[] = [
  { word: "CARTA", blank: 2, answer: "R", img: "envelope", opts: ["L","R","M","N"], hint: "CA-TA: carta para o correio. Consoante que vibra: R!" },
  { word: "PORTA", blank: 2, answer: "R", img: "house", opts: ["L","R","B","M"], hint: "PO-TA: tem maçaneta. Letra vibrante: R!" },
  { word: "FORTE", blank: 2, answer: "R", img: "shield", opts: ["L","R","N","T"], hint: "FO-TE: o super-herói é ____. Letra R!" },
  { word: "BARCA", blank: 2, answer: "R", img: "ball", opts: ["L","R","M","N"], hint: "BA-CA: flutua na água. Consoante vibrante: R!" },
  { word: "PULAR", blank: 2, answer: "L", img: "ball", opts: ["L","R","N","M"], hint: "PU_AR: o canguru sabe ____. Letra L!" },
  { word: "COLAR", blank: 2, answer: "L", img: "ball", opts: ["L","R","N","B"], hint: "CO_AR: usa-se no pescoço. Letra suave: L!" },
  { word: "FALAR", blank: 2, answer: "L", img: "speaker", opts: ["L","R","M","N"], hint: "FA_AR: o professor gosta de ____. Letra L!" },
  { word: "ARCO",  blank: 1, answer: "R", img: "ball", opts: ["R","L","B","M"], hint: "A-CO: do arco-íris. Letra que vibra: R!" },
  { word: "BOLSO", blank: 2, answer: "L", img: "ball", opts: ["L","R","N","S"], hint: "BO-SO: onde guardamos coisas. Letra L!" },
  { word: "PALCO", blank: 2, answer: "L", img: "shield", opts: ["L","R","N","B"], hint: "PA-CO: onde os atores ficam. Letra L!" },
]

const EX02_ALFA: Ex02[] = [
  { word: "PROVA",  blank: 1, answer: "R", img: "book",    opts: ["R","L","N","M"], hint: "P_OVA: teste na escola. Grupo PR!" },
  { word: "CLUBE",  blank: 1, answer: "L", img: "ball",    opts: ["L","R","N","B"], hint: "C_UBE: grupo de amigos. Grupo CL!" },
  { word: "BRACO",  blank: 1, answer: "R", img: "ball",    opts: ["R","L","N","M"], hint: "B_ACO: parte do nosso corpo. Grupo BR!" },
  { word: "CLIMA",  blank: 1, answer: "L", img: "sun",     opts: ["L","R","N","S"], hint: "C_IMA: tempo do dia. Grupo CL!" },
  { word: "GRILO",  blank: 1, answer: "R", img: "cat",     opts: ["R","L","N","V"], hint: "G_ILO: inseto que canta à noite. Grupo GR!" },
  { word: "PLANO",  blank: 1, answer: "L", img: "book",    opts: ["L","R","N","S"], hint: "P_ANO: projeto ou ideia. Grupo PL!" },
  { word: "PRESO",  blank: 1, answer: "R", img: "shield",  opts: ["R","L","N","M"], hint: "P_ESO: atrás das grades. Grupo PR!" },
  { word: "FLOCO",  blank: 1, answer: "L", img: "star",    opts: ["L","R","N","B"], hint: "F_OCO: floco de neve. Grupo FL!" },
  { word: "TROCO",  blank: 1, answer: "R", img: "ball",    opts: ["R","L","N","M"], hint: "T_OCO: dinheiro de volta. Grupo TR!" },
  { word: "GLOBO",  blank: 1, answer: "L", img: "sun",     opts: ["L","R","N","B"], hint: "G_OBO: esfera do mundo. Grupo GL!" },
]

export function Game02({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX02_ALFA : EX02
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [placed, setPlaced] = useState<string | null>(null)
  const ex = DATA[idx]
  const letters = ex.word.split("")

  const advance = () => {
    if (idx >= DATA.length - 1) onAdvance()
    else { setIdx((i) => i + 1); setPlaced(null) }
  }

  const choose = (l: string) => {
    if (placed || o.state) return
    speak(l)
    if (l === ex.answer) {
      setPlaced(l)
      setTimeout(() => speak(ex.word), 200)
      setTimeout(() => {
        if (idx >= DATA.length - 1) o.correct()
        else { o.advanceExercise(); setIdx((i) => i + 1); setPlaced(null) }
      }, 900)
    } else {
      o.wrong(advance, ex.answer)
    }
  }

  return (
    <GameShell title="Coloque a Letra" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-[24px] bg-white/90 p-2.5" style={{ boxShadow: "0 6px 18px rgba(49,84,119,0.14)" }}>
            <ObjectIcon name={ex.img} size={92} />
          </div>
          <SpeakButton text={ex.word} label="OUVIR" />
        </div>
        <Instruction>TOQUE NA LETRA CORRETA!</Instruction>
        <div className="mb-3 flex items-center gap-1.5">
          {letters.map((ch, i) =>
            i === ex.blank
              ? <Slot key={i} letter={placed || undefined} color={accent} size={50} highlight={!placed} />
              : <Tile key={i} faded size={50}>{ch}</Tile>
          )}
        </div>
        {placed && (
          <div className="anim-pop mb-2 text-2xl font-bold tracking-widest" style={{ color: accent }}>{ex.word}</div>
        )}
        {!placed && (
          <div className="mt-auto flex flex-col items-center gap-2 pb-2">
            <p className="text-sm font-bold uppercase" style={{ color: PALETTE.blueDeep }}>ESCOLHA A LETRA CERTA:</p>
            <div className="flex gap-3">
              {/* All tiles use the same color — no visual hint about which is correct */}
              {ex.opts.map((l) => (
                <Tile key={l} color={accent2} size={64} speakText={l} onClick={() => choose(l)}>{l}</Tile>
              ))}
            </div>
          </div>
        )}
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint}
        clear={() => { o.clear(); setPlaced(null) }} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 03 — BATALHA DE SÍLABAS ===== */
interface Ex03 { target: string[]; pool: string[]; img: string; word: string; hint: string }

const EX03: Ex03[] = [
  { target: ["CAR","TA"],       pool: ["TA","CAR","LA","TO","SA","MA"],  img: "envelope", word: "CARTA",    hint: "CAR + TA = CARTA! Carta é o que enviamos pelo correio!" },
  { target: ["CA","CHO","RRO"], pool: ["CA","BO","CHO","RA","RRO","TA"], img: "dog",      word: "CACHORRO", hint: "CA + CHO + RRO = CACHORRO! O animal que faz AU AU!" },
  { target: ["JA","NE","LA"],   pool: ["JA","LE","NE","LA","CA","TA"],   img: "house",    word: "JANELA",   hint: "JA + NE + LA = JANELA! Por onde vemos a rua!" },
  { target: ["SA","PA","TO"],   pool: ["SA","PA","LA","TO","BO","CA"],   img: "ball",     word: "SAPATO",   hint: "SA + PA + TO = SAPATO! Colocamos no pé!" },
  { target: ["MA","CA","CO"],   pool: ["MA","CA","CO","SA","LA","BO"],   img: "monkey",   word: "MACACO",   hint: "MA + CA + CO = MACACO! Vive na floresta!" },
  { target: ["TO","MA","TE"],   pool: ["TO","BO","MA","TE","LA","CA"],   img: "ball",     word: "TOMATE",   hint: "TO + MA + TE = TOMATE! Vermelho e gostoso!" },
]

const EX03_ALFA: Ex03[] = [
  { target: ["BOR","BO","LE","TA"],  pool: ["BOR","BO","LE","TA","CA","SA"], img: "ball",  word: "BORBOLETA",  hint: "BOR+BO+LE+TA = BORBOLETA! Voa de flor em flor!" },
  { target: ["CHO","CO","LA","TE"],  pool: ["CHO","CO","LA","TE","BO","SA"], img: "apple", word: "CHOCOLATE",  hint: "CHO+CO+LA+TE = CHOCOLATE! Doce feito de cacau!" },
  { target: ["E","LE","FAN","TE"],   pool: ["E","LE","FAN","TE","CA","BO"],  img: "cat",   word: "ELEFANTE",   hint: "E+LE+FAN+TE = ELEFANTE! O maior da floresta!" },
  { target: ["BI","CI","CLE","TA"],  pool: ["BI","CI","CLE","TA","SA","NA"], img: "ball",  word: "BICICLETA",  hint: "BI+CI+CLE+TA = BICICLETA! Anda com pedais!" },
  { target: ["TAR","TA","RU","GA"],  pool: ["TAR","TA","RU","GA","BO","LA"], img: "ball",  word: "TARTARUGA",  hint: "TAR+TA+RU+GA = TARTARUGA! Anda devagarzinho!" },
  { target: ["GI","RAS","SOL"],      pool: ["GI","RAS","SOL","BO","TA","CA"],img: "sun",   word: "GIRASSOL",   hint: "GI+RAS+SOL = GIRASSOL! Sempre de frente ao sol!" },
]

export function Game03({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX03_ALFA : EX03
  const o = useOutcome()
  const [idx, setIdx] = useState(0)
  const [slots, setSlots] = useState<(string|null)[]>(DATA[0].target.map(() => null))
  const [used, setUsed] = useState<number[]>([])
  const ex = DATA[idx]
  const nextI = slots.findIndex((s) => s === null)

  const advanceEx = (newIdx: number) => {
    const next = DATA[newIdx]
    setIdx(newIdx)
    setSlots(next.target.map(() => null))
    setUsed([])
  }

  const pick = (syl: string, i: number) => {
    if (nextI === -1 || used.includes(i) || o.state) return
    speak(syl)
    if (syl === ex.target[nextI]) {
      const ns = [...slots]; ns[nextI] = syl
      setSlots(ns); setUsed([...used, i])
      if (ns.every((s, k) => s === ex.target[k])) {
        speak(ex.word)
        setTimeout(() => {
          if (idx >= DATA.length - 1) o.correct()
          else { o.advanceExercise(); advanceEx(idx + 1) }
        }, 700)
      }
    } else {
      const advance = () => {
        if (idx >= DATA.length - 1) onAdvance()
        else advanceEx(idx + 1)
      }
      o.wrong(advance, ex.target.join("+"))
    }
  }

  const reset = () => { o.clear(); setSlots(ex.target.map(() => null)); setUsed([]) }

  return (
    <GameShell title="Batalha de Sílabas" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={idx} color={accent} />
        <div className="mb-2 flex items-center gap-2">
          <div className="rounded-[24px] bg-white/90 p-2" style={{ boxShadow: "0 6px 16px rgba(49,84,119,0.14)" }}>
            <ObjectIcon name={ex.img} size={86} />
          </div>
          <SpeakButton text={ex.word} label="OUVIR" />
        </div>
        <Instruction>MONTE A PALAVRA NA ARENA!</Instruction>
        <div className="mb-6 flex gap-2">
          {slots.map((s, i) => <Slot key={i} letter={s || undefined} color={accent} size={66} highlight={i === nextI} />)}
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 pb-2">
          {ex.pool.map((syl, i) => (
            <Tile key={i} color={used.includes(i) ? "#C4D3DE" : accent2} size={62} speakText={syl}
              onClick={() => pick(syl, i)} disabled={used.includes(i)}>
              {syl}
            </Tile>
          ))}
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint} clear={reset} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}

/* ===== GAME 04 — TROCA-LETRAS ===== */
interface SwapItem { letter: string; word: string; img: string; ok: boolean }
interface Ex04 { base: string; baseImg: string; swaps: SwapItem[]; needed: number; hint: string }

const EX04: Ex04[] = [
  { base: "BOLA", baseImg: "ball", needed: 2, hint: "COLA e MOLA são palavras! POLA não existe!",
    swaps: [{ letter:"C", word:"COLA", img:"glue", ok:true },{ letter:"M", word:"MOLA", img:"spring", ok:true },{ letter:"P", word:"POLA", img:"ball", ok:false }] },
  { base: "GATO", baseImg: "cat", needed: 2, hint: "PATO e MATO são palavras reais!",
    swaps: [{ letter:"P", word:"PATO", img:"cat", ok:true },{ letter:"M", word:"MATO", img:"ball", ok:true },{ letter:"Z", word:"ZATO", img:"ball", ok:false }] },
  { base: "FOCA", baseImg: "dog", needed: 2, hint: "TOCA (do animal) e ROCA (para fiar) existem!",
    swaps: [{ letter:"T", word:"TOCA", img:"house", ok:true },{ letter:"R", word:"ROCA", img:"ball", ok:true },{ letter:"V", word:"VOCA", img:"ball", ok:false }] },
  { base: "CAMA", baseImg: "house", needed: 2, hint: "DAMA (no xadrez) e FAMA são palavras reais!",
    swaps: [{ letter:"D", word:"DAMA", img:"ball", ok:true },{ letter:"F", word:"FAMA", img:"ball", ok:true },{ letter:"H", word:"HAMA", img:"ball", ok:false }] },
  { base: "MALA", baseImg: "ball", needed: 2, hint: "SALA e BALA são palavras reais!",
    swaps: [{ letter:"S", word:"SALA", img:"house", ok:true },{ letter:"B", word:"BALA", img:"ball", ok:true },{ letter:"X", word:"XALA", img:"ball", ok:false }] },
]

const EX04_ALFA: Ex04[] = [
  { base: "CANTO", baseImg: "star",   needed: 2, hint: "SANTO e MANTO existem! ZANTO não existe!",
    swaps: [{ letter:"S", word:"SANTO", img:"star",  ok:true },{ letter:"M", word:"MANTO", img:"ball",   ok:true },{ letter:"Z", word:"ZANTO", img:"ball", ok:false }] },
  { base: "TRATO", baseImg: "plate",  needed: 2, hint: "GRATO e PRATO são palavras! XRATO não!",
    swaps: [{ letter:"G", word:"GRATO", img:"ball",  ok:true },{ letter:"P", word:"PRATO", img:"plate",  ok:true },{ letter:"X", word:"XRATO", img:"ball", ok:false }] },
  { base: "PISTA", baseImg: "ball",   needed: 2, hint: "VISTA e LISTA existem! ZISTA não!",
    swaps: [{ letter:"V", word:"VISTA", img:"sun",   ok:true },{ letter:"L", word:"LISTA", img:"book",   ok:true },{ letter:"Z", word:"ZISTA", img:"ball", ok:false }] },
  { base: "VENTO", baseImg: "star",   needed: 2, hint: "CENTO e TENTO são palavras! XENTO não!",
    swaps: [{ letter:"C", word:"CENTO", img:"book",  ok:true },{ letter:"T", word:"TENTO", img:"ball",   ok:true },{ letter:"X", word:"XENTO", img:"ball", ok:false }] },
  { base: "FORTE", baseImg: "shield", needed: 2, hint: "SORTE e MORTE são palavras! ZORTE não!",
    swaps: [{ letter:"S", word:"SORTE", img:"star",  ok:true },{ letter:"M", word:"MORTE", img:"ball",   ok:true },{ letter:"Z", word:"ZORTE", img:"ball", ok:false }] },
]

export function Game04({ character, accent, accent2, onHome, onAdvance, isLast, level }: GameProps) {
  const DATA = level === "alfabetico" ? EX04_ALFA : EX04
  const o = useOutcome()
  const [exIdx, setExIdx] = useState(0)
  const [word, setWord] = useState(DATA[0].base)
  const [img, setImg] = useState(DATA[0].baseImg)
  const [discovered, setDiscovered] = useState<string[]>([])
  const ex = DATA[exIdx]

  const swap = (s: SwapItem) => {
    if (o.state) return
    speak(s.word)
    if (!s.ok) {
      const advance = () => {
        if (exIdx >= DATA.length - 1) onAdvance()
        else {
          const next = DATA[exIdx + 1]
          setExIdx((i) => i + 1)
          setWord(next.base); setImg(next.baseImg); setDiscovered([])
        }
      }
      o.wrong(advance, ex.swaps.filter((sw) => sw.ok).map((sw) => sw.letter).join(" ou "))
      return
    }
    setWord(s.word); setImg(s.img)
    const nd = discovered.includes(s.letter) ? discovered : [...discovered, s.letter]
    setDiscovered(nd)
    if (nd.length >= ex.needed) {
      setTimeout(() => {
        if (exIdx >= DATA.length - 1) o.correct()
        else {
          const next = DATA[exIdx + 1]
          o.advanceExercise()
          setExIdx((i) => i + 1)
          setWord(next.base); setImg(next.baseImg); setDiscovered([])
        }
      }, 700)
    }
  }

  return (
    <GameShell title="Troca-Letras" character={character} accent={accent} onHome={onHome}>
      <div className="flex h-full flex-col items-center">
        <ProgressDots total={DATA.length} current={exIdx} color={accent} />
        <div className="mb-2 rounded-[24px] bg-white/90 p-2.5" style={{ boxShadow: "0 6px 18px rgba(49,84,119,0.14)" }}>
          <div key={img} className="anim-pop"><ObjectIcon name={img} size={108} /></div>
        </div>
        <div className="mb-1 flex items-center gap-2">
          <div key={word} className="anim-pop text-3xl font-bold tracking-wide" style={{ color: accent }}>{word}</div>
          <SpeakButton text={word} />
        </div>
        <Instruction>TROQUE UMA LETRA!</Instruction>
        <div className="mt-auto flex flex-col items-center gap-2 pb-2">
          <span className="text-sm font-semibold uppercase" style={{ color: PALETTE.blueDeep }}>
            PALAVRAS NOVAS: {discovered.length}/{ex.needed}
          </span>
          <div className="flex gap-3">
            {ex.swaps.map((s) => (
              <Tile key={s.letter} color={discovered.includes(s.letter) ? PALETTE.green : accent2}
                size={68} speakText={s.word} onClick={() => swap(s)}>
                {s.letter}
              </Tile>
            ))}
          </div>
        </div>
      </div>
      <OutcomeOverlay state={o.state} character={character} hint={ex.hint} clear={o.clear} onAdvance={onAdvance} isLast={isLast} />
    </GameShell>
  )
}
