import {
  DifficultyBadge,
  ReadingTime,
} from "@/components/education/difficulty-badge";
import type { EducationalMetadata } from "@/lib/types";

interface ArticleEducationProps {
  metadata: EducationalMetadata | null | undefined;
}

/**
 * Difficulty and reading-time hints shown near the article title.
 * Renders nothing for Knowledge Assets published before metadata existed.
 */
export function ArticleEducationHints({ metadata }: ArticleEducationProps) {
  if (metadata == null) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <DifficultyBadge difficulty={metadata.difficulty} />
      <ReadingTime minutes={metadata.estimatedReadingMinutes} />
    </div>
  );
}

/**
 * Learning objectives, audience, and prerequisites for a Knowledge Asset.
 * Renders nothing when the article predates educational metadata.
 */
export function ArticleEducationOverview({ metadata }: ArticleEducationProps) {
  // Hand-edited Studio documents may be partial; only render real content.
  const objectives = metadata?.learningObjectives ?? [];
  if (metadata == null || objectives.length === 0) {
    return null;
  }
  const prerequisites = metadata.prerequisites ?? [];
  return (
    <section
      aria-label="Learning objectives"
      className="grid gap-4 rounded-xl border border-border bg-muted/30 p-6"
    >
      <h2 className="font-serif text-xl font-normal tracking-tight">
        What you&rsquo;ll learn
      </h2>
      <ul className="grid list-disc gap-2 pl-5 leading-relaxed text-muted-foreground">
        {objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Written for: </span>
        {metadata.targetAudience}
      </p>
      {prerequisites.length > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Before you start:{" "}
          </span>
          {prerequisites.join(" · ")}
        </p>
      )}
    </section>
  );
}
