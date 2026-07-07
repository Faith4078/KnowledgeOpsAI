/**
 * Prompt builders for the AI agents. Pure functions of their inputs —
 * no provider or transport concerns.
 */

/**
 * Governance label recorded on every published Knowledge Asset. Bump
 * manually when the reviewer prompt changes materially — it makes the
 * review provenance visible, it does not version prompts automatically.
 */
export const REVIEW_AGENT_VERSION = "review-agent/v1";

export function buildGeneratorPrompt(documentation: string): string {
  return `You are the Generator Agent for LearnOps AI, an internal customer-education platform.

Transform the raw product documentation below into a complete, publish-ready education bundle.

Respond with ONLY a single JSON object — no markdown fences, no commentary — matching exactly this shape:
{
  "title": "string — a clear, customer-facing article title",
  "slug": "string — URL-safe kebab-case slug derived from the title",
  "summary": "string — 2-3 sentence overview of the article",
  "article": "string — the full help-center article in Markdown, with headings, written for beginners",
  "faqs": [{ "question": "string", "answer": "string" }],
  "quiz": [{ "question": "string", "options": ["string", "..."], "answer": "string — must be one of the options verbatim", "explanation": "string — why the answer is correct" }],
  "educationalMetadata": {
    "learningObjectives": ["string — what the reader will be able to do after reading; at least one"],
    "estimatedReadingMinutes": "number — positive integer estimate of reading time for the article",
    "difficulty": "string — exactly one of: beginner, intermediate, advanced",
    "targetAudience": "string — who this Knowledge Asset is written for",
    "prerequisites": ["string — prior knowledge or setup required; empty array if none"]
  }
}

Requirements:
- Write for customers who have never seen this product before.
- Produce 4-6 FAQs covering the most likely customer questions.
- Produce 3-5 quiz questions, each with exactly 4 options and one correct answer.
- Produce 2-4 concrete, action-oriented learning objectives.
- Estimate reading time honestly from the article length (a positive whole number of minutes).
- Base everything strictly on the documentation; do not invent features.

Documentation:
"""
${documentation}
"""`;
}

export function buildReviewerPrompt(bundleJson: string): string {
  return `You are the Review Agent for LearnOps AI, an internal customer-education platform.

Below is a draft education bundle produced by the Generator Agent. Review and improve the ENTIRE bundle, then return the improved version together with a Quality Assurance Report on the work you did.

Improve:
- Clarity and flow: tighten wording, fix awkward phrasing, keep it beginner-friendly.
- Article structure: sensible Markdown headings, short paragraphs, lists where they help.
- Formatting: consistent Markdown, no stray artifacts or code fences.
- FAQs: questions a real customer would ask, with direct, accurate answers.
- Quiz quality: unambiguous questions, plausible distractors, the answer must match one option verbatim, explanations that teach.
- Consistency: terminology, tone, and title/slug/summary all agree with the article.
- Educational metadata: preserve the educationalMetadata object; improve it only to keep it accurate — objectives that match the article, an honest estimatedReadingMinutes, a difficulty of beginner/intermediate/advanced, a clear targetAudience, and correct prerequisites (empty array if none).

Do NOT invent features or facts not present in the draft. Keep the slug URL-safe kebab-case.

Respond with ONLY a single JSON object — no markdown fences, no commentary — matching exactly this shape:
{
  "bundle": {
    "title": "string",
    "slug": "string",
    "summary": "string",
    "article": "string — full Markdown article",
    "faqs": [{ "question": "string", "answer": "string" }],
    "quiz": [{ "question": "string", "options": ["string", "..."], "answer": "string — one of the options verbatim", "explanation": "string" }],
    "educationalMetadata": {
      "learningObjectives": ["string"],
      "estimatedReadingMinutes": "number — positive integer",
      "difficulty": "beginner | intermediate | advanced",
      "targetAudience": "string",
      "prerequisites": ["string"]
    }
  },
  "reviewReport": {
    "overallQualityScore": "number — integer 0-100 rating the improved bundle's overall quality",
    "readabilityAssessment": "string — 1-2 sentences on whether the article's readability suits its target audience and difficulty",
    "changesMade": [{ "category": "string — exactly one of: clarity, formatting, duplicates, quiz", "description": "string — one concrete change you made" }],
    "publishingRecommendation": "string — exactly one of: ready, needs-attention"
  }
}

Report rules:
- Score honestly: 90+ only for genuinely excellent content; below 70 means it needs another pass.
- List every meaningful change you made, categorized. If you made no changes in a category, omit that category; an empty array means you changed nothing.
- Recommend "ready" only when the bundle can be published as-is; otherwise "needs-attention".

Draft bundle:
"""
${bundleJson}
"""`;
}
