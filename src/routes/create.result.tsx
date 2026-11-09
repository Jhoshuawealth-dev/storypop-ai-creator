import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CoverPicker, remoteThumbToDataUrl } from "@/components/cover-picker";
import { CheckCircle2, Pencil, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { VideoPreviewPlayer } from "@/components/ui/video-player";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/catalog";

export const Route = createFileRoute("/create/result")({
  head: pageHead("Video Result", "Your AI-generated UGC video is ready."),
  component: VideoResult,
});

function VideoResult() {
  const navigate = useNavigate();
  const { draft, projects, addProject, updateProject, consumeMinutes, addNotification } = useApp();
  const savedId = useRef<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const thumb = projects.find((p) => p.id === savedId.current)?.thumb;

  // Pick up the real video + auto thumbnail from the worker, if any.
  useEffect(() => {
    setVideoUrl(sessionStorage.getItem("storypop:last-video"));
    const remote = sessionStorage.getItem("storypop:last-thumb");
    if (!remote) return;
    remoteThumbToDataUrl(remote).then((data) => {
      if (data && savedId.current) updateProject(savedId.current, { thumb: data });
    });
  }, [updateProject]);

  const title = draft.post.title.trim() || draft.idea.trim().slice(0, 60) || "Untitled video";

  useEffect(() => {
    if (savedId.current) return;
    const id = `proj_${Date.now()}`;
    savedId.current = id;
    addProject({
      id,
      title,
      durationSeconds: draft.duration,
      createdAt: new Date().toISOString(),
      status: "completed",
      ...(draft.platform ? { platform: draft.platform } : {}),
      script: draft.script,
      scenes: draft.scenes,
    });
    consumeMinutes(draft.duration);
    addNotification({ type: "video", title: "Your video is ready", body: `${title} finished rendering.` });
  }, [addProject, addNotification, consumeMinutes, draft, title]);

  return (
    <FlowShell title="Video Result" backTo="/create/settings">
      <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-primary-soft p-4">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm font-bold text-secondary-foreground">Your AI video is ready!</p>
      </div>

      <VideoPreviewPlayer
        {...(thumb ? { poster: thumb } : {})}
        durationSeconds={draft.duration}
        className="mt-4 aspect-[9/16] w-full"
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {formatDuration(draft.duration)} · {draft.ratio}
            {draft.platform ? ` · ${draft.platform}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-extrabold text-primary">Completed</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Link to="/editor">
          <Button variant="outline" fullWidth className="h-auto flex-col gap-1.5 rounded-2xl py-3.5">
            <Pencil className="h-5 w-5" /> <span className="text-xs">Edit</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 rounded-2xl py-3.5"
          onClick={() => navigate({ to: "/create/generating" })}
        >
          <RefreshCw className="h-5 w-5" /> <span className="text-xs">Regenerate</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-1.5 rounded-2xl py-3.5"
          onClick={() => {
            toast.success("Saved to your projects");
            navigate({ to: "/projects" });
          }}
        >
          <Save className="h-5 w-5" /> <span className="text-xs">Save draft</span>
        </Button>
      </div>

      <CoverPicker
        videoUrl={videoUrl}
        projectId={savedId.current}
        {...(thumb ? { value: thumb } : {})}
        onChange={(t) => savedId.current && updateProject(savedId.current, { thumb: t })}
      />

      <Link to="/publish" className="mt-4 block">
        <Button size="lg" fullWidth>
          Publish
        </Button>
      </Link>
    </FlowShell>
  );
}
