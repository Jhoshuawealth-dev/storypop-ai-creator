import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { platforms, projects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar/schedule")({
  head: pageHead("Schedule Post", "Schedule your video to publish automatically."),
  component: SchedulePost,
});

function SchedulePost() {
  const navigate = useNavigate();
  const [video, setVideo] = useState(projects[0]!.id);
  const [platform, setPlatform] = useState("TikTok");
  const [date, setDate] = useState("2026-05-12");
  const [time, setTime] = useState("10:00");
  const [auto, setAuto] = useState(true);

  return (
    <FlowShell title="Schedule Post" backTo="/calendar">
      <p className="mt-5 text-sm font-bold text-foreground">Video</p>
      <div className="mt-2.5 flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {projects.slice(0, 4).map((p) => (
          <button key={p.id} onClick={() => setVideo(p.id)} className="shrink-0">
            <img
              src={p.thumb}
              alt={p.title}
              className={cn(
                "h-24 w-20 rounded-xl object-cover transition-all",
                video === p.id ? "ring-2 ring-primary" : "opacity-70"
              )}
              loading="lazy"
            />
            <span className="mt-1 block max-w-20 truncate text-[11px] font-semibold text-foreground">{p.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <Field label="Platform">
          <SelectField options={platforms.map((p) => p.name)} value={platform} onChange={setPlatform} />
        </Field>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Time">
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
      </div>

      <button
        onClick={() => setAuto((a) => !a)}
        className="mt-5 flex w-full items-center justify-between rounded-2xl bg-card p-4 text-left shadow-card"
      >
        <span>
          <span className="block font-bold text-foreground">Auto-publish</span>
          <span className="block text-xs text-muted-foreground">Publish automatically at the scheduled time</span>
        </span>
        <span
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            auto ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-card shadow transition-all",
              auto ? "left-6" : "left-1"
            )}
          />
        </span>
      </button>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        onClick={() => {
          toast.success("Post scheduled");
          navigate({ to: "/calendar/publishing" });
        }}
      >
        Schedule Post
      </Button>
    </FlowShell>
  );
}
