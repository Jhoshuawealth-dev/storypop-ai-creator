import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Thumb } from "@/components/ui/avatar";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/catalog";

export const Route = createFileRoute("/analytics/$id")({
  head: pageHead("Video Analytics", "Review available performance data for a Storypop video."),
  component: VideoAnalytics,
});

function VideoAnalytics() {
  const { id } = Route.useParams();
  const { projects, posts } = useApp();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <AppShell title="Video Analytics" showBack backTo="/analytics">
        <ErrorState
          title="Video not found"
          description="This video may have been removed from your projects."
          secondaryLabel="Back to analytics"
          secondaryTo="/analytics"
        />
      </AppShell>
    );
  }

  const relatedPosts = posts.filter((post) => post.title === project.title);
  const metrics = [
    ["Views", "—"],
    ["Watch time", "—"],
    ["Likes", "—"],
    ["Comments", "—"],
    ["Shares", "—"],
    ["Saves", "—"],
  ];

  return (
    <AppShell title="Video Analytics" showBack backTo="/analytics">
      <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card">
        <Thumb src={project.thumb} alt={project.title} className="h-16 w-14 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{project.title}</p>
          <p className="text-xs text-muted-foreground">{formatDuration(project.durationSeconds)}</p>
        </div>
      </div>

      {relatedPosts.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Performance data isn’t available yet"
          description="Metrics will appear here when a connected platform provides them."
        />
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="font-bold text-foreground">Published platforms</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {relatedPosts.map((post) => post.platform).join(" · ")}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
                <p className="font-display text-xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}