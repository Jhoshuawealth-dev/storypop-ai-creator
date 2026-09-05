import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellOff, CalendarClock, CheckCheck, Clapperboard, CreditCard, Lightbulb, Send } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: pageHead("Notifications", "Updates on your videos, posts and plan."),
  component: Notifications,
});

const typeIcons: Record<NotificationType, typeof Clapperboard> = {
  video: Clapperboard,
  publish: Send,
  schedule: CalendarClock,
  subscription: CreditCard,
  tip: Lightbulb,
};

function Notifications() {
  const { notifications: items, markNotificationsRead } = useApp();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const visible = tab === "all" ? items : items.filter((n) => !n.read);

  return (
    <AppShell
      title="Notifications"
      showBack
      backTo="/home"
      right={
        <button
          aria-label="Mark all as read"
          onClick={markNotificationsRead}
          className="text-primary"
        >
          <CheckCheck className="h-5 w-5" />
        </button>
      }
    >
      {/* Tabs */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
        {(["all", "unread"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-9 rounded-full text-sm font-bold capitalize transition-all",
              tab === t ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications"
          description="You're all caught up. New video and publishing updates will appear here."
          actionLabel="Create UGC"
          actionTo="/create"
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((n) => {
            const Icon = typeIcons[n.type] ?? Lightbulb;
            return (
              <li key={n.id}>
                <div
                  className={cn(
                    "flex w-full items-start gap-3.5 rounded-2xl p-4 text-left shadow-card transition-all active:scale-[0.99]",
                    n.read ? "bg-card" : "bg-primary-soft"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      n.read ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-bold text-foreground">{n.title}</span>
                      <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{n.time}</span>
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{n.body}</span>
                  </span>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
