import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration, usage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/settings")({
  head: pageHead("Video Settings", "Set duration and aspect ratio for your video."),
  component: VideoSettings,
});

const durations = [15, 30, 60];
const ratios = [
  { id: "9:16", label: "9:16", desc: "Portrait", box: "h-14 w-8" },
  { id: "16:9", label: "16:9", desc: "Landscape", box: "h-8 w-14" },
  { id: "1:1", label: "1:1", desc: "Square", box: "h-11 w-11" },
] as const;

function VideoSettings() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const remaining = usage.totalSeconds - usage.usedSeconds;

  return (
    <FlowShell title="Video Settings" backTo="/create/style">
      <ProgressBar value={6.5 / 7} className="mt-4" />
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">Video settings</h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Last step before your video is generated.</p>

      <p className="mt-6 text-sm font-bold text-foreground">Duration</p>
      <div className="mt-2.5 grid grid-cols-3 gap-2.5">
        {durations.map((d) => (
          <button
            key={d}
            onClick={() => updateDraft({ duration: d })}
            className={cn(
              "rounded-2xl py-3.5 text-sm font-bold transition-all",
              draft.duration === d
                ? "bg-primary text-primary-foreground shadow-fab"
                : "bg-card text-foreground shadow-card"
            )}
          >
            {d}s
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-bold text-foreground">Aspect ratio</p>
      <div className="mt-2.5 grid grid-cols-3 gap-2.5">
        {ratios.map((r) => (
          <button
            key={r.id}
            onClick={() => updateDraft({ ratio: r.id })}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl bg-card py-4 shadow-card transition-all",
              draft.ratio === r.id && "ring-2 ring-primary"
            )}
          >
            <span
              className={cn(
                "rounded-md border-2",
                r.box,
                draft.ratio === r.id ? "border-primary bg-primary-soft" : "border-input"
              )}
            />
            <span className="text-xs font-bold text-foreground">{r.label}</span>
            <span className="text-[10px] font-medium text-muted-foreground">{r.desc}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary-soft/70 p-4">
        <div>
          <p className="text-sm font-bold text-secondary-foreground">Remaining balance</p>
          <p className="text-xs text-muted-foreground">This video uses {formatDuration(draft.duration)}</p>
        </div>
        <p className="font-display text-xl font-extrabold text-primary">{formatDuration(remaining)}</p>
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => navigate({ to: "/create/generating" })}>
        <Sparkles className="h-5 w-5" /> Generate Video
      </Button>
    </FlowShell>
  );
}
