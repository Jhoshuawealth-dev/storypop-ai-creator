import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { platforms, thumbSneaker } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publish/")({
  head: pageHead("Publish", "Choose where to publish your video."),
  component: PublishScreen,
});

function PublishScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(["tiktok"]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  return (
    <FlowShell title="Publish" backTo="/create/result">
      <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-card p-3 shadow-card">
        <img src={thumbSneaker} alt="Sneaker Promo" className="h-16 w-14 rounded-xl object-cover" loading="lazy" />
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">Sneaker Promo</p>
          <p className="text-xs text-muted-foreground">0:30 · 9:16 portrait</p>
        </div>
      </div>

      <h1 className="mt-7 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Where should this go?
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Select one or more platforms.</p>

      <div className="mt-5 space-y-3">
        {platforms.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-2xl bg-card p-4 text-left shadow-card transition-all active:scale-[0.99]",
                isSelected && "ring-2 ring-primary"
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                {p.name.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-foreground">{p.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {p.connected ? p.handle : "Not connected"}
                </span>
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        onClick={() => {
          if (selected.length === 0) {
            toast.error("Select at least one platform.");
            return;
          }
          navigate({ to: "/publish/caption" });
        }}
      >
        Next
      </Button>
    </FlowShell>
  );
}
