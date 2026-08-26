import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar, StepList, type GenStep } from "@/components/ui/progress-ring";
import { ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/create/generating")({
  head: pageHead("Generating Video", "Your AI video is being created."),
  component: Generating,
});

const stepLabels = [
  "Preparing idea",
  "Writing script",
  "Planning scenes",
  "Generating scenes",
  "Creating character",
  "Creating voice",
  "Editing video",
  "Finalizing",
];

function Generating() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(4);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    if (progress >= 100) {
      const t = setTimeout(() => navigate({ to: "/create/result" }), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + Math.random() * 7 + 2)), 260);
    return () => clearTimeout(t);
  }, [progress, failed, navigate]);

  const activeIndex = Math.min(stepLabels.length - 1, Math.floor((progress / 100) * stepLabels.length));
  const steps: GenStep[] = stepLabels.map((label, i) => ({
    label,
    status: i < activeIndex ? "done" : i === activeIndex ? "active" : "pending",
  }));

  if (failed) {
    return (
      <FlowShell title="Generation failed" backTo="/create/settings">
        <ErrorState
          title="Video generation failed"
          description="Something interrupted the render. No video minutes were deducted from your balance."
          onRetry={() => {
            setFailed(false);
            setProgress(4);
          }}
          retryLabel="Retry generation"
          secondaryLabel="Back to settings"
          secondaryTo="/create/settings"
        />
      </FlowShell>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-primary-deep px-6 pb-10 pt-16 text-primary-foreground">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-fab">
          <Sparkles className="h-9 w-9 animate-dot-pulse" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight">Creating your video...</h1>
        <p className="mt-2 text-sm text-primary-light">This may take a few moments.</p>
        <p className="mt-7 font-display text-5xl font-extrabold tabular-nums">{Math.round(progress)}%</p>
        <ProgressBar value={progress / 100} className="mt-4 bg-white/15" />
      </div>

      <div className="mt-9 rounded-3xl bg-white/8 p-5 backdrop-blur-sm">
        <div className="[&_*]:!text-primary-foreground">
          <StepList steps={steps} />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button variant="outline" size="lg" fullWidth className="border-white/25 bg-transparent text-primary-foreground hover:bg-white/10" onClick={() => setFailed(true)}>
          Cancel generation
        </Button>
      </div>
    </div>
  );
}
