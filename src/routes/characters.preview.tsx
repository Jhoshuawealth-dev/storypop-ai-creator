import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Palette, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { avatarJoshua } from "@/lib/mock-data";

export const Route = createFileRoute("/characters/preview")({
  head: pageHead("Character Preview", "Preview your new AI character."),
  component: CharacterPreview,
});

function CharacterPreview() {
  const navigate = useNavigate();

  return (
    <FlowShell title="Character Preview" backTo="/characters/style">
      <div className="mt-5 overflow-hidden rounded-3xl shadow-card">
        <img src={avatarJoshua} alt="Your AI character" className="aspect-square w-full object-cover" loading="lazy" />
      </div>

      <div className="mt-5 text-center">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">Meet your AI character</h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">3D Avatar · Voice: David · Energetic</p>
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        onClick={() => {
          toast.success("Character saved to your library");
          navigate({ to: "/characters" });
        }}
      >
        Use Character
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
