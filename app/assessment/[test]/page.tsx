"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { TEST_CONFIGS, PROBLEM_SOLVING, TIME_MANAGEMENT, OCEAN_QUESTIONS, COMMUNICATION } from "@/lib/questions";
import { PROBLEM_SOLVING_ID, TIME_MANAGEMENT_ID, OCEAN_ID, COMMUNICATION_ID } from "@/lib/questions-id";
import { PS_STAFF, TM_STAFF, COMM_STAFF } from "@/lib/questions-staff";
import { PS_STAFF_ID, TM_STAFF_ID, COMM_STAFF_ID } from "@/lib/questions-staff-id";
import { PS_EXEC, TM_EXEC, COMM_EXEC } from "@/lib/questions-exec";
import { PS_EXEC_ID, TM_EXEC_ID, COMM_EXEC_ID } from "@/lib/questions-exec-id";
import { PS_MGR, TM_MGR, COMM_MGR } from "@/lib/questions-manager";
import { PS_MGR_ID, TM_MGR_ID, COMM_MGR_ID } from "@/lib/questions-manager-id";
import { UI, Lang } from "@/lib/i18n";
import { AssessmentState, Question, MCQuestion, Difficulty } from "@/lib/types";
import { useAntiCheat } from "@/lib/anti-cheat";

function getQuestions(testId: string, lang: Lang, difficulty: Difficulty): Question[] {
  // OCEAN is the same for all difficulty levels
  if (testId === "ocean") {
    if (lang === "en") return OCEAN_QUESTIONS;
    return OCEAN_QUESTIONS.map((q, i) => ({ ...q, question: OCEAN_ID[i]?.question ?? q.question }));
  }

  // Get base questions by difficulty
  let basePS: MCQuestion[], baseTM: MCQuestion[], baseComm: MCQuestion[];
  let idPS: { question: string; options: string[] }[], idTM: { question: string; options: string[] }[], idComm: { question: string; options: string[] }[];

  if (difficulty === "staff") {
    basePS = PS_STAFF; baseTM = TM_STAFF; baseComm = COMM_STAFF;
    idPS = PS_STAFF_ID; idTM = TM_STAFF_ID; idComm = COMM_STAFF_ID;
  } else if (difficulty === "manager") {
    basePS = PS_MGR; baseTM = TM_MGR; baseComm = COMM_MGR;
    idPS = PS_MGR_ID; idTM = TM_MGR_ID; idComm = COMM_MGR_ID;
  } else if (difficulty === "executive") {
    basePS = PS_EXEC; baseTM = TM_EXEC; baseComm = COMM_EXEC;
    idPS = PS_EXEC_ID; idTM = TM_EXEC_ID; idComm = COMM_EXEC_ID;
  } else {
    // supervisor = original questions
    basePS = PROBLEM_SOLVING; baseTM = TIME_MANAGEMENT; baseComm = COMMUNICATION;
    idPS = PROBLEM_SOLVING_ID; idTM = TIME_MANAGEMENT_ID; idComm = COMMUNICATION_ID;
  }

  let base: MCQuestion[];
  let idArr: { question: string; options: string[] }[];

  switch (testId) {
    case "problem-solving": base = basePS; idArr = idPS; break;
    case "time-management": base = baseTM; idArr = idTM; break;
    case "communication": base = baseComm; idArr = idComm; break;
    default: return [];
  }

  if (lang === "en") return base;
  return base.map((q, i) => ({ ...q, question: idArr[i]?.question ?? q.question, options: idArr[i]?.options ?? q.options }));
}

