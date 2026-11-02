import { createFileRoute } from "@tanstack/react-router";
import { SettingsSection } from "@/components/features/settings-section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/settings/affiliate")({
  head: pageHead("Affiliate Settings", "Details used when you turn affiliate products into videos."),
  component: Page,
});

function Page() {
  return (
    <SettingsSection
      title="Affiliate Settings"
      description="Details used when you turn affiliate products into videos."
      fields={[
        { key: "aff.networks", label: "Affiliate networks you use", placeholder: "e.g. Amazon Associates, Jumia KOL, Selar" },
        { key: "aff.disclosure", label: "Disclosure text", placeholder: "#ad · I may earn from links in this post" },
        { key: "aff.autoDisclose", label: "Always add disclosure to affiliate posts", toggle: true },
      ]}
    />
  );
}
