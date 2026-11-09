import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/layout/app-shell";
import { ThumbnailEditor } from "@/components/thumbnail-editor";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tools/thumbnail-creator")({
  head: pageHead("Thumbnail Studio", "Create scroll-stopping thumbnails with AI or by hand, then download as PNG or JPG."),
  validateSearch: z.object({ project: z.string().optional() }),
  component: ThumbnailStudio,
});

function ThumbnailStudio() {
  const { project: projectId } = Route.useSearch();
  const { projects, updateProject } = useApp();
  const navigate = useNavigate();
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;

  return (
    <AppShell title="Thumbnail Studio" showBack backTo={project ? "/projects" : "/home"}>
      <p className="mb-4 text-sm text-muted-foreground">
        {project
          ? `Editing the thumbnail for “${project.title}”. Save to attach it to the video.`
          : "Design a thumbnail with an AI prompt or by hand. Download it, or attach it to one of your videos."}
      </p>
      {!project && projects.length > 0 && (
        <label className="mb-4 block text-xs font-bold text-foreground">
          Attach to a video (optional)
          <select
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            value=""
            onChange={(e) => e.target.value && navigate({ to: "/tools/thumbnail-creator", search: { project: e.target.value } })}
          >
            <option value="">Choose a video…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <ThumbnailEditor
        key={project?.id ?? "new"}
        initialImage={project?.thumb ?? null}
        initialHeadline={project?.script?.hook ?? ""}
        {...(project ? { onSave: (img: string) => updateProject(project.id, { thumb: img }) } : {})}
      />
    </AppShell>
  );
}
