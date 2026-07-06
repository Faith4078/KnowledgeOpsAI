import type { Metadata } from "next";

import { fetchArticles } from "@/actions/fetch-articles";
import { ArticleSearch } from "@/components/help-center/article-search";
import { ConfigNotice } from "@/components/help-center/config-notice";
import { DashboardShell } from "@/components/layout/dashboard-shell";

// Fetch at request time so newly published articles appear automatically.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Help Center — KnowledgeOps AI",
  description: "Searchable help articles published by the content pipeline.",
};

export default async function HelpCenterPage() {
  const result = await fetchArticles();

  return (
    <DashboardShell active="help-center">
      <div className="grid gap-12">
        <div className="grid max-w-3xl gap-4">
          <h1 className="font-serif text-5xl font-normal leading-tight tracking-tight">
            Help Center
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Guides, FAQs, and knowledge checks published straight from the
            content pipeline.
          </p>
        </div>
        {result.status === "error" ? (
          <ConfigNotice message={result.message} />
        ) : (
          <ArticleSearch articles={result.articles} />
        )}
      </div>
    </DashboardShell>
  );
}
