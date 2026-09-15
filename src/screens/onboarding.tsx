import React, { useState } from "react"
import {
  AnimalAvatar,
  Mascots,
  Sparkle,
  Star,
} from "../components/art"
import {
  BackButton,
  FloatingBits,
  PrimaryButton,
  Screen,
  shade,
} from "../components/kit"
import {
  ACCESSORIES,
  ANIMALS,
  AccessoryId,
  AnimalType,
  COLOR_SWATCHES,
  Character,
  DEFAULT_CHARACTER,
  FACES,
  FaceId,
  HATS,
  HatId,
  PALETTE,
  playTone,
  speak,
} from "../lib/store"
import { useApp } from "../lib/app"

/* ---------- ABC KIDS wordmark ---------- */
export function Logo({ scale = 1 }: { scale?: number }) {
  const letters: [string, string][] = [
    ["A", PALETTE.orange],
    ["B", PALETTE.blue],
    ["C", PALETTE.green],
  ]
  return (
    <div className="flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
      <div className="flex items-end gap-1">
        {letters.map(([ch, c], i) => (
          <span
            key={i}
            className="anim-float inline-block font-bold leading-none"
            style={{
              fontSize: 66,
              color: c,
              WebkitTextStroke: "3px #fff",
              paintOrder: "stroke fill",
              textShadow: `0 6px 0 ${shade(c, -30)}, 0 10px 14px rgba(49,84,119,.3)`,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <span
        className="-mt-1 font-bold"
        style={{
          fontSize: 34,
          letterSpacing: "0.18em",
          color: PALETTE.blueDeep,
          WebkitTextStroke: "2px #fff",
          paintOrder: "stroke fill",
          textShadow: "0 4px 10px rgba(49,84,119,.25)",
        }}
      >
        KIDS
      </span>
    </div>
  )
}

/* ============================= STUDENT LOGIN ============================= */
export function StudentLoginScreen({
  onBack,
  onLoggedIn,
}: {
  onBack: () => void
  onLoggedIn: (needsCharacter: boolean) => void
}) {
  const { students, studentLogin } = useApp()
  const [selected, setSelected] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const selectedStudent = students.find((s) => s.id === selected)

  const tryLogin = () => {
    if (!selectedStudent) return
    const ok = studentLogin(selectedStudent.name, password)
    if (ok) {
      playTone("correct")
      // Find the student after login to check characterCustomized
      const st = students.find((s) => s.id === selected)!
      onLoggedIn(!st.characterCustomized)
    } else {
      playTone("wrong")
      setError("SENHA INCORRETA! TENTE DE NOVO.")
      setPassword("")
    }
  }

  const COLORS = [PALETTE.orange, PALETTE.blue, PALETTE.green, PALETTE.pink, PALETTE.turquoise, PALETTE.lilac, PALETTE.yellow, PALETTE.coral]

  return (
    <Screen>
      <div className="flex items-center">
        <BackButton onClick={onBack} />
      </div>

      <div className="mt-2 flex flex-col items-center">
        <div className="anim-float mb-1">
          <Mascots size={120} />
        </div>
        <h1 className="text-2xl font-bold uppercase" style={{ color: PALETTE.blueDeep }}>
          QUEM ESTÁ CHEGANDO?
        </h1>
        <p className="text-sm font-medium" style={{ color: PALETTE.blue }}>
          TOQUE NO SEU NOME!
        </p>
      </div>

      {students.length === 0 ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-2 px-4">
          <div className="rounded-[24px] bg-white/90 p-6 text-center" style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.14)" }}>
            <div className="mb-2 text-4xl">🎒</div>
            <p className="font-bold uppercase" style={{ color: PALETTE.blueDeep }}>
              NENHUM ALUNO CADASTRADO
            </p>
            <p className="mt-1 text-sm font-medium" style={{ color: PALETTE.blue }}>
              PEÇA AO SEU PROFESSOR PARA CRIAR A SUA CONTA!
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
          {/* Student cards */}
          <div className="grid grid-cols-2 gap-2.5 px-1">
            {students.map((st, i) => {
              const c = COLORS[i % COLORS.length]
              const isSelected = selected === st.id
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    playTone("tap")
                    speak(st.name)
                    setSelected(isSelected ? null : st.id)
                    setPassword("")
                    setError("")
                  }}
                  className="tap-shrink flex flex-col items-center gap-1.5 rounded-[24px] p-3"
                  style={{
                    background: isSelected ? c : "#ffffffee",
                    boxShadow: isSelected
                      ? `0 6px 0 ${shade(c, -26)}, 0 10px 18px ${c}55`
                      : "0 4px 12px rgba(49,84,119,0.12)",
                    border: isSelected ? "none" : `3px solid ${c}44`,
                  }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ background: isSelected ? "rgba(255,255,255,0.28)" : `${c}22` }}
                  >
                    <AnimalAvatar animal={st.character.animal} character={st.character} size={52} happy />
                  </div>
                  <span
                    className="text-center text-sm font-bold leading-tight uppercase"
                    style={{ color: isSelected ? "#fff" : PALETTE.blueDeep }}
                  >
                    {st.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Password section */}
          {selected && selectedStudent && (
            <div
              className="anim-rise mx-1 rounded-[24px] bg-white p-4"
              style={{ boxShadow: "0 8px 24px rgba(49,84,119,0.14)" }}
            >
              <p className="mb-2 text-center text-sm font-bold uppercase" style={{ color: PALETTE.blueDeep }}>
                OLÁ, {selectedStudent.name.toUpperCase()}! QUAL É A SUA SENHA?
              </p>
              <input
                autoFocus
                type="password"
                value={password}
                maxLength={20}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && tryLogin()}
                placeholder="••••••"
                className="w-full rounded-2xl px-4 py-3 text-center text-xl font-bold tracking-widest outline-none"
                style={{
                  color: PALETTE.blueDeep,
                  border: `3px solid ${error ? PALETTE.coral : PALETTE.sky}`,
                  background: "#f8faff",
                }}
              />
              {error && (
                <p className="mt-1.5 text-center text-xs font-bold uppercase" style={{ color: PALETTE.coral }}>
                  {error}
                </p>
              )}
              <div className="mt-3">
                <PrimaryButton disabled={!password.trim()} onClick={tryLogin}>
                  ENTRAR ▶
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      )}
    </Screen>
  )
}

/* ====================== CREATE CHARACTER ====================== */
type Tab = "bichinho" | "chapeus" | "rosto" | "acessorios" | "cores"

export function CreateCharacter({
  name,
  onBack,
  onDone,
  initial,
}: {
  name: string
  onBack: () => void
  onDone: (c: Character) => void
  initial?: Character
}) {
  const [c, setC] = useState<Character>(initial || DEFAULT_CHARACTER)
  const [tab, setTab] = useState<Tab>("bichinho")

  const set = (patch: Partial<Character>) => {
    playTone("tap")
    setC((prev) => ({ ...prev, ...patch }))
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "bichinho", label: "🐾 Bichinho" },
    { id: "chapeus", label: "🎩 Chapéus" },
    { id: "rosto", label: "🕶️ Rosto" },
    { id: "acessorios", label: "🎀 Acessórios" },
    { id: "cores", label: "🎨 Cores" },
  ]

  return (
    <Screen>
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} />
        <h1 className="text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
          CRIE SEU PERSONAGEM!
        </h1>
      </div>
      <p className="mt-1 text-sm font-medium" style={{ color: PALETTE.blue }}>
        Olá, {name}! Escolha seu bichinho favorito e personalize!
      </p>

      {/* Preview island */}
      <div className="relative mt-2 flex items-center justify-center">
        <Sparkle size={18} className="anim-twinkle absolute left-8 top-2" color={PALETTE.yellow} />
        <Star size={16} className="anim-twinkle absolute right-10 top-4" style={{ animationDelay: "0.6s" }} />
        <div className="relative">
          <div className="anim-float">
            <AnimalAvatar animal={c.animal} character={c} size={168} happy />
          </div>
          <div
            className="mx-auto -mt-6 h-8 rounded-full"
            style={{ width: 150, background: PALETTE.green, opacity: 0.6, filter: "blur(1px)" }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { playTone("tap"); setTab(t.id) }}
            className="tap-shrink shrink-0 rounded-full px-3.5 py-2 text-sm font-bold"
            style={{
              background: tab === t.id ? PALETTE.blue : "#ffffffcc",
              color: tab === t.id ? "#fff" : PALETTE.blueDeep,
              boxShadow: tab === t.id ? `0 3px 0 ${shade(PALETTE.blue, -26)}` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Options grid */}
      <div
        className="min-h-0 flex-1 overflow-y-auto rounded-[28px] bg-white/85 p-3"
        style={{ boxShadow: "inset 0 2px 8px rgba(49,84,119,0.08)" }}
      >
        {tab === "bichinho" && (
          <div className="grid grid-cols-3 gap-2.5">
            {ANIMALS.map((a) => (
              <OptionCard key={a.type} active={c.animal === a.type} onClick={() => set({ animal: a.type })}>
                <AnimalAvatar animal={a.type} character={{ tint: c.tint }} size={62} happy />
                <span className="text-xs font-semibold" style={{ color: PALETTE.blueDeep }}>
                  {a.label}
                </span>
              </OptionCard>
            ))}
          </div>
        )}

        {tab === "chapeus" && (
          <PickGrid
            items={HATS}
            active={c.hat}
            onPick={(id) => set({ hat: id as HatId })}
            render={(id) => <AnimalAvatar animal={c.animal} character={{ ...c, hat: id as HatId }} size={62} happy />}
          />
        )}
        {tab === "rosto" && (
          <PickGrid
            items={FACES}
            active={c.face}
            onPick={(id) => set({ face: id as FaceId })}
            render={(id) => <AnimalAvatar animal={c.animal} character={{ ...c, face: id as FaceId }} size={62} happy />}
          />
        )}
        {tab === "acessorios" && (
          <PickGrid
            items={ACCESSORIES}
            active={c.accessory}
            onPick={(id) => set({ accessory: id as AccessoryId })}
            render={(id) => <AnimalAvatar animal={c.animal} character={{ ...c, accessory: id as AccessoryId }} size={62} happy />}
          />
        )}
        {tab === "cores" && (
          <div className="flex flex-wrap justify-center gap-3 py-2">
            {COLOR_SWATCHES.map((sw, i) => (
              <button
                key={i}
                onClick={() => set({ tint: sw })}
                className="tap-shrink flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: sw || "#fff",
                  border: c.tint === sw ? `4px solid ${PALETTE.blue}` : "4px solid #E4EEF5",
                  boxShadow: "0 4px 10px rgba(49,84,119,0.12)",
                }}
              >
                {!sw && <span className="text-xs font-bold" style={{ color: PALETTE.blueDeep }}>Natural</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3">
        <PrimaryButton color={PALETTE.green} onClick={() => onDone(c)}>
          PRONTO!  ⭐
        </PrimaryButton>
      </div>
    </Screen>
  )
}

function OptionCard({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="tap-shrink flex flex-col items-center gap-1 rounded-2xl bg-white p-2"
      style={{
        border: active ? `3px solid ${PALETTE.blue}` : "3px solid transparent",
        boxShadow: active ? `0 5px 0 ${shade(PALETTE.blue, -26)}` : "0 3px 8px rgba(49,84,119,0.1)",
      }}
    >
      {active && (
        <Star size={16} className="absolute -mt-4 self-end" />
      )}
      {children}
    </button>
  )
}

function PickGrid({
  items,
  active,
  onPick,
  render,
}: {
  items: { id: string; label: string }[]
  active: string
  onPick: (id: string) => void
  render: (id: string) => React.ReactNode
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((it) => (
        <OptionCard key={it.id} active={active === it.id} onClick={() => onPick(it.id)}>
          {it.id === "none" ? (
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full" style={{ background: PALETTE.cream }}>
              <span className="text-2xl">🚫</span>
            </div>
          ) : (
            render(it.id)
          )}
          <span className="text-xs font-semibold" style={{ color: PALETTE.blueDeep }}>
            {it.label}
          </span>
        </OptionCard>
      ))}
    </div>
  )
}
