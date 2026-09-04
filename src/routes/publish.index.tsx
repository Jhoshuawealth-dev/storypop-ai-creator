import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publish/")({
  head: pageHead("Publish", "Choose where to publish your video."),
  component: PublishScreen,
});

function PublishScreen() {
  const navigate = useNavigate();
  const { socialAccounts, draft, updatePost_Draft } = useApp();
  const selected = draft.post.platforms;

  const toggle = (id: string) =>
    updatePost_Draft({
      platforms: selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id],
    });

  return (
    <FlowShell title="Publish" backTo="/create/result">
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Where should this go?
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Select one or more connected platforms.</p>

      <div className="mt-5 space-y-3">
        {socialAccounts.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => {
                if (!p.connected) {
                  toast.error(`Connect ${p.name} in Settings → Social Accounts first.`);
                  return;
                }
                toggle(p.id);
              }}
              className={cn(
                "flex w-full items-center gap-3.5 rounded-2xl bg-card p-4 text-left shadow-card transition-all active:scale-[0.99]",
                isSelected && "ring-2 ring-primary",
                !p.connected && "opacity-60"
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                {p.name.slice(0, 2)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-foreground">{p.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {p.connected ? p.handle || "Connected" : "Not connected"}
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

      <Link to="/settings/social" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-primary">
        <Link2 className="h-4 w-4" /> Manage connected accounts
      </Link>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        onClick={() => {
          if (selected.length === 0) {
            toast.error("Select at least one platform.");
            return;
          }
          navigate({ to: "/publish/details" });
        }}
      >
        Next
      </Button>
    </FlowShell>
  );
}
