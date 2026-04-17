"use client";
import { useEffect, useRef, useCallback, useState } from "react";

export interface IntegrityMetrics {
  tabSwitches: number;
  copyPasteAttempts: number;
  devtoolsOpens: number;
  fullscreenExits: number;
  fastAnswerCount: number;
  avgResponseTimeMs: number;
  questionTimesMs: number[];
  suspiciousPatterns: string[];
  integrityScore: number;
  autoSubmitted: boolean;
}

export interface AntiCheatWarning {
  type: "tab" | "copy" | "devtools" | "fullscreen" | "fast" | "critical";
  message: string;
  timestamp: number;
}

const BROADCAST_CHANNEL = "phg-assessment-session";
const FAST_ANSWER_THRESHOLD_MS = 3000;
const TAB_SWITCH_WARNING = 5;
const TAB_SWITCH_AUTO_SUBMIT = 10;
const DEVTOOLS_THRESHOLD = 160;

function calcIntegrityScore(m: IntegrityMetrics): number {
  let score = 100;
  // Tab switches: -3 each
  score -= m.tabSwitches * 3;
  // Copy/paste attempts: -5 each
  score -= m.copyPasteAttempts * 5;
  // DevTools: -15 each
  score -= m.devtoolsOpens * 15;
  // Fullscreen exits: -2 each
  score -= m.fullscreenExits * 2;
  // Fast answers: -4 each
  score -= m.fastAnswerCount * 4;
  // Suspicious patterns: -10 each
  score -= m.suspiciousPatterns.length * 10;
  // Auto-submitted: -20
  if (m.autoSubmitted) score -= 20;
  return Math.max(0, Math.min(100, score));
}

export function detectAnswerPatterns(answers: number[]): string[] {
  const patterns: string[] = [];
  if (answers.length < 4) return patterns;

  // Straight-lining: all same answer
  const validAnswers = answers.filter((a) => a >= 0);
  if (validAnswers.length >= 4) {
    const allSame = validAnswers.every((a) => a === validAnswers[0]);
    if (allSame) patterns.push("STRAIGHT_LINE");

    // Repeating pattern (e.g., ABCABC or ABAB)
    for (const len of [2, 3, 4]) {
      if (validAnswers.length < len * 2) continue;
      const chunk = validAnswers.slice(0, len);
      let repeating = true;
      for (let i = len; i < validAnswers.length; i++) {
        if (validAnswers[i] !== chunk[i % len]) {
          repeating = false;
          break;
        }
      }
      if (repeating) {
        patterns.push(`REPEAT_PATTERN_${len}`);
        break;
      }
    }

    // All answers ascending or descending
    let ascending = true;
    let descending = true;
    for (let i = 1; i < validAnswers.length; i++) {
      if (validAnswers[i] < validAnswers[i - 1]) ascending = false;
      if (validAnswers[i] > validAnswers[i - 1]) descending = false;
    }
    if (ascending && validAnswers.length >= 5) patterns.push("ASCENDING");
    if (descending && validAnswers.length >= 5) patterns.push("DESCENDING");
  }

  return patterns;
}

