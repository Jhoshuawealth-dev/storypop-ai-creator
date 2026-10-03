import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/growth/community")({
  head: pageHead("Community Agent", "Organize audience feedback into ideas, replies, and FAQs."),
  component: () => <WorkspaceFeature featureKey="community" />,
});