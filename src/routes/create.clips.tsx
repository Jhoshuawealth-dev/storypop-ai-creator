import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/create/clips")({
  head: pageHead("Storypop Clips", "Turn long-form video into short-form clip ideas."),
  component: () => <WorkspaceFeature featureKey="clips" />,
});