import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Film, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Thumb } from "@/components/ui/avatar";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { formatDuration, type Scene } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/scenes")({
  head: pageHead("Scene Manager", "Manage the scenes inside your video project."),
  component: SceneManager,
});

function SceneManager() {
  const { id } = Route.useParams();
  const { projects, updateProject } = useApp();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <AppShell title="Scene Manager" showBack backTo="/projects">
        <ErrorState
          title="Project not found"
          description="This project may have been deleted."
          secondaryLabel="Back to projects"
          secondaryTo="/projects"
        />
      </AppShell>
    );
  }

  const scenes: Scene[] = project.scenes ?? [];
  const setScenes = (next: Scene[]) => updateProject(project.id, { scenes: next });

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= scenes.length) return;
    const next = [...scenes];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    setScenes(next);
  };

  return (
    <AppShell title="Scene Manager" subtitle={project.title} showBack>
      {scenes.length === 0 ? (
        <EmptyState
          icon={Film}
          title="No scenes yet"
          description="Scenes appear here once your video script has been broken down."
          className="mt-10"
        />
      ) : (
        <>
          <p className="mt-5 text-sm font-semibold text-muted-foreground">
            {scenes.length} scenes · {formatDuration(scenes.reduce((s, x) => s + x.durationSeconds, 0))}
          </p>

          <div className="mt-3 space-y-3">
            {scenes.map((scene, i) => (
              <article key={scene.id} className="rounded-2xl bg-card p-3 shadow-card">
                <div className="flex items-center gap-3">
                  <Thumb
                    {...(project.thumb ? { src: project.thumb } : {})}
                    alt={`Scene ${i + 1} thumbnail`}
                    className="h-16 w-14 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-foreground">
                      Scene {i + 1} — {scene.title}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">{formatDuration(scene.durationSeconds)}</p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{scene.description}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1 border-t border-border pt-2.5">
                  <Link
                    to="/editor"
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary-soft"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <span className="flex-1" />
                  <button
                    onClick={() => move(i, -1)}
                    aria-label="Move up"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    aria-label="Move down"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-primary-soft hover:text-primary"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setScenes(scenes.filter((s) => s.id !== scene.id));
                      toast.success("Scene deleted");
                    }}
                    aria-label="Delete scene"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
