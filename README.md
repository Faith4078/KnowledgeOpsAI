# LearnOps AI

AI-powered Customer Education Operations. LearnOps AI transforms raw product documentation into governed, reviewable, publish-ready knowledge assets — a help article, FAQs, and a knowledge check — through an automated publishing workflow, then publishes the approved asset to Sanity CMS, where it appears instantly in a public, searchable Help Center backed by the knowledge base.

Built with Next.js (App Router), Google Gemini, and Sanity, styled after the Harvey Legal Dark design system.

## Overview

Customer Education teams receive raw docs (Markdown, plain text) and must manually rewrite them into customer-facing learning content, run an editorial governance pass, and publish. LearnOps AI automates that documentation lifecycle:

1. An operator pastes documentation or uploads a `.md`/`.txt` file.
2. The **Generator Agent** (one Gemini call) produces a structured knowledge asset — title, slug, summary, article, FAQs, knowledge check, and educational metadata (learning objectives, reading time, difficulty, target audience, prerequisites).
3. The **Review Agent** (one Gemini call, the AI Review step) editorially improves the entire asset and returns a **Quality Assurance Report** — overall quality score, readability assessment, itemized changes, and an explicit publishing recommendation — in the same response.
4. The operator judges publish-readiness from the QA report, previews the reviewed knowledge asset in result cards, and publishes it to the knowledge base with one click. The published document carries a **governance record**: review score, recommendation, generating model, review-agent version, documentation version, and last-reviewed date.
5. The **Help Center** reflects published learning content automatically, with keyword search, article pages showing learning objectives and a Content Governance sidebar, FAQs, and an interactive knowledge check.

A visual timeline animates each publishing-workflow stage as it completes — including per-stage timings ("Completed in 4.2s") — with graceful error states and automatic retries for transient AI failures. The Home page opens with a **Knowledge Operations Dashboard** (live figures from Sanity where computable, clearly-marked estimates otherwise) and an architecture panel describing each pipeline stage.

## Features

- **Paste or upload** documentation (`.md`, `.txt`) through a single content-source abstraction
- **Two-agent publishing workflow** — exactly two AI calls per run (generate, AI Review), efficient within free-tier limits; educational metadata and the QA report ride inside those same two calls
- **Structured, validated output** — every AI response is parsed and validated against Zod schemas before use (content governance at the schema level)
- **Quality Assurance Report** — overall quality score (0–100), readability assessment, itemized changes (clarity, formatting, duplicates, quiz), and a Ready to Publish / Needs Attention recommendation
- **Educational metadata** — learning objectives, estimated reading time, difficulty, target audience, and prerequisites generated with every asset and displayed in the workspace and Help Center
- **Animated workflow timeline** — Uploaded → Generator Agent → AI Review → Quality Assurance Report → Publishing → Knowledge Base Updated, with per-stage completion timings
- **Result cards** previewing the QA report and reviewed knowledge asset — article, FAQs, and knowledge check — before anything goes live
- **One-click publish** to the Sanity-backed knowledge base with success/error toasts; every published document carries its governance record
- **Content Governance sidebar** on article pages — status, review score, computed freshness, generating model, review-agent version, documentation version, review and publish dates
- **Knowledge Operations Dashboard** — published assets, average review score, knowledge-base health, and last-published date computed live from Sanity; drafts, pending review, and processing time as clearly-marked estimates
- **Public Help Center** — searchable learning content: article list with difficulty and reading-time hints, full article pages, FAQs, knowledge check
- **Resilience** — retry with backoff, rate-limit handling, missing-env detection, human-readable error messages
- **Accessible, responsive UI** — labeled inputs, visible focus states, ARIA live regions, screen-reader-friendly timeline, mobile-first layouts

## Architecture

The system is deliberately small and seam-oriented:

- **Two-agent pipeline.** The Generator Agent produces the full content bundle (including educational metadata) in one structured-JSON request; the Review Agent improves the whole bundle and produces the Quality Assurance Report in a second request. No per-artifact calls — the QA Report timeline stage presents data the reviewer already returned.
- **One AI abstraction (provider-swap boundary).** All model access goes through `generateWithGemini` in `lib/ai/gemini.ts`. It owns client initialization, model config, structured JSON generation, parsing, Zod validation, retries, rate-limit handling, and typed error results. Agents know nothing about the provider — swapping Gemini for Claude or OpenAI touches one module.
- **Actions layer.** Next.js server actions (`actions/`) are the only bridge between UI and services: `generate-content`, `review-content`, `publish-to-sanity`, `fetch-articles`, `fetch-stats`. Each returns a typed result, never throws raw errors into the UI.
- **Content-source abstraction.** `lib/content-source` normalizes every input (pasted text, uploaded file) to one trimmed documentation string. New formats (e.g. PDF) are added by registering a `FileContentExtractor` — the upload flow doesn't change.
- **Seam-based testing.** Tests inject fakes at the seams instead of mocking SDKs: `setModelCaller`/`setRetryDelays` replace the Gemini transport, and `setSanityWriter`/`setSanityReader` replace the Sanity client. The suite exercises real parsing, validation, retry, and error-mapping logic with no network access.

### Workflow Diagram

