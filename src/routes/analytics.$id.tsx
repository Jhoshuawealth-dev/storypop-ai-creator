import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { AreaChart, DonutStat, RetentionBars } from "@/components/ui/charts";
import { pageHead } from "@/lib/seo";
import { analyticsSeries, formatDuration, projects, retentionSeries } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics/$id")({
  head: pageHead("Video Analytics", "Detailed performance for this video."),
  component: VideoAnalytics,
});

function VideoAnalytics() {
  const { id } = Route.useParams();
  const project = projects.find((p) => p.id === id) ?? projects[0]!;

  return (
    <AppShell title="Video Analytics" showBack backTo="/analytics">
      <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card">
        <img src={project.thumb} alt={project.title} className="h-16 w-14 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{project.title}</p>
          <p className="text-xs text-muted-foreground">
            {formatDuration(project.durationSeconds)} · {project.platform ?? "TikTok"}
          </p>
        </div>
      </div>

      <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Views</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-foreground">42.1K</p>
        <AreaChart data={analyticsSeries.map((d) => d.views)} className="mt-3" />
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ["Watch time", "3h 12m"],
          ["Avg. view", "0:19"],
          ["Likes", "4,180"],
          ["Comments", "412"],
          ["Shares", "986"],
          ["Saves", "1,204"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="font-display text-xl font-extrabold text-foreground">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
        <p className="text-sm font-bold text-foreground">Audience retention</p>
        <RetentionBars data={retentionSeries} className="mt-3" />
        <div className="mt-3 flex justify-between text-[11px] font-semibold text-muted-foreground">
          <span>0s</span>
          <span>{formatDuration(project.durationSeconds)}</span>
        </div>
      </section>

      <section className="mt-4 rounded-3xl bg-card p-5 shadow-card">
        <DonutStat value={0.63} label="Completion rate" />
      </section>
    </AppShell>
  );
}
