import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { aiInsights } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics/insights")({
  head: pageHead("AI Insights", "AI-generated insights about your content."),
  component: Insights,
});

function Insights() {
  return (
    <AppShell title="AI Insights" showBack backTo="/analytics">
      <div className="mt-5 rounded-3xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
        <Sparkles className="h-6 w-6" />
        <p className="mt-3 font-display text-lg font-extrabold leading-snug">
          Here's what your last 30 days of content is telling us.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {aiInsights.map((insight, i) => (
          <article key={i} className="flex items-start gap-3.5 rounded-2xl bg-card p-4 shadow-card">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
              {i + 1}
            </span>
            <p className="text-[15px] leading-relaxed text-foreground">{insight}</p>
          </article>
        ))}
      </div>

      <Link to="/create/idea" className="mt-6 block">
        <Button size="lg" fullWidth>
          Create More Like This
        </Button>
      </Link>
    </AppShell>
  );
}
