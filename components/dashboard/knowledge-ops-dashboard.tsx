import type { KnowledgeOpsStats } from "@/lib/education/stats";
import { formatPublishedDate } from "@/utils/date";

interface StatTile {
  label: string;
  value: string;
  /** Marks figures not yet computed from live data. */
  note?: string;
}

function buildTiles(stats: KnowledgeOpsStats | null): StatTile[] {
  return [
    {
      label: "Published assets",
      value: stats === null ? "—" : String(stats.publishedCount),
    },
    {
      label: "Draft assets",
      value: stats === null ? "—" : String(stats.draftAssets),
      note: "estimate",
    },
    {
      label: "Pending review",
      value: stats === null ? "—" : String(stats.pendingReview),
      note: "estimate",
    },
    {
      label: "Avg review score",
      value:
        stats?.averageReviewScore == null
          ? "—"
          : `${stats.averageReviewScore} / 100`,
    },
    {
      label: "Avg processing time",
      value: stats === null ? "—" : `${stats.averageProcessingSeconds}s`,
      note: "estimate",
    },
    {
      label: "Knowledge base health",
      value: stats === null ? "—" : stats.knowledgeBaseHealth,
    },
    {
      label: "Last published",
      value:
        stats?.lastPublishedAt == null
          ? "—"
          : formatPublishedDate(stats.lastPublishedAt),
    },
  ];
}

interface KnowledgeOpsDashboardProps {
  /** Null when live stats could not be loaded (e.g. Sanity unconfigured). */
  stats: KnowledgeOpsStats | null;
  /** Shown when live stats are unavailable. */
  errorMessage?: string;
}

/**
 * Compact Knowledge Operations Dashboard: the state of the knowledge
 * base at a glance. Live figures where computable; the rest are
 * clearly-marked estimates from the placeholder module.
 */
export function KnowledgeOpsDashboard({
  stats,
  errorMessage,
}: KnowledgeOpsDashboardProps) {
  const tiles = buildTiles(stats);

  return (
    <section
      aria-label="Knowledge operations dashboard"
      className="rounded-lg border bg-card p-6"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-lg font-normal tracking-tight">
          Knowledge Operations
        </h2>
        {stats === null && errorMessage !== undefined && (
          <p className="text-xs text-muted-foreground">{errorMessage}</p>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-7 lg:gap-x-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="grid content-start gap-1">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {tile.label}
            </dt>
            <dd className="font-serif text-2xl font-normal tracking-tight">
              {tile.value}
            </dd>
            {tile.note !== undefined && (
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                {tile.note}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
