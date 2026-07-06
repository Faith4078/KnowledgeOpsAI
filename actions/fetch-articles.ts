"use server";

import { getSanityReader } from "@/lib/sanity";
import type { FetchArticleResult, FetchArticlesResult } from "@/lib/types";

const ERROR_MESSAGES = {
  "missing-config":
    "The Help Center is not configured yet. Ask an administrator to set the Sanity environment variables.",
  "sanity-error":
    "Help Center articles could not be loaded. Please try again in a moment.",
} as const;

/**
 * Fetches all published article summaries, newest first. Server-only;
 * never throws — Sanity failures surface as typed results.
 */
export async function fetchArticles(): Promise<FetchArticlesResult> {
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
    // Normalize ordering here so it holds regardless of the reader impl.
    const articles = [...summaries].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
    return { status: "success", articles };
  } catch {
    return {
      status: "error",
      code: "sanity-error",
      message: ERROR_MESSAGES["sanity-error"],
    };
  }
}

/**
 * Fetches one full article by slug. Returns `article: null` when no
 * document matches (the page turns that into a 404).
 */
export async function fetchArticleBySlug(
  slug: string,
): Promise<FetchArticleResult> {
  const reader = getSanityReader();
  if (!reader.ok) {
    return {
      status: "error",
      code: reader.error.code,
      message: ERROR_MESSAGES[reader.error.code],
    };
  }

  try {
    const article = await reader.data.fetchArticleBySlug(slug);
    return { status: "success", article };
  } catch {
    return {
      status: "error",
      code: "sanity-error",
      message: ERROR_MESSAGES["sanity-error"],
    };
  }
}
