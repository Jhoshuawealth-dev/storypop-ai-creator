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
        { key: "brand.niche", label: "Niche", allowOther: true, options: ["E-commerce & DTC", "Beauty & Skincare", "Fitness & Health", "Tech & SaaS", "Fashion & Apparel", "Food & Beverage", "Finance & Crypto", "Real Estate", "Education & Coaching", "Travel", "Gaming", "Home & Living", "Parenting", "Entertainment & Comedy", "Faith & Inspiration"] },
        { key: "brand.audience", label: "Target audience", allowOther: true, options: ["Gen Z (18–24)", "Millennials (25–34)", "Working professionals", "Busy parents", "College students", "Entrepreneurs & business owners", "Fitness seekers", "Bargain hunters", "Luxury shoppers", "Gamers", "Seniors (55+)"] },
        { key: "brand.tone", label: "Brand tone", options: ["Friendly", "Energetic", "Professional", "Funny", "Luxury", "Educational"] },
        { key: "brand.website", label: "Website", placeholder: "https://" },
        { key: "brand.avoid", label: "Words or topics to avoid", placeholder: "Anything AI should never say", multiline: true },
      ]}
    />
  );
}
