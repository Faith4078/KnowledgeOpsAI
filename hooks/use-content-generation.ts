"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { generateContent } from "@/actions/generate-content";
import { reviewContent } from "@/actions/review-content";
import type { ContentBundle, PipelineStage } from "@/lib/types";

export interface ContentGeneration {
  /** The reviewed, publish-ready bundle. Null until a run completes. */
  bundle: ContentBundle | null;
  /** Which pipeline stage the current run is in. */
  stage: PipelineStage;
  /** When `stage` is "error", the stage that failed. Null otherwise. */
  failedStage: "generating" | "reviewing" | null;
  /** True while either AI call is in flight. */
  isGenerating: boolean;
  /** Kick off a full run: Generator Agent, then Review Agent. */
  generate: (documentation: string) => void;
}

/**
 * Client-side orchestration of the content pipeline: exactly two
 * sequential AI calls per run (generate → review), with stage tracking
 * for the Agent Timeline and success/error toasts. A review failure
 * fails the run — the unreviewed draft is never presented as final.
 */
export function useContentGeneration(): ContentGeneration {
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [failedStage, setFailedStage] = useState<
    "generating" | "reviewing" | null
  >(null);
  const [, startTransition] = useTransition();

  const generate = (documentation: string) => {
    setBundle(null);
    setFailedStage(null);
    setStage("generating");
    startTransition(async () => {
      const generated = await generateContent(documentation);
      if (generated.status === "error") {
        setFailedStage("generating");
        setStage("error");
        toast.error(generated.message);
        return;
      }

      setStage("reviewing");
      const reviewed = await reviewContent(generated.bundle);
      if (reviewed.status === "error") {
        setFailedStage("reviewing");
        setStage("error");
        toast.error(reviewed.message);
        return;
      }

      setBundle(reviewed.bundle);
      setStage("done");
      toast.success("Content bundle generated and reviewed.");
    });
  };

  return {
    bundle,
    stage,
    failedStage,
    isGenerating: stage === "generating" || stage === "reviewing",
    generate,
  };
}
