import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { platformSpecs } from "@/lib/catalog";
import { CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar/schedule")({
  head: pageHead("Schedule Post", "Schedule your video to publish automatically."),
  component: SchedulePost,
});

function SchedulePost() {
  const navigate = useNavigate();
  const { projects, addPost, addNotification } = useApp();
  const [video, setVideo] = useState("");
  const [platform, setPlatform] = useState(platformSpecs[0]?.name ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [auto, setAuto] = useState(true);
  const selectedProject = projects.find((project) => project.id === video);

  if (projects.length === 0) {
    return (
      <FlowShell title="Schedule Post" backTo="/calendar">
        <EmptyState
          icon={CalendarX}
          title="No videos to schedule"
          description="Create a video first, then return here to choose when to share it."
          actionLabel="Create Video"
          actionTo="/create"
        />
      </FlowShell>
    );
  }

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
          <SelectField options={platformSpecs.map((p) => p.name)} value={platform} onChange={setPlatform} />
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
          if (!selectedProject) {
            toast.error("Choose a video to schedule.");
            return;
          }
          const post = {
            id: `post_${Date.now()}`,
            title: selectedProject.title,
            date,
            time,
            platform,
            status: "scheduled" as const,
            ...(selectedProject.thumb ? { thumb: selectedProject.thumb } : {}),
          };
          addPost(post);
          addNotification({ type: "schedule", title: "Post scheduled", body: `${post.title} · ${platform}` });
          toast.success("Post added to your calendar");
          navigate({ to: "/calendar/publishing" });
        }}
      >
        Schedule Post
      </Button>
    </FlowShell>
  );
}
