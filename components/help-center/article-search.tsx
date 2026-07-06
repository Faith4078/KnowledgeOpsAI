"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { HelpArticleSummary } from "@/lib/types";
import { formatPublishedDate } from "@/utils/date";

interface ArticleSearchProps {
  articles: HelpArticleSummary[];
}

/**
 * Client-side keyword search over the server-fetched article summaries.
 * Filters by title and summary, case-insensitively.
 */
export function ArticleSearch({ articles }: ArticleSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === "") return articles;
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(needle) ||
        article.summary.toLowerCase().includes(needle),
    );
  }, [articles, query]);

  return (
    <div className="grid gap-8">
      <div className="grid max-w-xl gap-2">
        <Label htmlFor="article-search">Search articles</Label>
        <input
          id="article-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or summary…"
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">
          No articles yet. Publish one from the dashboard to see it here.
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">
          No articles match &ldquo;{query.trim()}&rdquo;. Try a different
          keyword.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/help-center/${article.slug}`}
                className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full transition-shadow group-hover:ring-foreground/25">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl tracking-tight">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 pt-1">
                    <p className="leading-relaxed text-muted-foreground">
                      {article.summary}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {formatPublishedDate(article.publishedAt)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
