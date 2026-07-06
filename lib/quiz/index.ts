import type { QuizQuestion } from "@/lib/types";

/**
 * Pure answer-evaluation logic for the interactive knowledge-check quiz.
 * Kept free of React so it can be unit-tested directly (issue #5).
 */

export type OptionStatus =
  | "correct" // this option is the answer and the visitor picked it
  | "incorrect" // the visitor picked this option and it is wrong
  | "revealed-correct" // the visitor picked another option; this is the answer
  | "unselected"; // any other option once a selection exists
export type SelectionResult = "correct" | "incorrect";

/** Whether the selected option is the question's correct answer. */
export function evaluateSelection(
  question: QuizQuestion,
  selected: string,
): SelectionResult {
  return selected === question.answer ? "correct" : "incorrect";
}

/**
 * Presentation status for one option given the visitor's selection
 * (or null when nothing has been selected yet).
 */
export function optionStatus(
  question: QuizQuestion,
  option: string,
  selected: string | null,
): OptionStatus | null {
  if (selected === null) return null;
  if (option === question.answer) {
    return option === selected ? "correct" : "revealed-correct";
  }
  return option === selected ? "incorrect" : "unselected";
}

export interface QuizSummary {
  answered: number;
  correct: number;
  total: number;
  allAnswered: boolean;
}

/**
 * Count answered/correct questions from the per-question selections.
 * `selections[i]` is the visitor's pick for `quiz[i]`, or null if unanswered.
 */
export function summarizeQuiz(
  quiz: QuizQuestion[],
  selections: ReadonlyArray<string | null>,
): QuizSummary {
  let answered = 0;
  let correct = 0;
  quiz.forEach((question, index) => {
    const selected = selections[index] ?? null;
    if (selected === null) return;
    answered += 1;
    if (evaluateSelection(question, selected) === "correct") correct += 1;
  });
  return {
    answered,
    correct,
    total: quiz.length,
    allAnswered: quiz.length > 0 && answered === quiz.length,
  };
}
