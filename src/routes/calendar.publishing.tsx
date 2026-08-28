import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { thumbSneaker } from "@/lib/mock-data";

export const Route = createFileRoute("/calendar/publishing")({
  head: pageHead("Publishing Status", "Track your post as it publishes."),
  component: PublishingStatus,
});

const stages = ["Preparing", "Uploading", "Editing", "Publishing", "Published"];

function PublishingStatus() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed || stage >= stages.length - 1) return;
    const t = setTimeout(() => setStage((s) => s + 1), 1600);
    return () => clearTimeout(t);
  }, [stage, failed]);

  if (failed) {
    return (
      <FlowShell title="Publishing failed" backTo="/calendar">
        <ErrorState
          title="Social publishing failed"
          description="TikTok rejected the upload. Reconnect your account and try publishing again."
          onRetry={() => {
            setFailed(false);
            setStage(0);
          }}
          retryLabel="Retry publishing"
          secondaryLabel="Manage social accounts"
          secondaryTo="/settings/social"
        />
      </FlowShell>
    );
  }

  const done = stage >= stages.length - 1;

  return (
    <FlowShell title="Publishing Status" backTo="/calendar">
      <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card">
        <img src={thumbSneaker} alt="Sneaker Promo" className="h-16 w-14 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">Sneaker Promo</p>
          <p className="text-xs text-muted-foreground">TikTok · May 12, 10:00 AM</p>
        </div>
      </div>

      <ol className="mt-7 space-y-1">
        {stages.map((s, i) => {
          const state = i < stage ? "done" : i === stage ? "active" : "pending";
          return (
            <li key={s} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    state === "done" && "bg-primary text-primary-foreground",
                    state === "active" && "animate-dot-pulse bg-primary-soft text-primary ring-2 ring-primary",
                    state === "pending" && "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                {i < stages.length - 1 && (
                  <span className={cn("w-0.5 flex-1", i < stage ? "bg-primary" : "bg-border")} style={{ minHeight: 28 }} />
                )}
              </div>
              <div className="pb-5">
                <p
                  className={cn(
                    "font-bold transition-colors",
                    state === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {s}
                </p>
                <p className="text-xs text-muted-foreground">
                  {state === "done" ? "Completed" : state === "active" ? "In progress..." : "Waiting"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {done ? (
        <Button size="lg" fullWidth onClick={() => navigate({ to: "/calendar/published" })}>
          View published post
        </Button>
      ) : (
        <Button variant="outline" size="lg" fullWidth onClick={() => setFailed(true)}>
          Cancel publishing
        </Button>
      )}
    </FlowShell>
  );
}
