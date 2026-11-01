import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/voices")({
  head: pageHead("Characters & Voices", "Pick the character and voice used by default in new videos."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Characters & Voices"
      description="Pick the character and voice used by default in new videos."
      fields={[
        { key: "voice.default", label: "Default voice", options: ["Ada · Warm", "David · Energetic", "Zara · Calm", "Tunde · Deep"] },
        { key: "voice.speed", label: "Speaking speed", options: ["Normal", "Slow", "Fast"] },
        { key: "voice.consent", label: "Allow voice cloning of my own voice", toggle: true, hint: "Only ever used with your explicit permission." },
      ]}
      notice="Manage your saved characters from the Characters page."
    />
  );
}
