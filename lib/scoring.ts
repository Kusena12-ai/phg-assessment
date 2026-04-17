import { MCQuestion, LikertQuestion, OceanScores } from "./types";

export function scoreMC(questions: MCQuestion[], answers: number[]): number {
  let correct = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

export function scoreOcean(questions: LikertQuestion[], answers: number[]): OceanScores {
  const traits: Record<string, number[]> = { O: [], C: [], E: [], A: [], N: [] };
  questions.forEach((q, i) => {
    let score = answers[i] ?? 3;
    if (q.reversed) score = 6 - score; // 1→5, 2→4, 3→3, 4→2, 5→1
    traits[q.trait].push(score);
  });
  const calc = (arr: number[]) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length / 5) * 100);
  return {
    O: calc(traits.O),
    C: calc(traits.C),
    E: calc(traits.E),
    A: calc(traits.A),
    N: calc(traits.N),
  };
}
