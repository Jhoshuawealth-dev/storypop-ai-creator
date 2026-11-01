import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/calendar/publishing")({
  head: pageHead("Publishing Status", "Track posts that are queued for publishing."),
  component: PublishingStatus,
});

function PublishingStatus() {
  const { posts } = useApp();
  const queued = posts.filter((p) => p.status === "scheduled");

  return (
    <FlowShell title="Publishing Status" backTo="/calendar">
      {queued.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nothing is publishing"
          description="Scheduled posts will appear here. Direct publishing starts once your social accounts are linked to a live service."
          actionLabel="Schedule a post"
          actionTo="/calendar/schedule"
          className="mt-10"
        />
      ) : (
        <div className="mt-5 space-y-3">
          {queued.map((p) => (
            <div key={p.id} className="rounded-2xl bg-card p-4 shadow-card">
              <p className="truncate font-bold text-foreground">{p.title || "Untitled post"}</p>
              <p className="text-xs text-muted-foreground">
                {p.platform} · {p.date} {p.time} · Waiting to publish
              </p>
            </div>
          ))}
        </div>
      )}
    </FlowShell>
  );
}
