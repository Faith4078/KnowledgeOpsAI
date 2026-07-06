/**
 * Application-level shared types.
 */

export type {
  ContentBundle,
  Faq,
  QuizQuestion,
} from "@/lib/ai/schemas";

/** Error codes a content-generation run can surface to the UI. */
export type GenerateContentErrorCode =
  | "empty-input"
  | "invalid-response"
  | "api-error"
  | "missing-config";

import type { ContentBundle } from "@/lib/ai/schemas";

/** Discriminated union returned by the `generateContent` server action. */
export type GenerateContentResult =
  | { status: "success"; bundle: ContentBundle }
  | { status: "error"; code: GenerateContentErrorCode; message: string };

/** Error codes a review run can surface to the UI. */
export type ReviewContentErrorCode =
  | "invalid-response"
  | "api-error"
  | "missing-config";

/** Discriminated union returned by the `reviewContent` server action. */
export type ReviewContentResult =
  | { status: "success"; bundle: ContentBundle }
  | { status: "error"; code: ReviewContentErrorCode; message: string };

/** Stages of the client-side content pipeline (issue #2). */
export type PipelineStage =
  | "idle"
  | "generating"
  | "reviewing"
  | "done"
  | "error";
