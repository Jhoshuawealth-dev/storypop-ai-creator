import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/trends")({
  head: pageHead("Trend-to-You", "Adapt emerging formats to your niche and audience."),
  component: () => <WorkspaceFeature featureKey="trends" />,
});