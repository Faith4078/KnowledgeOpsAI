/**
 * Realistic placeholder figures for Knowledge Operations Dashboard
 * stats the platform cannot yet compute from live data (no draft
 * persistence, no review queue, no run-time history). Deliberately
 * isolated in this one module so each figure is trivial to replace
 * with a live query later.
 */
export const PLACEHOLDER_OPS_STATS = {
  /** No draft persistence exists yet (PRD-2 out of scope). */
  draftAssets: 3,
  /** No review queue exists yet — publishing is operator-triggered. */
  pendingReview: 2,
  /** Pipeline run history is not stored; typical two-call run time. */
  averageProcessingSeconds: 42,
  /** Fallback health when no review scores exist to derive it from. */
  knowledgeBaseHealth: "Good",
} as const;
