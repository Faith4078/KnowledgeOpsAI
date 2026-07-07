import type { HelpArticleSummary } from "@/lib/sanity";

import { PLACEHOLDER_OPS_STATS } from "./placeholders";

/**
 * Knowledge Operations Dashboard figures. Live values are computed from
 * the published documents; the rest are derived where possible and
 * otherwise come from the placeholder module.
 */
export interface KnowledgeOpsStats {
  /** Live: number of published Knowledge Assets. */
  publishedCount: number;
  /** Live: mean governance review score; null when no document has one. */
  averageReviewScore: number | null;
  /** Live: most recent publish date (ISO); null when nothing is published. */
  lastPublishedAt: string | null;
  /** Placeholder: no draft persistence exists yet. */
  draftAssets: number;
  /** Placeholder: no review queue exists yet. */
  pendingReview: number;
  /** Placeholder: pipeline run history is not stored. */
  averageProcessingSeconds: number;
  /** Derived from the average review score when available. */
  knowledgeBaseHealth: string;
}

function deriveHealth(averageReviewScore: number | null): string {
  if (averageReviewScore === null) {
    return PLACEHOLDER_OPS_STATS.knowledgeBaseHealth;
  }
  if (averageReviewScore >= 85) return "Excellent";
  if (averageReviewScore >= 70) return "Good";
  return "Needs attention";
}

/**
 * Pure, deterministic merge of live figures computed from the article
 * summaries with the placeholder figures — the dashboard's single data
 * shape.
 */
export function computeKnowledgeOpsStats(
  summaries: HelpArticleSummary[],
): KnowledgeOpsStats {
  const scores = summaries
    .map((summary) => summary.reviewScore)
    .filter((score): score is number => typeof score === "number");
  const averageReviewScore =
    scores.length === 0
      ? null
      : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

  const publishTimestamps = summaries
    .map((summary) => Date.parse(summary.publishedAt))
    .filter((timestamp) => !Number.isNaN(timestamp));
  const lastPublishedAt =
    publishTimestamps.length === 0
      ? null
      : new Date(Math.max(...publishTimestamps)).toISOString();

  return {
    publishedCount: summaries.length,
    averageReviewScore,
    lastPublishedAt,
    draftAssets: PLACEHOLDER_OPS_STATS.draftAssets,
    pendingReview: PLACEHOLDER_OPS_STATS.pendingReview,
    averageProcessingSeconds: PLACEHOLDER_OPS_STATS.averageProcessingSeconds,
    knowledgeBaseHealth: deriveHealth(averageReviewScore),
  };
}
