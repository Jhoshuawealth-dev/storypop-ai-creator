import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextArea, Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/create/idea")({
  head: pageHead("Content Idea", "Describe the UGC video you want to create."),
  component: Idea,
});

const examples = [
  "Create a funny 30-second UGC video promoting my sneaker business.",
  "A relatable video about morning skincare for busy students.",
  "Show why my coffee subscription is worth it, in a casual tone.",
];

function Idea() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useApp();
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => navigate({ to: "/create/script" }), 1200);
  };

  return (
    <FlowShell title="Content Idea" backTo="/create">
      <ProgressBar value={2 / 7} className="mt-4" />
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">
        What do you want to create?
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">
        Describe your idea in your own words. AI handles the rest.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Your idea">
          <TextArea
            value={draft.idea}
            onChange={(e) => updateDraft({ idea: e.target.value })}
            placeholder="Describe your idea..."
            className="min-h-32"
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => updateDraft({ idea: ex })}
              className="rounded-full bg-primary-soft px-3.5 py-2 text-left text-xs font-semibold text-primary transition-colors hover:bg-accent"
            >
              {ex.length > 42 ? `${ex.slice(0, 42)}…` : ex}
            </button>
          ))}
        </div>

        <Field label="Topic">
          <Input
            value={draft.cta === "" ? "" : undefined}
            defaultValue="Sneaker business"
            placeholder="e.g. Sneaker business"
          />
        </Field>
        <Field label="Audience">
          <SelectField
            options={["Young adults", "Teens", "Parents", "Professionals", "Fitness enthusiasts"]}
            value={draft.audience}
            onChange={(v) => updateDraft({ audience: v })}
          />
        </Field>
        <Field label="Tone">
          <SelectField
            options={["Funny", "Casual", "Professional", "Inspiring", "Bold"]}
            value={draft.tone}
            onChange={(v) => updateDraft({ tone: v })}
          />
        </Field>
        <Field label="Platform">
          <SelectField
            options={["TikTok", "Instagram", "YouTube", "Facebook"]}
            value={draft.platform}
            onChange={(v) => updateDraft({ platform: v })}
          />
        </Field>
        <Field label="Call to action">
          <SelectField
            options={["Shop now", "Follow for more", "Link in bio", "Book a call", "Try it free"]}
            value={draft.cta}
            onChange={(v) => updateDraft({ cta: v })}
          />
        </Field>
      </div>

      <Button size="lg" fullWidth className="mt-7" onClick={generate} loading={loading}>
        {!loading && <Sparkles className="h-5 w-5" />}
        {loading ? "Writing your script..." : "Generate Script"}
      </Button>
    </FlowShell>
  );
}
