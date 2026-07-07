import { ArticleCard } from "@/components/agents/article-card";
import { BundleOverviewCard } from "@/components/agents/bundle-overview-card";
import { EducationalMetadataCard } from "@/components/agents/educational-metadata-card";
import { FaqCard } from "@/components/agents/faq-card";
import { QuizCard } from "@/components/agents/quiz-card";
import type { ContentBundle } from "@/lib/types";

interface ResultCardsProps {
  bundle: ContentBundle;
}

/** The Generator Agent's full output rendered as a stack of result cards. */
export function ResultCards({ bundle }: ResultCardsProps) {
  return (
    <section aria-label="Reviewed knowledge asset" className="grid gap-6">
      <BundleOverviewCard bundle={bundle} />
      <EducationalMetadataCard metadata={bundle.educationalMetadata} />
      <ArticleCard article={bundle.article} />
      <FaqCard faqs={bundle.faqs} />
      <QuizCard quiz={bundle.quiz} />
    </section>
  );
}
