"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TEST_CONFIGS } from "@/lib/questions";
import { AssessmentState, Difficulty } from "@/lib/types";
import { UI, Lang } from "@/lib/i18n";

function getTestConfigs(difficulty: Difficulty) {
  if (difficulty === "staff") {
    return [
      { id: "problem-solving", name: "Problem Solving", questionCount: 12, timeMinutes: 9, description: "Practical problem-solving in daily F&B scenarios", icon: "🧩" },
      { id: "time-management", name: "Time Management", questionCount: 16, timeMinutes: 9, description: "Task prioritization during service", icon: "⏱️" },
      { id: "ocean", name: "Big 5 (OCEAN)", questionCount: 50, timeMinutes: 10, description: "Personality traits assessment", icon: "🧠" },
      { id: "communication", name: "Communication", questionCount: 15, timeMinutes: 8, description: "Guest interaction and teamwork", icon: "💬" },
    ];
  }
  if (difficulty === "manager") {
    return [
      { id: "problem-solving", name: "Problem Solving", questionCount: 12, timeMinutes: 10, description: "Operational problem-solving and team management", icon: "🧩" },
      { id: "time-management", name: "Time Management", questionCount: 16, timeMinutes: 10, description: "Multi-task prioritization and delegation", icon: "⏱️" },
      { id: "ocean", name: "Big 5 (OCEAN)", questionCount: 50, timeMinutes: 10, description: "Personality traits assessment", icon: "🧠" },
      { id: "communication", name: "Communication", questionCount: 15, timeMinutes: 9, description: "Team leadership and stakeholder communication", icon: "💬" },
    ];
  }
  if (difficulty === "executive") {
    return [
      { id: "problem-solving", name: "Problem Solving", questionCount: 12, timeMinutes: 12, description: "Strategic analysis, P&L decisions, multi-outlet management", icon: "🧩" },
      { id: "time-management", name: "Time Management", questionCount: 16, timeMinutes: 12, description: "Executive prioritization and delegation", icon: "⏱️" },
      { id: "ocean", name: "Big 5 (OCEAN)", questionCount: 50, timeMinutes: 10, description: "Personality traits assessment", icon: "🧠" },
      { id: "communication", name: "Communication", questionCount: 15, timeMinutes: 10, description: "Leadership communication and stakeholder management", icon: "💬" },
    ];
  }
  return TEST_CONFIGS;
}

const LEVEL_LABELS: Record<string, Partial<Record<Difficulty, string>>> = {
  en: { staff: "Staff Level", supervisor: "Supervisor Level", manager: "Manager Level", executive: "Executive Level" },
  id: { staff: "Level Staf", supervisor: "Level Supervisor", manager: "Level Manager", executive: "Level Eksekutif" },
};
const LEVEL_ICONS: Record<Difficulty, string> = { staff: "🟢", supervisor: "🟡", manager: "🟠", executive: "🔴" };

export default function Overview() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [difficulty, setDifficulty] = useState<Difficulty>("supervisor");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("assessment");
    if (!raw) { router.push("/"); return; }
    const s = JSON.parse(raw) as AssessmentState;
    setState(s);
    setLang(s.lang || "en");
    setDifficulty(s.difficulty || "supervisor");
  }, [router]);

  if (!state) return null;
  const t = UI[lang];
  const configs = getTestConfigs(difficulty);
  const testNames = [t.problemSolving, t.timeManagement, t.ocean, t.communication];
  const testDescs = [t.psDesc, t.tmDesc, t.oceanDesc, t.commDesc];

  const startTest = async () => { 
    setIsNavigating(true);
    await router.push(`/assessment/${configs[state.currentTest].id}`);
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="text-center mt-8 mb-8">
        <div className="flex justify-center mb-3">
          <Image src="/phg-logo.png" alt="PHG" width={140} height={120} className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "#2C2520" }}>{t.overview}</h1>
        <p className="text-sm mt-1" style={{ color: "#8C8175" }}>{t.hello} {state.candidateName}! {t.ready}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span>{LEVEL_ICONS[difficulty]}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F5F0E8", color: "#5C534A" }}>
            {LEVEL_LABELS[lang]?.[difficulty] ?? difficulty}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {configs.map((test, i) => {
          const done = i < state.currentTest;
          const current = i === state.currentTest;
          return (
            <div key={test.id} className="rounded-xl p-5 flex items-center gap-4 transition-all"
              style={{
                background: current ? "#FBF6ED" : "#FFFFFF",
                border: current ? "2px solid #B8943E" : "1px solid #E8E2D9",
                opacity: done ? 0.5 : 1,
                boxShadow: current ? "0 2px 8px rgba(184,148,62,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}>
              <div className="text-2xl w-10 text-center">{test.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: "#2C2520" }}>{testNames[i]}</span>
                  {done && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#E8F5E9", color: "#2D8A4E" }}>✓ {t.done}</span>}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#8C8175" }}>{testDescs[i]}</p>
                <p className="text-xs mt-1" style={{ color: "#A89F95" }}>{test.questionCount} {t.questions} • {test.timeMinutes} {t.min}</p>
              </div>
              <div className="text-lg font-bold" style={{ color: "#D4B15A" }}>{i + 1}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl p-5 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E8E2D9" }}>
        <p className="text-sm font-semibold mb-2" style={{ color: "#B8943E" }}>{t.beforeBegin}</p>
        <ul className="text-xs space-y-1" style={{ color: "#5C534A" }}>
          <li>• {t.rule1}</li>
          <li>• {t.rule2}</li>
          <li>• {t.rule3}</li>
          <li>• {t.rule4}</li>
          <li>• {t.rule5}</li>
        </ul>
      </div>

      {state.currentTest < configs.length ? (
        <button onClick={startTest} disabled={isNavigating} className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "#B8943E" }}>
          {isNavigating ? "Loading..." : state.currentTest === 0 ? t.startAssessment : `${t.continueTest} — ${testNames[state.currentTest]}`} →
        </button>
      ) : (
        <button onClick={async () => { setIsNavigating(true); await router.push("/results"); }} disabled={isNavigating} className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: "#2D8A4E" }}>
          {isNavigating ? "Loading..." : t.viewResults}
        </button>
      )}
    </div>
  );
}
