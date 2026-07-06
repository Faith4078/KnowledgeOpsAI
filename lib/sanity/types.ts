import type { Faq, QuizQuestion } from "@/lib/ai/schemas";

/** The `helpArticle` document shape written to Sanity. */
export interface HelpArticleDoc {
  title: string;
  slug: string;
  summary: string;
  article: string;
  faqs: Faq[];
  quiz: QuizQuestion[];
  publishedAt: string;
}

/**
 * The seam through which the app writes to Sanity. Tests fake this
 * interface (via `setSanityWriter`) exactly like the AI `ModelCaller`.
 */
export interface SanityWriter {
  /** All existing slugs starting with the given base, for de-duplication. */
  fetchSlugsMatching(baseSlug: string): Promise<string[]>;
  /** Creates the document and returns its Sanity id. */
  createHelpArticle(doc: HelpArticleDoc): Promise<string>;
}

/** Listing-page projection of a published help article. */
export interface HelpArticleSummary {
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
}

/** The full `helpArticle` document as read back from Sanity. */
export interface HelpArticle extends HelpArticleSummary {
  article: string;
  faqs: Faq[];
  quiz: QuizQuestion[];
}

/**
 * The seam through which the app reads from Sanity. Tests fake this
 * interface (via `setSanityReader`) exactly like `SanityWriter`.
 */
export interface SanityReader {
  /** All published article summaries; order is normalized by the caller. */
  fetchArticleSummaries(): Promise<HelpArticleSummary[]>;
  /** The full article for a slug, or null when no document matches. */
  fetchArticleBySlug(slug: string): Promise<HelpArticle | null>;
}

export interface SanityError {
  code: "missing-config" | "sanity-error";
  message: string;
}

export type SanityResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: SanityError };
