import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function ArticleNotFound() {
  return (
    <DashboardShell active="help-center">
      <div className="grid max-w-2xl gap-4">
        <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight">
          Article not found
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/help-center"
          className="w-fit rounded-sm text-sm font-medium underline underline-offset-4 outline-none transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Browse all Help Center articles
        </Link>
      </div>
    </DashboardShell>
  );
}
