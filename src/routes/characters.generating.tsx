import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar, StepList, type GenStep } from "@/components/ui/progress-ring";
import { ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { readCharacterDraft } from "@/lib/character-draft";

export const Route = createFileRoute("/characters/generating")({
  head: pageHead("Creating Character", "Your AI character is being generated."),
  component: CharacterGenerating,
});

const stepLabels = ["Analyzing photo", "Building facial model", "Applying style", "Creating character"];

function CharacterGenerating() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState("");
  const [progress, setProgress] = useState(5);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setPhoto(readCharacterDraft().photo);
  }, []);

  useEffect(() => {
    if (failed) return;
    if (progress >= 100) {
      const t = setTimeout(() => navigate({ to: "/characters/preview" }), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + Math.random() * 9 + 3)), 280);
    return () => clearTimeout(t);
  }, [progress, failed, navigate]);

  const activeIndex = Math.min(stepLabels.length - 1, Math.floor((progress / 100) * stepLabels.length));
  const steps: GenStep[] = stepLabels.map((label, i) => ({
    label,
    status: i < activeIndex ? "done" : i === activeIndex ? "active" : "pending",
  }));

  if (failed) {
    return (
      <FlowShell title="Generation failed" backTo="/characters/style">
        <ErrorState
          title="Character generation failed"
          description="We couldn't build your character from that photo. Try a clearer, well-lit photo of your face."
          onRetry={() => {
            setFailed(false);
            setProgress(5);
          }}
          retryLabel="Try again"
          secondaryLabel="Upload another photo"
          secondaryTo="/characters/upload"
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Creating Character" backTo="/characters/style">
      <div className="mt-6 flex flex-col items-center">
        <div className="relative">
          {photo ? (
            <img
              src={photo}
              alt="Your photo being processed"
              className="h-40 w-40 rounded-3xl object-cover opacity-70"
            />
          ) : (
            <span className="block h-40 w-40 rounded-3xl bg-primary-soft" />
          )}
          <span className="absolute inset-0 animate-dot-pulse rounded-3xl ring-4 ring-primary" />
        </div>
        <p className="mt-6 font-display text-4xl font-extrabold tabular-nums text-foreground">
          {Math.round(progress)}%
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Generating your animated identity...</p>
        <ProgressBar value={progress / 100} className="mt-4" />
      </div>

      <div className="mt-8 rounded-2xl bg-card p-5 shadow-card">
        <StepList steps={steps} />
      </div>

      <Button variant="outline" size="lg" fullWidth className="mt-6" onClick={() => setFailed(true)}>
        Cancel
      </Button>
    </FlowShell>
  );
}
