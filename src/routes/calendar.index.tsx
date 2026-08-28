import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarPlus, CalendarX } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, StatusBadge } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { scheduledPosts } from "@/lib/mock-data";

export const Route = createFileRoute("/calendar/")({
  head: pageHead("Content Calendar", "Plan, schedule and track your posts."),
  component: CalendarScreen,
});

const tabs = ["Drafts", "Scheduled", "Published"] as const;
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const scheduledDays = [12, 15, 18, 24];

function CalendarScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Scheduled");
  const visible = scheduledPosts.filter((p) => p.status === tab.toLowerCase().replace(/s$/, ""));

  return (
    <AppShell title="Calendar">
      {/* Month grid */}
      <section className="mt-4 rounded-3xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-extrabold text-foreground">May 2026</p>
          <Link to="/calendar/schedule" className="text-sm font-bold text-primary">
            Schedule
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
          {weekdays.map((d, i) => (
            <span key={i} className="py-1 text-[11px] font-bold text-muted-foreground">
              {d}
            </span>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const has = scheduledDays.includes(day);
            return (
              <span
                key={day}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-lg text-xs font-semibold",
                  has ? "bg-primary text-primary-foreground" : "text-foreground"
                )}
              >
                {day}
              </span>
            );
          })}
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
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
          icon={CalendarX}
          title={`No ${tab.toLowerCase()} yet`}
          description="Schedule a video and it will appear on your content calendar."
          actionLabel="Schedule a post"
          actionTo="/calendar/schedule"
        />
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((p) => (
            <Link
              key={p.id}
              to={p.status === "published" ? "/calendar/published" : "/calendar/publishing"}
              className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card transition-transform active:scale-[0.98]"
            >
              <img src={p.thumb} alt={p.title} className="h-16 w-14 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{p.title}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {p.platform} · {p.date} {p.time && `· ${p.time}`}
                </p>
                <div className="mt-1.5">
                  <StatusBadge status={p.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link to="/calendar/schedule" className="mt-5 block">
        <Button size="lg" fullWidth>
          <CalendarPlus className="h-4 w-4" /> Schedule Post
        </Button>
      </Link>
    </AppShell>
  );
}
