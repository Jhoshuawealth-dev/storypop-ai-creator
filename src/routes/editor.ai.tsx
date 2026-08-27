import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { suggestedCommands, thumbSneaker } from "@/lib/mock-data";

export const Route = createFileRoute("/editor/ai")({
  head: pageHead("AI Editor", "Tell AI what to change in your video."),
  component: AiEditor,
});

function AiEditor() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const apply = () => {
    if (!prompt.trim()) {
      toast.error("Describe the change you want first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("AI edit applied to your video.");
    }, 1600);
  };

  return (
    <FlowShell title="AI Editor" backTo="/editor">
      <div className="mt-4 overflow-hidden rounded-3xl shadow-card">
        <img src={thumbSneaker} alt="Current video" className="aspect-video w-full object-cover" loading="lazy" />
      </div>

      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Tell AI what to change
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">
        Describe your edit in plain words — no editing skills needed.
      </p>

      <TextArea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Make this video more energetic..."
        className="mt-4 min-h-28"
      />

      <p className="mt-5 text-sm font-bold text-foreground">Try also</p>
      <div className="mt-2.5 space-y-2">
        {suggestedCommands.map((c) => (
          <button
            key={c}
            onClick={() => setPrompt(c)}
            className="flex w-full items-center gap-2.5 rounded-2xl bg-card p-3.5 text-left text-sm font-semibold text-foreground shadow-card transition-transform active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            {c}
          </button>
        ))}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={apply} loading={loading}>
        {loading ? "Applying AI edit..." : "Apply AI Edit"}
      </Button>
    </FlowShell>
  );
}
