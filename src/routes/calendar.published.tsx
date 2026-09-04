import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { VideoPreviewPlayer } from "@/components/ui/video-player";
import { pageHead } from "@/lib/seo";
import { thumbSneaker } from "@/lib/mock-data";

export const Route = createFileRoute("/calendar/published")({
  head: pageHead("Published Post", "See how your published post is performing."),
  component: PublishedPost,
});

const stats = [
  { icon: Eye, label: "Views", value: "1.2K" },
  { icon: Heart, label: "Likes", value: "246" },
  { icon: MessageCircle, label: "Comments", value: "32" },
  { icon: Share2, label: "Shares", value: "18" },
];

function PublishedPost() {
  return (
    <FlowShell title="Published Post" backTo="/calendar">
      <VideoPreviewPlayer poster={thumbSneaker} durationSeconds={30} className="mt-4 aspect-[9/16] w-full" />

      <div className="mt-4 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-extrabold text-foreground">Sneaker Promo</h1>
          <p className="text-sm text-muted-foreground">Published May 12 · 10:00 AM</p>
        </div>
        <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground">
          Published
        </span>
      </div>

      <p className="mt-5 text-sm font-bold text-foreground">Platforms</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {["TikTok", "Instagram"].map((p) => (
          <span key={p} className="rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-4 shadow-card">
            <s.icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
            <p className="mt-2 font-display text-xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-xs font-semibold text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Link to="/analytics/$id" params={{ id: "sneaker-promo" }} className="mt-5 block">
        <Button size="lg" fullWidth>
          View Analytics
        </Button>
      </Link>
    </FlowShell>
  );
}
