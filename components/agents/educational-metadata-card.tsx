import {
  DifficultyBadge,
  ReadingTime,
} from "@/components/education/difficulty-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EducationalMetadata } from "@/lib/types";

interface EducationalMetadataCardProps {
  metadata: EducationalMetadata;
}

/** The Knowledge Asset's educational metadata as an operator result card. */
export function EducationalMetadataCard({
  metadata,
}: EducationalMetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Educational metadata</CardDescription>
        <CardTitle className="font-serif text-2xl font-normal tracking-tight">
          Learning profile
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={metadata.difficulty} />
          <ReadingTime minutes={metadata.estimatedReadingMinutes} />
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Learning objectives</h3>
          <ul className="grid list-disc gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            {metadata.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            Target audience:{" "}
          </span>
          {metadata.targetAudience}
        </p>
        {metadata.prerequisites.length > 0 && (
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">Prerequisites</h3>
            <ul className="grid list-disc gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              {metadata.prerequisites.map((prerequisite) => (
                <li key={prerequisite}>{prerequisite}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
