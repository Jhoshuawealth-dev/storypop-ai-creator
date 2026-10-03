import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/growth/experiments")({
  head: pageHead("Experiment Engine", "Plan controlled creative tests for your content."),
  component: () => <WorkspaceFeature featureKey="experiments" />,
});