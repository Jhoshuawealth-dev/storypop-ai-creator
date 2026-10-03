import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/intelligence/content-dna")({
  head: pageHead("Content DNA", "Explore your content themes, hooks, formats, and publishing patterns."),
  component: () => <WorkspaceFeature featureKey="content-dna" />,
});