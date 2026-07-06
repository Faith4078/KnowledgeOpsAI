"use client";

import { Check, X } from "lucide-react";
import { useId, useState } from "react";

import { evaluateSelection, optionStatus, summarizeQuiz } from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizSectionProps {
  quiz: QuizQuestion[];
}

/**
 * Interactive knowledge-check quiz (issue #5). Client island on the otherwise
 * server-rendered article page. Per-question state only — nothing persists,
 * a reload starts fresh.
 */
export function QuizSection({ quiz }: QuizSectionProps) {
  const [selections, setSelections] = useState<Array<string | null>>(() =>
    quiz.map(() => null),
  );

  if (quiz.length === 0) return null;

  const summary = summarizeQuiz(quiz, selections);

  return (
    <section aria-labelledby="quiz-heading" className="grid gap-8">
      <h2 id="quiz-heading" className="font-serif text-2xl tracking-tight">
        Knowledge check
      </h2>
      {quiz.map((question, index) => (
        <InteractiveQuizQuestion
          key={question.question}
          question={question}
          number={index + 1}
          selected={selections[index] ?? null}
          onSelect={(option) =>
            setSelections((previous) => {
              // Lock in the first answer for each question.
              if (previous[index] !== null) return previous;
              const next = [...previous];
              next[index] = option;
              return next;
            })
          }
        />
      ))}
      <p role="status" className="text-sm font-medium text-muted-foreground">
        {summary.allAnswered
          ? `You answered ${summary.correct} of ${summary.total} correctly.`
          : null}
      </p>
    </section>
  );
}

interface InteractiveQuizQuestionProps {
  question: QuizQuestion;
  number: number;
  selected: string | null;
  onSelect: (option: string) => void;
}

/** One quiz question: pick an option, see the verdict and explanation. */
function InteractiveQuizQuestion({
  question,
  number,
  selected,
  onSelect,
}: InteractiveQuizQuestionProps) {
  const questionId = useId();
  const explanationId = `${questionId}-explanation`;
  const answered = selected !== null;
  const result = answered ? evaluateSelection(question, selected) : null;

  return (
    <div className="grid gap-3">
      <p id={questionId} className="font-medium">
        {number}. {question.question}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={questionId}
        aria-describedby={answered ? explanationId : undefined}
        className="grid gap-1.5"
      >
        {question.options.map((option) => {
          const status = optionStatus(question, option, selected);
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={option === selected}
              disabled={answered}
              onClick={() => onSelect(option)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                status === null &&
                  "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
                (status === "correct" || status === "revealed-correct") &&
                  "border-foreground font-medium text-foreground",
                status === "incorrect" &&
                  "border-destructive/60 text-muted-foreground",
                status === "unselected" && "border-border text-muted-foreground",
                answered && "cursor-default",
              )}
            >
              <span>{option}</span>
              {(status === "correct" || status === "revealed-correct") && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  <Check aria-hidden="true" className="size-3.5" />
                  Correct answer
                </span>
              )}
              {status === "incorrect" && (
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
                  <X aria-hidden="true" className="size-3.5" />
                  Your answer
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="status" id={explanationId} className="grid gap-1">
        {answered && (
          <>
            <p className="text-sm font-medium">
              {result === "correct" ? "Correct." : "Not quite."}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {question.explanation}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
