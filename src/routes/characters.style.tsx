import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { characterStyles } from "@/lib/catalog";
import { readCharacterDraft, saveCharacterDraft } from "@/lib/character-draft";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/characters/style")({
  head: pageHead("Character Style", "Choose the art style for your AI character."),
  component: CharacterStyle,
});

function CharacterStyle() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState("");
  const [style, setStyle] = useState("3d");

  useEffect(() => {
    setPhoto(readCharacterDraft().photo);
  }, []);

  return (
    <FlowShell title="Character Style" backTo="/characters/upload">
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">Pick your style</h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">This is how your animated identity will look.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {characterStyles.map((s) => (
          <button
            key={s.id}
            onClick={() => setStyle(s.id)}
            className={cn(
              "relative overflow-hidden rounded-2xl bg-card p-2.5 text-left shadow-card transition-all active:scale-[0.98]",
              style === s.id && "ring-2 ring-primary"
            )}
          >
            {photo ? (
              <img
                src={photo}
                alt={`${s.label} style preview`}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <span className="flex aspect-square w-full items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                {s.label}
              </span>
            )}
            {style === s.id && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
            )}
            <p className="mt-2 font-bold text-foreground">{s.label}</p>
            <p className="text-xs leading-snug text-muted-foreground">{s.desc}</p>
          </button>
        ))}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => {
          saveCharacterDraft({ styleId: style });
          navigate({ to: "/characters/generating" });
        }}>
        Create Character
      </Button>
    </FlowShell>
  );
}
