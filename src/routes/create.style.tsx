import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { videoStyles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/style")({
  head: pageHead("Video Style", "Choose the visual style of your video."),
  component: VideoStyleScreen,
});

function VideoStyleScreen() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();

  return (
    <FlowShell title="Video Style" backTo="/create/voice">
      <ProgressBar value={6 / 7} className="mt-4" />
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">Pick a video style</h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">The overall look and feel of every scene.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {videoStyles.map((s, i) => {
          const selected = draft.styleId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => updateDraft({ styleId: s.id })}
              className={cn(
                "relative overflow-hidden rounded-2xl bg-card p-4 text-left shadow-card transition-all active:scale-[0.98]",
                selected && "ring-2 ring-primary"
              )}
            >
              <span
                className="flex h-20 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in oklab, var(--color-primary) ${12 + i * 9}%, white)`,
                }}
              >
                <span className="font-display text-lg font-extrabold text-primary-deep">{s.label}</span>
              </span>
              {selected && (
                <span className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              <p className="mt-2.5 font-bold text-foreground">{s.label}</p>
              <p className="text-xs leading-snug text-muted-foreground">{s.desc}</p>
            </button>
          );
        })}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => navigate({ to: "/create/settings" })}>
        Next
      </Button>
    </FlowShell>
  );
}
