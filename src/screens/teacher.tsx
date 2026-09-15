import React, { useState } from "react"
import { AnimalAvatar } from "../components/art"
import { BackButton, ExitButton, PrimaryButton, SecondaryButton, shade } from "../components/kit"
import {
  ClassGameAvg,
  Classroom,
  GAMES,
  GameStats,
  PALETTE,
  PSICOGENESE_LEVELS,
  Play,
  Student,
  classAverages,
  fmtDate,
  gameStats,
  playTone,
  psicogenese,
  psicogeneseColor,
  studentOverview,
} from "../lib/store"
import { useApp } from "../lib/app"

/* ---------------- shared panel chrome ---------------- */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full" style={{ background: "#EEF4FA" }}>
      <div className="flex h-full w-full flex-col">{children}</div>
    </div>
  )
}

function TopBar({
  title,
  onBack,
  onExit,
}: {
  title: string
  onBack?: () => void
  onExit?: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-4"
      style={{ background: PALETTE.blueDeep }}
    >
      {onBack && (
        <button
          onClick={() => { playTone("tap"); onBack() }}
          aria-label="Voltar"
          className="tap-shrink flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 5l-7 7 7 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      <h1 className="flex-1 truncate text-lg font-bold text-white">{title}</h1>
      {onExit && <ExitButton onClick={onExit} dark />}
    </div>
  )
}

function pctColor(pct: number | null) {
  if (pct === null) return "#C4D3DE"
  if (pct >= 80) return PALETTE.green
  if (pct >= 60) return PALETTE.yellow
  return PALETTE.coral
}

function PerfBar({ pct }: { pct: number | null }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#E1E9F1" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct ?? 0}%`, background: pctColor(pct) }}
      />
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-3 text-center" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
      <div className="text-2xl font-bold" style={{ color: color ?? PALETTE.blueDeep }}>{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.blue }}>{label}</div>
    </div>
  )
}

/* ---------------- Psicogênese Badge ---------------- */
function PsicogeneseBadge({ pct }: { pct: number | null }) {
  const level = psicogenese(pct)
  const color = psicogeneseColor(pct)
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
      style={{ background: color }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" fill="rgba(255,255,255,0.3)" />
        <path d="M3 6l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {level}
    </div>
  )
}

