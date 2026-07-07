"use server";

import { computeKnowledgeOpsStats } from "@/lib/education/stats";
import type { KnowledgeOpsStats } from "@/lib/education/stats";
import { getSanityReader } from "@/lib/sanity";
import type { FetchArticlesErrorCode } from "@/lib/types";

const ERROR_MESSAGES = {
  "missing-config":
    "Live knowledge base stats are unavailable until the Sanity environment variables are set.",
  "sanity-error":
    "Live knowledge base stats could not be loaded. Please try again in a moment.",
} as const;

/** Discriminated union returned by `fetchKnowledgeOpsStats`. */
export type FetchStatsResult =
  | { status: "success"; stats: KnowledgeOpsStats }
  | { status: "error"; code: FetchArticlesErrorCode; message: string };

/**
 * Computes the Knowledge Operations Dashboard figures from the
 * published documents. Server-only; never throws — Sanity failures
 * surface as typed results so the dashboard can degrade gracefully.
 */
export async function fetchKnowledgeOpsStats(): Promise<FetchStatsResult> {
  const reader = getSanityReader();
  if (!reader.ok) {
    return {
      status: "error",
      code: reader.error.code,
      message: ERROR_MESSAGES[reader.error.code],
    };
  }

  try {
    const summaries = await reader.data.fetchArticleSummaries();
    return { status: "success", stats: computeKnowledgeOpsStats(summaries) };
  } catch {
    return {
      status: "error",
      code: "sanity-error",
      message: ERROR_MESSAGES["sanity-error"],
    };
  }
}
