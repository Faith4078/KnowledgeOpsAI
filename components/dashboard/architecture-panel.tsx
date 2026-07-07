const PIPELINE_STAGES = [
  {
    name: "Documentation Intake",
    responsibility:
      "Accepts raw product documentation as the input to the publishing workflow.",
  },
  {
    name: "Generator Agent",
    responsibility:
      "Drafts the complete knowledge asset — article, FAQs, knowledge check, and educational metadata — in a single AI call.",
  },
  {
    name: "AI Review",
    responsibility:
      "Improves clarity, structure, and quiz quality, and produces the Quality Assurance Report in the same call.",
  },
  {
    name: "Publishing",
    responsibility:
      "Validates the reviewed asset, normalizes its slug, and writes it with its governance record to the knowledge base.",
  },
  {
    name: "Knowledge Base",
    responsibility:
      "Serves published assets in the Help Center with learning objectives, difficulty, and governance visible.",
  },
] as const;

/**
 * Static panel describing each automation pipeline stage's
 * responsibility — orientation for new team members.
 */
export function ArchitecturePanel() {
  return (
    <section
      aria-label="Automation architecture"
      className="rounded-lg border bg-card p-6"
    >
      <h2 className="mb-5 font-serif text-lg font-normal tracking-tight">
        How the automation works
      </h2>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {PIPELINE_STAGES.map((stage, index) => (
          <li key={stage.name} className="grid content-start gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Stage {index + 1}
            </span>
            <h3 className="text-sm font-medium">{stage.name}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {stage.responsibility}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
