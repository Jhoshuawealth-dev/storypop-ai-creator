import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/brain")({
  head: pageHead("Storypop Brain", "Shape Storypop’s creative profile around your brand and audience."),
  component: () => <WorkspaceFeature featureKey="brain" />,
});