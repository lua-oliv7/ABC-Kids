import React, { createContext, useContext, useEffect, useState } from "react"
import {
  Character,
  Classroom,
  DEFAULT_CHARACTER,
  Play,
  PlayResult,
  Student,
  Teacher,
} from "./store"

/* ---- Context shape ---- */
interface AppCtx {
  students: Student[]
  currentId: string | null
  current: Student | null
  studentLogin: (name: string, password: string) => boolean
  completeCharacterSetup: (id: string, character: Character) => void
  logoutStudent: () => void
  createStudent: (name: string, password: string) => string
  deleteStudent: (id: string) => void
  editStudent: (id: string, name: string, character: Character, password?: string) => void
  recordPlay: (gameId: number, result: PlayResult) => void
  teachers: Teacher[]
  teacherName: string | null
  teacherLogin: (name: string, password: string) => boolean
  teacherRegister: (name: string, password: string) => boolean
  teacherLogout: () => void
  classrooms: Classroom[]
  createClassroom: (name: string) => void
  deleteClassroom: (id: string) => void
  editClassroom: (id: string, name: string) => void
  toggleStudentInClassroom: (classroomId: string, studentId: string) => void
  unlockAlphabetico: (studentId: string) => void
}

interface Persisted {
  students: Student[]
  teachers: Teacher[]
  classrooms: Classroom[]
}

const KEY = "abckids.data.v4"

async function loadFromServer(): Promise<Persisted> {
  const response = await fetch("/api/data")

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados do servidor")
  }

  return response.json()
}

async function saveToServer(data: Persisted): Promise<void> {
  const response = await fetch("/api/data", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Não foi possível salvar os dados no servidor")
  }
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Persisted>
      return {
        students: (parsed.students ?? []).map((s: any) => ({
          ...s,
          password: s.password ?? "",
          characterCustomized: s.characterCustomized ?? true,
        })),
        teachers: (parsed.teachers ?? []).map((t: any) => ({
          ...t,
          password: t.password ?? "",
        })),
        classrooms: parsed.classrooms ?? [],
      }
    }
  } catch { /* ignore */ }

  // Migrate from v3
  try {
    const old = localStorage.getItem("abckids.data.v3")
    if (old) {
      const parsed = JSON.parse(old) as any
      const teachers: Teacher[] = (parsed.teachers ?? []).map((t: any) => ({
        id: t.id ?? `t_${Date.now()}`,
        name: t.name ?? "",
        password: "",
        createdAt: t.createdAt ?? new Date().toISOString(),
      }))
      if (!teachers.length && parsed.teacherName) {
        teachers.push({ id: "t_legacy", name: parsed.teacherName, password: "", createdAt: new Date().toISOString() })
      }
      return {
        students: (parsed.students ?? []).map((s: any) => ({
          ...s,
          password: "",
          characterCustomized: true,
        })),
        teachers,
        classrooms: parsed.classrooms ?? [],
      }
    }
  } catch { /* ignore */ }

  // Migrate from v2
  try {
    const old = localStorage.getItem("abckids.data.v2")
    if (old) {
      const parsed = JSON.parse(old) as any
      const teachers: Teacher[] = []
      if (parsed.teacherName) {
        teachers.push({ id: "t_legacy", name: parsed.teacherName, password: "", createdAt: new Date().toISOString() })
      }
      return {
        students: (parsed.students ?? []).map((s: any) => ({
          ...s,
          password: "",
          characterCustomized: true,
        })),
        teachers,
        classrooms: [],
      }
    }
  } catch { /* ignore */ }

  return { students: [], teachers: [], classrooms: [] }
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Persisted>(() => load())

