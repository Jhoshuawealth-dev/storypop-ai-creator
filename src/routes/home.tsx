import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CalendarClock, ChevronRight, Clapperboard, Plus, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { EmptyState, SectionHeader, StatusBadge } from "@/components/ui/feedback";
import { Avatar, Thumb } from "@/components/ui/avatar";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/catalog";

export const Route = createFileRoute("/home")({
  head: pageHead("Home", "Your Storypop AI creator dashboard."),
  component: Home,
});

function Home() {
  const { user, minutesTotal, minutesUsed, projects, posts, notifications } = useApp();
  const remaining = Math.max(0, minutesTotal - minutesUsed);
  const recent = projects.slice(0, 3);
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const published = posts.filter((p) => p.status === "published").length;
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <AppShell>
      {/* Greeting */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/profile" className="shrink-0">
            <Avatar
              src={user.avatar || undefined}
              name={user.fullName || user.name}
              className="h-11 w-11 rounded-full ring-2 ring-primary-light"
            />
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">Good morning,</p>
            <h1 className="truncate font-display text-xl font-extrabold tracking-tight text-foreground">
              {user.name || "Creator"} 👋
            </h1>
          </div>
        </div>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card shadow-card"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {hasUnread && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />}
        </Link>
      </div>

      {/* Usage card */}
      <Link to="/usage" className="mt-6 block">
        <div className="flex items-center gap-5 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
          <ProgressRing value={minutesTotal ? remaining / minutesTotal : 0} size={92} stroke={9}>
            <span className="font-display text-sm font-extrabold text-primary-deep">{formatDuration(remaining)}</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-light">Video Minutes</p>
            <p className="mt-1 font-display text-2xl font-extrabold">{formatDuration(remaining)} remaining</p>
            <p className="mt-0.5 text-xs text-primary-light/80">of {formatDuration(minutesTotal)} this cycle</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-primary-light" />
        </div>
      </Link>

      <Link to="/create" className="mt-4 block">
        <Button size="lg" fullWidth>
          <Plus className="h-5 w-5" strokeWidth={2.5} /> Create UGC
        </Button>
      </Link>

      {/* Quick stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { icon: Clapperboard, value: String(projects.length), label: "Videos created" },
          { icon: CalendarClock, value: String(scheduled), label: "Scheduled" },
          { icon: Send, value: String(published), label: "Published" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-3.5 text-center shadow-card">
            <s.icon className="mx-auto h-5 w-5 text-primary" strokeWidth={1.8} />
            <p className="mt-1.5 font-display text-lg font-extrabold text-foreground">{s.value}</p>
            <p className="text-[11px] font-semibold leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <SectionHeader
        title="Recent Projects"
        action={
          <Link to="/projects" className="text-sm font-bold text-primary">
            See all
          </Link>
        }
      />
      {recent.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No projects yet"
          description="Your videos will appear here once you create your first UGC video."
          actionLabel="Create UGC"
          actionTo="/create"
        />
      ) : (
      <div className="space-y-3">
        {recent.map((p) => (
          <Link
            key={p.id}
            to="/projects/$id"
            params={{ id: p.id }}
            className="flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card transition-transform active:scale-[0.98]"
          >
            <Thumb src={p.thumb} alt={p.title} className="h-16 w-14 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground">{p.title}</p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {formatDuration(p.durationSeconds)} · {p.createdAt}
              </p>
              <div className="mt-1.5">
                <StatusBadge status={p.status} />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
      )}

      {/* AI tip */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-dashed border-primary-light bg-primary-soft/60 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-secondary-foreground">
          <span className="font-bold">Creator tip:</span> videos with a strong first 3 seconds keep 40% more viewers.
        </p>
      </div>
    </AppShell>
  );
}
