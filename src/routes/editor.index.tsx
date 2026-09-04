import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Captions,
  Clapperboard,
  Image as ImageIcon,
  Music,
  Redo2,
  Scissors,
  Sparkles,
  SplitSquareHorizontal,
  Type,
  Undo2,
  User,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { VideoPreviewPlayer } from "@/components/ui/video-player";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { defaultScenes, formatDuration, thumbSneaker } from "@/lib/mock-data";

export const Route = createFileRoute("/editor/")({
  head: pageHead("Video Editor", "Edit your AI-generated video."),
  component: Editor,
});

const tools = [
  { label: "Trim", icon: Scissors },
  { label: "Split", icon: SplitSquareHorizontal },
  { label: "Text", icon: Type },
  { label: "Captions", icon: Captions, to: "/editor/captions" },
  { label: "Voice", icon: User, to: "/editor/audio" },
  { label: "Music", icon: Music, to: "/editor/audio" },
  { label: "Effects", icon: Sparkles },
  { label: "Transitions", icon: Wand2 },
  { label: "Speed", icon: Zap },
  { label: "Background", icon: ImageIcon },
  { label: "Character", icon: Clapperboard, to: "/editor/scenes" },
] as const;

function Editor() {
  const [active, setActive] = useState("Trim");

  return (
    <FlowShell
      title="Editor"
      backTo="/create/result"
      right={
        <Link to="/editor/export" className="text-sm font-bold text-primary">
          Export
        </Link>
      }
    >
      <VideoPreviewPlayer poster={thumbSneaker} durationSeconds={30} className="mt-4 aspect-[9/16] w-full" />

      {/* Undo / redo */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => toast.info("Undone")}
          className="flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-foreground shadow-card"
        >
          <Undo2 className="h-4 w-4" /> Undo
        </button>
        <button
          onClick={() => toast.info("Redone")}
          className="flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-foreground shadow-card"
        >
          <Redo2 className="h-4 w-4" /> Redo
        </button>
      </div>

      {/* Timeline */}
      <section className="mt-4 rounded-2xl bg-card p-3.5 shadow-card">
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Timeline</p>
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto no-scrollbar">
          {defaultScenes.map((s, i) => (
            <button
              key={s.id}
              className="shrink-0 overflow-hidden rounded-lg ring-2 ring-transparent transition-all focus:ring-primary"
            >
              <img src={thumbSneaker} alt={`Scene ${i + 1}`} className="h-14 w-11 object-cover" loading="lazy" />
              <span className="block bg-primary-soft py-0.5 text-[9px] font-bold text-primary">
                {formatDuration(s.durationSeconds)}
              </span>
            </button>
          ))}
        </div>
        <div className="relative mt-2.5 h-1.5 rounded-full bg-muted">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary" />
        </div>
      </section>

      {/* Tools */}
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {tools.map((t) => {
          const content = (
            <span
              className={cn(
                "flex w-[74px] shrink-0 flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-[11px] font-bold transition-all",
                active === t.label ? "bg-primary text-primary-foreground shadow-fab" : "bg-card text-foreground shadow-card"
              )}
            >
              <t.icon className="h-5 w-5" strokeWidth={1.9} />
              {t.label}
            </span>
          );
          return "to" in t && t.to ? (
            <Link key={t.label} to={t.to} onClick={() => setActive(t.label)}>
              {content}
            </Link>
          ) : (
            <button key={t.label} onClick={() => setActive(t.label)}>
              {content}
            </button>
          );
        })}
      </div>

      <Link to="/editor/ai" className="mt-5 block">
        <Button size="lg" variant="outline" fullWidth>
          <Sparkles className="h-4 w-4" /> Edit with AI
        </Button>
      </Link>
      <Link to="/publish" className="mt-3 block">
        <Button size="lg" fullWidth>
          Publish
        </Button>
      </Link>
    </FlowShell>
  );
}
