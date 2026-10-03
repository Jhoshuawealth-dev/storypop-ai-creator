import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ChevronRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, SectionHeader } from "@/components/ui/feedback";
import { Thumb } from "@/components/ui/avatar";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/catalog";

export const Route = createFileRoute("/analytics/")({
  head: pageHead("Analytics", "Track performance across your Storypop videos."),
  component: Analytics,
});

function Analytics() {
  const { projects, posts } = useApp();
  const publishedPosts = posts.filter((post) => post.status === "published");
  const publishedProjects = projects.filter((project) => project.status === "published");
  const metrics = [
    ["Published posts", String(publishedPosts.length)],
    ["Videos published", String(publishedProjects.length)],
    ["Platforms", String(new Set(publishedPosts.map((post) => post.platform)).size)],
    ["Tracked views", "—"],
  ];

  return (
    <AppShell title="Analytics" showBack backTo="/profile">
      <section className="mt-5 grid grid-cols-2 gap-3" aria-label="Account analytics summary">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <Link
        to="/analytics/insights"
        className="mt-4 flex items-center gap-3 rounded-2xl bg-primary-deep p-4 text-primary-foreground shadow-fab"
      >
        <Sparkles className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">AI Insights</span>
          <span className="block text-xs text-primary-light">Insights become available as your content earns data</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary-light" />
      </Link>

      <SectionHeader title="Published content" />
      {publishedProjects.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Publish your first video to start building a performance history."
          actionLabel="Create Video"
          actionTo="/create"
        />
      ) : (
        <div className="space-y-3">
          {publishedProjects.map((project) => {
            const projectPosts = publishedPosts.filter((post) => post.title === project.title);
            const platforms = projectPosts.map((post) => post.platform);
            return (
              <Link
                key={project.id}
                to="/analytics/$id"
                params={{ id: project.id }}
                className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card"
              >
                <Thumb src={project.thumb} alt={project.title} className="h-16 w-14 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{project.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(project.durationSeconds)}
                    {platforms.length > 0 ? ` · ${platforms.join(", ")}` : " · No platform data"}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}