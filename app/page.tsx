import { fetchKnowledgeOpsStats } from "@/actions/fetch-stats";
import { PipelineWorkspace } from "@/components/agents/pipeline-workspace";
import { ArchitecturePanel } from "@/components/dashboard/architecture-panel";
import { KnowledgeOpsDashboard } from "@/components/dashboard/knowledge-ops-dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";

// Fetch at request time so the dashboard reflects the latest publishes.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await fetchKnowledgeOpsStats();

  return (
    <DashboardShell>
      <div className="grid gap-12">
        <div className="grid max-w-3xl gap-4">
          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl">
            AI-powered Customer Education Operations
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Transform product documentation into governed, reviewable,
            publish-ready knowledge assets using AI agents and automated
            publishing workflows.
          </p>
        </div>
        <KnowledgeOpsDashboard
          stats={result.status === "success" ? result.stats : null}
          errorMessage={
            result.status === "error" ? result.message : undefined
          }
        />
        <PipelineWorkspace />
        <ArchitecturePanel />
      </div>
    </DashboardShell>
  );
}
