import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/team")({
  head: pageHead("Team", "Invite teammates to your workspace. Available on Business and Enterprise plans."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Team"
      description="Invite teammates to your workspace. Available on Business and Enterprise plans."
      fields={[
        { key: "team.invite", label: "Invite by email", placeholder: "teammate@company.com" },
        { key: "team.role", label: "Role for new members", options: ["Editor", "Viewer", "Admin"] },
      ]}
      notice="Invites will be sent once team accounts are switched on for your workspace."
    />
  );
}
