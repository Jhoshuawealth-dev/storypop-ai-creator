import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Download, ImagePlus, Loader2, Save, Sparkles, Type } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateThumbnailImage } from "@/lib/thumbnail.functions";
import { cn } from "@/lib/utils";

export type Ratio = "9:16" | "16:9" | "1:1";
const SIZES: Record<Ratio, [number, number]> = { "9:16": [720, 1280], "16:9": [1280, 720], "1:1": [1080, 1080] };
const BADGES = ["", "MUST WATCH", "NEW", "POV", "WAIT TILL THE END", "BEFORE / AFTER", "SECRET", "WARNING", "VIRAL"];
// Thumbnail backgrounds are the creator's content, so they span a full colour range.
export const GRADIENTS: { name: string; c: [string, string]; radial?: boolean }[] = [
  { name: "Royal purple", c: ["#2e1065", "#7c3aed"] },
  { name: "Fire red", c: ["#450a0a", "#ef4444"] },
  { name: "Sunset orange", c: ["#7c2d12", "#fb923c"] },
  { name: "Gold", c: ["#713f12", "#facc15"] },
  { name: "Emerald", c: ["#022c22", "#10b981"] },
  { name: "Ocean", c: ["#082f49", "#0ea5e9"] },
  { name: "Hot pink", c: ["#500724", "#ec4899"] },
  { name: "Midnight black", c: ["#000000", "#27272a"] },
  { name: "Clean white", c: ["#e4e4e7", "#ffffff"] },
  { name: "Purple spotlight", c: ["#a855f7", "#0b0614"], radial: true },
  { name: "Red spotlight", c: ["#f87171", "#1a0505"], radial: true },
  { name: "Yellow spotlight", c: ["#fde047", "#1c1404"], radial: true },
];
export const ACCENTS = [
  { name: "Purple", c: "#7c3aed", fg: "#ffffff" },
  { name: "Yellow", c: "#facc15", fg: "#111111" },
  { name: "Red", c: "#ef4444", fg: "#ffffff" },
  { name: "White", c: "#ffffff", fg: "#111111" },
  { name: "Black", c: "#111111", fg: "#ffffff" },
  { name: "Green", c: "#22c55e", fg: "#ffffff" },
];
type TextStyle = "pill" | "outline" | "plain";
type Pos = "top" | "center" | "bottom";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("load"));
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

interface Design {
  ratio: Ratio;
  bg: string | null;
  gradient: number;
  headline: string;
  subtitle: string;
  textStyle: TextStyle;
  pos: Pos;
  size: number;
  badge: string;
  brightness: number;
  vignette: boolean;
  accent: number;
  template: number;
}

/** Three ready-made, platform-standard thumbnail layouts. */
export const TEMPLATES: { name: string; desc: string; apply: Partial<Design> }[] = [
  { name: "Viral Punch", desc: "Bold banner + badge for TikTok / Reels", apply: { textStyle: "pill", pos: "bottom", size: 10, badge: "MUST WATCH", vignette: false, accent: 1, gradient: 0 } },
  { name: "Cinematic", desc: "Big shadow text, dark edges, YouTube style", apply: { textStyle: "plain", pos: "center", size: 12, badge: "", vignette: true, accent: 3, gradient: 9 } },
  { name: "High-Energy Hook", desc: "Thick outline, spotlight, reaction style", apply: { textStyle: "outline", pos: "top", size: 11, badge: "WAIT TILL THE END", vignette: true, accent: 2, gradient: 11 } },
];

