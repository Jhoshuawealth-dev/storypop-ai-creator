import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/monetization/affiliates")({
  head: pageHead("Affiliate Marketing", "Organize affiliate products, creative, and performance."),
  component: () => <WorkspaceFeature featureKey="affiliates" />,
});