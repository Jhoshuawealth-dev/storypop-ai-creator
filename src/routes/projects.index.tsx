import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Clapperboard } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, StatusBadge } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/catalog";
import { Thumb } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/projects/")({
  head: pageHead("Projects", "All your AI-generated UGC video projects."),
  component: Projects,
});

const tabs = ["All", "Drafts", "Completed"] as const;

function Projects() {
  const { projects } = useApp();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const visible = projects.filter((p) => {
    if (tab === "All") return true;
    if (tab === "Drafts") return p.status === "draft";
    return p.status === "completed" || p.status === "published";
  });

  return (
    <AppShell title="Projects">
      <div className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-9 rounded-full text-sm font-bold transition-all",
              tab === t ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No videos yet"
          description="Create your first AI-powered UGC video and it will show up here."
          actionLabel="Create UGC"
          actionTo="/create"
        />
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((p) => (
            <Link
              key={p.id}
              to="/projects/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card transition-transform active:scale-[0.98]"
            >
              <Thumb src={p.thumb} alt={p.title} className="h-20 w-16 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{p.title}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {formatDuration(p.durationSeconds)} · {p.createdAt}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  {p.platform && <span className="text-[11px] font-semibold text-muted-foreground">{p.platform}</span>}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
