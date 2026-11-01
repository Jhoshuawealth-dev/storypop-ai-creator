import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/calendar/published")({
  head: pageHead("Published Posts", "Posts you've published from Storypop AI."),
  component: PublishedPosts,
});

function PublishedPosts() {
  const { posts } = useApp();
  const published = posts.filter((p) => p.status === "published");

  return (
    <FlowShell title="Published Posts" backTo="/calendar">
      {published.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No published posts yet"
          description="Once a video goes live on your social accounts it will show up here with its results."
          actionLabel="Create a video"
          actionTo="/create"
          className="mt-10"
        />
      ) : (
        <div className="mt-5 space-y-3">
          {published.map((p) => (
            <div key={p.id} className="rounded-2xl bg-card p-4 shadow-card">
              <p className="truncate font-bold text-foreground">{p.title || "Untitled post"}</p>
              <p className="text-xs text-muted-foreground">{p.platform} · {p.date} {p.time}</p>
            </div>
          ))}
        </div>
      )}
    </FlowShell>
  );
}
