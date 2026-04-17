"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_SOLVING, TIME_MANAGEMENT, OCEAN_QUESTIONS, COMMUNICATION } from "@/lib/questions";
import { PS_STAFF, TM_STAFF, COMM_STAFF } from "@/lib/questions-staff";
import { PS_EXEC, TM_EXEC, COMM_EXEC } from "@/lib/questions-exec";
import { PS_MGR, TM_MGR, COMM_MGR } from "@/lib/questions-manager";
import { scoreMC, scoreOcean } from "@/lib/scoring";
import { AssessmentState, OceanScores, Difficulty, MCQuestion } from "@/lib/types";
import Image from "next/image";
import { UI, Lang } from "@/lib/i18n";

function getQuestionsForScoring(difficulty: Difficulty): { ps: MCQuestion[]; tm: MCQuestion[]; comm: MCQuestion[] } {
  if (difficulty === "staff") return { ps: PS_STAFF, tm: TM_STAFF, comm: COMM_STAFF };
  if (difficulty === "manager") return { ps: PS_MGR, tm: TM_MGR, comm: COMM_MGR };
  if (difficulty === "executive") return { ps: PS_EXEC, tm: TM_EXEC, comm: COMM_EXEC };
  return { ps: PROBLEM_SOLVING, tm: TIME_MANAGEMENT, comm: COMMUNICATION };
}

const LEVEL_LABELS: Record<string, Partial<Record<Difficulty, string>>> = {
  en: { staff: "Staff Level", supervisor: "Supervisor Level", manager: "Manager Level", executive: "Executive Level" },
  id: { staff: "Level Staf", supervisor: "Level Supervisor", manager: "Level Manager", executive: "Level Eksekutif" },
};
const LEVEL_ICONS: Record<Difficulty, string> = { staff: "🟢", supervisor: "🟡", manager: "🟠", executive: "🔴" };

