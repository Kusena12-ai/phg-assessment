export type QuestionType = "mc" | "likert";

export interface MCQuestion {
  type: "mc";
  id: number;
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

export interface LikertQuestion {
  type: "likert";
  id: number;
  question: string;
  trait: "O" | "C" | "E" | "A" | "N";
  reversed: boolean;
}

export type Question = MCQuestion | LikertQuestion;

export interface TestConfig {
  id: string;
  name: string;
  questionCount: number;
  timeMinutes: number;
  description: string;
  icon: string;
}

export interface TestResult {
  testId: string;
  score: number; // 0-100
  answers: number[];
  timeTaken: number; // seconds
  tabSwitches: number;
  integrityMetrics?: IntegrityMetrics;
}

export interface IntegrityMetrics {
  tabSwitches: number;
  copyPasteAttempts: number;
  devtoolsOpens: number;
  fullscreenExits: number;
  fastAnswerCount: number;
  avgResponseTimeMs: number;
  suspiciousPatterns: string[];
  integrityScore: number;
  autoSubmitted: boolean;
}

export interface OceanScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}

export type Difficulty = "staff" | "supervisor" | "manager" | "executive";

export interface AssessmentState {
  candidateName: string;
  whatsapp: string;
  position: string;
  sessionId: string;
  currentTest: number;
  results: TestResult[];
  startTime: number;
  lang?: "en" | "id";
  difficulty?: Difficulty;
}
