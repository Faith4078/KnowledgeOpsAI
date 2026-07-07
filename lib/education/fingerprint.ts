/**
 * Stable short label identifying the source documentation a Knowledge
 * Asset was generated from — recorded as the governance field
 * "documentationVersion". FNV-1a over the trimmed text: not
 * cryptographic, just a deterministic fingerprint.
 */
export function fingerprintDocumentation(documentation: string): string {
  const normalized = documentation.trim();
  let hash = 0x811c9dc5;
  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `doc-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}
