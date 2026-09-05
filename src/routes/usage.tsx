import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { formatDate, formatDuration } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/usage")({
  head: pageHead("Video Usage", "Track your monthly video minutes."),
  component: Usage,
});

function Usage() {
  const { minutesTotal, minutesUsed, planName, subscription } = useApp();
  const remaining = Math.max(0, minutesTotal - minutesUsed);

  return (
    <AppShell title="Video Usage" showBack backTo="/home">
      <div className="mt-6 flex flex-col items-center rounded-3xl bg-card p-7 shadow-card">
        <span className="rounded-full bg-primary-soft px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
          {planName} plan
        </span>
        <ProgressRing value={minutesTotal ? remaining / minutesTotal : 0} size={180} stroke={16} className="mt-6">
          <span className="font-display text-3xl font-extrabold text-foreground">{formatDuration(remaining)}</span>
          <span className="text-xs font-semibold text-muted-foreground">of {formatDuration(minutesTotal)}</span>
        </ProgressRing>

        <div className="mt-7 grid w-full grid-cols-3 divide-x divide-border text-center">
          <div>
            <p className="font-display text-lg font-extrabold text-foreground">{formatDuration(minutesUsed)}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Used</p>
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-primary">{formatDuration(remaining)}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Remaining</p>
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-foreground">{formatDate(subscription.renewsOn)}</p>
            <p className="text-[11px] font-semibold text-muted-foreground">Reset date</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-primary-soft/70 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-secondary-foreground">
          Your video allowance resets every billing cycle. Unused minutes don't roll over.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <Link to="/subscription" className="block">
          <Button size="lg" fullWidth>
            Upgrade Plan
          </Button>
        </Link>
        <Link to="/subscription/credits" className="block">
          <Button size="lg" variant="outline" fullWidth>
            Buy Additional Minutes
          </Button>
        </Link>
      </div>
    </AppShell>
  );
}