useEffect(() => {
  loadFromServer()
    .then((data) => {
  setStore(data)
  setServerLoaded(true)
})
    .catch((error) => {
      console.error("Erro ao carregar dados do servidor:", error)
    })
}, [])

  const [serverLoaded, setServerLoaded] = useState(false)

    useEffect(() => {
    if (!serverLoaded) return

    saveToServer(store).catch((error) => {
      console.error("Erro ao salvar dados no servidor:", error)
    })
  }, [store, serverLoaded])

  const [currentId, setCurrentId] = useState<string | null>(null)
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(store)) } catch { /* ignore */ }
  }, [store])

  const studentLogin = (name: string, password: string): boolean => {
    const student = store.students.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase() && s.password === password,
    )
    if (student) { setCurrentId(student.id); return true }
    return false
  }

  const completeCharacterSetup = (id: string, character: Character) => {
    setStore((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.id === id ? { ...st, character, characterCustomized: true } : st,
      ),
    }))
  }

  const createStudent = (name: string, password: string): string => {
    const id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
    const student: Student = {
      id,
      name: name.trim(),
      password,
      character: DEFAULT_CHARACTER,
      characterCustomized: false,
      plays: [],
      createdAt: new Date().toISOString(),
    }
    setStore((s) => ({ ...s, students: [...s.students, student] }))
    return id
  }

  const deleteStudent = (id: string) => {
    setStore((s) => ({
      ...s,
      students: s.students.filter((st) => st.id !== id),
      classrooms: s.classrooms.map((cl) => ({
        ...cl,
        studentIds: cl.studentIds.filter((sid) => sid !== id),
      })),
    }))
  }

  const editStudent = (id: string, name: string, character: Character, password?: string) => {
    setStore((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.id === id
          ? { ...st, name: name.trim(), character, ...(password !== undefined ? { password } : {}) }
          : st,
      ),
    }))
  }

  const recordPlay = (gameId: number, result: PlayResult) => {
    if (!currentId) return
    const play: Play = { ...result, gameId, date: new Date().toISOString() }
    setStore((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.id === currentId ? { ...st, plays: [...st.plays, play] } : st,
      ),
    }))
  }

  const logoutStudent = () => setCurrentId(null)

  const teacherLogin = (name: string, password: string): boolean => {
    const existing = store.teachers.find(
      (t) => t.name.toLowerCase() === name.trim().toLowerCase() && t.password === password,
    )
    if (existing) { setActiveTeacherId(existing.id); return true }
    return false
  }

  const teacherRegister = (name: string, password: string): boolean => {
    const trimmed = name.trim()
    if (store.teachers.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) return false
    const id = `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
    const teacher: Teacher = { id, name: trimmed, password, createdAt: new Date().toISOString() }
    setStore((s) => ({ ...s, teachers: [...s.teachers, teacher] }))
    setActiveTeacherId(id)
    return true
  }

  const teacherLogout = () => setActiveTeacherId(null)

  const createClassroom = (name: string) => {
    const id = `cl_${Date.now().toString(36)}`
    const classroom: Classroom = { id, name: name.trim(), studentIds: [], createdAt: new Date().toISOString() }
    setStore((s) => ({ ...s, classrooms: [...s.classrooms, classroom] }))
  }

  const deleteClassroom = (id: string) => {
    setStore((s) => ({ ...s, classrooms: s.classrooms.filter((cl) => cl.id !== id) }))
  }

  const editClassroom = (id: string, name: string) => {
    setStore((s) => ({
      ...s,
      classrooms: s.classrooms.map((cl) => (cl.id === id ? { ...cl, name: name.trim() } : cl)),
    }))
  }

  const unlockAlphabetico = (studentId: string) => {
    setStore((s) => ({
      ...s,
      students: s.students.map((st) =>
        st.id === studentId ? { ...st, alphabeticoUnlocked: !st.alphabeticoUnlocked } : st,
      ),
    }))
  }

  const toggleStudentInClassroom = (classroomId: string, studentId: string) => {
    setStore((s) => ({
      ...s,
      classrooms: s.classrooms.map((cl) => {
        if (cl.id !== classroomId) return cl
        const has = cl.studentIds.includes(studentId)
        return {
          ...cl,
          studentIds: has
            ? cl.studentIds.filter((sid) => sid !== studentId)
            : [...cl.studentIds, studentId],
        }
      }),
    }))
  }

  const activeTeacher = store.teachers.find((t) => t.id === activeTeacherId) ?? null

  return (
    <Ctx.Provider
      value={{
        students: store.students,
        currentId,
        current: store.students.find((s) => s.id === currentId) ?? null,
        studentLogin,
        completeCharacterSetup,
        logoutStudent,
        createStudent,
        deleteStudent,
        editStudent,
        recordPlay,
        teachers: store.teachers,
        teacherName: activeTeacher?.name ?? null,
        teacherLogin,
        teacherRegister,
        teacherLogout,
        classrooms: store.classrooms,
        createClassroom,
        deleteClassroom,
        editClassroom,
        toggleStudentInClassroom,
        unlockAlphabetico,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
