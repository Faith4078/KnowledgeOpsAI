import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchKnowledgeOpsStats } from "@/actions/fetch-stats";
import { PLACEHOLDER_OPS_STATS } from "@/lib/education/placeholders";
import { setSanityReader } from "@/lib/sanity";
import type { HelpArticleSummary, SanityReader } from "@/lib/sanity";

/**
 * Seam tests: `fetchKnowledgeOpsStats` end-to-end with Sanity faked at
 * its single injection point (`setSanityReader` in lib/sanity/client.ts).
 * No network access anywhere in this file.
 */

function summary(overrides: Partial<HelpArticleSummary>): HelpArticleSummary {
  return {
    title: "Getting Started",
    slug: "getting-started",
    summary: "Learn the basics.",
    publishedAt: "2026-07-01T10:00:00.000Z",
    ...overrides,
  };
}

function fakeReader(summaries: HelpArticleSummary[]): SanityReader {
  return {
    fetchArticleSummaries: async () => summaries,
    fetchArticleBySlug: async () => null,
  };
}

afterEach(() => {
  setSanityReader(null);
  vi.unstubAllEnvs();
});

describe("fetchKnowledgeOpsStats", () => {
  it("computes live figures from the published documents", async () => {
    setSanityReader(
      fakeReader([
        summary({
          slug: "a",
          publishedAt: "2026-07-01T10:00:00.000Z",
          reviewScore: 80,
        }),
        summary({
          slug: "b",
          publishedAt: "2026-07-03T10:00:00.000Z",
          reviewScore: 91,
        }),
        summary({
          slug: "c",
          publishedAt: "2026-06-20T10:00:00.000Z",
          // Pre-governance document: no reviewScore. It still counts as
          // published but is excluded from the average.
        }),
      ]),
    );

    const result = await fetchKnowledgeOpsStats();

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.stats.publishedCount).toBe(3);
    expect(result.stats.averageReviewScore).toBe(86); // round((80+91)/2)
    expect(result.stats.lastPublishedAt).toBe("2026-07-03T10:00:00.000Z");
    expect(result.stats.knowledgeBaseHealth).toBe("Excellent");
  });

  it("merges the placeholder figures deterministically", async () => {
    setSanityReader(fakeReader([]));

    const result = await fetchKnowledgeOpsStats();

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.stats.draftAssets).toBe(PLACEHOLDER_OPS_STATS.draftAssets);
    expect(result.stats.pendingReview).toBe(
      PLACEHOLDER_OPS_STATS.pendingReview,
    );
    expect(result.stats.averageProcessingSeconds).toBe(
      PLACEHOLDER_OPS_STATS.averageProcessingSeconds,
    );
  });

  it("returns null live figures for an empty knowledge base", async () => {
    setSanityReader(fakeReader([]));

    const result = await fetchKnowledgeOpsStats();

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.stats.publishedCount).toBe(0);
    expect(result.stats.averageReviewScore).toBeNull();
    expect(result.stats.lastPublishedAt).toBeNull();
    // Health falls back to the placeholder when there are no scores.
    expect(result.stats.knowledgeBaseHealth).toBe(
      PLACEHOLDER_OPS_STATS.knowledgeBaseHealth,
    );
  });

  it("derives health from the average review score", async () => {
    setSanityReader(
      fakeReader([summary({ reviewScore: 60 }), summary({ reviewScore: 65 })]),
    );

    const result = await fetchKnowledgeOpsStats();

    expect(result.status).toBe("success");
    if (result.status !== "success") return;
    expect(result.stats.averageReviewScore).toBe(63);
    expect(result.stats.knowledgeBaseHealth).toBe("Needs attention");
  });

  it("maps a Sanity read failure to a sanity-error result", async () => {
    setSanityReader({
      fetchArticleSummaries: async () => {
        throw new Error("boom");
      },
      fetchArticleBySlug: async () => null,
    });

    const result = await fetchKnowledgeOpsStats();

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("sanity-error");
      expect(result.message).not.toContain("boom");
    }
  });

  it("returns missing-config when Sanity env vars are absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "");

    const result = await fetchKnowledgeOpsStats();

    expect(result).toMatchObject({ status: "error", code: "missing-config" });
  });
});
