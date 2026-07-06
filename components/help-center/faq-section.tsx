import type { Faq } from "@/lib/types";

interface FaqSectionProps {
  faqs: Faq[];
}

/** Frequently asked questions for a published article. */
export function FaqSection({ faqs }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="grid gap-6">
      <h2 id="faq-heading" className="font-serif text-2xl tracking-tight">
        Frequently asked questions
      </h2>
      <dl className="grid gap-6">
        {faqs.map((faq) => (
          <div key={faq.question} className="grid gap-1.5">
            <dt className="font-medium">{faq.question}</dt>
            <dd className="leading-relaxed text-muted-foreground">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
