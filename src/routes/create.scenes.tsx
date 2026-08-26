import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/mock-data";

export const Route = createFileRoute("/create/scenes")({
  head: pageHead("Scene Planner", "Plan and arrange the scenes of your video."),
  component: ScenePlanner,
});

function ScenePlanner() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const scenes = draft.scenes;
  const total = scenes.reduce((sum, s) => sum + s.durationSeconds, 0);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= scenes.length) return;
    const next = [...scenes];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    updateDraft({ scenes: next });
  };

  const remove = (id: string) => {
    updateDraft({ scenes: scenes.filter((s) => s.id !== id) });
    toast.success("Scene deleted");
  };

  const add = () => {
    updateDraft({
      scenes: [
        ...scenes,
        {
          id: `s${Date.now()}`,
          title: "New Scene",
          durationSeconds: 6,
          description: "Describe what happens in this scene.",
        },
      ],
    });
  };

  return (
    <FlowShell title="Scene Planner" backTo="/create/script">
      <ProgressBar value={4 / 7} className="mt-4" />
      <div className="mt-5 flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Your scenes</h1>
        <span className="text-sm font-bold text-primary">{formatDuration(total)} total</span>
      </div>

      <div className="mt-5 space-y-3">
        {scenes.map((scene, i) => (
          <article key={scene.id} className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-bold text-foreground">
                    Scene {i + 1} — {scene.title}
                  </p>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                    {formatDuration(scene.durationSeconds)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{scene.description}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3">
              <button
                onClick={() => toast.success("Scene regenerated")}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-soft"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
              <span className="flex-1" />
              <button
                onClick={() => move(i, -1)}
                aria-label="Move scene up"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(i, 1)}
                aria-label="Move scene down"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(scene.id)}
                aria-label="Delete scene"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-light py-4 text-sm font-bold text-primary transition-colors hover:bg-primary-soft"
      >
        <Plus className="h-4 w-4" /> Add Scene
      </button>

      <Button size="lg" fullWidth className="mt-6" onClick={() => navigate({ to: "/create/character" })}>
        Continue
      </Button>
    </FlowShell>
  );
}
