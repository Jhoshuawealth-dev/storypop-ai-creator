import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { formatDate, formatDuration, plans } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/subscription/manage")({
  head: pageHead("Manage Subscription", "Review and change your plan."),
  component: ManageSubscription,
});

function ManageSubscription() {
  const navigate = useNavigate();
  const { subscription, minutesTotal, minutesUsed, planName, cancelPlan } = useApp();
  const remaining = Math.max(0, minutesTotal - minutesUsed);
  const plan = plans.find((p) => p.id === subscription.planId);
  const isFree = !subscription.planId;
  const price = plan ? (subscription.billing === "yearly" ? plan.priceYearly : plan.priceMonthly) : "Free";

  return (
    <AppShell title="Subscription" showBack backTo="/profile">
      <section className="mt-5 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-primary-light">Current plan</p>
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold">
            {isFree ? "Free" : "Active"}
          </span>
        </div>
        <p className="mt-1.5 font-display text-2xl font-extrabold">{planName} Plan</p>
        <p className="text-sm text-primary-light">
          {isFree
            ? "No payment method required"
            : `${price} / ${subscription.billing === "yearly" ? "year" : "month"} · renews ${formatDate(subscription.renewsOn)}`}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-primary-light">
            <span>Video allowance</span>
            <span>
              {formatDuration(remaining)} of {formatDuration(minutesTotal)} left
            </span>
          </div>
          <ProgressBar value={minutesTotal ? remaining / minutesTotal : 0} className="mt-2 bg-white/15" />
        </div>
      </section>

      <dl className="mt-4 divide-y divide-border rounded-2xl bg-card px-4 shadow-card">
        {[
          ["Billing cycle", isFree ? "—" : subscription.billing === "yearly" ? "Yearly" : "Monthly"],
          ["Next charge", isFree ? "—" : formatDate(subscription.renewsOn)],
          ["Payment method", isFree ? "None added" : "Saved card"],
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
            {isFree ? "Choose a plan" : "Upgrade or change plan"}
          </Button>
        </Link>
        <Link to="/subscription/credits" className="block">
          <Button size="lg" variant="outline" fullWidth>
            Buy additional minutes
          </Button>
        </Link>
        {!isFree && (
          <Button
            size="lg"
            variant="danger"
            fullWidth
            onClick={() => {
              cancelPlan();
              toast.success("Your plan was cancelled. You're back on the Free plan.");
              navigate({ to: "/profile" });
            }}
          >
            Cancel subscription
          </Button>
        )}
      </div>
    </AppShell>
  );
}