async function render(canvas: HTMLCanvasElement, d: Design) {
  const [W, H] = SIZES[d.ratio];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  void css;
  const acc = ACCENTS[d.accent] ?? ACCENTS[0]!;
  const primary = acc.c;
  const pfg = acc.fg;
  const textFill = d.textStyle === "pill" ? acc.fg : d.textStyle === "outline" ? "#ffffff" : acc.c === "#111111" ? "#ffffff" : acc.c;
  const gg = GRADIENTS[d.gradient] ?? GRADIENTS[0]!;
  const grad = gg.radial
    ? ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.7)
    : ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, gg.c[0]);
  grad.addColorStop(1, gg.c[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  if (d.bg) {
    try {
      const img = await loadImage(d.bg);
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      ctx.filter = `brightness(${d.brightness}%)`;
      ctx.drawImage(img, (W - img.naturalWidth * s) / 2, (H - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
      ctx.filter = "none";
    } catch {
      /* keep gradient */
    }
  }
  if (d.vignette) {
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }
  const unit = Math.min(W, H) / 100;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Badge
  if (d.badge) {
    ctx.font = `800 ${unit * 4.2}px Sora, sans-serif`;
    const bw = ctx.measureText(d.badge).width + unit * 6;
    const bh = unit * 8;
    const by = d.pos === "top" ? H * 0.8 : H * 0.11;
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.roundRect(W / 2 - bw / 2, by, bw, bh, bh / 2);
    ctx.fill();
    ctx.fillStyle = pfg;
    ctx.fillText(d.badge, W / 2, by + bh / 2);
  }
  // Headline + subtitle
  const head = d.headline.trim();
  const sub = d.subtitle.trim();
  if (!head && !sub) return;
  const fs = unit * d.size;
  ctx.font = `800 ${fs}px Sora, sans-serif`;
  const lines = head ? wrap(ctx, d.ratio === "16:9" ? head.toUpperCase() : head, W - unit * 16) : [];
  const lh = fs * 1.2;
  const subFs = fs * 0.5;
  const blockH = lines.length * lh + (sub ? subFs * 1.6 : 0);
  const cy = d.pos === "top" ? H * 0.2 : d.pos === "center" ? H * 0.5 : H * 0.72;
  const top = cy - blockH / 2;
  if (d.textStyle === "pill" && lines.length) {
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.roundRect(unit * 5, top - unit * 3, W - unit * 10, lines.length * lh + unit * 6, unit * 4);
    ctx.fill();
  }
  lines.forEach((l, i) => {
    const y = top + lh / 2 + i * lh;
    if (d.textStyle === "outline") {
      ctx.lineWidth = fs * 0.22;
      ctx.strokeStyle = acc.c === "#ffffff" ? "#111111" : primary;
      ctx.lineJoin = "round";
      ctx.strokeText(l, W / 2, y);
    }
    if (d.textStyle === "plain") {
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = fs * 0.35;
      ctx.shadowOffsetY = fs * 0.06;
    }
    ctx.fillStyle = textFill;
    ctx.fillText(l, W / 2, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });
  if (sub) {
    ctx.font = `700 ${subFs}px Manrope, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = subFs * 0.4;
    ctx.fillText(sub.slice(0, 80), W / 2, top + lines.length * lh + (d.textStyle === "pill" ? unit * 5 : 0) + subFs);
    ctx.shadowBlur = 0;
  }
}

/** Full thumbnail editor: AI prompt or manual background, text layers, badges, filters, safe zones, PNG/JPG export. */
export function ThumbnailEditor({
  initialImage,
  initialHeadline = "",
  videoUrl,
  defaultRatio = "9:16",
  onSave,
  saveLabel = "Save to video",
}: {
  initialImage?: string | null;
  initialHeadline?: string;
  videoUrl?: string | null;
  defaultRatio?: Ratio;
  onSave?: (jpegDataUrl: string) => void;
  saveLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const gen = useServerFn(generateThumbnailImage);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [safe, setSafe] = useState(true);
  const [d, setD] = useState<Design>({
    ratio: defaultRatio,
    bg: initialImage ?? null,
    gradient: 0,
    headline: initialHeadline,
    subtitle: "",
    textStyle: "pill",
    pos: "bottom",
    size: 9,
    badge: "",
    brightness: 100,
    vignette: false,
    accent: 1,
    template: 0,
    ...TEMPLATES[0]!.apply,
  });
  const set = <K extends keyof Design>(k: K, v: Design[K]) => setD((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (initialImage) setD((p) => ({ ...p, bg: initialImage }));
  }, [initialImage]);

  useEffect(() => {
    const c = canvasRef.current;
    if (c) void render(c, d);
  }, [d]);

  const exportAs = useCallback(
    async (type: "image/png" | "image/jpeg") => {
      const c = document.createElement("canvas");
      await render(c, d);
      return c.toDataURL(type, 0.9);
    },
    [d],
  );

  const download = async (fmt: "png" | "jpg") => {
    try {
      const url = await exportAs(fmt === "png" ? "image/png" : "image/jpeg");
      const a = document.createElement("a");
      a.href = url;
      a.download = `storypop-thumbnail-${Date.now()}.${fmt}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success(`Downloaded ${fmt.toUpperCase()}`);
    } catch {
      toast.error("Could not export. If you used a video frame, try uploading the image instead.");
    }
  };

  const save = async () => {
    if (!onSave) return;
    const c = document.createElement("canvas");
    await render(c, d);
    // keep stored size small
    const small = document.createElement("canvas");
    const scale = 540 / Math.max(c.width, c.height) * (d.ratio === "9:16" ? 960 / 540 : 1);
    small.width = Math.round(c.width * Math.min(1, scale));
    small.height = Math.round(c.height * Math.min(1, scale));
    small.getContext("2d")!.drawImage(c, 0, 0, small.width, small.height);
    onSave(small.toDataURL("image/jpeg", 0.82));
    toast.success("Thumbnail saved");
  };

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) { toast.error("Let the video load first"); return; }
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    try {
      set("bg", c.toDataURL("image/jpeg", 0.9));
      toast.success("Frame captured");
    } catch {
      toast.error("Could not capture this frame");
    }
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Choose an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    const r = new FileReader();
    r.onload = () => set("bg", String(r.result));
    r.readAsDataURL(file);
  };

  const runAi = async () => {
    if (prompt.trim().length < 3) { toast.error("Describe the thumbnail you want"); return; }
    setGenerating(true);
    try {
      const res = await gen({ data: { prompt, ratio: d.ratio } });
      if (res.ok) {
        set("bg", res.image);
        toast.success("Image generated — add your text below");
      } else toast.error(res.error);
    } catch {
      toast.error("Please sign in to generate with AI");
    } finally {
      setGenerating(false);
    }
  };

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground",
    );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Preview */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-primary-deep shadow-card" style={{ maxWidth: d.ratio === "16:9" ? 560 : 360 }}>
          <canvas ref={canvasRef} className="block h-auto w-full" />
          {safe && d.ratio === "9:16" && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-0 top-0 h-[9%] border-b border-dashed border-primary-foreground/60 bg-primary-deep/25" />
              <div className="absolute bottom-0 right-0 top-[40%] w-[15%] border-l border-dashed border-primary-foreground/60 bg-primary-deep/25" />
              <div className="absolute inset-x-0 bottom-0 h-[18%] border-t border-dashed border-primary-foreground/60 bg-primary-deep/25" />
            </div>
          )}
        </div>
        <div className="mx-auto mt-3 flex max-w-sm flex-wrap justify-center gap-2">
          {onSave && (
            <Button size="sm" onClick={save}>
              <Save className="h-4 w-4" /> {saveLabel}
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => download("png")}>
            <Download className="h-4 w-4" /> PNG
          </Button>
          <Button size="sm" variant="outline" onClick={() => download("jpg")}>
            <Download className="h-4 w-4" /> JPG
          </Button>
        </div>
        {d.ratio === "9:16" && (
          <label className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
            <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} className="accent-primary" />
            Show TikTok / Reels safe zones (not exported)
          </label>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <section className="rounded-2xl bg-card p-4 shadow-card">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Choose a design</p>
          <div className={cn("mt-2 grid gap-2 items-start", d.ratio === "16:9" ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-3")}>
            {TEMPLATES.map((t, i) => (
              <TemplateCard key={t.name} name={t.name} desc={t.desc} active={d.template === i} design={{ ...d, ...t.apply, template: i, headline: d.headline || "Your hook here" }} onClick={() => setD((p) => ({ ...p, ...t.apply, template: i }))} />
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-card p-4 shadow-card">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["9:16", "16:9", "1:1"] as Ratio[]).map((r) => (
              <button key={r} className={chip(d.ratio === r)} onClick={() => set("ratio", r)}>
                {r === "9:16" ? "9:16 TikTok/Reels/Shorts" : r === "16:9" ? "16:9 YouTube" : "1:1 Feed"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-card">
          <div className="flex gap-2">
            <button className={chip(mode === "manual")} onClick={() => setMode("manual")}>Manual</button>
            <button className={chip(mode === "ai")} onClick={() => setMode("ai")}>
              <Sparkles className="mr-1 inline h-3.5 w-3.5" /> AI prompt
            </button>
          </div>
          {mode === "ai" ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 800))}
                rows={3}
                placeholder="e.g. Shocked creator holding a phone, neon purple glow, cinematic lighting"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex flex-wrap gap-1.5">
                {["High-contrast reaction", "Tech showcase", "Aesthetic UGC", "Neon glow"].map((s) => (
                  <button key={s} className={chip(false)} onClick={() => setPrompt((p) => (p ? `${p}, ${s.toLowerCase()} style` : `${s} style`))}>
                    + {s}
                  </button>
                ))}
              </div>
              <Button fullWidth onClick={runAi} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "Generating…" : "Generate image"}
              </Button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="h-4 w-4" /> Upload image
                </Button>
                {videoUrl && (
                  <Button size="sm" variant="outline" onClick={capture}>
                    <Camera className="h-4 w-4" /> Use current frame
                  </Button>
                )}
                {d.bg && (
                  <Button size="sm" variant="ghost" onClick={() => set("bg", null)}>
                    Remove image
                  </Button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </div>
              {videoUrl && (
                <video ref={videoRef} src={videoUrl} crossOrigin="anonymous" controls playsInline className="max-h-56 w-full rounded-xl bg-primary-deep object-contain" />
              )}
              <div>
                <p className="text-xs font-bold text-foreground">Background colour</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={g.name}
                      aria-label={g.name}
                      title={g.name}
                      onClick={() => set("gradient", i)}
                      className={cn("h-9 w-9 rounded-full border-2 ring-1 ring-border", d.gradient === i ? "border-primary" : "border-transparent")}
                      style={{ background: g.radial ? `radial-gradient(circle, ${g.c[0]}, ${g.c[1]})` : `linear-gradient(135deg, ${g.c[0]}, ${g.c[1]})` }}
                    />
                  ))}
                </div>
                {d.bg && <p className="mt-1 text-xs text-muted-foreground">Remove the image to see the colour.</p>}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
            <Type className="h-3.5 w-3.5" /> Text
          </p>
          <input
            value={d.headline}
            onChange={(e) => set("headline", e.target.value.slice(0, 70))}
            placeholder="Headline, e.g. I tried this for 7 days"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            value={d.subtitle}
            onChange={(e) => set("subtitle", e.target.value.slice(0, 80))}
            placeholder="Subtitle (optional)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex flex-wrap gap-2">
            {(["pill", "outline", "plain"] as TextStyle[]).map((s) => (
              <button key={s} className={chip(d.textStyle === s)} onClick={() => set("textStyle", s)}>
                {s === "pill" ? "Colour banner" : s === "outline" ? "Bold outline" : "Shadow"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["top", "center", "bottom"] as Pos[]).map((p) => (
              <button key={p} className={chip(d.pos === p)} onClick={() => set("pos", p)}>
                {p[0]!.toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Text & badge colour</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {ACCENTS.map((a, i) => (
                <button key={a.name} aria-label={a.name} title={a.name} onClick={() => set("accent", i)}
                  className={cn("h-8 w-8 rounded-full border-2 ring-1 ring-border", d.accent === i ? "border-primary" : "border-transparent")}
                  style={{ background: a.c }} />
              ))}
            </div>
          </div>
          <label className="block text-xs font-bold text-foreground">
            Text size
            <input type="range" min={5} max={14} step={0.5} value={d.size} onChange={(e) => set("size", Number(e.target.value))} className="mt-1 w-full accent-primary" />
          </label>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Badge & look</p>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <button key={b || "none"} className={chip(d.badge === b)} onClick={() => set("badge", b)}>
                {b || "No badge"}
              </button>
            ))}
          </div>
          <label className="block text-xs font-bold text-foreground">
            Brightness
            <input type="range" min={50} max={150} value={d.brightness} onChange={(e) => set("brightness", Number(e.target.value))} className="mt-1 w-full accent-primary" />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-foreground">
            <input type="checkbox" checked={d.vignette} onChange={(e) => set("vignette", e.target.checked)} className="accent-primary" />
            Dark edges (vignette)
          </label>
        </section>
      </div>
    </div>
  );
}

function TemplateCard({ name, desc, active, design, onClick }: { name: string; desc: string; active: boolean; design: Design; onClick: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(design);
  useEffect(() => {
    if (ref.current) void render(ref.current, design);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <button onClick={onClick} className={cn("overflow-hidden rounded-xl border-2 text-left transition-colors", active ? "border-primary" : "border-border")}>
      <canvas ref={ref} className={cn("block h-auto w-full", design.ratio === "16:9" ? "aspect-video" : design.ratio === "1:1" ? "aspect-square" : "aspect-[9/16]")} />
      <div className="p-1.5">
        <p className="text-xs font-extrabold text-foreground">{name}</p>
        <p className="line-clamp-2 text-[10px] leading-tight text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
