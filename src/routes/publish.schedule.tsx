import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { specFor } from "@/lib/post-seo";
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
  const { draft, addPost, addNotification } = useApp();
  const [mode, setMode] = useState<"now" | "later">("now");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("18:00");

  const platformNames = draft.post.platforms.map((id) => specFor(id).name);

  const submit = () => {
    if (draft.post.platforms.length === 0) {
      toast.error("Go back and choose at least one platform.");
      return;
    }
    if (mode === "later" && (!date || !time)) {
      toast.error("Pick a date and time.");
      return;
    }

    const title = draft.post.title || "Untitled post";
    for (const id of draft.post.platforms) {
      addPost({
        id: `post_${Date.now()}_${id}`,
        title,
        date: mode === "now" ? todayISO() : date,
        time: mode === "now" ? new Date().toTimeString().slice(0, 5) : time,
        platform: specFor(id).name,
        status: mode === "now" ? "published" : "scheduled",
      });
    }

    addNotification({
      type: mode === "now" ? "publish" : "schedule",
      title: mode === "now" ? "Publishing started" : "Post scheduled",
      body: `${title} — ${platformNames.join(", ")}`,
    });

    toast.success(mode === "now" ? "Publishing your video" : "Post scheduled");
    navigate({ to: "/calendar/publishing" });
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
            {m === "now" ? "Publish now" : "Schedule"}
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

      <Button size="lg" fullWidth className="mt-7" onClick={submit}>
        {mode === "now" ? "Publish now" : "Schedule post"}
      </Button>
    </FlowShell>
  );
}
