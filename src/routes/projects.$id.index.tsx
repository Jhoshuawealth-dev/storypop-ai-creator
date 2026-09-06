import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Copy, Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { VideoPreviewPlayer } from "@/components/ui/video-player";
import { ErrorState, StatusBadge } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { formatDate, formatDuration } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/")({
  head: pageHead("Project Details", "View and manage your UGC video project."),
  component: ProjectDetails,
});

function ProjectDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { projects, characters, addProject, removeProject } = useApp();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <AppShell title="Project" showBack backTo="/projects">
        <ErrorState
          title="Project not found"
          description="This project may have been deleted."
          secondaryLabel="Back to projects"
          secondaryTo="/projects"
        />
      </AppShell>
    );
  }

  const scenes = project.scenes ?? [];
  const character = characters[0];

  return (
    <AppShell title={project.title} showBack backTo="/projects">
      <VideoPreviewPlayer
        {...(project.thumb ? { poster: project.thumb } : {})}
        durationSeconds={project.durationSeconds}
        className="mt-4 aspect-[9/16] w-full"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-foreground">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDuration(project.durationSeconds)} · {formatDate(project.createdAt)}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.script && (project.script.hook || project.script.body) && (
        <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Script</p>
          <p className="mt-2 font-bold text-foreground">{project.script.hook}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{project.script.body}</p>
          <p className="mt-2 text-sm font-semibold text-secondary-foreground">{project.script.cta}</p>
        </section>
      )}

      <Link
        to="/projects/$id/scenes"
        params={{ id: project.id }}
        className="mt-3 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card"
      >
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">Scenes</p>
          <p className="text-sm text-muted-foreground">
            {scenes.length ? `${scenes.length} scenes · manage and reorder` : "No scenes yet"}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      {character && (
        <section className="mt-3 flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-card">
          <Avatar
            {...(character.image ? { src: character.image } : {})}
            name={character.name}
            className="h-12 w-12 rounded-full"
          />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-foreground">{character.name}</p>
            <p className="text-sm text-muted-foreground">
              {character.style} · {character.voice}
            </p>
          </div>
        </section>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Link to="/editor">
          <Button variant="outline" fullWidth className="h-auto flex-col gap-1.5 rounded-2xl py-3.5">
            <Pencil className="h-5 w-5" /> <span className="text-xs">Edit</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 rounded-2xl py-3.5"
          onClick={() => {
            addProject({
              ...project,
              id: `proj_${Date.now()}`,
              title: `${project.title} (copy)`,
              createdAt: new Date().toISOString(),
              status: "draft",
            });
            toast.success("Project duplicated");
          }}
        >
          <Copy className="h-5 w-5" /> <span className="text-xs">Duplicate</span>
        </Button>
        <Button
          variant="danger"
          className="h-auto flex-col gap-1.5 rounded-2xl py-3.5"
          onClick={() => {
            removeProject(project.id);
            toast.success("Project deleted");
            navigate({ to: "/projects" });
          }}
        >
          <Trash2 className="h-5 w-5" /> <span className="text-xs">Delete</span>
        </Button>
      </div>

      <Link to="/publish" className="mt-4 block">
        <Button size="lg" fullWidth>
          <Send className="h-4 w-4" /> Publish
        </Button>
      </Link>
    </AppShell>
  );
}
