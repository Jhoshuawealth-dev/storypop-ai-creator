import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/growth/revenue")({
  head: pageHead("Revenue Intelligence", "Review revenue signals across content and platforms."),
  component: () => <WorkspaceFeature featureKey="revenue" />,
});