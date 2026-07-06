import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchArticleBySlug, fetchArticles } from "@/actions/fetch-articles";
import { setSanityReader } from "@/lib/sanity";
import type { HelpArticle, SanityReader } from "@/lib/sanity";

/**
 * Seam tests: the Help Center read path with Sanity faked at its single
 * injection point (`setSanityReader` in lib/sanity/client.ts).
 * No network access anywhere in this file.
 */

const articleA: HelpArticle = {
  title: "Older Article",
  slug: "older-article",
  summary: "An older help article.",
  article: "# Older\n\nBody text.",
  faqs: [{ question: "Q?", answer: "A." }],
  quiz: [
    {
      question: "Pick one",
      options: ["Right", "Wrong"],
      answer: "Right",
      explanation: "Because.",
    },
  ],
  publishedAt: "2026-01-01T00:00:00.000Z",
};

const articleB: HelpArticle = {
  ...articleA,
  title: "Newer Article",
  slug: "newer-article",
  summary: "A newer help article.",
  publishedAt: "2026-06-01T00:00:00.000Z",
};

function fakeReader(overrides: Partial<SanityReader> = {}): SanityReader {
  return {
    fetchArticleSummaries: async () => [],
    fetchArticleBySlug: async () => null,
    ...overrides,
  };
}

afterEach(() => {
  setSanityReader(null);
  vi.unstubAllEnvs();
});

describe("fetchArticles", () => {
  it("returns summaries ordered newest-first", async () => {
    setSanityReader(
      fakeReader({
        // Deliberately oldest-first: the action normalizes ordering.
        fetchArticleSummaries: async () => [articleA, articleB],
      }),
    );

    const result = await fetchArticles();

    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.articles.map((a) => a.slug)).toEqual([
        "newer-article",
        "older-article",
      ]);
    }
  });

  it("returns an empty list when nothing is published", async () => {
    setSanityReader(fakeReader());

    const result = await fetchArticles();

    expect(result).toEqual({ status: "success", articles: [] });
  });

  it("returns missing-config when Sanity env vars are absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "");

    const result = await fetchArticles();

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("missing-config");
    }
  });

  it("maps a Sanity read failure to a sanity-error result", async () => {
    setSanityReader(
      fakeReader({
        fetchArticleSummaries: async () => {
          throw new Error("boom");
        },
      }),
    );

    const result = await fetchArticles();

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("sanity-error");
      expect(result.message).not.toContain("boom");
    }
  });
});

describe("fetchArticleBySlug", () => {
  it("returns the full article for a known slug", async () => {
    setSanityReader(
      fakeReader({
        fetchArticleBySlug: async (slug) =>
          slug === "newer-article" ? articleB : null,
      }),
    );

    const result = await fetchArticleBySlug("newer-article");

    expect(result).toEqual({ status: "success", article: articleB });
  });

  it("returns null for an unknown slug", async () => {
    setSanityReader(fakeReader());

    const result = await fetchArticleBySlug("does-not-exist");

    expect(result).toEqual({ status: "success", article: null });
  });

  it("returns missing-config when Sanity env vars are absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "");

    const result = await fetchArticleBySlug("any-slug");

    expect(result.status).toBe("error");
    if (result.status === "error") {
      expect(result.code).toBe("missing-config");
    }
  });
});
