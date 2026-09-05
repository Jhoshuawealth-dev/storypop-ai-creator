import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/feedback";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/character")({
  head: pageHead("Choose Character", "Pick the AI character who stars in your video."),
  component: ChooseCharacter,
});

function ChooseCharacter() {
  const navigate = useNavigate();
  const { draft, updateDraft, characters } = useApp();

  return (
    <FlowShell title="Choose Character" backTo="/create/scenes">
      <ProgressBar value={5 / 7} className="mt-4" />
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Choose your AI character
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">This is who your audience will see on screen.</p>

      {characters.length === 0 && (
        <EmptyState
          icon={Users}
          title="No characters yet"
          description="Create your first AI character to star in this video."
          actionLabel="Create Character"
          actionTo="/characters/upload"
        />
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {characters.map((c) => {
          const selected = draft.characterId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => updateDraft({ characterId: c.id })}
              className={cn(
                "relative overflow-hidden rounded-2xl bg-card p-2.5 text-left shadow-card transition-all active:scale-[0.98]",
                selected && "ring-2 ring-primary"
              )}
            >
              <Avatar src={c.image} name={c.name} className="aspect-square w-full rounded-xl text-2xl" />
              {selected && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              <p className="mt-2 truncate font-bold text-foreground">{c.name}</p>
              <p className="truncate text-xs font-medium text-muted-foreground">{c.style}</p>
              <p className="truncate text-xs text-muted-foreground">{c.voice}</p>
            </button>
          );
        })}
      </div>

      <Link to="/characters/upload" className="mt-4 block">
        <Button variant="outline" size="lg" fullWidth>
          <Plus className="h-4 w-4" /> Create New Character
        </Button>
      </Link>

      <Button size="lg" fullWidth className="mt-3" onClick={() => {
          if (!draft.characterId) {
            toast.error("Choose or create a character first.");
            return;
          }
          navigate({ to: "/create/voice" });
        }}>
        Use Character
      </Button>
    </FlowShell>
  );
}
