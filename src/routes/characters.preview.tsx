import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Palette, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { characterStyles, voices } from "@/lib/catalog";
import { clearCharacterDraft, readCharacterDraft, saveCharacterDraft } from "@/lib/character-draft";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/characters/preview")({
  head: pageHead("Character Preview", "Preview your new AI character."),
  component: CharacterPreview,
});

function CharacterPreview() {
  const navigate = useNavigate();
  const { addCharacter } = useApp();
  const [photo, setPhoto] = useState("");
  const [styleId, setStyleId] = useState("");
  const [name, setName] = useState("");
  const [voiceName, setVoiceName] = useState(voices[0]!.name);

  useEffect(() => {
    const draft = readCharacterDraft();
    setPhoto(draft.photo);
    setStyleId(draft.styleId);
    if (draft.name) setName(draft.name);
  }, []);

  const styleLabel = characterStyles.find((s) => s.id === styleId)?.label ?? "Custom style";

  const save = () => {
    if (!name.trim()) {
      toast.error("Give your character a name.");
      return;
    }
    const voice = voices.find((v) => v.name === voiceName);
    addCharacter({
      id: `char_${Date.now()}`,
      name: name.trim(),
      style: styleLabel,
      voice: voice ? `${voice.name} · ${voice.style}` : voiceName,
      ...(photo ? { image: photo } : {}),
      videos: 0,
      created: new Date().toISOString(),
    });
    clearCharacterDraft();
    toast.success("Character saved to your library");
    navigate({ to: "/characters" });
  };

  return (
    <FlowShell title="Character Preview" backTo="/characters/style">
      <div className="mt-5 overflow-hidden rounded-3xl shadow-card">
        {photo ? (
          <img src={photo} alt="Your AI character" className="aspect-square w-full object-cover" />
        ) : (
          <span className="block aspect-square w-full bg-primary-soft" />
        )}
      </div>

      <div className="mt-5 text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Meet your AI character</h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">{styleLabel}</p>
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Character name">
          <Input
            value={name}
            placeholder="e.g. Ada"
            onChange={(e) => {
              setName(e.target.value);
              saveCharacterDraft({ name: e.target.value });
            }}
          />
        </Field>
        <Field label="Voice">
          <SelectField options={voices.map((v) => v.name)} value={voiceName} onChange={setVoiceName} />
        </Field>
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={save}>
        Save character
      </Button>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={() => navigate({ to: "/characters/generating" })}>
          <RefreshCw className="h-4 w-4" /> Regenerate
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate({ to: "/characters/style" })}>
          <Palette className="h-4 w-4" /> Another style
        </Button>
      </div>
    </FlowShell>
  );
}
