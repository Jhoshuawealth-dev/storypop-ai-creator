import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Hash, Lightbulb, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, TextArea } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/feedback";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import { analysePost, combinedLimits, normaliseHashtag, suggestHashtags } from "@/lib/post-seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publish/details")({
  head: pageHead("Post Details & SEO", "Add a title, description and hashtags, and optimise your post for search."),
  component: PublishDetails,
});

function PublishDetails() {
  const navigate = useNavigate();
  const { draft, updatePost_Draft } = useApp();
  const post = draft.post;
  const [tagInput, setTagInput] = useState("");

  const limits = useMemo(() => combinedLimits(post.platforms), [post.platforms]);
  const report = useMemo(() => analysePost(post, post.platforms), [post]);
  const suggestions = useMemo(
    () => suggestHashtags(post, limits.hashtagsMax).filter((t) => !post.hashtags.includes(t)),
    [post, limits.hashtagsMax]
  );

  const addTag = (raw: string) => {
    const tag = normaliseHashtag(raw);
    if (!tag) return;
    if (post.hashtags.includes(tag)) {
      toast.error("You already added that hashtag.");
      return;
    }
    if (post.hashtags.length >= limits.hashtagsMax) {
      toast.error(`Your platforms allow up to ${limits.hashtagsMax} hashtags.`);
      return;
    }
    updatePost_Draft({ hashtags: [...post.hashtags, tag] });
    setTagInput("");
  };

  const removeTag = (tag: string) => updatePost_Draft({ hashtags: post.hashtags.filter((t) => t !== tag) });

  const copyAll = () => {
    const text = [post.title, "", post.description, "", post.cta, "", post.hashtags.join(" ")]
      .join("\n")
      .trim();
    navigator.clipboard?.writeText(text);
    toast.success("Post copied to clipboard");
  };

  const continueNext = () => {
    if (!post.title.trim()) {
      toast.error("Add a title before continuing.");
      return;
    }
    if (!post.description.trim()) {
      toast.error("Add a description before continuing.");
      return;
    }
    navigate({ to: "/publish/schedule" });
  };

  const scoreTone =
    report.grade === "Strong" ? "text-primary" : report.grade === "Good" ? "text-foreground" : "text-muted-foreground";

  return (
    <FlowShell title="Post Details" backTo="/publish">
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Write your post
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">
        Title, description and hashtags — optimised for search on every platform you selected.
      </p>

      {/* SEO score */}
      <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="4" className="stroke-muted" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-500"
                strokeDasharray={`${(report.score / 100) * 97.4} 97.4`}
              />
            </svg>
            <span className="absolute font-display text-sm font-extrabold text-foreground">{report.score}</span>
          </div>
          <div className="min-w-0">
            <p className={cn("font-display text-lg font-extrabold", scoreTone)}>SEO score: {report.grade}</p>
            <p className="text-sm text-muted-foreground">
              {report.passedCount} of {report.checks.length} checks passed
            </p>
          </div>
        </div>
      </section>

      <SectionHeader title="Focus keyword" />
      <Field label="What should this post rank for?" hint="One phrase people would actually search for.">
        <Input
          value={post.keyword}
          onChange={(e) => updatePost_Draft({ keyword: e.target.value })}
          placeholder="e.g. running shoes for flat feet"
        />
      </Field>

      <SectionHeader title="Title" />
      <Field
        label="Post title"
        hint={`${post.title.length}/${limits.titleMax} characters — include your keyword near the start.`}
      >
        <Input
          value={post.title}
          onChange={(e) => updatePost_Draft({ title: e.target.value.slice(0, limits.titleMax) })}
          placeholder="Write a specific, searchable title"
        />
      </Field>

      <SectionHeader title="Description" />
      <Field
        label="Description / caption"
        hint={`${post.description.length}/${limits.descriptionMax} characters — the first 150 are what gets indexed.`}
      >
        <TextArea
          value={post.description}
          onChange={(e) => updatePost_Draft({ description: e.target.value.slice(0, limits.descriptionMax) })}
          placeholder="Describe the video, who it's for and what they'll get from it."
          className="min-h-32"
        />
      </Field>

      <SectionHeader title="Call to action" />
      <Field label="What should viewers do next?">
        <Input
          value={post.cta}
          onChange={(e) => updatePost_Draft({ cta: e.target.value })}
          placeholder="e.g. Tap the link in bio to shop the collection"
        />
      </Field>

      <SectionHeader title={`Hashtags (${post.hashtags.length}/${limits.hashtagsMax})`} />
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          {post.hashtags.length === 0 && (
            <p className="text-sm text-muted-foreground">No hashtags yet. Add 3–{limits.hashtagsMax} specific tags.</p>
          )}
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary"
            >
              {tag}
              <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Add a hashtag"
          />
          <Button variant="outline" size="md" onClick={() => addTag(tagInput)} aria-label="Add hashtag">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-3">
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Suggested from your copy
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground"
                >
                  <Hash className="h-3 w-3" />
                  {tag.replace("#", "")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <SectionHeader title="SEO checklist" />
      <div className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-card">
        {report.checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 px-4 py-3.5">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                check.passed ? "bg-primary text-primary-foreground" : "border-2 border-border"
              )}
            >
              {check.passed && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-sm font-bold", check.passed ? "text-foreground" : "text-muted-foreground")}>
                {check.label}
              </p>
              {!check.passed && <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{check.hint}</p>}
            </div>
          </div>
        ))}
      </div>

      {limits.specs.length > 0 && (
        <>
          <SectionHeader title="Platform tips" />
          <div className="space-y-2.5">
            {limits.specs.map((spec) => (
              <div key={spec.id} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-card">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground">{spec.name}:</span> {spec.tip}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={copyAll}>
          <Copy className="h-4 w-4" /> Copy post
        </Button>
        <Button size="lg" onClick={continueNext}>
          Next
        </Button>
      </div>
    </FlowShell>
  );
}
