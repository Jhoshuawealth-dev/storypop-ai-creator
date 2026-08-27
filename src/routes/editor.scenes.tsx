import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { characters, defaultScenes, formatDuration, thumbSneaker } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/editor/scenes")({
  head: pageHead("Scenes & Character", "Swap the character and adjust scenes."),
  component: EditorScenes,
});

function EditorScenes() {
  const [selected, setSelected] = useState(defaultScenes[0]!.id);
  const [character, setCharacter] = useState("joshua");

  return (
    <FlowShell title="Scenes & Character" backTo="/editor">
      <p className="mt-5 text-sm font-bold text-foreground">Scenes</p>
      <div className="mt-2.5 space-y-2.5">
        {defaultScenes.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-card transition-all",
              selected === s.id && "ring-2 ring-primary"
            )}
          >
            <img src={thumbSneaker} alt={`Scene ${i + 1}`} className="h-14 w-12 rounded-lg object-cover" loading="lazy" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold text-foreground">
                Scene {i + 1} — {s.title}
              </span>
              <span className="block text-xs text-muted-foreground">{formatDuration(s.durationSeconds)}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-bold text-foreground">Character in this scene</p>
      <div className="mt-2.5 grid grid-cols-4 gap-2.5">
        {characters.map((c) => (
          <button key={c.id} onClick={() => setCharacter(c.id)} className="relative">
            <img
              src={c.image}
              alt={c.name}
              className={cn(
                "aspect-square w-full rounded-2xl object-cover transition-all",
                character === c.id ? "ring-2 ring-primary" : "opacity-70"
              )}
              loading="lazy"
            />
            {character === c.id && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}
            <span className="mt-1 block truncate text-[11px] font-semibold text-foreground">{c.name}</span>
          </button>
        ))}
      </div>

      <Button size="lg" fullWidth className="mt-7" onClick={() => toast.success("Scene updated")}>
        Save changes
      </Button>
    </FlowShell>
  );
}
