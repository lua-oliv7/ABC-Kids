import React, { useState } from "react"
import { ConfirmExit, PhoneFrame } from "./components/kit"
import { AppProvider, useApp } from "./lib/app"
import { Character } from "./lib/store"
import { CreateCharacter, StudentLoginScreen } from "./screens/onboarding"
import { Entry } from "./screens/entry"
import { Home } from "./screens/home"
import { LevelGames } from "./screens/levelgames"
import { GamePlayer } from "./games"
import {
  TeacherGameDetail,
  TeacherHome,
  TeacherLogin,
  TeacherStudent,
} from "./screens/teacher"
import { AlphabetModule, NumbersModule } from "./screens/modules"

type Level = "silabico" | "alfabetico"

type Step =
  | { s: "entry" }
  // student login + play
  | { s: "slogin" }
  | { s: "create" }  // character setup (first login only)
  | { s: "home" }
  | { s: "levelgames"; level: Level }
  | { s: "game"; id: number; level: Level }
  // student learning modules
  | { s: "alphabet" }
  | { s: "numbers" }
  // teacher
  | { s: "tlogin" }
  | { s: "thome" }
  | { s: "tstudent"; id: string }
  | { s: "tgame"; studentId: string; gameId: number }

function Flow() {
  const { current, logoutStudent, teacherLogout, completeCharacterSetup } = useApp()
  const [step, setStep] = useState<Step>({ s: "entry" })
  const [confirm, setConfirm] = useState<null | "student" | "teacher">(null)

  const go = (s: Step) => setStep(s)

  const doExit = () => {
    if (confirm === "student") logoutStudent()
    if (confirm === "teacher") teacherLogout()
    setConfirm(null)
    go({ s: "entry" })
  }

  const content = () => {
    switch (step.s) {
      case "entry":
        return (
          <Entry
            onAluno={() => go({ s: "slogin" })}
            onProfessor={() => go({ s: "tlogin" })}
          />
        )

      /* ---------- student ---------- */
      case "slogin":
        return (
          <StudentLoginScreen
            onBack={() => go({ s: "entry" })}
            onLoggedIn={(needsCharacter: boolean) => {
              if (needsCharacter) go({ s: "create" })
              else go({ s: "home" })
            }}
          />
        )
      case "create":
        if (!current) return <Entry onAluno={() => go({ s: "slogin" })} onProfessor={() => go({ s: "tlogin" })} />
        return (
          <CreateCharacter
            name={current.name}
            initial={current.character}
            onBack={() => go({ s: "slogin" })}
            onDone={(c: Character) => {
              completeCharacterSetup(current.id, c)
              go({ s: "home" })
            }}
          />
        )
      case "home":
        if (!current) return <Entry onAluno={() => go({ s: "slogin" })} onProfessor={() => go({ s: "tlogin" })} />
        return (
          <Home
            student={current}
            onOpenLevel={(level) => go({ s: "levelgames", level })}
            onOpenAlphabet={() => go({ s: "alphabet" })}
            onOpenNumbers={() => go({ s: "numbers" })}
            onExit={() => setConfirm("student")}
          />
        )
      case "levelgames":
        if (!current) return <Entry onAluno={() => go({ s: "slogin" })} onProfessor={() => go({ s: "tlogin" })} />
        return (
          <LevelGames
            student={current}
            level={step.level}
            onOpenGame={(id) => go({ s: "game", id, level: step.level })}
            onBack={() => go({ s: "home" })}
          />
        )
      case "game":
        return (
          <GamePlayer
            id={step.id}
            character={current!.character}
            level={step.level}
            onHome={() => go({ s: "levelgames", level: step.level })}
            onAdvance={() => {
              if (step.id >= 12) go({ s: "levelgames", level: step.level })
              else go({ s: "game", id: step.id + 1, level: step.level })
            }}
          />
        )

      /* ---------- learning modules ---------- */
      case "alphabet":
        return <AlphabetModule onBack={() => go({ s: "home" })} />
      case "numbers":
        return <NumbersModule onBack={() => go({ s: "home" })} />

      /* ---------- teacher ---------- */
      case "tlogin":
        return <TeacherLogin onBack={() => go({ s: "entry" })} onEnter={() => go({ s: "thome" })} />
      case "thome":
        return (
          <TeacherHome
            onExit={() => setConfirm("teacher")}
            onOpenStudent={(id) => go({ s: "tstudent", id })}
          />
        )
      case "tstudent":
        return (
          <TeacherStudent
            studentId={step.id}
            onBack={() => go({ s: "thome" })}
            onOpenGame={(gameId) => go({ s: "tgame", studentId: step.id, gameId })}
          />
        )
      case "tgame":
        return (
          <TeacherGameDetail
            studentId={step.studentId}
            gameId={step.gameId}
            onBack={() => go({ s: "tstudent", id: step.studentId })}
          />
        )
    }
  }

  return (
    <>
      {content()}
      {confirm && <ConfirmExit onCancel={() => setConfirm(null)} onConfirm={doExit} />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <PhoneFrame>
        <Flow />
      </PhoneFrame>
    </AppProvider>
  )
}
