import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, ChevronRight, ExternalLink, Pencil, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, SectionHeader } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { pageHead } from "@/lib/seo";
import { useApp } from "@/lib/store";
import type { ScheduledPost } from "@/lib/catalog";

export const Route = createFileRoute("/analytics/")({
  head: pageHead("Analytics", "Track performance across your Storypop videos."),
  component: Analytics,
});

const fmt = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
const emptyStats = { views: 0, likes: 0, comments: 0, shares: 0 };

function Analytics() {
  const { posts, updatePost } = useApp();
  const published = posts.filter((p) => p.status === "published");
  const totals = published.reduce(
    (t, p) => {
      const s = p.stats ?? emptyStats;
      return { views: t.views + s.views, likes: t.likes + s.likes, comments: t.comments + s.comments, shares: t.shares + s.shares };
    },
    { ...emptyStats }
  );
  const engagement = totals.views ? (((totals.likes + totals.comments + totals.shares) / totals.views) * 100).toFixed(1) : "0";
  const metrics = [
    ["Published posts", String(published.length)],
    ["Total views", fmt(totals.views)],
    ["Total likes", fmt(totals.likes)],
    ["Engagement", `${engagement}%`],
  ];
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <AppShell title="Analytics" showBack backTo="/profile">
      <section className="mt-5 grid grid-cols-2 gap-3" aria-label="Account analytics summary">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <Link to="/analytics/insights" className="mt-4 flex items-center gap-3 rounded-2xl bg-primary-deep p-4 text-primary-foreground shadow-fab">
        <Sparkles className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">AI Insights</span>
          <span className="block text-xs text-primary-light">Insights grow as you log results</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-primary-light" />
      </Link>

      <SectionHeader title="Your posts" />
      <p className="-mt-1 mb-3 text-xs text-muted-foreground">Results entered by you, saved across your devices. Automatic platform analytics is not connected.</p>
      {published.length === 0 ? (
        <EmptyState icon={BarChart3} title="No analytics yet" description="Publish your first video to start building a performance history." actionLabel="Create Video" actionTo="/create" />
      ) : (
        <div className="space-y-3">
          {published.map((p) =>
            editing === p.id ? (
              <StatsForm key={p.id} post={p} onDone={(patch) => { if (patch) { updatePost(p.id, patch); toast.success("Results saved"); } setEditing(null); }} />
            ) : (
              <div key={p.id} className="rounded-2xl bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">{p.title || "Untitled post"}</p>
                    <p className="text-xs text-muted-foreground">{p.platform} · {p.date} · Manually entered</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {p.postUrl && (
                      <a href={p.postUrl} target="_blank" rel="noreferrer" aria-label="Open post" className="rounded-full p-2 text-primary hover:bg-primary-soft"><ExternalLink className="h-4 w-4" /></a>
                    )}
                    <button aria-label="Edit results" onClick={() => setEditing(p.id)} className="rounded-full p-2 text-primary hover:bg-primary-soft"><Pencil className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {(["views", "likes", "comments", "shares"] as const).map((k) => (
                    <div key={k} className="rounded-xl bg-muted py-2">
                      <p className="font-display text-sm font-extrabold text-foreground">{fmt((p.stats ?? emptyStats)[k])}</p>
                      <p className="text-[10px] font-semibold capitalize text-muted-foreground">{k}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </AppShell>
  );
}

function StatsForm({ post, onDone }: { post: ScheduledPost; onDone: (patch?: Partial<ScheduledPost>) => void }) {
  const s = post.stats ?? emptyStats;
  const [v, setV] = useState({ views: String(s.views), likes: String(s.likes), comments: String(s.comments), shares: String(s.shares) });
  const [url, setUrl] = useState(post.postUrl ?? "");
  const num = (x: string) => Math.max(0, Math.floor(Number(x.replace(/[^\d]/g, "")) || 0));
  return (
    <div className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
      <p className="font-bold text-foreground">{post.title || "Untitled post"} · {post.platform}</p>
      <div className="grid grid-cols-2 gap-3">
        {(["views", "likes", "comments", "shares"] as const).map((k) => (
          <Field key={k} label={(k[0] ?? '').toUpperCase() + k.slice(1)}>
            <Input inputMode="numeric" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} />
          </Field>
        ))}
      </div>
      <Field label="Post link (optional)"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" /></Field>
      <div className="flex gap-2">
        <Button variant="outline" fullWidth onClick={() => onDone()}>Cancel</Button>
        <Button fullWidth onClick={() => onDone({
          stats: { views: num(v.views), likes: num(v.likes), comments: num(v.comments), shares: num(v.shares) },
          ...(/^https?:\/\//i.test(url.trim()) ? { postUrl: url.trim() } : {}),
        })}>Save</Button>
      </div>
    </div>
  );
}
