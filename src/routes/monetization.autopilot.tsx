import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/monetization/autopilot")({
  head: pageHead("Affiliate Autopilot", "Plan a reviewable affiliate content workflow."),
  component: () => <WorkspaceFeature featureKey="affiliate-autopilot" />,
});