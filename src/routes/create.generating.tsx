import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { enqueueGeneration, getGenerationJob } from "@/lib/generation.functions";

export const Route = createFileRoute("/create/generating")({
  head: pageHead("Generating Video", "Your AI video is being created."),
  component: Generating,
});

const JOB_KEY = "storypop:current-job";

type JobState = {
  status: string;
  progress: number;
  stage: string;
  error: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  queuePosition: number;
};

function Generating() {
  const navigate = useNavigate();
  const { draft } = useApp();
  const enqueue = useServerFn(enqueueGeneration);
  const fetchJob = useServerFn(getGenerationJob);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const started = useRef(false);

  // Queue the job once (or resume a job already in progress).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return setNeedsLogin(true);
      const existing = sessionStorage.getItem(JOB_KEY);
      if (existing) return setJobId(existing);
      try {
        const res = await enqueue({
          data: {
            title: draft.post.title || draft.idea.slice(0, 80) || "Untitled video",
            idea: draft.idea,
            script: draft.script,
            scenes: draft.scenes as unknown as Record<string, unknown>[],
            voiceId: draft.voiceId,
            styleId: draft.styleId,
            ratio: draft.ratio,
            duration: draft.duration,
            monetizationSafe: draft.monetizationSafe !== false,
          },
        });
        sessionStorage.setItem(JOB_KEY, res.jobId);
        setJobId(res.jobId);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not start generation.");
      }
    })();
  }, [draft, enqueue]);

  // Poll job status.
  useEffect(() => {
    if (!jobId) return;
    let stop = false;
    const tick = async () => {
      try {
        const j = await fetchJob({ data: { jobId } });
        if (stop || !j) return;
        setJob(j);
        if (j.status === "completed" || j.status === "failed") {
          sessionStorage.removeItem(JOB_KEY);
          if (j.status === "completed") {
            if (j.videoUrl) sessionStorage.setItem("storypop:last-video", j.videoUrl);
            if (j.thumbnailUrl) sessionStorage.setItem("storypop:last-thumb", j.thumbnailUrl);
            else sessionStorage.removeItem("storypop:last-thumb");
            setTimeout(() => navigate({ to: "/create/result" }), 700);
          }
          return;
        }
      } catch {
        /* keep polling */
      }
      if (!stop) setTimeout(tick, 3000);
    };
    tick();
    return () => {
      stop = true;
    };
  }, [jobId, fetchJob, navigate]);

  if (needsLogin) {
    return (
      <FlowShell title="Sign in required" backTo="/create/settings">
        <ErrorState
          title="Sign in to generate"
          description="Videos are saved to your account, so you need to be signed in."
          onRetry={() => navigate({ to: "/login" })}
          retryLabel="Sign in"
          secondaryLabel="Back to settings"
          secondaryTo="/create/settings"
        />
      </FlowShell>
    );
  }

  if (error || job?.status === "failed") {
    return (
      <FlowShell title="Generation failed" backTo="/create/settings">
        <ErrorState
          title="Video generation failed"
          description={job?.error ?? error ?? "Something interrupted the render."}
          onRetry={() => {
            sessionStorage.removeItem(JOB_KEY);
            started.current = false;
            setError(null);
            setJob(null);
            setJobId(null);
            navigate({ to: "/create/settings" });
          }}
          retryLabel="Try again"
          secondaryLabel="Back to settings"
          secondaryTo="/create/settings"
        />
      </FlowShell>
    );
  }

  const progress = job?.progress ?? 0;
  const queued = !job || job.status === "queued";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-primary-deep px-6 pb-10 pt-16 text-primary-foreground">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-fab">
          <Sparkles className="h-9 w-9 animate-dot-pulse" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight">
          {queued ? "Your video is in the queue" : "Creating your video..."}
        </h1>
        <p className="mt-2 text-sm text-primary-light">
          {queued
            ? job?.queuePosition
              ? `Position ${job.queuePosition} — it starts as soon as the render machine is free.`
              : "Sending your video to the render machine..."
            : job?.stage || "Rendering"}
        </p>
        <p className="mt-7 font-display text-5xl font-extrabold tabular-nums">{Math.round(progress)}%</p>
        <ProgressBar value={progress / 100} className="mt-4 bg-white/15" />
      </div>

      <p className="mt-9 rounded-3xl bg-white/8 p-5 text-center text-sm text-primary-light">
        You can leave this page — your video keeps rendering and will appear in Projects when it's ready.
      </p>

      <div className="mt-auto pt-8">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          className="border-white/25 bg-transparent text-primary-foreground hover:bg-white/10"
          onClick={() => navigate({ to: "/projects" })}
        >
          Go to Projects
        </Button>
      </div>
    </div>
  );
}
