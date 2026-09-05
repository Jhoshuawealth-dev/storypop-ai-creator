import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { creditPacks, formatDuration } from "@/lib/catalog";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscription/credits")({
  head: pageHead("Buy Minutes", "Top up your video minutes."),
  component: Credits,
});

function Credits() {
  const navigate = useNavigate();
  const [pack, setPack] = useState(creditPacks[1]!.id);
  const { minutesTotal, minutesUsed } = useApp();
  const remaining = Math.max(0, minutesTotal - minutesUsed);

  return (
    <AppShell title="Buy Minutes" showBack backTo="/subscription/manage">
      <div className="mt-5 rounded-2xl bg-primary-soft/70 p-4">
        <p className="text-sm font-bold text-secondary-foreground">
          You have {formatDuration(remaining)} left this cycle
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Extra minutes never expire and are used after your monthly allowance runs out.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {creditPacks.map((c) => (
          <button
            key={c.id}
            onClick={() => setPack(c.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl bg-card p-5 text-left shadow-card transition-all",
              pack === c.id && "ring-2 ring-primary"
            )}
          >
            <span>
              <span className="block font-display text-xl font-extrabold text-foreground">{c.minutes} minutes</span>
              <span className="block text-xs text-muted-foreground">One-time top-up</span>
            </span>
            <span className="font-display text-lg font-extrabold text-primary">{c.price}</span>
          </button>
        ))}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => navigate({ to: "/subscription/checkout" })}>
        Continue to payment
      </Button>
    </AppShell>
  );
}
