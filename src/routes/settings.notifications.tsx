import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/notifications")({
  head: pageHead("Notification Settings", "Choose what Storypop AI notifies you about."),
  component: NotificationSettings,
});

const groups = [
  {
    title: "Push notifications",
    items: [
      ["video-ready", "Video ready", "When a generation finishes"],
      ["publish", "Publishing updates", "Success or failure on connected platforms"],
      ["schedule", "Scheduled reminders", "1 hour before a scheduled post"],
    ],
  },
  {
    title: "Email",
    items: [
      ["weekly", "Weekly performance digest", "Views, engagement and top videos"],
      ["billing", "Billing & receipts", "Renewals, invoices and plan changes"],
      ["tips", "Creator tips", "Trends and prompt ideas"],
    ],
  },
] as const;

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
        on ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-card shadow-card transition-all duration-200",
          on ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

function NotificationSettings() {
  const [state, setState] = useState<Record<string, boolean>>({
    "video-ready": true,
    publish: true,
    schedule: true,
    weekly: true,
    billing: true,
    tips: false,
  });

  return (
    <AppShell title="Notifications" showBack backTo="/profile">
      {groups.map((group) => (
        <div key={group.title}>
          <SectionHeader title={group.title} />
          <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
            {group.items.map(([id, label, description]) => (
              <div key={id} className="flex items-center gap-3.5 px-4 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Toggle
                  label={label}
                  on={Boolean(state[id])}
                  onToggle={() => setState((prev) => ({ ...prev, [id]: !prev[id] }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
