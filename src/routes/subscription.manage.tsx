import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { formatDuration, usage } from "@/lib/mock-data";

export const Route = createFileRoute("/subscription/manage")({
  head: pageHead("Manage Subscription", "Review and change your plan."),
  component: ManageSubscription,
});

function ManageSubscription() {
  const remaining = usage.totalSeconds - usage.usedSeconds;

  return (
    <AppShell title="Subscription" showBack backTo="/profile">
      <section className="mt-5 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-light">Current plan</p>
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold">Active</span>
        </div>
        <p className="mt-1.5 font-display text-2xl font-extrabold">Pro Plan</p>
        <p className="text-sm text-primary-light">₦24,900 / month · renews {usage.resetDate}</p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-primary-light">
            <span>Video allowance</span>
            <span>
              {formatDuration(remaining)} of {formatDuration(usage.totalSeconds)} left
            </span>
          </div>
          <ProgressBar value={remaining / usage.totalSeconds} className="mt-2 bg-white/15" />
        </div>
      </section>

      <dl className="mt-4 divide-y divide-border rounded-2xl bg-card px-4 shadow-card">
        {[
          ["Billing cycle", "Monthly"],
          ["Next charge", usage.resetDate],
          ["Payment method", "Card ending 4291"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3.5">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd className="text-sm font-bold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3">
        <Link to="/subscription" className="block">
          <Button size="lg" fullWidth>
            Upgrade or change plan
          </Button>
        </Link>
        <Link to="/subscription/credits" className="block">
          <Button size="lg" variant="outline" fullWidth>
            Buy additional minutes
          </Button>
        </Link>
        <Button size="lg" variant="outline" fullWidth onClick={() => toast.info("Billing details updated")}>
          Change billing details
        </Button>
        <Button size="lg" variant="danger" fullWidth onClick={() => toast.info("Subscription cancellation started")}>
          Cancel subscription
        </Button>
      </div>
    </AppShell>
  );
}
