import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchArticleBySlug } from "@/actions/fetch-articles";
import { ArticleBody } from "@/components/help-center/article-body";
import { ConfigNotice } from "@/components/help-center/config-notice";
import { FaqSection } from "@/components/help-center/faq-section";
import { QuizSection } from "@/components/help-center/quiz-section";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { formatPublishedDate } from "@/utils/date";

// Fetch at request time so edits and new publishes appear automatically.
export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const result = await fetchArticleBySlug(slug);

  if (result.status === "error") {
    return (
      <DashboardShell active="help-center">
        <ConfigNotice message={result.message} />
      </DashboardShell>
    );
  }

  if (result.article === null) {
    notFound();
  }

  const article = result.article;

  return (
    <DashboardShell active="help-center">
      <article className="mx-auto grid w-full max-w-3xl gap-12">
        <header className="grid gap-4">
          <Link
            href="/help-center"
            className="w-fit rounded-sm text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            &larr; Back to Help Center
          </Link>
          <h1 className="font-serif text-3xl font-normal leading-tight tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Published {formatPublishedDate(article.publishedAt)}
          </p>
        </header>
        <ArticleBody article={article.article} />
        <FaqSection faqs={article.faqs} />
        <QuizSection quiz={article.quiz} />
      </article>
    </DashboardShell>
  );
}
