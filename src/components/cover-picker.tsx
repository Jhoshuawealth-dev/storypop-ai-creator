import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Type } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const W = 540;
const H = 960;

/** Turn any image source into a compressed 9:16 JPEG data URL (cover-cropped), optionally with hook text. */
async function renderCover(source: CanvasImageSource, sw: number, sh: number, hook: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  const scale = Math.max(W / sw, H / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  ctx.drawImage(source, (W - dw) / 2, (H - dh) / 2, dw, dh);
  const text = hook.trim();
  if (text) {
    const styles = getComputedStyle(document.documentElement);
    const primary = styles.getPropertyValue("--primary").trim() || "#7c3aed";
    const fg = styles.getPropertyValue("--primary-foreground").trim() || "#ffffff";
    ctx.font = "800 46px Sora, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (ctx.measureText(next).width > W - 100 && line) {
        lines.push(line);
        line = w;
      } else line = next;
    }
    if (line) lines.push(line);
    const shown = lines.slice(0, 3);
    const lh = 58;
    const boxH = shown.length * lh + 36;
    const top = H * 0.62;
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.roundRect(36, top, W - 72, boxH, 28);
    ctx.fill();
    ctx.fillStyle = fg;
    shown.forEach((l, i) => ctx.fillText(l, W / 2, top + 18 + lh / 2 + i * lh));
  }
  return canvas.toDataURL("image/jpeg", 0.82);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

/**
 * Cover / thumbnail picker: pick a frame from the rendered video, upload a custom image,
 * and add hook text. Calls onChange with a compressed JPEG data URL.
 */
export function CoverPicker({
  videoUrl,
  value,
  onChange,
}: {
  videoUrl?: string | null;
  value?: string;
  onChange: (thumb: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [base, setBase] = useState<string | null>(null); // clean image before hook text
  const [hook, setHook] = useState("");
  const [busy, setBusy] = useState(false);

  // Re-render the cover whenever the hook text changes.
  useEffect(() => {
    if (!base) return;
    const t = setTimeout(async () => {
      try {
        const img = await loadImage(base);
        onChange(await renderCover(img, img.naturalWidth, img.naturalHeight, hook));
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, hook]);

  const captureFrame = async () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) {
      toast.error("Let the video load first");
      return;
    }
    setBusy(true);
    try {
      setBase(await renderCover(v, v.videoWidth, v.videoHeight, ""));
      toast.success("Frame set as cover");
    } catch {
      toast.error("Could not capture this frame");
    } finally {
      setBusy(false);
    }
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const img = await loadImage(String(reader.result));
        setBase(await renderCover(img, img.naturalWidth, img.naturalHeight, ""));
        toast.success("Custom cover uploaded");
      } catch {
        toast.error("Could not read that image");
      }
    };
    reader.readAsDataURL(file);
  };

  const startFromCurrent = () => {
    if (value && !base) setBase(value);
  };

  return (
    <section className="mt-5 rounded-2xl bg-card p-4 shadow-card">
      <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Cover & thumbnail</p>
      <div className="mt-3 flex gap-3.5">
        <div className="relative aspect-[9/16] w-28 shrink-0 overflow-hidden rounded-xl bg-primary-soft">
          {value ? (
            <img src={value} alt="Video cover" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-[11px] font-semibold text-muted-foreground">
              No cover yet
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {videoUrl && (
            <Button variant="outline" fullWidth size="sm" onClick={captureFrame} disabled={busy}>
              <Camera className="h-4 w-4" /> Use current frame
            </Button>
          )}
          <Button variant="outline" fullWidth size="sm" onClick={() => fileRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> Upload cover
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <label className="block">
            <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Type className="h-3.5 w-3.5" /> Hook text
            </span>
            <input
              value={hook}
              onFocus={startFromCurrent}
              onChange={(e) => setHook(e.target.value.slice(0, 60))}
              placeholder={value ? "e.g. I tried this for 7 days" : "Pick a cover first"}
              disabled={!value && !base}
              className={cn(
                "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
                !value && !base && "opacity-60",
              )}
            />
          </label>
        </div>
      </div>
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          crossOrigin="anonymous"
          controls
          playsInline
          className="mt-3 aspect-[9/16] max-h-80 w-full rounded-xl bg-primary-deep object-contain"
        />
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        {videoUrl ? "Pause on your favourite moment, then tap “Use current frame”. " : ""}
        Covers are 9:16, ready for TikTok, Reels and Shorts.
      </p>
    </section>
  );
}

/** Download a remote thumbnail (signed link) and keep it as a compressed data URL. */
export async function remoteThumbToDataUrl(url: string): Promise<string | null> {
  try {
    const img = await loadImage(url);
    return await renderCover(img, img.naturalWidth, img.naturalHeight, "");
  } catch {
    return null;
  }
}
