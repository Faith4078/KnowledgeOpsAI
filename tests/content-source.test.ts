import { describe, expect, it } from "vitest";

import {
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE_BYTES,
  loadDocumentationFromFile,
  loadDocumentationFromText,
} from "@/lib/content-source";

/** Content-source normalization: every input path yields one trimmed string. */

describe("loadDocumentationFromText", () => {
  it("normalizes pasted text by trimming surrounding whitespace", () => {
    const result = loadDocumentationFromText("  # Widgets\n\nDocs here.  \n");

    expect(result).toEqual({
      ok: true,
      documentation: "# Widgets\n\nDocs here.",
    });
  });

  it("rejects empty and whitespace-only text", () => {
    for (const input of ["", "   \n\t  "]) {
      const result = loadDocumentationFromText(input);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("loadDocumentationFromFile", () => {
  it("extracts text from a .md file", async () => {
    const file = new File(["# Hello\n\nMarkdown body.\n"], "guide.md", {
      type: "text/markdown",
    });

    const result = await loadDocumentationFromFile(file);

    expect(result).toEqual({
      ok: true,
      documentation: "# Hello\n\nMarkdown body.",
    });
  });

  it("extracts text from a .txt file (case-insensitive extension)", async () => {
    const file = new File(["Plain text docs."], "NOTES.TXT", {
      type: "text/plain",
    });

    const result = await loadDocumentationFromFile(file);

    expect(result).toEqual({ ok: true, documentation: "Plain text docs." });
  });

  it("fails validation for an empty file", async () => {
    const file = new File([" \n "], "empty.md");

    const result = await loadDocumentationFromFile(file);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/empty/i);
    }
  });

  it("rejects unsupported extensions and names the accepted formats", async () => {
    for (const name of ["doc.pdf", "archive.zip", "no-extension"]) {
      const result = await loadDocumentationFromFile(new File(["x"], name));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain(".md");
        expect(result.error).toContain(".txt");
      }
    }
  });

  it("rejects files over the size limit", async () => {
    const oversized = new File(
      ["a".repeat(MAX_FILE_SIZE_BYTES + 1)],
      "huge.txt",
    );

    const result = await loadDocumentationFromFile(oversized);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/too large/i);
    }
  });
});

describe("ACCEPTED_EXTENSIONS", () => {
  it("advertises .md and .txt", () => {
    expect(ACCEPTED_EXTENSIONS).toEqual(expect.arrayContaining([".md", ".txt"]));
  });
});