function OceanChart({ scores, labels }: { scores: OceanScores; labels: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);
    const cx = size / 2, cy = size / 2, r = 100, n = 5;

    for (let level = 1; level <= 5; level++) {
      ctx.beginPath();
      const lr = (r * level) / 5;
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + lr * Math.cos(angle);
        const y = cy + lr * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "#E8E2D9";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const keys: (keyof OceanScores)[] = ["O", "C", "E", "A", "N"];
    ctx.beginPath();
    keys.forEach((k, i) => {
      const val = scores[k] / 100;
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = cx + r * val * Math.cos(angle);
      const y = cy + r * val * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(184, 148, 62, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#B8943E";
    ctx.lineWidth = 2;
    ctx.stroke();

    keys.forEach((k, i) => {
      const val = scores[k] / 100;
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const px = cx + r * val * Math.cos(angle);
      const py = cy + r * val * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#B8943E";
      ctx.fill();

      const lx = cx + (r + 22) * Math.cos(angle);
      const ly = cy + (r + 22) * Math.sin(angle);
      ctx.fillStyle = "#5C534A";
      ctx.font = "10px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i].substring(0, 5), lx, ly);
    });
  }, [scores, labels]);

  return <canvas ref={canvasRef} />;
}

function ScoreBar({ label, score, color = "#B8943E" }: { label: string; score: number; color?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: "#5C534A" }}>{label}</span>
        <span className="font-bold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-3 rounded-full" style={{ background: "#E8E2D9" }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function Results() {
  const router = useRouter();
  const [state, setState] = useState<AssessmentState | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [difficulty, setDifficulty] = useState<Difficulty>("supervisor");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("assessment");
    if (!raw) { router.push("/"); return; }
    const s = JSON.parse(raw) as AssessmentState;
    if (s.results.length < 4) { router.push("/assessment"); return; }
    setState(s);
    setLang(s.lang || "en");
    setDifficulty(s.difficulty || "supervisor");
  }, [router]);

  const t = UI[lang];
  const qs = getQuestionsForScoring(difficulty);
  const psScore = state ? scoreMC(qs.ps, state.results[0]?.answers || []) : 0;
  const tmScore = state ? scoreMC(qs.tm, state.results[1]?.answers || []) : 0;
  const oceanScores = state ? scoreOcean(OCEAN_QUESTIONS, state.results[2]?.answers || []) : { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const commScore = state ? scoreMC(qs.comm, state.results[3]?.answers || []) : 0;
  const overallScore = Math.round((psScore + tmScore + commScore) / 3);
  const totalTime = state ? Math.round(state.results.reduce((s, r) => s + r.timeTaken, 0) / 60) : 0;
  const totalTabSwitches = state ? state.results.reduce((s, r) => s + r.tabSwitches, 0) : 0;
  
  // Aggregate integrity metrics across all tests
  const aggregateIntegrity = state ? (() => {
    let totalCopyPaste = 0, totalDevtools = 0, totalFullscreen = 0, totalFast = 0;
    let allPatterns: string[] = [];
    let anyAutoSubmit = false;
    let totalAvgTime = 0;
    let metricsCount = 0;
    
    for (const r of state.results) {
      if (r.integrityMetrics) {
        totalCopyPaste += r.integrityMetrics.copyPasteAttempts;
        totalDevtools += r.integrityMetrics.devtoolsOpens;
        totalFullscreen += r.integrityMetrics.fullscreenExits;
        totalFast += r.integrityMetrics.fastAnswerCount;
        allPatterns = [...allPatterns, ...r.integrityMetrics.suspiciousPatterns];
        if (r.integrityMetrics.autoSubmitted) anyAutoSubmit = true;
        totalAvgTime += r.integrityMetrics.avgResponseTimeMs;
        metricsCount++;
      }
    }
    
    // Calculate overall integrity score
    let score = 100;
    score -= totalTabSwitches * 3;
    score -= totalCopyPaste * 5;
    score -= totalDevtools * 15;
    score -= totalFullscreen * 2;
    score -= totalFast * 4;
    score -= allPatterns.length * 10;
    if (anyAutoSubmit) score -= 20;
    
    return {
      copyPasteAttempts: totalCopyPaste,
      devtoolsOpens: totalDevtools,
      fullscreenExits: totalFullscreen,
      fastAnswerCount: totalFast,
      avgResponseTimeMs: metricsCount > 0 ? Math.round(totalAvgTime / metricsCount) : 0,
      suspiciousPatterns: [...new Set(allPatterns)],
      integrityScore: Math.max(0, Math.min(100, score)),
      autoSubmitted: anyAutoSubmit,
    };
  })() : null;

  useEffect(() => {
    if (!state || submitted) return;
    const doSubmit = async () => {
      try {
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateName: state.candidateName,
            whatsapp: state.whatsapp || "",
            position: state.position,
            difficulty,
            problemSolving: psScore,
            timeManagement: tmScore,
            oceanO: oceanScores.O, oceanC: oceanScores.C, oceanE: oceanScores.E, oceanA: oceanScores.A, oceanN: oceanScores.N,
            communication: commScore,
            overall: overallScore,
            timeTaken: totalTime,
            tabSwitches: totalTabSwitches,
            lang,
            integrity: aggregateIntegrity,
          }),
        });
        setSubmitted(true);
      } catch { /* silently fail */ }
    };
    doSubmit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) return null;

  const oceanLabels = [t.openness, t.conscientiousness, t.extraversion, t.agreeableness, t.emotionalStability];
  const oceanDescs = [t.opennessDesc, t.conscientiousnessDesc, t.extraversionDesc, t.agreeablenessDesc, t.emotionalStabilityDesc];
  const oceanKeys: (keyof OceanScores)[] = ["O", "C", "E", "A", "N"];

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      <div className="text-center mt-8 mb-8">
        <div className="flex justify-center mb-3">
          <Image src="/phg-logo.png" alt="PHG" width={140} height={120} className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#2C2520" }}>{t.complete}</h1>
        <p className="text-sm" style={{ color: "#8C8175" }}>{t.thankYou}, {state.candidateName}!</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span>{LEVEL_ICONS[difficulty]}</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F5F0E8", color: "#5C534A" }}>
            {LEVEL_LABELS[lang]?.[difficulty] ?? difficulty}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-6 mb-6 text-center" style={{ background: "#FFFFFF", border: "2px solid #B8943E", boxShadow: "0 2px 8px rgba(184,148,62,0.15)" }}>
        <p className="text-sm mb-2" style={{ color: "#8C8175" }}>{t.overallScore}</p>
        <p className="text-5xl font-bold" style={{ color: "#B8943E" }}>{overallScore}%</p>
        <p className="text-xs mt-2" style={{ color: "#A89F95" }}>
          {t.completedIn} {totalTime} {t.minutes}
          {totalTabSwitches > 0 ? ` • ${totalTabSwitches} ${t.tabSwitchDetected}` : ""}
        </p>
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E8E2D9" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#B8943E" }}>{t.testScores}</h3>
        <ScoreBar label={`🧩 ${t.problemSolving}`} score={psScore} color={psScore >= 70 ? "#2D8A4E" : psScore >= 50 ? "#D4880F" : "#C0392B"} />
        <ScoreBar label={`⏱️ ${t.timeManagement}`} score={tmScore} color={tmScore >= 70 ? "#2D8A4E" : tmScore >= 50 ? "#D4880F" : "#C0392B"} />
        <ScoreBar label={`💬 ${t.communication}`} score={commScore} color={commScore >= 70 ? "#2D8A4E" : commScore >= 50 ? "#D4880F" : "#C0392B"} />
      </div>

      <div className="rounded-xl p-6 mb-6" style={{ background: "#FFFFFF", border: "1px solid #E8E2D9" }}>
        <h3 className="text-sm font-bold mb-4" style={{ color: "#B8943E" }}>🧠 {t.personality}</h3>
        <div className="flex justify-center mb-4">
          <OceanChart scores={oceanScores} labels={oceanLabels} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {oceanKeys.map((k, i) => (
            <div key={k} className="p-3 rounded-lg" style={{ background: "#FAF8F5", border: "1px solid #E8E2D9" }}>
              <div className="flex justify-between">
                <span style={{ color: "#5C534A" }}>{oceanLabels[i]}</span>
                <span className="font-bold" style={{ color: "#B8943E" }}>{oceanScores[k]}%</span>
              </div>
              <p className="text-xs" style={{ color: "#8C8175" }}>{oceanDescs[i]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity indicator for candidate */}
      {aggregateIntegrity && aggregateIntegrity.integrityScore < 80 && (
        <div className="rounded-xl p-4 mb-6 text-center" style={{ background: "#FFF5F5", border: "1px solid #E8C4C4" }}>
          <p className="text-sm" style={{ color: "#C0392B" }}>{t.acFlaggedNote}</p>
        </div>
      )}

      <div className="text-center py-6">
        <p className="text-sm" style={{ color: "#8C8175" }}>{t.resultsSubmitted}</p>
        <p className="text-sm mt-1" style={{ color: "#8C8175" }}>{t.nextSteps}</p>
        <p className="text-xs mt-4" style={{ color: "#B8943E" }}>{t.tagline}</p>
      </div>
    </div>
  );
}