/* ---------------- Psicogênese Progress Chart ---------------- */
function PsicogeneseChart({ pct }: { pct: number | null }) {
  const current = psicogenese(pct)
  return (
    <div className="rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
          Psicogênese da Escrita
        </span>
        <PsicogeneseBadge pct={pct} />
      </div>
      <div className="flex flex-col gap-1.5">
        {PSICOGENESE_LEVELS.map((lvl) => {
          const isActive = lvl.level === current
          const isPast =
            pct !== null &&
            PSICOGENESE_LEVELS.findIndex((l) => l.level === current) >
              PSICOGENESE_LEVELS.findIndex((l) => l.level === lvl.level)
          return (
            <div
              key={lvl.level}
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: isActive ? `${lvl.color}22` : isPast ? "#F0F4F8" : "#F8FAFC",
                border: isActive ? `2px solid ${lvl.color}` : "2px solid transparent",
              }}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: isActive || isPast ? lvl.color : "#E1E9F1" }}
              >
                {(isActive || isPast) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className="text-xs font-bold"
                  style={{ color: isActive ? lvl.color : isPast ? PALETTE.blue : "#B0C0CC" }}
                >
                  {lvl.level}
                </span>
                <span className="ml-2 text-[10px]" style={{ color: "#B0C0CC" }}>
                  {lvl.min}–{lvl.max}%
                </span>
              </div>
              {isActive && pct !== null && (
                <span className="text-xs font-bold" style={{ color: lvl.color }}>
                  {pct}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ============ DELETE CONFIRMATION MODAL ============ */
function ConfirmDeleteModal({
  studentName,
  onCancel,
  onConfirm,
}: {
  studentName: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        className="anim-pop relative w-full rounded-[26px] bg-white p-6 text-center"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: PALETTE.coral + "22" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={PALETTE.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Excluir aluno?
        </h3>
        <p className="mb-5 text-sm font-medium" style={{ color: PALETTE.blue }}>
          Todos os dados de <strong>{studentName}</strong> serão removidos permanentemente.
        </p>
        <div className="flex flex-col gap-2">
          <SecondaryButton onClick={onCancel}>CANCELAR</SecondaryButton>
          <PrimaryButton color={PALETTE.coral} onClick={onConfirm}>
            EXCLUIR
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

/* ============ CREATE STUDENT MODAL ============ */
function CreateStudentModal({
  existingNames,
  onCancel,
  onSave,
}: {
  existingNames: string[]
  onCancel: () => void
  onSave: (name: string, password: string) => void
}) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const isDuplicate = name.trim().length > 0 && existingNames.includes(name.trim().toLowerCase())
  const passwordMismatch = confirm.length > 0 && password !== confirm
  const ready = name.trim().length > 0 && password.length > 0 && password === confirm && !isDuplicate

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        className="anim-pop relative w-full rounded-[26px] bg-white p-6"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <h3 className="mb-4 text-center text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Cadastrar aluno
        </h3>
        <label className="mb-1 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Nome</label>
        <input
          autoFocus
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do aluno"
          className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
          style={{ color: PALETTE.blueDeep, border: `3px solid ${isDuplicate ? PALETTE.coral : PALETTE.sky}` }}
        />
        {isDuplicate && (
          <p className="mb-2 text-xs font-semibold" style={{ color: PALETTE.coral }}>Já existe um aluno com esse nome.</p>
        )}
        <label className="mb-1 mt-2 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Senha do aluno</label>
        <input
          type="password"
          value={password}
          maxLength={20}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha"
          className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
          style={{ color: PALETTE.blueDeep, border: `3px solid ${PALETTE.sky}` }}
        />
        <label className="mb-1 mt-2 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Confirmar senha</label>
        <input
          type="password"
          value={confirm}
          maxLength={20}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ready && onSave(name.trim(), password)}
          placeholder="Repita a senha"
          className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
          style={{ color: PALETTE.blueDeep, border: `3px solid ${passwordMismatch ? PALETTE.coral : PALETTE.sky}` }}
        />
        {passwordMismatch && (
          <p className="mb-2 text-xs font-semibold" style={{ color: PALETTE.coral }}>As senhas não coincidem.</p>
        )}
        <div className="mt-3 flex flex-col gap-2">
          <PrimaryButton disabled={!ready} onClick={() => onSave(name.trim(), password)}>
            CADASTRAR
          </PrimaryButton>
          <SecondaryButton onClick={onCancel}>CANCELAR</SecondaryButton>
        </div>
      </div>
    </div>
  )
}

/* ============ EDIT STUDENT MODAL ============ */
function EditStudentModal({
  student,
  existingNames,
  onCancel,
  onSave,
}: {
  student: Student
  existingNames: string[]
  onCancel: () => void
  onSave: (name: string, password?: string) => void
}) {
  const [name, setName] = useState(student.name)
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const isDuplicate =
    name.trim().toLowerCase() !== student.name.toLowerCase() &&
    existingNames.includes(name.trim().toLowerCase())
  const passwordMismatch = confirm.length > 0 && newPassword !== confirm
  const passwordOk = newPassword.length === 0 || (newPassword.length > 0 && newPassword === confirm)
  const ready = name.trim().length > 0 && !isDuplicate && passwordOk

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        className="anim-pop relative w-full rounded-[26px] bg-white p-6"
        style={{ boxShadow: "0 20px 50px rgba(49,84,119,0.35)" }}
      >
        <h3 className="mb-4 text-center text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Editar aluno
        </h3>
        <label className="mb-1 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Nome</label>
        <input
          autoFocus
          value={name}
          maxLength={16}
          onChange={(e) => setName(e.target.value)}
          className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
          style={{ color: PALETTE.blueDeep, border: `3px solid ${isDuplicate ? PALETTE.coral : PALETTE.sky}` }}
        />
        {isDuplicate && (
          <p className="mb-2 text-xs font-semibold" style={{ color: PALETTE.coral }}>Já existe um aluno com esse nome.</p>
        )}
        <label className="mb-1 mt-2 block text-sm font-semibold" style={{ color: PALETTE.blue }}>
          Nova senha <span style={{ color: PALETTE.blue, opacity: 0.6 }}>(deixe em branco para manter)</span>
        </label>
        <input
          type="password"
          value={newPassword}
          maxLength={20}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nova senha (opcional)"
          className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
          style={{ color: PALETTE.blueDeep, border: `3px solid ${PALETTE.sky}` }}
        />
        {newPassword.length > 0 && (
          <>
            <label className="mb-1 mt-2 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Confirmar nova senha</label>
            <input
              type="password"
              value={confirm}
              maxLength={20}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a senha"
              className="mb-1 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
              style={{ color: PALETTE.blueDeep, border: `3px solid ${passwordMismatch ? PALETTE.coral : PALETTE.sky}` }}
            />
            {passwordMismatch && (
              <p className="mb-2 text-xs font-semibold" style={{ color: PALETTE.coral }}>As senhas não coincidem.</p>
            )}
          </>
        )}
        <div className="mt-3 flex flex-col gap-2">
          <PrimaryButton disabled={!ready} onClick={() => onSave(name.trim(), newPassword.length > 0 ? newPassword : undefined)}>
            SALVAR
          </PrimaryButton>
          <SecondaryButton onClick={onCancel}>CANCELAR</SecondaryButton>
        </div>
      </div>
    </div>
  )
}

/* ============ CLASSROOM MANAGEMENT ============ */
function ClassroomView({
  classrooms,
  students,
  onCreate,
  onDelete,
  onEdit,
  onToggleStudent,
}: {
  classrooms: Classroom[]
  students: Student[]
  onCreate: (name: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, name: string) => void
  onToggleStudent: (classroomId: string, studentId: string) => void
}) {
  const [newName, setNewName] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const doCreate = () => {
    if (!newName.trim()) return
    onCreate(newName.trim())
    setNewName("")
    playTone("correct")
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Create new classroom */}
      <div className="rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
        <p className="mb-2 text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
          Nova turma
        </p>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doCreate()}
            placeholder="Nome da turma"
            maxLength={24}
            className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none"
            style={{ border: `2.5px solid ${PALETTE.sky}`, color: PALETTE.blueDeep }}
          />
          <button
            onClick={doCreate}
            disabled={!newName.trim()}
            className="tap-shrink rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            style={{
              background: newName.trim() ? PALETTE.green : "#C4D3DE",
              boxShadow: newName.trim() ? `0 4px 0 ${shade(PALETTE.green, -26)}` : "none",
            }}
          >
            + CRIAR
          </button>
        </div>
      </div>

      {/* Classroom list */}
      {classrooms.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm font-medium" style={{ color: PALETTE.blue }}>
          Nenhuma turma criada. Crie a primeira acima!
        </div>
      ) : (
        classrooms.map((cl) => {
          const clStudents = students.filter((s) => cl.studentIds.includes(s.id))
          const isExpanded = expandedId === cl.id
          const isEditing = editId === cl.id
          return (
            <div
              key={cl.id}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}
            >
              {/* header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: PALETTE.blue + "22" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="14" rx="3" fill={PALETTE.blue} />
                    <path d="M9 21h6M12 17v4" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={editName}
                        maxLength={24}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && editName.trim()) {
                            onEdit(cl.id, editName.trim())
                            setEditId(null)
                          }
                          if (e.key === "Escape") setEditId(null)
                        }}
                        className="min-w-0 flex-1 rounded-lg px-2 py-1 text-sm font-bold outline-none"
                        style={{ border: `2px solid ${PALETTE.sky}`, color: PALETTE.blueDeep }}
                      />
                      <button
                        onClick={() => { if (editName.trim()) { onEdit(cl.id, editName.trim()); setEditId(null) } }}
                        className="text-xs font-bold"
                        style={{ color: PALETTE.green }}
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="truncate text-base font-bold" style={{ color: PALETTE.blueDeep }}>
                      {cl.name}
                    </div>
                  )}
                  <div className="text-xs font-medium" style={{ color: PALETTE.blue }}>
                    {clStudents.length} aluno{clStudents.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { setEditId(cl.id); setEditName(cl.name); playTone("tap") }}
                    className="tap-shrink flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: PALETTE.sky + "55" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setDeleteId(cl.id); playTone("tap") }}
                    className="tap-shrink flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: PALETTE.coral + "22" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={PALETTE.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setExpandedId(isExpanded ? null : cl.id); playTone("tap") }}
                    className="tap-shrink flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: PALETTE.blueDeep + "11" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform .2s" }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={PALETTE.blueDeep} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded: student list for this classroom */}
              {isExpanded && (
                <div className="border-t px-4 pb-3 pt-2" style={{ borderColor: "#EEF2F6" }}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: PALETTE.blue }}>
                    Gerenciar alunos
                  </p>
                  {students.length === 0 ? (
                    <p className="text-xs font-medium" style={{ color: PALETTE.blue }}>
                      Nenhum aluno cadastrado ainda.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {students.map((s) => {
                        const inClass = cl.studentIds.includes(s.id)
                        return (
                          <button
                            key={s.id}
                            onClick={() => { onToggleStudent(cl.id, s.id); playTone("tap") }}
                            className="tap-shrink flex items-center gap-2 rounded-xl px-3 py-2"
                            style={{
                              background: inClass ? PALETTE.green + "18" : "#F5F8FA",
                              border: `2px solid ${inClass ? PALETTE.green : "#E1E9F1"}`,
                            }}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: PALETTE.skySoft }}>
                              <AnimalAvatar animal={s.character.animal} character={s.character} size={28} happy />
                            </div>
                            <span className="flex-1 text-left text-sm font-semibold" style={{ color: PALETTE.blueDeep }}>
                              {s.name}
                            </span>
                            <div
                              className="flex h-5 w-5 items-center justify-center rounded-full"
                              style={{ background: inClass ? PALETTE.green : "#E1E9F1" }}
                            >
                              {inClass && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Delete classroom confirm */}
      {deleteId && (
        <ConfirmDeleteModal
          studentName={classrooms.find((cl) => cl.id === deleteId)?.name ?? ""}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            onDelete(deleteId)
            setDeleteId(null)
            playTone("tap")
          }}
        />
      )}
    </div>
  )
}

/* ============ TEACHER LOGIN ============ */
export function TeacherLogin({ onBack, onEnter }: { onBack: () => void; onEnter: () => void }) {
  const { teacherLogin, teacherRegister, teachers } = useApp()
  const [mode, setMode] = useState<"login" | "register">(teachers.length === 0 ? "register" : "login")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  const doLogin = () => {
    const tname = selectedTeacher || name.trim()
    if (!tname || !password) return
    const ok = teacherLogin(tname, password)
    if (ok) { playTone("correct"); onEnter() }
    else { playTone("wrong"); setError("NOME OU SENHA INCORRETOS."); setPassword("") }
  }

  const doRegister = () => {
    if (!name.trim() || !password || password !== confirm) return
    const ok = teacherRegister(name.trim(), password)
    if (ok) { playTone("correct"); onEnter() }
    else { playTone("wrong"); setError("JÁ EXISTE UM PROFESSOR COM ESSE NOME.") }
  }

  const passwordMismatch = mode === "register" && confirm.length > 0 && password !== confirm

  return (
    <Panel>
      <TopBar title="ÁREA DO PROFESSOR" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl"
            style={{ background: PALETTE.blue, boxShadow: `0 8px 0 ${shade(PALETTE.blue, -26)}` }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="12" rx="2" fill="#fff" />
              <path d="M9 20h6M12 16v4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mt-4 flex rounded-2xl overflow-hidden" style={{ border: `2px solid ${PALETTE.sky}` }}>
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setPassword(""); setConfirm("") }}
              className="flex-1 py-2.5 text-sm font-bold"
              style={{
                background: mode === m ? PALETTE.blue : "#fff",
                color: mode === m ? "#fff" : PALETTE.blue,
              }}
            >
              {m === "login" ? "ENTRAR" : "CADASTRAR"}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[28px] bg-white p-6" style={{ boxShadow: "0 16px 40px rgba(49,84,119,0.14)" }}>
          {mode === "login" ? (
            <>
              <h2 className="mb-4 text-center text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
                ENTRAR COMO PROFESSOR
              </h2>
              {teachers.length > 0 && (
                <div className="mb-3 flex flex-col gap-1.5">
                  {teachers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTeacher(t.name); setName(t.name); playTone("tap") }}
                      className="tap-shrink flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{
                        background: selectedTeacher === t.name ? `${PALETTE.blue}18` : "#F5F8FA",
                        border: `2px solid ${selectedTeacher === t.name ? PALETTE.blue : "transparent"}`,
                      }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ background: PALETTE.blue }}
                      >
                        {t.name[0]?.toUpperCase()}
                      </div>
                      <span className="flex-1 text-left text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
                        {t.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {!selectedTeacher && (
                <input
                  value={name}
                  maxLength={24}
                  onChange={(e) => { setName(e.target.value); setError("") }}
                  placeholder="Ou digite seu nome"
                  className="mb-3 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
                  style={{ color: PALETTE.blueDeep, border: `3px solid ${PALETTE.sky}` }}
                />
              )}
              <input
                type="password"
                autoFocus
                value={password}
                maxLength={20}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && doLogin()}
                placeholder="Senha"
                className="w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
                style={{ color: PALETTE.blueDeep, border: `3px solid ${error ? PALETTE.coral : PALETTE.sky}` }}
              />
              {error && <p className="mt-1.5 text-xs font-bold uppercase" style={{ color: PALETTE.coral }}>{error}</p>}
              <div className="mt-4">
                <PrimaryButton disabled={!(selectedTeacher || name.trim()) || !password} onClick={doLogin}>
                  ENTRAR
                </PrimaryButton>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-center text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
                CRIAR CONTA DE PROFESSOR
              </h2>
              <label className="mb-1 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Seu nome</label>
              <input
                autoFocus
                value={name}
                maxLength={24}
                onChange={(e) => { setName(e.target.value); setError("") }}
                placeholder="Nome do professor"
                className="mb-3 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
                style={{ color: PALETTE.blueDeep, border: `3px solid ${PALETTE.sky}` }}
              />
              <label className="mb-1 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Senha</label>
              <input
                type="password"
                value={password}
                maxLength={20}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                placeholder="Crie uma senha"
                className="mb-3 w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
                style={{ color: PALETTE.blueDeep, border: `3px solid ${PALETTE.sky}` }}
              />
              <label className="mb-1 block text-sm font-semibold" style={{ color: PALETTE.blue }}>Confirmar senha</label>
              <input
                type="password"
                value={confirm}
                maxLength={20}
                onChange={(e) => { setConfirm(e.target.value); setError("") }}
                onKeyDown={(e) => e.key === "Enter" && !passwordMismatch && doRegister()}
                placeholder="Repita a senha"
                className="w-full rounded-2xl px-4 py-3 text-base font-bold outline-none"
                style={{ color: PALETTE.blueDeep, border: `3px solid ${passwordMismatch ? PALETTE.coral : PALETTE.sky}` }}
              />
              {passwordMismatch && <p className="mt-1 text-xs font-bold" style={{ color: PALETTE.coral }}>Senhas não coincidem.</p>}
              {error && <p className="mt-1.5 text-xs font-bold uppercase" style={{ color: PALETTE.coral }}>{error}</p>}
              <div className="mt-4">
                <PrimaryButton
                  disabled={!name.trim() || !password || password !== confirm}
                  onClick={doRegister}
                >
                  CADASTRAR
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  )
}

/* ============ TEACHER DASHBOARD ============ */
type DashTab = "alunos" | "turmas"

export function TeacherHome({
  onExit,
  onOpenStudent,
}: {
  onExit: () => void
  onOpenStudent: (id: string) => void
}) {
  const { students, teacherName, classrooms, createClassroom, deleteClassroom, editClassroom, toggleStudentInClassroom, deleteStudent, editStudent, createStudent } = useApp()
  const [tab, setTab] = useState<DashTab>("alunos")
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null)
  const [editStudentId, setEditStudentId] = useState<string | null>(null)
  const [showCreateStudent, setShowCreateStudent] = useState(false)
  const cls = classAverages(students)
  const perGame = [...cls.perGame].filter((g) => g.pct !== null)
  const best = perGame.length ? perGame.reduce((a, b) => (b.pct! > a.pct! ? b : a)) : null
  const worst = perGame.length ? perGame.reduce((a, b) => (b.pct! < a.pct! ? b : a)) : null
  const gameTitle = (id: number) => GAMES.find((g) => g.id === id)!.title

  const existingNames = students.map((s) => s.name.toLowerCase())
  const editingStudent = students.find((s) => s.id === editStudentId)
  const deletingStudent = students.find((s) => s.id === deleteStudentId)

  return (
    <Panel>
      <TopBar title="PAINEL DO PROFESSOR" onExit={onExit} />

      {/* Tab bar */}
      <div className="flex gap-0 border-b" style={{ background: PALETTE.blueDeep, borderColor: "rgba(255,255,255,0.15)" }}>
        {(["alunos", "turmas"] as DashTab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); playTone("tap") }}
            className="flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all"
            style={{
              color: tab === t ? "#fff" : "rgba(255,255,255,0.55)",
              borderBottom: tab === t ? `3px solid ${PALETTE.yellow}` : "3px solid transparent",
            }}
          >
            {t === "alunos" ? "Alunos" : "Turmas"}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {tab === "alunos" ? (
          <>
            <h2 className="text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
              Olá{teacherName ? `, ${teacherName}` : ""}! 👋
            </h2>
            <p className="mb-4 text-sm font-medium" style={{ color: PALETTE.blue }}>
              Acompanhe o desempenho da sua turma.
            </p>

            <div className="mb-3 flex gap-3">
              <StatBox label="Alunos" value={String(students.length)} />
              <StatBox
                label="Média da turma"
                value={cls.overallPct !== null ? `${cls.overallPct}%` : "—"}
                color={pctColor(cls.overallPct)}
              />
            </div>

            {students.length > 0 && (
              <div className="mb-4 flex gap-3">
                <HighlightCard
                  title="Melhor desempenho"
                  game={best ? gameTitle(best.gameId) : "—"}
                  pct={best?.pct ?? null}
                  positive
                />
                <HighlightCard
                  title="Mais atenção"
                  game={worst ? gameTitle(worst.gameId) : "—"}
                  pct={worst?.pct ?? null}
                />
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
                Meus alunos
              </h3>
              <button
                onClick={() => { setShowCreateStudent(true); playTone("tap") }}
                className="tap-shrink flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-white"
                style={{ background: PALETTE.green, boxShadow: `0 4px 0 ${shade(PALETTE.green, -26)}` }}
              >
                + CADASTRAR
              </button>
            </div>
            {students.length === 0 ? (
              <div className="rounded-2xl bg-white p-6 text-center text-sm font-medium" style={{ color: PALETTE.blue }}>
                Nenhum aluno cadastrado. Clique em "+ CADASTRAR" para adicionar!
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {students.map((s) => {
                  const ov = studentOverview(s)
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 rounded-2xl bg-white p-3"
                      style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}
                    >
                      {/* Avatar — click to open profile */}
                      <button
                        onClick={() => { playTone("tap"); onOpenStudent(s.id) }}
                        className="tap-shrink flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                        style={{ background: PALETTE.skySoft }}
                      >
                        <AnimalAvatar animal={s.character.animal} character={s.character} size={42} happy />
                      </button>
                      <button
                        onClick={() => { playTone("tap"); onOpenStudent(s.id) }}
                        className="tap-shrink min-w-0 flex-1 text-left"
                      >
                        <div className="truncate text-base font-bold" style={{ color: PALETTE.blueDeep }}>
                          {s.name}
                        </div>
                        <div className="mt-1">
                          <PerfBar pct={ov.overallPct} />
                        </div>
                        <div className="mt-1">
                          <PsicogeneseBadge pct={ov.overallPct} />
                        </div>
                      </button>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="text-lg font-bold" style={{ color: pctColor(ov.overallPct) }}>
                          {ov.overallPct !== null ? `${ov.overallPct}%` : "—"}
                        </div>
                        {/* Edit/Delete buttons */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditStudentId(s.id); playTone("tap") }}
                            className="tap-shrink flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{ background: PALETTE.sky + "55" }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setDeleteStudentId(s.id); playTone("tap") }}
                            className="tap-shrink flex h-7 w-7 items-center justify-center rounded-lg"
                            style={{ background: PALETTE.coral + "22" }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={PALETTE.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {students.length > 0 && (
              <>
                <h3 className="mb-2 mt-5 text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
                  Desempenho da turma
                </h3>
                <div className="rounded-2xl bg-white p-3" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
                  {cls.perGame.map((g: ClassGameAvg, i) => (
                    <div key={g.gameId} className={`flex items-center gap-3 py-2 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#EEF2F6" }}>
                      <span className="w-[52%] truncate text-sm font-semibold" style={{ color: PALETTE.blueDeep }}>
                        {gameTitle(g.gameId)}
                      </span>
                      <div className="flex-1">
                        <PerfBar pct={g.pct} />
                      </div>
                      <span className="w-9 shrink-0 text-right text-sm font-bold" style={{ color: pctColor(g.pct) }}>
                        {g.pct !== null ? `${g.pct}%` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
              Turmas
            </h2>
            <p className="mb-4 text-sm font-medium" style={{ color: PALETTE.blue }}>
              Crie e organize suas turmas e alunos.
            </p>
            <ClassroomView
              classrooms={classrooms}
              students={students}
              onCreate={createClassroom}
              onDelete={deleteClassroom}
              onEdit={editClassroom}
              onToggleStudent={toggleStudentInClassroom}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {deleteStudentId && deletingStudent && (
        <ConfirmDeleteModal
          studentName={deletingStudent.name}
          onCancel={() => setDeleteStudentId(null)}
          onConfirm={() => {
            deleteStudent(deleteStudentId)
            setDeleteStudentId(null)
            playTone("tap")
          }}
        />
      )}
      {editStudentId && editingStudent && (
        <EditStudentModal
          student={editingStudent}
          existingNames={existingNames}
          onCancel={() => setEditStudentId(null)}
          onSave={(name, password) => {
            editStudent(editStudentId, name, editingStudent.character, password)
            setEditStudentId(null)
            playTone("correct")
          }}
        />
      )}
      {showCreateStudent && (
        <CreateStudentModal
          existingNames={existingNames}
          onCancel={() => setShowCreateStudent(false)}
          onSave={(name, password) => {
            createStudent(name, password)
            setShowCreateStudent(false)
            playTone("correct")
          }}
        />
      )}
    </Panel>
  )
}

function HighlightCard({
  title,
  game,
  pct,
  positive = false,
}: {
  title: string
  game: string
  pct: number | null
  positive?: boolean
}) {
  const color = positive ? PALETTE.green : PALETTE.coral
  return (
    <div className="flex-1 rounded-2xl bg-white p-3" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
      <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color }}>
        {title}
      </div>
      <div className="mt-1 truncate text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
        {game}
      </div>
      <div className="text-xl font-bold" style={{ color }}>
        {pct !== null ? `${pct}%` : "—"}
      </div>
    </div>
  )
}

/* ============ WEEKLY PERFORMANCE CHART ============ */
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

function WeeklyChart({ plays }: { plays: Play[] }) {
  // Compute average pct per day-of-week for the last 8 weeks
  const byDay: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  const cutoff = Date.now() - 56 * 24 * 60 * 60 * 1000 // 8 weeks
  plays.forEach((p) => {
    const d = new Date(p.date)
    if (d.getTime() >= cutoff) byDay[d.getDay()].push(p.pct)
  })
  const data = DAYS.map((label, i) => {
    const arr = byDay[i]
    const avg = arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : null
    return { label, avg, count: arr.length }
  })
  const hasAny = data.some((d) => d.avg !== null)

  return (
    <div className="rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
          Desempenho Semanal
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: PALETTE.blue }}>
          Média por dia
        </span>
      </div>
      {!hasAny ? (
        <p className="py-4 text-center text-sm font-medium" style={{ color: PALETTE.blue }}>
          Nenhuma atividade registrada ainda.
        </p>
      ) : (
        <div className="flex items-end gap-1.5" style={{ height: 110 }}>
          {data.map(({ label, avg, count }) => (
            <div key={label} className="flex flex-1 flex-col items-center justify-end gap-1">
              {avg !== null && (
                <span className="text-[10px] font-bold" style={{ color: pctColor(avg) }}>
                  {avg}%
                </span>
              )}
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: avg !== null ? `${Math.max(6, avg)}%` : 4,
                  background: avg !== null ? pctColor(avg) : "#E1E9F1",
                  minHeight: 4,
                }}
              />
              <span className="text-[9px] font-bold uppercase" style={{ color: PALETTE.blue }}>
                {label}
              </span>
              {count > 0 && (
                <span className="text-[9px]" style={{ color: "#B0C0CC" }}>
                  {count}x
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ============ STUDENT PERFORMANCE PROFILE ============ */
export function TeacherStudent({
  studentId,
  onBack,
  onOpenGame,
}: {
  studentId: string
  onBack: () => void
  onOpenGame: (gameId: number) => void
}) {
  const { students, deleteStudent, editStudent, unlockAlphabetico } = useApp()
  const student = students.find((s) => s.id === studentId)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const existingNames = students.map((s) => s.name.toLowerCase())

  if (!student) {
    return (
      <Panel>
        <TopBar title="Aluno" onBack={onBack} />
        <div className="p-6 text-center font-medium" style={{ color: PALETTE.blue }}>
          Aluno não encontrado.
        </div>
      </Panel>
    )
  }

  const ov = studentOverview(student)
  const gameTitle = (id: number) => GAMES.find((g) => g.id === id)!.title
  const history = [...student.plays].reverse().slice(0, 12)

  return (
    <Panel>
      <TopBar title="Desempenho do aluno" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {/* identity */}
        <div className="flex items-center gap-4 rounded-[26px] bg-white p-4" style={{ boxShadow: "0 6px 16px rgba(49,84,119,0.1)" }}>
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl" style={{ background: PALETTE.skySoft }}>
            <AnimalAvatar animal={student.character.animal} character={student.character} size={70} happy />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-2xl font-bold" style={{ color: PALETTE.blueDeep }}>
              {student.name}
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color: PALETTE.blue }}>
              Desde {fmtDate(student.createdAt)}
            </div>
            <div className="mt-1">
              <PsicogeneseBadge pct={ov.overallPct} />
            </div>
          </div>
          {/* Edit / Delete */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => { setShowEdit(true); playTone("tap") }}
              className="tap-shrink flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: PALETTE.sky + "55" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={PALETTE.blue} strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={() => { setShowDelete(true); playTone("tap") }}
              className="tap-shrink flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: PALETTE.coral + "22" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={PALETTE.coral} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* overview stats */}
        <div className="mt-3 flex gap-3">
          <StatBox label="Geral" value={ov.overallPct !== null ? `${ov.overallPct}%` : "—"} color={pctColor(ov.overallPct)} />
          <StatBox label="Jogos" value={`${ov.gamesPlayed}/12`} />
          <StatBox label="Atividades" value={String(ov.totalActivities)} />
        </div>

        {ov.best && ov.worst && (
          <div className="mt-3 flex gap-3">
            <HighlightCard title="Melhor" game={gameTitle(ov.best.gameId)} pct={ov.best.pct} positive />
            <HighlightCard title="Mais atenção" game={gameTitle(ov.worst.gameId)} pct={ov.worst.pct} />
          </div>
        )}

        {/* Psicogênese chart */}
        <div className="mt-3">
          <PsicogeneseChart pct={ov.overallPct} />
        </div>

        {/* Weekly performance chart */}
        <div className="mt-3">
          <WeeklyChart plays={student.plays} />
        </div>

        {/* Nível Alfabético unlock */}
        <div
          className="mt-3 rounded-2xl bg-white p-4"
          style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: student.alphabeticoUnlocked ? PALETTE.green + "22" : PALETTE.orange + "22" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {student.alphabeticoUnlocked ? (
                  <path d="M5 13l4 4L19 7" stroke={PALETTE.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <rect x="5" y="11" width="14" height="10" rx="2" fill={PALETTE.orange} opacity="0.8" />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke={PALETTE.orange} strokeWidth="2.2" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
                Nível Alfabético
              </div>
              <div className="text-xs font-medium" style={{ color: PALETTE.blue }}>
                {student.alphabeticoUnlocked ? "Desbloqueado para este aluno" : "Bloqueado — aguarda liberação do professor"}
              </div>
            </div>
            <button
              onClick={() => { unlockAlphabetico(student.id); playTone("tap") }}
              className="tap-shrink shrink-0 rounded-xl px-3 py-2 text-xs font-bold text-white"
              style={{
                background: student.alphabeticoUnlocked ? PALETTE.coral : PALETTE.green,
                boxShadow: `0 3px 0 ${shade(student.alphabeticoUnlocked ? PALETTE.coral : PALETTE.green, -26)}`,
              }}
            >
              {student.alphabeticoUnlocked ? "BLOQUEAR" : "LIBERAR"}
            </button>
          </div>
        </div>

        {/* per-game desempenho */}
        <h3 className="mb-2 mt-5 text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Desempenho por jogo
        </h3>
        <div className="rounded-2xl bg-white p-3" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
          {GAMES.map((g, i) => {
            const st = gameStats(student, g.id)
            return (
              <button
                key={g.id}
                onClick={() => { playTone("tap"); onOpenGame(g.id) }}
                className={`flex w-full items-center gap-3 py-2.5 text-left ${i > 0 ? "border-t" : ""}`}
                style={{ borderColor: "#EEF2F6" }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: g.colors[0] }}
                >
                  {g.id}
                </span>
                <span className="w-[42%] truncate text-sm font-semibold" style={{ color: PALETTE.blueDeep }}>
                  {g.title}
                </span>
                <div className="flex-1">
                  <PerfBar pct={st.pct} />
                </div>
                <span className="w-9 shrink-0 text-right text-sm font-bold" style={{ color: pctColor(st.pct) }}>
                  {st.pct !== null ? `${st.pct}%` : "—"}
                </span>
                <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="#B7C6D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )
          })}
        </div>

        {/* history */}
        <h3 className="mb-2 mt-5 text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Histórico
        </h3>
        <div className="rounded-2xl bg-white p-3" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
          {history.length === 0 ? (
            <p className="py-2 text-center text-sm font-medium" style={{ color: PALETTE.blue }}>
              Nenhuma atividade registrada ainda.
            </p>
          ) : (
            history.map((p, i) => (
              <div key={i} className={`flex items-center gap-2 py-2 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#EEF2F6" }}>
                <span className="w-11 shrink-0 text-xs font-bold" style={{ color: PALETTE.blue }}>
                  {fmtDate(p.date)}
                </span>
                <span className="flex-1 truncate text-sm font-semibold" style={{ color: PALETTE.blueDeep }}>
                  {gameTitle(p.gameId)}
                </span>
                <span className="shrink-0 text-sm font-bold" style={{ color: pctColor(p.pct) }}>
                  {p.pct}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDeleteModal
          studentName={student.name}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            deleteStudent(student.id)
            setShowDelete(false)
            onBack()
          }}
        />
      )}
      {showEdit && (
        <EditStudentModal
          student={student}
          existingNames={existingNames}
          onCancel={() => setShowEdit(false)}
          onSave={(name) => {
            editStudent(student.id, name, student.character)
            setShowEdit(false)
            playTone("correct")
          }}
        />
      )}
    </Panel>
  )
}

/* ============ GAME DETAIL ============ */
export function TeacherGameDetail({
  studentId,
  gameId,
  onBack,
}: {
  studentId: string
  gameId: number
  onBack: () => void
}) {
  const { students } = useApp()
  const student = students.find((s) => s.id === studentId)
  const meta = GAMES.find((g) => g.id === gameId)!
  const st: GameStats = student ? gameStats(student, gameId) : {
    gameId, plays: 0, acertos: 0, erros: 0, tentativas: 0, pct: null, lastDate: null, evolution: [],
  }

  return (
    <Panel>
      <TopBar title={meta.title} onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div
          className="rounded-[26px] p-5 text-center text-white"
          style={{ background: meta.colors[0], boxShadow: `0 8px 0 ${shade(meta.colors[0], -26)}` }}
        >
          <div className="text-sm font-semibold uppercase tracking-wide opacity-90">Aproveitamento</div>
          <div className="text-5xl font-bold">{st.pct !== null ? `${st.pct}%` : "—"}</div>
          {student && (
            <div className="mt-1 text-sm font-medium opacity-90">de {student.name}</div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatBox label="Acertos" value={String(st.acertos)} color={PALETTE.green} />
          <StatBox label="Erros" value={String(st.erros)} color={PALETTE.coral} />
          <StatBox label="Tentativas" value={String(st.tentativas)} />
          <StatBox label="Atividades" value={String(st.plays)} />
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 text-center" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
          <span className="text-sm font-semibold" style={{ color: PALETTE.blue }}>
            Última atividade:{" "}
          </span>
          <span className="text-sm font-bold" style={{ color: PALETTE.blueDeep }}>
            {fmtDate(st.lastDate)}
          </span>
        </div>

        {/* Evolution chart */}
        <h3 className="mb-2 mt-5 text-lg font-bold" style={{ color: PALETTE.blueDeep }}>
          Evolução
        </h3>
        <div className="rounded-2xl bg-white p-4" style={{ boxShadow: "0 4px 12px rgba(49,84,119,0.08)" }}>
          {st.evolution.length === 0 ? (
            <p className="text-center text-sm font-medium" style={{ color: PALETTE.blue }}>
              Sem tentativas registradas.
            </p>
          ) : (
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {st.evolution.map((pct, i) => (
                <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10px] font-bold" style={{ color: pctColor(pct) }}>
                    {pct}%
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{ height: `${Math.max(6, pct)}%`, background: pctColor(pct) }}
                  />
                  <span className="text-[10px] font-semibold" style={{ color: PALETTE.blue }}>
                    {i + 1}ª
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
