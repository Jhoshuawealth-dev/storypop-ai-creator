import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/growth/autopilot")({
  head: pageHead("Autopilot", "Configure a reviewable content planning and publishing strategy."),
  component: () => <WorkspaceFeature featureKey="autopilot" />,
});