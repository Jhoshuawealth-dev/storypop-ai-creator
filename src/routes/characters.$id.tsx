import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clapperboard, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { characters } from "@/lib/mock-data";

export const Route = createFileRoute("/characters/$id")({
  head: pageHead("Character Profile", "Details about your AI character."),
  component: CharacterProfile,
});

function CharacterProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const character = characters.find((c) => c.id === id) ?? characters[0]!;

  return (
    <AppShell title={character.name} showBack backTo="/characters">
      <div className="mt-5 overflow-hidden rounded-3xl shadow-card">
        <img
          src={character.image}
          alt={character.name}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
      </div>

      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">{character.name}</h1>
      <p className="text-sm text-muted-foreground">Main character</p>

      <dl className="mt-5 divide-y divide-border rounded-2xl bg-card px-4 shadow-card">
        {[
          ["Style", character.style],
          ["Voice", character.voice],
          ["Created", character.created],
          ["Videos using character", `${character.videos}`],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3.5">
            <dt className="text-sm font-medium text-muted-foreground">{k}</dt>
            <dd className="text-sm font-bold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <Link to="/create/idea" className="mt-5 block">
        <Button size="lg" fullWidth>
          <Clapperboard className="h-4 w-4" /> Use in Video
        </Button>
      </Link>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={() => toast.info("Character editor opened")}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
        <Button
          variant="danger"
          size="lg"
          onClick={() => {
            toast.success("Character deleted");
            navigate({ to: "/characters" });
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>
    </AppShell>
  );
}
