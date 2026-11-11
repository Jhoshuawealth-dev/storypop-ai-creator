import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Download, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { platformSpecs } from "@/lib/catalog";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const openLinks: Record<string, string> = {
  tiktok: "https://www.tiktok.com/tiktokstudio/upload",
  instagram: "https://www.instagram.com/",
  youtube: "https://studio.youtube.com/",
  facebook: "https://www.facebook.com/",
};

function tagsFrom(text: string) {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  return Array.from(new Set(words)).slice(0, 3);
}

/** Three ready-made caption packages for a clip. */
export function captionOptions(title: string, quote: string) {
  const base = tagsFrom(`${title} ${quote}`);
  const hook = quote ? `"${quote.slice(0, 90)}"` : title;
  return [
    { label: "Curiosity hook", title: `${title} 👀`, description: `Wait for it… ${hook} Would you have done the same?`, hashtags: [...base, "fyp", "viral"] },
    { label: "Story", title, description: `Here's the moment everything changed. ${hook} Watch till the end and tell me what you think.`, hashtags: [...base, "storytime", "mustwatch"] },
    { label: "Short & punchy", title: title.slice(0, 60), description: `${hook} Follow for more 🔥`, hashtags: [...base, "shorts", "trending"] },
  ];
}

export function ClipPublish({ title, quote, videoUrl }: { title: string; quote: string; videoUrl: string | null }) {
  const options = useMemo(() => captionOptions(title, quote), [title, quote]);
  const [pick, setPick] = useState(0);
  const [open, setOpen] = useState(false);
  const { socialAccounts } = useApp();
  const [chosen, setChosen] = useState<string[]>([]);
  const o = options[pick]!;
  const text = `${o.title}\n\n${o.description}\n\n${o.hashtags.map((h) => `#${h}`).join(" ")}`;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1">
        {options.map((opt, i) => (
          <button key={opt.label} type="button" onClick={() => setPick(i)}
            className={cn("rounded-lg px-1 py-1.5 text-[11px] font-bold", pick === i ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
            {opt.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-muted p-2 text-xs">
        <p className="font-bold text-foreground">{o.title}</p>
        <p className="mt-1 text-muted-foreground">{o.description}</p>
        <p className="mt-1 text-primary">{o.hashtags.map((h) => `#${h}`).join(" ")}</p>
      </div>
      <Button size="sm" fullWidth onClick={() => setOpen(true)}><Send className="h-4 w-4" /> Upload to social</Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-5 shadow-fab" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-foreground">Where do you want to post?</h3>
              <button aria-label="Close" onClick={() => setOpen(false)} className="rounded-lg p-1 text-muted-foreground"><X className="h-5 w-5" /></button>
            </div>
            {socialAccounts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No accounts linked yet. <Link to="/settings/social" className="font-bold text-primary">Add your accounts</Link> first.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {socialAccounts.map((a) => {
                  const on = chosen.includes(a.id);
                  const spec = platformSpecs.find((p) => p.id === a.platform);
                  return (
                    <button key={a.id} type="button" onClick={() => setChosen((c) => on ? c.filter((x) => x !== a.id) : [...c, a.id])}
                      className={cn("flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left", on ? "border-primary bg-primary-soft" : "border-border")}>
                      <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-primary">{on && <Check className="h-3 w-3 text-primary" />}</span>
                      <span className="flex-1 text-sm font-semibold text-foreground">{spec?.name ?? a.platform} · {a.handle}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(text); toast.success("Caption copied"); }}><Copy className="h-4 w-4" /> Copy caption</Button>
              {videoUrl ? <a href={videoUrl} download><Button variant="outline" fullWidth><Download className="h-4 w-4" /> Download</Button></a> : <span />}
            </div>
            <Button className="mt-2" fullWidth disabled={chosen.length === 0} onClick={() => {
              navigator.clipboard.writeText(text).catch(() => {});
              const platforms = new Set(socialAccounts.filter((a) => chosen.includes(a.id)).map((a) => a.platform));
              platforms.forEach((p) => { const u = openLinks[p]; if (u) window.open(u, "_blank", "noopener"); });
              toast.success("Caption copied — paste it in the upload page that just opened.");
              setOpen(false);
            }}>
              <Send className="h-4 w-4" /> Post to {chosen.length || ""} account{chosen.length === 1 ? "" : "s"}
            </Button>
            <p className="mt-2 text-[11px] text-muted-foreground">Automatic posting turns on once Storypop is approved by each platform. For now we copy your caption and open each upload page.</p>
          </div>
        </div>
      )}
    </div>
  );
}
