import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { platforms } from "@/lib/mock-data";

export const Route = createFileRoute("/settings/social")({
  head: pageHead("Social Accounts", "Connect the platforms you publish to."),
  component: SocialAccounts,
});

function SocialAccounts() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map((p) => [p.id, p.connected]))
  );

  return (
    <AppShell title="Social Accounts" showBack backTo="/profile">
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Connect your accounts to publish and schedule videos directly from Storypop AI.
      </p>

      <div className="mt-5 space-y-3">
        {platforms.map((p) => {
          const isOn = connected[p.id];
          return (
            <div key={p.id} className="flex items-center gap-3.5 rounded-2xl bg-card p-4 shadow-card">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                {p.name.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-foreground">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{isOn ? p.handle : "Not connected"}</p>
              </div>
              <Button
                size="sm"
                variant={isOn ? "outline" : "primary"}
                onClick={() => {
                  setConnected((prev) => ({ ...prev, [p.id]: !isOn }));
                  toast.success(isOn ? `${p.name} disconnected` : `${p.name} connected`);
                }}
              >
                {isOn ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
