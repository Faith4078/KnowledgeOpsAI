"use client";

import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCEPTED_EXTENSIONS,
  loadDocumentationFromFile,
  loadDocumentationFromText,
} from "@/lib/content-source";
import { cn } from "@/lib/utils";

const documentationFormSchema = z.object({
  documentation: z
    .string()
    .trim()
    .min(1, "Paste some documentation to get started."),
});

type DocumentationFormValues = z.infer<typeof documentationFormSchema>;

type InputMode = "paste" | "upload";

interface DocumentationFormProps {
  isGenerating: boolean;
  onSubmitDocumentation: (documentation: string) => void;
}

const MODES: { value: InputMode; label: string }[] = [
  { value: "paste", label: "Paste text" },
  { value: "upload", label: "Upload file" },
];

/**
 * Documentation entry card: operators either paste text or upload a
 * .md/.txt file. Both paths are normalized through the content-source
 * abstraction (lib/content-source) into a single documentation string
 * handed to `onSubmitDocumentation`.
 */
export function DocumentationForm({
  isGenerating,
  onSubmitDocumentation,
}: DocumentationFormProps) {
  const [mode, setMode] = useState<InputMode>("paste");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  const form = useForm<DocumentationFormValues>({
    resolver: zodResolver(documentationFormSchema),
    defaultValues: { documentation: "" },
  });

  const pasteError = form.formState.errors.documentation;

  const submitPasted = form.handleSubmit((values) => {
    const result = loadDocumentationFromText(values.documentation);
    if (result.ok) {
      onSubmitDocumentation(result.documentation);
    }
  });

  async function handleFileSubmit() {
    const file = fileInputRef.current?.files?.[0];
    if (file === undefined) {
      setFileError("Choose a .md or .txt file to upload.");
      return;
    }
    const result = await loadDocumentationFromFile(file);
    if (!result.ok) {
      setFileError(result.error);
      return;
    }
    setFileError(null);
    onSubmitDocumentation(result.documentation);
  }

  return (
    <Card>
      <form
        onSubmit={(event) => {
          if (mode === "paste") {
            void submitPasted(event);
          } else {
            event.preventDefault();
            void handleFileSubmit();
          }
        }}
        noValidate
      >
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-normal tracking-tight">
            Add documentation
          </CardTitle>
          <CardDescription>
            The Generator Agent turns raw product documentation into a help
            article, FAQs, and a knowledge-check quiz in one pass. Paste text
            or upload a Markdown/plain-text file.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6">
          <div
            role="tablist"
            aria-label="Documentation source"
            className="inline-flex w-fit gap-1 rounded-md border border-border p-1"
          >
            {MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                id={`${baseId}-tab-${option.value}`}
                aria-selected={mode === option.value}
                aria-controls={`${baseId}-panel-${option.value}`}
                disabled={isGenerating}
                onClick={() => setMode(option.value)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-sm transition-colors",
                  mode === option.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {mode === "paste" && (
            <div
              role="tabpanel"
              id={`${baseId}-panel-paste`}
              aria-labelledby={`${baseId}-tab-paste`}
              className="grid gap-2"
            >
              <Label htmlFor="documentation">Documentation</Label>
              <Textarea
                id="documentation"
                rows={12}
                placeholder="Paste Markdown or plain-text documentation here…"
                aria-invalid={pasteError !== undefined}
                aria-describedby={
                  pasteError !== undefined ? "documentation-error" : undefined
                }
                disabled={isGenerating}
                className="min-h-56 resize-y font-mono text-sm"
                {...form.register("documentation")}
              />
              {pasteError !== undefined && (
                <p
                  id="documentation-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {pasteError.message}
                </p>
              )}
            </div>
          )}

          {mode === "upload" && (
            <div
              role="tabpanel"
              id={`${baseId}-panel-upload`}
              aria-labelledby={`${baseId}-tab-upload`}
              className="grid gap-2"
            >
              <Label htmlFor={`${baseId}-file`}>
                Documentation file ({ACCEPTED_EXTENSIONS.join(", ")})
              </Label>
              <input
                ref={fileInputRef}
                id={`${baseId}-file`}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                disabled={isGenerating}
                aria-invalid={fileError !== null}
                aria-describedby={
                  fileError !== null ? `${baseId}-file-error` : undefined
                }
                onChange={(event) => {
                  setFileError(null);
                  setFileName(event.target.files?.[0]?.name ?? null);
                }}
                className="cursor-pointer rounded-md border border-dashed border-border bg-transparent p-6 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
              />
              {fileName !== null && fileError === null && (
                <p className="text-sm text-muted-foreground">
                  Selected: {fileName}
                </p>
              )}
              {fileError !== null && (
                <p
                  id={`${baseId}-file-error`}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {fileError}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-6">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating…" : "Generate content"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
