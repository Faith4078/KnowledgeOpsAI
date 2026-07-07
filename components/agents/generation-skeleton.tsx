import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GenerationSkeletonProps {
  /** Status line above the skeleton cards. */
  message?: string;
}

/** Loading placeholder shown while an agent call is in flight. */
export function GenerationSkeleton({
  message = "Generator Agent is drafting the knowledge asset — article, FAQs, and knowledge check…",
}: GenerationSkeletonProps) {
  return (
    <section aria-label="Publishing workflow in progress" aria-busy="true" className="grid gap-6">
      <p className="text-sm text-muted-foreground" role="status">
        {message}
      </p>
      {[0, 1].map((key) => (
        <Card key={key}>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="grid gap-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
