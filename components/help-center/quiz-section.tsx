import type { QuizQuestion } from "@/lib/types";

interface QuizSectionProps {
  quiz: QuizQuestion[];
}

/**
 * Static display of the knowledge-check quiz. Each question renders its
 * options, the correct answer, and the explanation. Structured per-question
 * so issue #5 can swap in an interactive client component question-by-question.
 */
export function QuizSection({ quiz }: QuizSectionProps) {
  if (quiz.length === 0) return null;

  return (
    <section aria-labelledby="quiz-heading" className="grid gap-8">
      <h2 id="quiz-heading" className="font-serif text-2xl tracking-tight">
        Knowledge check
      </h2>
      {quiz.map((question, index) => (
        <StaticQuizQuestion
          key={question.question}
          question={question}
          number={index + 1}
        />
      ))}
    </section>
  );
}

interface StaticQuizQuestionProps {
  question: QuizQuestion;
  number: number;
}

/** One quiz question rendered statically (interactivity arrives in issue #5). */
function StaticQuizQuestion({ question, number }: StaticQuizQuestionProps) {
  return (
    <div className="grid gap-3">
      <p className="font-medium">
        {number}. {question.question}
      </p>
      <ul className="grid gap-1.5 pl-1">
        {question.options.map((option) => {
          const isCorrect = option === question.answer;
          return (
            <li
              key={option}
              className={
                isCorrect
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {option}
              {isCorrect && (
                <span className="ml-2 rounded-full border border-border px-2 py-0.5 text-xs font-medium">
                  Correct answer
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {question.explanation}
      </p>
    </div>
  );
}