// Dynamic test configs based on difficulty
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
  return TEST_CONFIGS; // supervisor = default
}

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.test as string;

  const [state, setState] = useState<AssessmentState | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [difficulty, setDifficulty] = useState<Difficulty>("supervisor");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const antiCheat = useAntiCheat(questions.length > 0);

  useEffect(() => {
    const raw = sessionStorage.getItem("assessment");
    if (!raw) { router.push("/"); return; }
    const s = JSON.parse(raw) as AssessmentState;
    const d = s.difficulty || "supervisor";
    const configs = getTestConfigs(d);
    const config = configs.find(t => t.id === testId);
    if (!config) { router.push("/"); return; }
    setState(s);
    const l = s.lang || "en";
    setLang(l);
    setDifficulty(d);
    const qs = getQuestions(testId, l, d);
    setQuestions(qs);
    setTimeLeft(config.timeMinutes * 60);
    setAnswers(new Array(qs.length).fill(-1));
  }, [router, testId]);

  const configs = getTestConfigs(difficulty);
  const config = configs.find(t => t.id === testId);
  const t = UI[lang];
  const likertLabels = [t.likert1, t.likert2, t.likert3, t.likert4, t.likert5];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && state && questions.length > 0) { finishTest(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, state, questions.length]);

  // Request fullscreen on first question load
  useEffect(() => {
    if (questions.length > 0) {
      antiCheat.requestFullscreen();
      antiCheat.resetQuestionTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  // Auto-submit if anti-cheat triggers it
  useEffect(() => {
    if (antiCheat.shouldAutoSubmit && state && config) {
      finishTest();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antiCheat.shouldAutoSubmit]);

  const finishTest = useCallback(() => {
    if (!state || !config) return;
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const metrics = antiCheat.finalizeMetrics(answers);
    const result = { testId: config.id, score: 0, answers, timeTaken, tabSwitches: metrics.tabSwitches, integrityMetrics: metrics };
    const configs2 = getTestConfigs(state.difficulty || "supervisor");
    const newState = { ...state, currentTest: state.currentTest + 1, results: [...state.results, result] };
    sessionStorage.setItem("assessment", JSON.stringify(newState));
    if (newState.currentTest >= configs2.length) {
      router.push("/results");
    } else {
      router.push("/assessment");
    }
  }, [state, config, answers, antiCheat, router]);

  const nextQuestion = () => {
    if (selected === null) return;
    antiCheat.recordQuestionTime();
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ + 1 >= questions.length) {
      const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (!state || !config) return;
      const metrics = antiCheat.finalizeMetrics(newAnswers);
      const result = { testId: config.id, score: 0, answers: newAnswers, timeTaken, tabSwitches: metrics.tabSwitches, integrityMetrics: metrics };
      const configs2 = getTestConfigs(state.difficulty || "supervisor");
      const newState = { ...state, currentTest: state.currentTest + 1, results: [...state.results, result] };
      sessionStorage.setItem("assessment", JSON.stringify(newState));
      if (newState.currentTest >= configs2.length) {
        router.push("/results");
      } else {
        router.push("/assessment");
      }
    } else {
      setCurrentQ(currentQ + 1);
      antiCheat.resetQuestionTimer();
    }
  };

  if (!state || !config || questions.length === 0) return null;

  const q = questions[currentQ];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((currentQ + 1) / questions.length) * 100;
  const isUrgent = timeLeft < 60;

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 mt-4">
        <div>
          <p className="text-xs font-bold tracking-wider" style={{ color: "#B8943E" }}>{config.icon} {config.name.toUpperCase()}</p>
          <p className="text-xs" style={{ color: "#8C8175" }}>{currentQ + 1} / {questions.length}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold" style={{ color: isUrgent ? "#C0392B" : "#B8943E" }}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
          <p className="text-xs" style={{ color: "#8C8175" }}>{t.remaining}</p>
        </div>
      </div>

      <div className="h-1 rounded-full mb-8" style={{ background: "#E8E2D9" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "#B8943E" }} />
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E8E2D9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <p className="text-lg font-medium leading-relaxed" style={{ color: "#2C2520" }}>{q.question}</p>
      </div>

      {q.type === "mc" ? (
        <div className="space-y-3 mb-8">
          {(q as MCQuestion).options.map((opt, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className="w-full text-left p-4 rounded-xl transition-all"
              style={{
                background: selected === i ? "#FBF6ED" : "#FFFFFF",
                border: selected === i ? "2px solid #B8943E" : "2px solid #E8E2D9",
              }}>
              <span className="inline-block w-8 h-8 rounded-full text-center leading-8 mr-3 text-sm font-bold"
                style={{ background: selected === i ? "#B8943E" : "#F5F0E8", color: selected === i ? "#FFF" : "#8C8175" }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ color: selected === i ? "#2C2520" : "#5C534A" }}>{opt}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {likertLabels.map((label, i) => (
            <button key={i} onClick={() => setSelected(i + 1)}
              className="w-full text-left p-4 rounded-xl transition-all flex items-center gap-3"
              style={{
                background: selected === i + 1 ? "#FBF6ED" : "#FFFFFF",
                border: selected === i + 1 ? "2px solid #B8943E" : "2px solid #E8E2D9",
              }}>
              <span className="inline-block w-8 h-8 rounded-full text-center leading-8 text-sm font-bold"
                style={{ background: selected === i + 1 ? "#B8943E" : "#F5F0E8", color: selected === i + 1 ? "#FFF" : "#8C8175" }}>
                {i + 1}
              </span>
              <span style={{ color: selected === i + 1 ? "#2C2520" : "#5C534A" }}>{label}</span>
            </button>
          ))}
        </div>
      )}

      <button onClick={nextQuestion} disabled={selected === null}
        className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-30"
        style={{ background: "#B8943E" }}>
        {currentQ + 1 >= questions.length ? t.finish : t.next}
      </button>

      {/* Anti-cheat warnings banner */}
      {antiCheat.warnings.length > 0 && (
        <div className="mt-4 space-y-1">
          {antiCheat.warnings.slice(-2).map((w, i) => (
            <p key={i} className="text-xs text-center py-1 px-3 rounded-lg" style={{ color: "#C0392B", background: "#FFF5F5" }}>
              ⚠️ {w.message}
            </p>
          ))}
        </div>
      )}

      {/* Integrity monitoring indicator */}
      <p className="text-xs text-center mt-3" style={{ color: "#B8B0A5" }}>
        🔒 {t.acIntegrityNote}
      </p>

      {/* Critical warning overlay */}
      {antiCheat.showCriticalWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="rounded-xl p-8 mx-4 max-w-md text-center" style={{ background: "#FFFFFF", border: "3px solid #C0392B" }}>
            <p className="text-2xl mb-3">🚨</p>
            <h3 className="text-lg font-bold mb-3" style={{ color: "#C0392B" }}>{t.acCriticalTitle}</h3>
            <p className="text-sm mb-6" style={{ color: "#5C534A" }}>{t.acCriticalMsg}</p>
            <button
              onClick={() => antiCheat.dismissCriticalWarning()}
              className="px-6 py-2 rounded-lg font-semibold text-white"
              style={{ background: "#C0392B" }}
            >
              {t.acCriticalDismiss}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
