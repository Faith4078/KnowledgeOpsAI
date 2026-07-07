import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: "border-emerald-600/30 text-emerald-700 dark:text-emerald-400",
  intermediate: "border-amber-600/30 text-amber-700 dark:text-amber-400",
  advanced: "border-rose-600/30 text-rose-700 dark:text-rose-400",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

/** Small pill badge for a Knowledge Asset's difficulty level. */
export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  // Sanity data is untyped at runtime; ignore values we don't recognize.
  if (!(difficulty in DIFFICULTY_LABELS)) return null;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        DIFFICULTY_STYLES[difficulty],
        className,
      )}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

/** "5 min read" style label for a Knowledge Asset's reading time. */
export function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {minutes} min read
    </span>
  );
}
