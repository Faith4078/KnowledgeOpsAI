const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** Formats an ISO datetime as e.g. "July 6, 2026"; falls back to the raw string. */
export function formatPublishedDate(iso: string): string {
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return iso;
  return DATE_FORMATTER.format(new Date(timestamp));
}
