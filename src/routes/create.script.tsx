import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create/script")({
  head: pageHead("AI Script", "Review and refine your AI-generated script."),
  component: ScriptScreen,
});

const refinements = ["Make Shorter", "Make Funnier", "Make More Persuasive", "Strengthen Hook"];

function ScriptScreen() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [tab, setTab] = useState<"script" | "hook" | "cta">("script");
  const [regenerating, setRegenerating] = useState(false);

  const refine = (label: string) => {
    setRegenerating(true);
    setTimeout(() => {
      setRegenerating(false);
      toast.success(`Applied: ${label}`);
    }, 1100);
  };

  return (
    <FlowShell title="AI Script" backTo="/create/idea">
      <ProgressBar value={3 / 7} className="mt-4" />

      <div className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
        {(["script", "hook", "cta"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "h-9 rounded-full text-sm font-bold uppercase transition-all",
              tab === t ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={cn("mt-5 space-y-4", regenerating && "animate-pulse opacity-60")}>
        {(tab === "script" || tab === "hook") && (
          <section className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Hook</p>
            <TextArea
              value={draft.script.hook}
              onChange={(e) => updateDraft({ script: { ...draft.script, hook: e.target.value } })}
              className="mt-2 min-h-16 border-none bg-transparent px-0 text-[17px] font-bold leading-snug focus:ring-0"
            />
          </section>
        )}

        {tab === "script" && (
          <section className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Main Script</p>
            <TextArea
              value={draft.script.body}
              onChange={(e) => updateDraft({ script: { ...draft.script, body: e.target.value } })}
              className="mt-2 min-h-40 border-none bg-transparent px-0 text-[15px] leading-relaxed focus:ring-0"
            />
          </section>
        )}

        {(tab === "script" || tab === "cta") && (
          <section className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Call to action</p>
            <TextArea
              value={draft.script.cta}
              onChange={(e) => updateDraft({ script: { ...draft.script, cta: e.target.value } })}
              className="mt-2 min-h-16 border-none bg-transparent px-0 text-[15px] font-semibold leading-snug focus:ring-0"
            />
          </section>
        )}
      </div>

      <p className="mt-6 text-sm font-bold text-foreground">Refine with AI</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {refinements.map((r) => (
          <button
            key={r}
            onClick={() => refine(r)}
            className="rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent"
          >
            {r}
          </button>
        ))}
        <button
          onClick={() => refine("Regenerate")}
          className="flex items-center gap-1.5 rounded-full bg-primary-soft px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", regenerating && "animate-spin")} /> Regenerate
        </button>
      </div>

      <Button size="lg" fullWidth className="mt-7" onClick={() => navigate({ to: "/create/scenes" })}>
        Continue
      </Button>
    </FlowShell>
  );
}
