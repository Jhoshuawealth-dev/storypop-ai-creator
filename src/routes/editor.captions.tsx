import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { captionMock } from "@/lib/mock-data";

export const Route = createFileRoute("/editor/captions")({
  head: pageHead("Caption & Hashtags", "Generate captions and hashtags with AI."),
  component: CaptionEditor,
});

export function CaptionHashtagEditor({ backTo }: { backTo: string }) {
  const [caption, setCaption] = useState(captionMock.caption);
  const [cta, setCta] = useState(captionMock.cta);
  const [tags, setTags] = useState(captionMock.hashtags.join(" "));
  const [busy, setBusy] = useState(false);

  const regenerate = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Regenerated with AI");
    }, 1100);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <FlowShell title="Caption & Hashtags" backTo={backTo}>
      <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Caption</p>
          <button onClick={() => copy(caption, "Caption")} aria-label="Copy caption" className="text-muted-foreground hover:text-primary">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <TextArea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-2 min-h-24 border-none bg-transparent px-0 focus:ring-0"
        />
      </section>

      <section className="mt-3 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Hashtags</p>
          <button onClick={() => copy(tags, "Hashtags")} aria-label="Copy hashtags" className="text-muted-foreground hover:text-primary">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <TextArea
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mt-2 min-h-20 border-none bg-transparent px-0 font-semibold text-primary focus:ring-0"
        />
      </section>

      <section className="mt-3 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Call to action</p>
          <button onClick={() => copy(cta, "CTA")} aria-label="Copy call to action" className="text-muted-foreground hover:text-primary">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <TextArea
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          className="mt-2 min-h-16 border-none bg-transparent px-0 focus:ring-0"
        />
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => copy(`${caption}\n\n${tags}\n\n${cta}`, "Everything")}>
          <Copy className="h-4 w-4" /> Copy all
        </Button>
        <Button variant="outline" onClick={regenerate} loading={busy}>
          {!busy && <RefreshCw className="h-4 w-4" />} Regenerate
        </Button>
      </div>
    </FlowShell>
  );
}

function CaptionEditor() {
  return <CaptionHashtagEditor backTo="/editor" />;
}
