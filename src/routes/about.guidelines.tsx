import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about/guidelines")({
  head: pageHead("Content Guidelines", "What you can and can't create with Storypop AI."),
  component: Guidelines,
});

const allowed = [
  "Product promos, reviews and demos for your own brand",
  "Educational and how-to content",
  "Characters based on yourself or people who consented",
  "Parody and satire that's clearly labelled",
  "Ads that follow each platform's advertising policies",
];

const notAllowed = [
  "Impersonating real people without disclosure or consent",
  "Deepfakes intended to deceive, defame or harass",
  "Hate speech, harassment or incitement to violence",
  "Misinformation presented as factual news",
  "Adult, sexual or exploitative content",
  "Content that infringes others' IP rights",
];

function Guidelines() {
  return (
    <AppShell title="Content Guidelines" showBack backTo="/about">
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Storypop AI is built for authentic, responsible creator content. These rules keep the platform safe for everyone.
      </p>

      <SectionHeader title="What's welcome" />
      <div className="space-y-2.5">
        {allowed.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-card">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.8} />
            <p className="text-sm leading-relaxed text-foreground">{item}</p>
          </div>
        ))}
      </div>

      <SectionHeader title="What's not allowed" />
      <div className="space-y-2.5">
        {notAllowed.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-card">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={1.8} />
            <p className="text-sm leading-relaxed text-foreground">{item}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        Violations can lead to content removal or account suspension. Repeated violations lead to a permanent ban.
        Report abuse anytime from Help & Support or at safety@storypop.ai.
      </p>
    </AppShell>
  );
}
