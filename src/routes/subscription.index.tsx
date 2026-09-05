import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { plans } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscription/")({
  head: pageHead("Pricing Plans", "Choose the Storypop AI plan that fits your output."),
  component: Pricing,
});

function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const currentPlan = "pro";

  return (
    <AppShell title="Plans" showBack backTo="/profile">
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Pick your creator plan
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">Every plan includes AI scripts, characters and publishing.</p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={cn(
              "h-10 rounded-full text-sm font-bold capitalize transition-all",
              billing === b ? "bg-card text-primary shadow-card" : "text-muted-foreground"
            )}
          >
            {b}
            {b === "yearly" && <span className="ml-1 text-[11px] font-extrabold">−17%</span>}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const featured = plan.recommended;
          return (
            <article
              key={plan.id}
              className={cn(
                "relative rounded-3xl p-5 shadow-card",
                featured ? "bg-primary-deep text-primary-foreground shadow-fab" : "bg-card"
              )}
            >
              {featured && (
                <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary-foreground">
                  Recommended
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <h2 className={cn("font-display text-xl font-extrabold", !featured && "text-foreground")}>
                  {plan.name}
                </h2>
                {isCurrent && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-extrabold",
                      featured ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"
                    )}
                  >
                    Current plan
                  </span>
                )}
              </div>
              <p className={cn("mt-2 font-display text-3xl font-extrabold", !featured && "text-foreground")}>
                {billing === "monthly" ? plan.priceMonthly : plan.priceYearly}
                <span className={cn("text-sm font-semibold", featured ? "text-primary-light" : "text-muted-foreground")}>
                  /{billing === "monthly" ? "month" : "year"}
                </span>
              </p>
              <p className={cn("mt-1 text-sm font-bold", featured ? "text-primary-light" : "text-primary")}>
                {plan.minutes}
              </p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={cn("mt-0.5 h-4 w-4 shrink-0", featured ? "text-primary-light" : "text-primary")}
                      strokeWidth={3}
                    />
                    <span className={cn("text-sm", featured ? "text-primary-light" : "text-muted-foreground")}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link to="/subscription/checkout" className="mt-5 block">
                <Button
                  fullWidth
                  size="lg"
                  variant={featured ? "primary" : "outline"}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Your current plan" : `Upgrade to ${plan.name}`}
                </Button>
              </Link>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
