import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ChevronRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AreaChart } from "@/components/ui/charts";
import { EmptyState, SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { analyticsSeries, analyticsTotals, projects } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics/")({
  head: pageHead("Analytics", "Track views, engagement and growth."),
  component: Analytics,
});

const hasData = true;

function Analytics() {
  const published = projects.filter((p) => p.status === "published");

  return (
    <AppShell title="Analytics" showBack backTo="/profile">
      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No analytics yet"
          description="Publish your first video and performance data will show up here."
          actionLabel="Create UGC"
          actionTo="/create"
        />
      ) : (
        <>
          <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total views</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{analyticsTotals.views}</p>
            <p className="text-xs font-bold text-primary">+18% vs last month</p>
            <AreaChart data={analyticsSeries.map((d) => d.views)} className="mt-3" />
          </section>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Likes", analyticsTotals.likes],
              ["Comments", analyticsTotals.comments],
              ["Shares", analyticsTotals.shares],
              ["Followers gained", analyticsTotals.followers],
              ["Engagement", analyticsTotals.engagement],
              ["Watch time", analyticsTotals.watchTime],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
                <p className="font-display text-xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/analytics/insights"
            className="mt-4 flex items-center gap-3 rounded-2xl bg-primary-deep p-4 text-primary-foreground shadow-fab"
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block font-bold">AI Insights</span>
              <span className="block text-xs text-primary-light">See what's working and why</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-primary-light" />
          </Link>

          <SectionHeader title="Top videos" />
          <div className="space-y-3">
            {published.map((p) => (
              <Link
                key={p.id}
                to="/analytics/$id"
                params={{ id: p.id }}
                className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card"
              >
                <img src={p.thumb} alt={p.title} className="h-16 w-14 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.platform} · 42.1K views</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
