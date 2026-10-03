import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/competitors")({
  head: pageHead("Competitor Radar", "Study public content patterns and find original creative gaps."),
  component: () => <WorkspaceFeature featureKey="competitors" />,
});