import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/ai")({
  head: pageHead("AI Preferences", "Default choices Storypop AI uses whenever you start a new video."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="AI Preferences"
      description="Default choices Storypop AI uses whenever you start a new video."
      fields={[
        { key: "ai.language", label: "Script language", options: ["English", "Nigerian Pidgin", "French", "Spanish", "Portuguese", "Yoruba", "Igbo", "Hausa"] },
        { key: "ai.length", label: "Default video length", options: ["15 seconds", "30 seconds", "45 seconds", "60 seconds"] },
        { key: "ai.format", label: "Default format", options: ["9:16 Vertical", "16:9 Landscape", "1:1 Square"] },
        { key: "ai.hookStyle", label: "Hook style", options: ["Question", "Bold claim", "Story", "Problem / solution", "Surprising fact"] },
        { key: "ai.captions", label: "Auto-add captions", toggle: true },
        { key: "ai.music", label: "Auto-add background music", toggle: true },
      ]}
      notice={undefined}
    />
  );
}
