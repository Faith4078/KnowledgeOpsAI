/**
 * Content-source abstraction: every documentation input (pasted text,
 * uploaded file, …) is normalized to a single trimmed string before it
 * reaches the generation pipeline.
 *
 * EXTENSION POINT: to support a new file format (e.g. PDF), implement a
 * `FileContentExtractor` and add it to `FILE_EXTRACTORS`. Nothing else in
 * the upload flow needs to change — the form keeps calling
 * `loadDocumentationFromFile`, which routes by extension.
 */

export type ContentSourceResult =
  | { ok: true; documentation: string }
  | { ok: false; error: string };

/** Extracts normalized documentation text from one family of file types. */
export interface FileContentExtractor {
  /** Lowercase extensions this extractor handles, including the dot. */
  extensions: readonly string[];
  /** Reads the file and returns its raw text content. */
  extract: (file: File) => Promise<string>;
}

/** Maximum accepted upload size: 1 MB of text is far beyond any real doc. */
export const MAX_FILE_SIZE_BYTES = 1_000_000;

const plainTextExtractor: FileContentExtractor = {
  extensions: [".md", ".txt"],
  extract: (file) => file.text(),
};

/** Registry of file extractors. Add a PDF extractor here to support .pdf. */
const FILE_EXTRACTORS: readonly FileContentExtractor[] = [plainTextExtractor];

/** All extensions currently accepted, e.g. for the file input's `accept`. */
export const ACCEPTED_EXTENSIONS: readonly string[] = FILE_EXTRACTORS.flatMap(
  (extractor) => extractor.extensions,
);

const ACCEPTED_LIST = ACCEPTED_EXTENSIONS.join(", ");

const EMPTY_MESSAGE =
  "That looks empty. Add some documentation text before generating content.";

function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
}

function normalize(raw: string): ContentSourceResult {
  const documentation = raw.trim();
  if (documentation.length === 0) {
    return { ok: false, error: EMPTY_MESSAGE };
  }
  return { ok: true, documentation };
}

/** Content source: pasted text. */
export function loadDocumentationFromText(text: string): ContentSourceResult {
  return normalize(text);
}

/** Content source: uploaded file (.md / .txt today; see extension point above). */
export async function loadDocumentationFromFile(
  file: File,
): Promise<ContentSourceResult> {
  const extension = extensionOf(file.name);
  const extractor = FILE_EXTRACTORS.find((candidate) =>
    candidate.extensions.includes(extension),
  );

  if (extractor === undefined) {
    return {
      ok: false,
      error: `Unsupported file type. Accepted formats: ${ACCEPTED_LIST}.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: "That file is too large. Please keep uploads under 1 MB of text.",
    };
  }

  try {
    return normalize(await extractor.extract(file));
  } catch {
    return {
      ok: false,
      error: "We couldn't read that file. Please try again or paste the text.",
    };
  }
}
