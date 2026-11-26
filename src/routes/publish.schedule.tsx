import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { captionText, manualPost, uploadPages } from '@/lib/social-publishing';
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publish/schedule")({
  head: pageHead("Schedule", "Publish now or schedule for later."),
  component: PublishSchedule,
});

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function PublishSchedule() {
  const navigate = useNavigate();
  const { draft, addPost, addNotification, socialAccounts } = useApp();
  const [mode, setMode] = useState<"now" | "later">("now");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("18:00");

  const accounts = socialAccounts.filter((account) => draft.post.platforms.includes(account.id));
  const platformNames = accounts.map((account) => `${account.name} (${account.handle})`);

  const submit = () => {
    if (accounts.length === 0) {
      toast.error("Go back and choose at least one platform.");
      return;
    }
    if (mode === "later" && (!date || !time)) {
      toast.error("Pick a date and time.");
      return;
    }

    const title = draft.post.title || "Untitled post";
    if (mode === "now") {
      const text = captionText(draft.post);
      void navigator.clipboard?.writeText(text);
      for (const account of accounts) {
        const url = uploadPages[account.platform];
        if (url) window.open(url, "_blank", "noopener");
      }
    }
    for (const account of accounts) {
      addPost(manualPost(account, draft.post, mode === 'now' ? todayISO() : date, mode === 'now' ? new Date().toTimeString().slice(0, 5) : time, mode === 'later'));
    }

    addNotification({
      type: mode === "now" ? "publish" : "schedule",
      title: mode === "now" ? "Upload prepared" : "Manual upload scheduled",
      body: `${title} — ${platformNames.join(", ")}`,
    });

    toast.success(mode === "now" ? "Upload prepared — confirm your post after it goes live" : "Added to calendar for manual upload");
    navigate({ to: '/calendar/publishing' });
  };

  return (
    <FlowShell title="Schedule" backTo="/publish/details">
      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
        {(["now", "later"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "h-10 rounded-full text-sm font-bold transition-all",
              mode === m ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {m === "now" ? "Manual upload" : "Schedule"}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card p-4 shadow-card">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Publishing to</p>
        <p className="mt-1.5 font-bold text-foreground">
          {platformNames.length ? platformNames.join(" · ") : "No platform selected"}
        </p>
        {draft.post.title && <p className="mt-1 truncate text-sm text-muted-foreground">{draft.post.title}</p>}
      </div>

      {mode === "later" && (
        <div className="mt-4 space-y-4">
          <Field label="Date">
            <Input type="date" value={date} min={todayISO()} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>
      )}

      {mode === "now" && (
        <p className="mt-4 text-xs text-muted-foreground">
          Upload on the platform, then confirm the live post in Publishing Status. Opening an upload page does not publish your video.
        </p>
      )}

      <Button size="lg" fullWidth className="mt-7" onClick={submit}>
        {mode === "now" ? "Prepare manual upload" : "Schedule manual upload"}
      </Button>
    </FlowShell>
  );
}
