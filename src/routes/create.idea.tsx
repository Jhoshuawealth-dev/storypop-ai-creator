import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextArea, Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ui/progress-ring";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { useState } from "react";

const templates = [
  { id: "Problem → Solution", desc: "Show a pain point, then how the product fixes it." },
  { id: "3-second hook", desc: "A bold opening line that stops the scroll." },
  { id: "Before & After", desc: "Show the transformation side by side." },
  { id: "Honest review", desc: "Pros, cons and a clear verdict." },
  { id: "Quick tutorial", desc: "Teach one thing in under 60 seconds." },
];

const topicSuggestions = ["Product launch", "Customer story", "Behind the scenes", "Tips & tricks", "Myth vs fact", "Day in my life"];

export const Route = createFileRoute("/create/idea")({
  validateSearch: (s: Record<string, unknown>): { mode?: "idea" | "product" | "template" } =>
    {
    const m = s["mode"];
    return m === "product" || m === "template" || m === "idea" ? { mode: m } : {};
  },
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
  const { mode = "idea" } = Route.useSearch();
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
        {mode === "product" && (
          <div className="rounded-2xl bg-primary-soft p-4">
            <p className="text-sm font-bold text-foreground">From Product</p>
            <p className="mt-1 text-xs text-muted-foreground">Paste the product page link. AI uses its benefits and the problems it solves to write your video.</p>
            <Input className="mt-3" value={draft.productUrl ?? ""} onChange={(e) => updateDraft({ productUrl: e.target.value, mode })} placeholder="https://yourstore.com/product" />
          </div>
        )}
        {mode === "template" && (
          <div className="rounded-2xl bg-primary-soft p-4">
            <p className="text-sm font-bold text-foreground">Pick a template</p>
            <div className="mt-3 grid gap-2">
              {templates.map((t) => (
                <button key={t.id} type="button" onClick={() => updateDraft({ template: t.id, mode })}
                  className={`rounded-xl border-2 bg-card p-3 text-left ${draft.template === t.id ? "border-primary" : "border-transparent"}`}>
                  <span className="block text-sm font-bold text-foreground">{t.id}</span>
                  <span className="block text-xs text-muted-foreground">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
            dictation
            value={draft.topic ?? ""}
            onChange={(e) => updateDraft({ topic: e.target.value })}
            placeholder="e.g. Sneaker business"
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {topicSuggestions.map((t) => (
            <button key={t} type="button" onClick={() => updateDraft({ topic: t })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${draft.topic === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
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
