import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/editor/export")({
  head: pageHead("Export Video", "Export your finished video."),
  component: ExportScreen,
});

const groups = [
  { key: "Resolution", options: ["720p", "1080p", "4K"], initial: "1080p" },
  { key: "Aspect ratio", options: ["9:16", "16:9", "1:1"], initial: "9:16" },
  { key: "Quality", options: ["Standard", "High", "Max"], initial: "High" },
];

function ExportScreen() {
  const navigate = useNavigate();
  const [choices, setChoices] = useState<Record<string, string>>(
    Object.fromEntries(groups.map((g) => [g.key, g.initial]))
  );
  const [progress, setProgress] = useState<number | null>(null);

  const exportVideo = () => {
    setProgress(0);
    const tick = (p: number) => {
      if (p >= 100) {
        toast.success("Video exported to your device");
        setTimeout(() => navigate({ to: "/publish" }), 600);
        return;
      }
      setProgress(p);
      setTimeout(() => tick(p + 8), 180);
    };
    tick(0);
  };

  return (
    <FlowShell title="Export" backTo="/editor">
      {groups.map((g) => (
        <section key={g.key} className="mt-5">
          <p className="text-sm font-bold text-foreground">{g.key}</p>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {g.options.map((o) => (
              <button
                key={o}
                onClick={() => setChoices((c) => ({ ...c, [g.key]: o }))}
                className={cn(
                  "rounded-2xl py-3.5 text-sm font-bold transition-all",
                  choices[g.key] === o ? "bg-primary text-primary-foreground shadow-fab" : "bg-card text-foreground shadow-card"
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </section>
      ))}

      {progress !== null && (
        <div className="mt-7 rounded-2xl bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Exporting your video</p>
            <p className="text-sm font-bold tabular-nums text-primary">{Math.min(100, progress)}%</p>
          </div>
          <ProgressBar value={Math.min(100, progress) / 100} className="mt-2.5" />
        </div>
      )}

      <Button size="lg" fullWidth className="mt-7" onClick={exportVideo} loading={progress !== null && progress < 100}>
        {progress === null && <Download className="h-4 w-4" />} Export Video
      </Button>
    </FlowShell>
  );
}
