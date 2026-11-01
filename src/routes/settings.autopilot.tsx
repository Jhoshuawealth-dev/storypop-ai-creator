import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/autopilot")({
  head: pageHead("Autopilot", "Control how much Storypop AI can plan and prepare for you."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Autopilot"
      description="Control how much Storypop AI can plan and prepare for you."
      fields={[
        { key: "auto.enabled", label: "Turn on Autopilot", toggle: true },
        { key: "auto.frequency", label: "Posts per week", options: ["1", "3", "5", "7", "14"] },
        { key: "auto.approval", label: "Approval", options: ["Ask me before anything is posted", "Draft only, never post"] },
        { key: "auto.topics", label: "Topics to focus on", placeholder: "e.g. product tips, behind the scenes", multiline: true },
      ]}
      notice={undefined}
    />
  );
}
