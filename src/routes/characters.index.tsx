import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { characters } from "@/lib/mock-data";

export const Route = createFileRoute("/characters/")({
  head: pageHead("My Characters", "Your reusable AI characters."),
  component: CharacterLibrary,
});

function CharacterLibrary() {
  return (
    <AppShell title="My Characters" showBack backTo="/profile">
      <div className="mt-5 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-light">Your AI Character</p>
        <p className="mt-1.5 font-display text-lg font-extrabold leading-snug">
          Create your animated identity once — reuse it in every video.
        </p>
      </div>

      {characters.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No characters yet"
          description="Upload a photo and Storypop AI will build your animated character."
          actionLabel="Create Character"
          actionTo="/characters/upload"
        />
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {characters.map((c) => (
            <Link
              key={c.id}
              to="/characters/$id"
              params={{ id: c.id }}
              className="overflow-hidden rounded-2xl bg-card p-2.5 shadow-card transition-transform active:scale-[0.98]"
            >
              <img src={c.image} alt={c.name} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />
              <p className="mt-2 truncate font-bold text-foreground">{c.name}</p>
              <p className="truncate text-xs font-medium text-muted-foreground">{c.style}</p>
              <p className="truncate text-xs text-muted-foreground">{c.voice}</p>
              <p className="mt-1 text-[11px] font-bold text-primary">{c.videos} videos</p>
            </Link>
          ))}
        </div>
      )}

      <Link to="/characters/upload" className="mt-5 block">
        <Button size="lg" fullWidth>
          <Plus className="h-4 w-4" /> Create Character
        </Button>
      </Link>
    </AppShell>
  );
}
