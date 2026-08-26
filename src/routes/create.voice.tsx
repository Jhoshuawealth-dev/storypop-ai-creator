import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { voices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/voice")({
  head: pageHead("Choose Voice", "Pick the AI voice for your video."),
  component: ChooseVoice,
});

function ChooseVoice() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [playing, setPlaying] = useState<string | null>(null);

  const list = voices.filter((v) => v.gender === gender);

  return (
    <FlowShell title="Choose Voice" backTo="/create/character">
      <ProgressBar value={5.5 / 7} className="mt-4" />
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">Choose a voice</h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Tap play to preview how each voice sounds.</p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
        {(["Male", "Female"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={cn(
              "h-9 rounded-full text-sm font-bold transition-all",
              gender === g ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {list.map((v) => {
          const selected = draft.voiceId === v.id;
          const isPlaying = playing === v.id;
          return (
            <div
              key={v.id}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-card transition-all",
                selected && "ring-2 ring-primary"
              )}
            >
              <button
                onClick={() => setPlaying(isPlaying ? null : v.id)}
                aria-label={`Preview ${v.name}'s voice`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors hover:bg-accent"
              >
                {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="ml-0.5 h-5 w-5" fill="currentColor" />}
              </button>
              <button onClick={() => updateDraft({ voiceId: v.id })} className="min-w-0 flex-1 text-left">
                <p className="font-bold text-foreground">
                  {v.name} <span className="text-sm font-medium text-muted-foreground">· {v.style}</span>
                </p>
                <p className="mt-0.5 truncate text-sm italic text-muted-foreground">"{v.sample}"</p>
                {isPlaying && (
                  <span className="mt-2 flex items-end gap-0.5" aria-hidden="true">
                    {[6, 12, 8, 14, 9, 5, 11].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 animate-dot-pulse rounded-full bg-primary"
                        style={{ height: h, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </span>
                )}
              </button>
              <button
                onClick={() => updateDraft({ voiceId: v.id })}
                aria-label={`Select ${v.name}`}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
                )}
              >
                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
            </div>
          );
        })}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => navigate({ to: "/create/style" })}>
        Next
      </Button>
    </FlowShell>
  );
}
