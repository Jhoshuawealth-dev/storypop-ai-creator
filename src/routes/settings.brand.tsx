import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/brand")({
  head: pageHead("Brand Kit", "Tell Storypop AI about your brand so scripts, captions and visuals match your voice."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Brand Kit"
      description="Tell Storypop AI about your brand so scripts, captions and visuals match your voice."
      fields={[
        { key: "brand.name", label: "Brand or creator name", placeholder: "e.g. Ada Sneakers" },
        { key: "brand.niche", label: "Niche", placeholder: "e.g. Streetwear, fitness, skincare" },
        { key: "brand.audience", label: "Target audience", placeholder: "Who are your videos for?", multiline: true },
        { key: "brand.tone", label: "Brand tone", options: ["Friendly", "Energetic", "Professional", "Funny", "Luxury", "Educational"] },
        { key: "brand.website", label: "Website", placeholder: "https://" },
        { key: "brand.avoid", label: "Words or topics to avoid", placeholder: "Anything AI should never say", multiline: true },
      ]}
    />
  );
}
