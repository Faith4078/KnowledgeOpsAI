import { z } from "zod";

/**
 * Canonical content-bundle contract. Defined once here; every layer
 * (agents, actions, UI, and later the Sanity mapper) shares this schema
 * and its inferred type.
 */

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  answer: z.string().min(1),
  explanation: z.string().min(1),
});

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const educationalMetadataSchema = z.object({
  learningObjectives: z.array(z.string().min(1)).min(1),
  estimatedReadingMinutes: z.number().int().positive(),
  difficulty: difficultySchema,
  targetAudience: z.string().min(1),
  prerequisites: z.array(z.string().min(1)),
});

export const contentBundleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  article: z.string().min(1),
  faqs: z.array(faqSchema).min(1),
  quiz: z.array(quizQuestionSchema).min(1),
  educationalMetadata: educationalMetadataSchema,
});

export const publishingRecommendationSchema = z.enum([
  "ready",
  "needs-attention",
]);

export const reviewChangeCategorySchema = z.enum([
  "clarity",
  "formatting",
  "duplicates",
  "quiz",
]);

export const reviewChangeSchema = z.object({
  category: reviewChangeCategorySchema,
  description: z.string().min(1),
});

/**
 * Quality Assurance Report produced by the Review Agent in the same
 * response as the improved bundle — no extra AI call.
 */
export const reviewReportSchema = z.object({
  overallQualityScore: z.number().int().min(0).max(100),
  readabilityAssessment: z.string().min(1),
  changesMade: z.array(reviewChangeSchema),
  publishingRecommendation: publishingRecommendationSchema,
});

/** The Review Agent's complete single-call response shape. */
export const reviewResponseSchema = z.object({
  bundle: contentBundleSchema,
  reviewReport: reviewReportSchema,
});

export type Faq = z.infer<typeof faqSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type EducationalMetadata = z.infer<typeof educationalMetadataSchema>;
export type ContentBundle = z.infer<typeof contentBundleSchema>;
export type PublishingRecommendation = z.infer<
  typeof publishingRecommendationSchema
>;
export type ReviewChangeCategory = z.infer<typeof reviewChangeCategorySchema>;
export type ReviewChange = z.infer<typeof reviewChangeSchema>;
export type ReviewReport = z.infer<typeof reviewReportSchema>;
export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
