import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/apps")({
  head: pageHead("Connected Apps", "Other tools you'd like to link with Storypop AI."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Connected Apps"
      description="Other tools you'd like to link with Storypop AI."
      fields={[
        { key: "apps.drive", label: "Google Drive", toggle: true },
        { key: "apps.canva", label: "Canva", toggle: true },
        { key: "apps.shopify", label: "Shopify", toggle: true },
        { key: "apps.zapier", label: "Zapier", toggle: true },
      ]}
      notice="These connections are saved as your preference and will activate when each app link goes live."
    />
  );
}
