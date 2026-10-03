import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/analytics/insights")({
  head: pageHead("AI Insights", "AI-generated insights about your content."),
  component: Insights,
});

function Insights() {
  const { posts } = useApp();
  return (
    <AppShell title="AI Insights" showBack backTo="/analytics">
      {posts.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Insights will grow with your content"
          description="Publish videos and connect your channels to see personalized recommendations here."
          actionLabel="Create Video"
          actionTo="/create"
        />
      ) : (
        <>
          <div className="mt-5 rounded-2xl bg-primary-deep p-5 text-primary-foreground shadow-fab">
            <Sparkles className="h-6 w-6" />
            <p className="mt-3 font-display text-lg font-extrabold leading-snug">
              Your published content is ready to analyze.
            </p>
            <p className="mt-2 text-sm text-primary-light">
              {posts.length} {posts.length === 1 ? "post is" : "posts are"} in your publishing history. Platform metrics will appear when available.
            </p>
          </div>
          <Link to="/create/idea" className="mt-6 block">
            <Button size="lg" fullWidth>
              Create Video
            </Button>
          </Link>
        </>
      )}
    </AppShell>
  );
}
