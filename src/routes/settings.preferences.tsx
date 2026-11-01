import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/preferences")({
  head: pageHead("App Preferences", "Language, appearance and other everyday choices."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="App Preferences"
      description="Language, appearance and other everyday choices."
      fields={[
        { key: "app.language", label: "App language", options: ["English", "French", "Spanish", "Portuguese"] },
        { key: "app.theme", label: "Appearance", options: ["System", "Light", "Dark"] },
        { key: "app.currency", label: "Currency", options: ["USD ($)", "NGN (₦)", "GBP (£)", "EUR (€)"] },
        { key: "app.sounds", label: "Sounds and haptics", toggle: true },
        { key: "app.autoplay", label: "Autoplay video previews", toggle: true },
      ]}
      notice={undefined}
    />
  );
}
