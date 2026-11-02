import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/publishing")({
  head: pageHead("Publishing Defaults", "How your posts are prepared before they go to your social accounts."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Publishing Defaults"
      description="How your posts are prepared before they go to your social accounts."
      fields={[
        { key: "pub.caption", label: "Default caption ending", placeholder: "e.g. Follow for more tips 👇", multiline: true },
        { key: "pub.hashtags", label: "Always-include hashtags", placeholder: "#storypop #ugc" },
        { key: "pub.time", label: "Preferred posting time", options: ["Best time (AI suggested)", "Morning (8–10 AM)", "Afternoon (12–2 PM)", "Evening (6–9 PM)"] },
        { key: "pub.timezone", label: "Time zone", options: ["Africa/Lagos (WAT)", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Dubai"] },
        { key: "pub.seo", label: "Suggest SEO titles and tags", toggle: true },
        { key: "pub.review", label: "Ask me to review before every post", toggle: true },
      ]}
    />
  );
}
