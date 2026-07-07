import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  PublishingRecommendation,
  ReviewChangeCategory,
  ReviewReport,
} from "@/lib/types";

const CATEGORY_LABELS: Record<ReviewChangeCategory, string> = {
  clarity: "Clarity",
  formatting: "Formatting",
  duplicates: "Duplicate removal",
  quiz: "Knowledge check",
};

const RECOMMENDATION_LABELS: Record<PublishingRecommendation, string> = {
  ready: "Ready to Publish",
  "needs-attention": "Needs Attention",
};

const RECOMMENDATION_STYLES: Record<PublishingRecommendation, string> = {
  ready: "border-emerald-600/30 text-emerald-700 dark:text-emerald-400",
  "needs-attention": "border-amber-600/30 text-amber-700 dark:text-amber-400",
};

interface QaReportCardProps {
  report: ReviewReport;
}

/**
 * The Review Agent's Quality Assurance Report: overall score, publishing
 * recommendation, readability assessment, and the itemized changes the
 * agent made — the operator's go/no-go view before publishing.
 */
export function QaReportCard({ report }: QaReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Quality assurance report</CardDescription>
        <CardTitle className="font-serif text-2xl font-normal tracking-tight">
          AI Review outcome
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="flex items-baseline gap-1">
            <span className="font-serif text-4xl font-normal tracking-tight">
              {report.overallQualityScore}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span className="sr-only">overall quality score</span>
          </p>
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
              RECOMMENDATION_STYLES[report.publishingRecommendation],
            )}
          >
            {RECOMMENDATION_LABELS[report.publishingRecommendation]}
          </span>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Readability</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {report.readabilityAssessment}
          </p>
        </div>
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Changes made by the AI Review</h3>
          {report.changesMade.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No changes were needed — the draft passed review as written.
            </p>
          ) : (
            <ul className="grid gap-1.5 text-sm leading-relaxed text-muted-foreground">
              {report.changesMade.map((change, index) => (
                <li key={index} className="flex gap-2">
                  <span className="shrink-0 font-medium text-foreground">
                    {CATEGORY_LABELS[change.category]}:
                  </span>
                  <span>{change.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