export function useAntiCheat(isActive: boolean) {
  const metricsRef = useRef<IntegrityMetrics>({
    tabSwitches: 0,
    copyPasteAttempts: 0,
    devtoolsOpens: 0,
    fullscreenExits: 0,
    fastAnswerCount: 0,
    avgResponseTimeMs: 0,
    questionTimesMs: [],
    suspiciousPatterns: [],
    integrityScore: 100,
    autoSubmitted: false,
  });

  const [warnings, setWarnings] = useState<AntiCheatWarning[]>([]);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const lastQuestionTimeRef = useRef(Date.now());
  const devtoolsOpenRef = useRef(false);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const sessionTokenRef = useRef<string>("");

  const addWarning = useCallback(
    (type: AntiCheatWarning["type"], message: string) => {
      setWarnings((prev) => [...prev.slice(-4), { type, message, timestamp: Date.now() }]);
    },
    []
  );

  // Session token + multi-tab prevention
  useEffect(() => {
    if (!isActive) return;
    const token = `phg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionTokenRef.current = token;

    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL);
      broadcastRef.current = bc;
      bc.postMessage({ type: "session-start", token });

      bc.onmessage = (e) => {
        if (e.data?.type === "session-start" && e.data.token !== token) {
          addWarning("critical", "Multiple tabs detected!");
          metricsRef.current.suspiciousPatterns.push("MULTI_TAB");
        }
      };

      return () => {
        bc.close();
        broadcastRef.current = null;
      };
    } catch {
      // BroadcastChannel not supported — skip
    }
  }, [isActive, addWarning]);

  // Tab visibility detection
  useEffect(() => {
    if (!isActive) return;

    const handler = () => {
      if (document.hidden) {
        metricsRef.current.tabSwitches += 1;
        const count = metricsRef.current.tabSwitches;

        if (count >= TAB_SWITCH_AUTO_SUBMIT) {
          metricsRef.current.autoSubmitted = true;
          setShouldAutoSubmit(true);
          addWarning("critical", "Too many tab switches — test auto-submitted");
        } else if (count >= TAB_SWITCH_WARNING) {
          setShowCriticalWarning(true);
          addWarning("tab", `⚠️ Tab switch ${count}/${TAB_SWITCH_AUTO_SUBMIT}`);
        } else {
          addWarning("tab", `Tab switch detected (${count})`);
        }
      }
    };

    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [isActive, addWarning]);

  // Copy/Paste prevention
  useEffect(() => {
    if (!isActive) return;

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      metricsRef.current.copyPasteAttempts += 1;
      addWarning("copy", "Copy/paste not allowed during assessment");
    };

    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      metricsRef.current.copyPasteAttempts += 1;
    };

    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "a", "x", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        metricsRef.current.copyPasteAttempts += 1;
        addWarning("copy", "Keyboard shortcuts disabled during assessment");
      }
      // Prevent F12 / DevTools shortcuts
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        metricsRef.current.devtoolsOpens += 1;
        addWarning("devtools", "Developer tools are not allowed");
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("keydown", preventShortcuts);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("keydown", preventShortcuts);
    };
  }, [isActive, addWarning]);

  // DevTools detection via window size
  useEffect(() => {
    if (!isActive) return;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > DEVTOOLS_THRESHOLD;
      const heightThreshold = window.outerHeight - window.innerHeight > DEVTOOLS_THRESHOLD;

      if ((widthThreshold || heightThreshold) && !devtoolsOpenRef.current) {
        devtoolsOpenRef.current = true;
        metricsRef.current.devtoolsOpens += 1;
        addWarning("devtools", "Developer tools detected — this is logged");
      } else if (!widthThreshold && !heightThreshold) {
        devtoolsOpenRef.current = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    window.addEventListener("resize", checkDevTools);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", checkDevTools);
    };
  }, [isActive, addWarning]);

  // Fullscreen monitoring
  useEffect(() => {
    if (!isActive) return;

    const handler = () => {
      if (!document.fullscreenElement) {
        metricsRef.current.fullscreenExits += 1;
        if (metricsRef.current.fullscreenExits > 1) {
          addWarning("fullscreen", "Please stay in fullscreen during the assessment");
        }
      }
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [isActive, addWarning]);

  // Request fullscreen
  const requestFullscreen = useCallback(() => {
    try {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } catch {
      // Fullscreen not supported — OK
    }
  }, []);

  // Track question answer time
  const recordQuestionTime = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastQuestionTimeRef.current;
    metricsRef.current.questionTimesMs.push(elapsed);

    if (elapsed < FAST_ANSWER_THRESHOLD_MS) {
      metricsRef.current.fastAnswerCount += 1;
      if (metricsRef.current.fastAnswerCount >= 3) {
        addWarning("fast", "Answering very quickly — please read questions carefully");
      }
    }

    lastQuestionTimeRef.current = now;

    // Update average
    const times = metricsRef.current.questionTimesMs;
    metricsRef.current.avgResponseTimeMs = Math.round(
      times.reduce((a, b) => a + b, 0) / times.length
    );
  }, [addWarning]);

  // Reset timer for new question
  const resetQuestionTimer = useCallback(() => {
    lastQuestionTimeRef.current = Date.now();
  }, []);

  // Finalize metrics with pattern detection
  const finalizeMetrics = useCallback((answers: number[]): IntegrityMetrics => {
    const patterns = detectAnswerPatterns(answers);
    metricsRef.current.suspiciousPatterns = [
      ...metricsRef.current.suspiciousPatterns,
      ...patterns,
    ];
    metricsRef.current.integrityScore = calcIntegrityScore(metricsRef.current);
    return { ...metricsRef.current };
  }, []);

  const getMetrics = useCallback((): IntegrityMetrics => {
    metricsRef.current.integrityScore = calcIntegrityScore(metricsRef.current);
    return { ...metricsRef.current };
  }, []);

  return {
    warnings,
    showCriticalWarning,
    shouldAutoSubmit,
    requestFullscreen,
    recordQuestionTime,
    resetQuestionTimer,
    finalizeMetrics,
    getMetrics,
    dismissCriticalWarning: () => setShowCriticalWarning(false),
  };
}