```mermaid
flowchart LR
    A[Upload / Paste Docs] --> B[Generator Agent<br/>1 Gemini call<br/>bundle + edu metadata]
    B --> C[AI Review<br/>1 Gemini call<br/>improved bundle + QA report]
    C --> D[QA Report +<br/>Preview Result Cards]
    D --> E[Publish to Sanity CMS<br/>with governance record]
    E --> F[Help Center<br/>search, article, governance,<br/>FAQs, knowledge check]
```

```
Upload → Generator Agent → AI Review → QA Report → Publish to Sanity → Help Center
```

## Folder Structure

```
learnopsai/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Dashboard: upload form + pipeline workspace
│   └── help-center/          # Public Help Center (list + [slug] article page)
├── actions/                  # Server actions (UI ↔ services bridge)
│   ├── generate-content.ts   # Generator Agent
│   ├── review-content.ts     # Review Agent (bundle + QA report)
│   ├── publish-to-sanity.ts  # Persist reviewed bundle + governance record
│   ├── fetch-articles.ts     # GROQ reads for the Help Center
│   └── fetch-stats.ts        # Knowledge Operations Dashboard figures
├── components/
│   ├── agents/               # Timeline, QA report card, result cards, publish card
│   ├── dashboard/            # Knowledge Ops Dashboard + architecture panel
│   ├── education/            # Difficulty badge, reading-time label
│   ├── help-center/          # Search, article body, governance sidebar, FAQ + quiz
│   ├── layout/               # Dashboard shell (nav, skip link)
│   ├── upload/               # Documentation form (paste / upload tabs)
│   └── ui/                   # shadcn/ui primitives
├── hooks/
│   └── use-content-generation.ts  # Client pipeline state machine + stage timings
├── lib/
│   ├── ai/                   # Gemini abstraction, prompts, Zod schemas (provider-swap boundary)
│   ├── content-source/       # Paste/file input normalization (extension point)
│   ├── education/            # Pure derivations: freshness, doc fingerprint, ops stats, placeholders
│   ├── sanity/               # Sanity client factory + types
│   └── types/                # Shared domain types
├── sanity/                   # Sanity schema (helpArticle) for the Studio
├── tests/                    # Vitest suites (seam-injected fakes, no network)
├── utils/                    # Small pure helpers (slug, date, env, article parsing)
└── harvey.ai-design.md       # Design-system source of truth
```

## Tech Stack

- **Next.js 16** (App Router, Server Actions) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** + **shadcn/ui** (base-ui) — Harvey Legal Dark theme
- **Google Gemini** (`gemini-2.5-flash`) via `@google/genai`
- **Sanity CMS** via `@sanity/client` / `next-sanity` + GROQ
- **React Hook Form** + **Zod** for forms and AI-output validation
- **Vitest** for the test suite
- **sonner** for toasts, **lucide-react** for icons

## Setup

### 1. Install

```bash
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in the values (see the table below):

- `GEMINI_API_KEY` — create one at [Google AI Studio](https://aistudio.google.com/apikey).
- Sanity variables — see the next step.

### 3. Create the Sanity project

1. Sign up / log in at [sanity.io/manage](https://www.sanity.io/manage) and create a new project with a `production` dataset.
2. Copy the **project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Create an API token with **Editor** permissions (Project → API → Tokens) and set it as `SANITY_API_TOKEN`.
4. Add the document schema to your Sanity Studio: this repo exports it from `sanity/index.ts` —

   ```ts
   import { schemaTypes } from "./sanity"; // → schema: { types: schemaTypes }
   ```

   The single document type is `helpArticle` (title, slug, summary, article, faqs, quiz, educationalMetadata, governance, publishedAt). If you prefer, create a fresh Studio with `pnpm create sanity@latest` and paste in `sanity/schemas/help-article.ts`. Documents published before the educational metadata and governance fields existed still render — the new fields are optional on read.

### 4. Run

```bash
pnpm dev          # start the app at http://localhost:3000
pnpm test         # run the Vitest suite
pnpm lint         # ESLint
pnpm build        # production build
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Google Gemini API key used by both agents (server-side only). |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID for reads and writes. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset name (default `production`). |
| `SANITY_API_TOKEN` | Yes (for publishing) | Server-side write token with Editor role. Never expose with `NEXT_PUBLIC_`. |

Missing configuration is detected at first use and surfaced as a clear, human-readable error instead of a crash.

## Future Improvements

- **Claude / OpenAI support** — the `generateWithGemini` boundary makes adding alternative providers a one-module change
- **Multi-agent orchestration** — specialized agents (structure, tone, fact-check) coordinated over the same bundle contract
- **ElevenLabs narration** — audio versions of published articles
- **Skilljar LMS integration** — push quizzes and articles into formal course flows
- **AI content governance** — policy checks and audit trails on generated content before publication
- **Content freshness monitoring** — flag published articles whose source documentation has changed
- **Scheduled review agents** — periodic re-review of the live catalog for accuracy and tone drift
- **Semantic search** — embedding-based Help Center search beyond keyword matching
- **Version-aware documentation updates** — regenerate only the sections affected by a doc change
- **Analytics dashboard** — article views, search misses, quiz pass rates
- **Human approval workflows** — multi-reviewer sign-off gates between review and publish
