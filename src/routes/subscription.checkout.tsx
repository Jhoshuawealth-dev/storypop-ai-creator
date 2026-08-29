import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { plans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscription/checkout")({
  head: pageHead("Checkout", "Complete your Storypop AI subscription."),
  component: Checkout,
});

const methods = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "transfer", label: "Bank transfer", icon: Landmark },
  { id: "ussd", label: "USSD", icon: Smartphone },
];

function Checkout() {
  const navigate = useNavigate();
  const plan = plans.find((p) => p.id === "pro")!;
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <FlowShell title="Payment failed" backTo="/subscription">
        <ErrorState
          title="Payment failed"
          description="Your bank declined the transaction. No money was taken — try again or use another method."
          onRetry={() => setFailed(false)}
          retryLabel="Try again"
          secondaryLabel="Back to plans"
          secondaryTo="/subscription"
        />
      </FlowShell>
    );
  }

  const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly;

  return (
    <FlowShell title="Checkout" backTo="/subscription">
      <section className="mt-5 rounded-3xl bg-card p-5 shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected plan</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <h1 className="font-display text-xl font-extrabold text-foreground">{plan.name}</h1>
          <p className="font-display text-2xl font-extrabold text-primary">{price}</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{plan.minutes}</p>
      </section>

      <p className="mt-6 text-sm font-bold text-foreground">Billing cycle</p>
      <div className="mt-2.5 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
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
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-bold text-foreground">Payment method</p>
      <div className="mt-2.5 space-y-2.5">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-2xl bg-card p-4 text-left shadow-card transition-all",
              method === m.id && "ring-2 ring-primary"
            )}
          >
            <m.icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
            <span className="flex-1 font-bold text-foreground">{m.label}</span>
            <span
              className={cn(
                "h-5 w-5 shrink-0 rounded-full border-2 transition-colors",
                method === m.id ? "border-[6px] border-primary" : "border-input"
              )}
            />
          </button>
        ))}
      </div>

      <dl className="mt-6 divide-y divide-border rounded-2xl bg-card px-4 shadow-card">
        <div className="flex justify-between py-3.5">
          <dt className="text-sm text-muted-foreground">Subtotal</dt>
          <dd className="text-sm font-bold text-foreground">{price}</dd>
        </div>
        <div className="flex justify-between py-3.5">
          <dt className="text-sm text-muted-foreground">VAT (7.5%)</dt>
          <dd className="text-sm font-bold text-foreground">Included</dd>
        </div>
        <div className="flex justify-between py-3.5">
          <dt className="font-bold text-foreground">Total due today</dt>
          <dd className="font-display text-lg font-extrabold text-primary">{price}</dd>
        </div>
      </dl>

      <Button
        size="lg"
        fullWidth
        className="mt-6"
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate({ to: "/subscription/success" });
          }, 1600);
        }}
      >
        {loading ? "Processing payment..." : `Pay ${price}`}
      </Button>
      <button onClick={() => setFailed(true)} className="mx-auto mt-3 block text-xs font-semibold text-muted-foreground">
        Simulate a failed payment
      </button>
    </FlowShell>
  );
}
