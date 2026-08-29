import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/subscription/success")({
  head: pageHead("Payment Successful", "You're now on the Pro Plan."),
  component: PaymentSuccess,
});

function PaymentSuccess() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-dot-pulse rounded-full bg-primary/20" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-fab">
          <Check className="h-11 w-11 text-primary-foreground" strokeWidth={3} />
        </span>
      </div>

      <h1 className="mt-8 font-display text-2xl font-extrabold tracking-tight text-foreground">Payment successful!</h1>
      <p className="mt-2 max-w-64 text-[15px] leading-relaxed text-muted-foreground">
        You are now on the <span className="font-bold text-foreground">Pro Plan</span> with 8:00 video minutes every
        month.
      </p>

      <div className="mt-9 w-full space-y-3">
        <Link to="/create" className="block">
          <Button size="lg" fullWidth>
            Start Creating
          </Button>
        </Link>
        <Link to="/subscription/manage" className="block">
          <Button size="lg" variant="outline" fullWidth>
            Manage subscription
          </Button>
        </Link>
      </div>
    </div>
  );
}
