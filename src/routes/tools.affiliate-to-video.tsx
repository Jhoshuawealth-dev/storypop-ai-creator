import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Link2, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, SelectField, TextArea } from "@/components/ui/input";
import { analyzeAffiliateLink, type AffiliateAnalysis } from "@/lib/affiliate.functions";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/tools/affiliate-to-video")({
  head: pageHead("Affiliate to Video", "Paste an affiliate link — AI studies the product and writes a ready-to-make promo video."),
  component: AffiliateToVideo,
});

function AffiliateToVideo() {
  const analyze = useServerFn(analyzeAffiliateLink);
  const navigate = useNavigate();
  const { updateDraft } = useApp();
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [platform, setPlatform] = useState<"TikTok" | "Instagram" | "YouTube" | "Facebook">("TikTok");
  const [length, setLength] = useState<30 | 60>(30);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<AffiliateAnalysis | null>(null);

  const run = async () => {
    if (!/^https?:\/\//i.test(url.trim())) return toast.error("Paste a full link starting with https://");
    setBusy(true);
    try {
      const r = await analyze({ data: { url: url.trim(), notes, platform, length } });
      if (!r.ok) toast.error(r.error);
      else setResult(r.analysis);
    } catch {
      toast.error("Please sign in to use this tool.");
    } finally {
      setBusy(false);
    }
  };

  const makeVideo = () => {
    if (!result) return;
    updateDraft({
      idea: `Affiliate promo for ${result.productName}: ${result.summary}`,
      topic: result.productName,
      productUrl: url,
      mode: "product",
      platform,
      duration: length,
      script: result.script,
      post: { title: result.productName, description: result.caption, tags: result.hashtags } as never,
    });
    navigate({ to: "/create/script" });
  };

  return (
    <AppShell title="Affiliate to Video">
      <div className="mx-auto w-full max-w-3xl space-y-5 pb-10 pt-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Affiliate to Video</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste any affiliate or product link (Amazon, TikTok Shop, Jumia, Selar, Shopify…). AI reads the product, finds who it's for and why they'd buy, then writes a short promo video with a disclosure included.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl bg-card p-5 shadow-card">
          <Field label="Affiliate or product link">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Anything AI should know? (optional)">
            <TextArea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. I've used it for 2 months, it's great for oily skin" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Platform">
              <SelectField options={["TikTok", "Instagram", "YouTube", "Facebook"]} value={platform} onChange={(v) => setPlatform(v as typeof platform)} />
            </Field>
            <Field label="Length">
              <SelectField options={["30 seconds", "60 seconds"]} value={`${length} seconds`} onChange={(v) => setLength(v.startsWith("60") ? 60 : 30)} />
            </Field>
          </div>
          <Button fullWidth size="lg" onClick={run} disabled={busy}>
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Link2 className="h-5 w-5" />}
            {busy ? "Studying the product…" : "Analyze link"}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-card p-5 shadow-card">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Product</p>
              <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">{result.productName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{result.summary}</p>
              <p className="mt-3 text-sm"><span className="font-bold text-foreground">Best audience: </span><span className="text-muted-foreground">{result.audience}</span></p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <List title="Problems it solves" items={result.painPoints} />
                <List title="Selling points" items={result.sellingPoints} />
              </div>
              <div className="mt-4"><List title="Hook ideas" items={result.hooks} /></div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-card">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Video script</p>
              <p className="mt-2 text-sm"><b>Hook:</b> {result.script.hook}</p>
              <p className="mt-2 whitespace-pre-line text-sm"><b>Body:</b> {result.script.body}</p>
              <p className="mt-2 text-sm"><b>Call to action:</b> {result.script.cta}</p>
              <div className="mt-4 rounded-xl bg-muted p-3 text-sm text-foreground">
                {result.caption}
                <p className="mt-2 text-primary">{result.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={makeVideo}><WandSparkles className="h-4 w-4" /> Make this video</Button>
                <Button variant="outline" onClick={() => { navigator.clipboard.writeText(`${result.caption}\n\n${result.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}`); toast.success("Caption copied"); }}>
                  <Copy className="h-4 w-4" /> Copy caption
                </Button>
                <Button variant="outline" onClick={run} disabled={busy}><Sparkles className="h-4 w-4" /> Try again</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((i) => <li key={i} className="text-sm text-muted-foreground">• {i}</li>)}
      </ul>
    </div>
  );
}
