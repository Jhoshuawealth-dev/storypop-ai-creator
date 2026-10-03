import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceFeature } from "@/components/features/workspace-feature";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/create/reverse-engineer")({
  head: pageHead("Viral Reverse Engineering", "Learn from video structure and create an original Storypop concept."),
  component: () => <WorkspaceFeature featureKey="reverse-engineer" />,
});