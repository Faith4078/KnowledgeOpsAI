import { PipelineWorkspace } from "@/components/agents/pipeline-workspace";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function HomePage() {
  return (
    <DashboardShell>
      <div className="grid gap-12">
        <div className="grid max-w-3xl gap-4">
          <h1 className="font-serif text-5xl font-normal leading-tight tracking-tight">
            Documentation, published as learning.
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Paste raw product documentation and the Generator and Review
            Agents turn it into a polished, publish-ready help article, FAQs,
            and knowledge-check quiz.
          </p>
        </div>
        <PipelineWorkspace />
      </div>
    </DashboardShell>
  );
}
