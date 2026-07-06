import { describe, expect, it } from "vitest";

import { evaluateSelection, optionStatus, summarizeQuiz } from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/types";

/** Pure answer-evaluation logic behind the interactive knowledge-check quiz. */

const questionOne: QuizQuestion = {
  question: "What does the Generator Agent produce?",
  options: ["A content bundle", "A billing report", "A support ticket"],
  answer: "A content bundle",
  explanation: "It generates the article, FAQs, and quiz as one bundle.",
};

const questionTwo: QuizQuestion = {
  question: "Where are articles published?",
  options: ["Sanity", "A local file"],
  answer: "Sanity",
  explanation: "Publishing writes the bundle to Sanity.",
};

describe("evaluateSelection", () => {
  it("marks the correct option as correct", () => {
    expect(evaluateSelection(questionOne, "A content bundle")).toBe("correct");
  });

  it("marks any other option as incorrect", () => {
    expect(evaluateSelection(questionOne, "A billing report")).toBe(
      "incorrect",
    );
  });
});

describe("optionStatus", () => {
  it("returns null before a selection is made", () => {
    expect(optionStatus(questionOne, "A content bundle", null)).toBeNull();
  });

  it("marks the picked correct option as correct", () => {
    expect(
      optionStatus(questionOne, "A content bundle", "A content bundle"),
    ).toBe("correct");
  });

  it("marks a wrong pick as incorrect and reveals the answer", () => {
    expect(
      optionStatus(questionOne, "A billing report", "A billing report"),
    ).toBe("incorrect");
    expect(
      optionStatus(questionOne, "A content bundle", "A billing report"),
    ).toBe("revealed-correct");
    expect(
      optionStatus(questionOne, "A support ticket", "A billing report"),
    ).toBe("unselected");
  });
});

describe("summarizeQuiz", () => {
  const quiz = [questionOne, questionTwo];

  it("counts nothing when no questions are answered", () => {
    expect(summarizeQuiz(quiz, [null, null])).toEqual({
      answered: 0,
      correct: 0,
      total: 2,
      allAnswered: false,
    });
  });

  it("counts partial progress without marking all answered", () => {
    expect(summarizeQuiz(quiz, ["A content bundle", null])).toEqual({
      answered: 1,
      correct: 1,
      total: 2,
      allAnswered: false,
    });
  });

  it("counts correct answers once all questions are answered", () => {
    expect(summarizeQuiz(quiz, ["A content bundle", "A local file"])).toEqual({
      answered: 2,
      correct: 1,
      total: 2,
      allAnswered: true,
    });
  });

  it("never reports an empty quiz as all answered", () => {
    expect(summarizeQuiz([], [])).toEqual({
      answered: 0,
      correct: 0,
      total: 0,
      allAnswered: false,
    });
  });
});
