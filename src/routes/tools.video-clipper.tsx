import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Download, Film, Loader2, Palette, Scissors, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { createClipSourceUpload, enqueueClipJob, getClipJob } from "@/lib/clipper.functions";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/video-clipper")({
  head: pageHead("Video Clipper", "Turn long videos, podcasts and interviews into short viral clips with AI."),
  component: VideoClipper,
});

type Job = Awaited<ReturnType<typeof getClipJob>>;
const JOB_KEY = "storypop.clipJob";
const MAX_MB = 500;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

function VideoClipper() {
  const mkUpload = useServerFn(createClipSourceUpload);
  const enqueue = useServerFn(enqueueClipJob);
  const fetchJob = useServerFn(getClipJob);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [clipLength, setClipLength] = useState<15 | 30 | 60>(30);
  const [ratio, setRatio] = useState<"9:16" | "1:1" | "16:9">("9:16");
  const [count, setCount] = useState(5);
  const [captions, setCaptions] = useState(true);
  const [busy, setBusy] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<Job>(null);

  useEffect(() => {
    const saved = localStorage.getItem(JOB_KEY);
    if (saved) setJobId(saved);
  }, []);

  useEffect(() => {
    if (!jobId) return;
    let stop = false;
    const tick = async () => {
      try {
        const j = await fetchJob({ data: { jobId } });
        if (stop) return;
        setJob(j);
        if (j && (j.status === "queued" || j.status === "processing")) setTimeout(tick, 4000);
      } catch {
        if (!stop) setTimeout(tick, 8000);
      }
    };
    void tick();
    return () => {
      stop = true;
    };
  }, [jobId, fetchJob]);

  const pick = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) return toast.error("Choose a video file");
    if (f.size > MAX_MB * 1024 * 1024) return toast.error(`Video must be under ${MAX_MB}MB`);
    setFile(f);
  };

  const start = async () => {
    if (!file) return toast.error("Upload a video first");
    setBusy(true);
    try {
      const raw = (file.name.split(".").pop() ?? "mp4").toLowerCase();
      const ext = (["mp4", "mov", "webm", "m4v"].includes(raw) ? raw : "mp4") as "mp4";
      const { path, token } = await mkUpload({ data: { ext } });
      const { error } = await supabase.storage.from("generated-videos").uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error(error.message);
      const { jobId: id } = await enqueue({ data: { sourcePath: path, title: file.name.slice(0, 200), clipLength, ratio, count, captions } });
      localStorage.setItem(JOB_KEY, id);
      setJob(null);
      setJobId(id);
      toast.success("Video uploaded — finding the best moments");
    } catch (e) {
      toast.error(e instanceof Error && e.message.includes("auth") ? "Please sign in first" : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    localStorage.removeItem(JOB_KEY);
    setJobId(null);
    setJob(null);
    setFile(null);
  };

  const chip = (active: boolean) =>
    cn("rounded-full border px-3 py-1.5 text-xs font-bold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground");

  const running = job && (job.status === "queued" || job.status === "processing");

  return (
    <AppShell title="Video Clipper" showBack backTo="/home">
      <div className="mx-auto max-w-4xl space-y-5 py-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">Video Clipper</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload a long video, podcast or interview. AI finds the most engaging moments and turns them into short clips with captions.</p>
        </div>

        {!jobId && (
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}
              className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-card p-6 text-center shadow-card"
            >
              <Upload className="h-8 w-8 text-primary" />
              <p className="font-bold text-foreground">{file ? file.name : "Upload your long video"}</p>
              <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1048576).toFixed(1)} MB` : `MP4, MOV or WEBM · up to ${MAX_MB}MB`}</p>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
            </button>

            <div className="space-y-4 rounded-2xl bg-card p-4 shadow-card">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Clip length</p>
                <div className="mt-2 flex gap-2">
                  {([15, 30, 60] as const).map((l) => <button key={l} className={chip(clipLength === l)} onClick={() => setClipLength(l)}>{l}s</button>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Shape</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["9:16", "1:1", "16:9"] as const).map((r) => (
                    <button key={r} className={chip(ratio === r)} onClick={() => setRatio(r)}>{r === "9:16" ? "9:16 Shorts/Reels" : r === "1:1" ? "1:1 Feed" : "16:9 Original"}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Number of clips</p>
                <div className="mt-2 flex gap-2">
                  {[3, 4, 5].map((n) => <button key={n} className={chip(count === n)} onClick={() => setCount(n)}>{n}</button>)}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <input type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} className="accent-primary" />
                Add captions
              </label>
              <Button fullWidth onClick={start} disabled={busy || !file}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
                {busy ? "Uploading…" : "Find my best clips"}
              </Button>
            </div>
          </div>
        )}

        {jobId && !job && (
          <div className="flex items-center gap-2 rounded-2xl bg-card p-5 shadow-card text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        )}

        {running && (
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <p className="font-bold text-foreground">{job.status === "queued" ? "Waiting for the clipping engine…" : job.stage || "Working…"}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${Math.max(4, job.progress)}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">You can leave this page — your clips will be here when you come back.</p>
          </div>
        )}

        {job?.status === "failed" && (
          <div className="rounded-2xl bg-card p-5 shadow-card">
            <p className="font-bold text-foreground">Clipping didn't finish</p>
            <p className="mt-1 text-sm text-muted-foreground">{job.error || "Something went wrong."}</p>
            <Button className="mt-3" onClick={reset}>Try another video</Button>
          </div>
        )}

        {job?.status === "completed" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold text-foreground">{job.clips.length} clips ready</p>
              <Button size="sm" variant="outline" onClick={reset}>New video</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {job.clips.map((c, i) => (
                <div key={c.path} className="overflow-hidden rounded-2xl bg-card shadow-card">
                  {c.videoUrl ? (
                    <video src={c.videoUrl} poster={c.thumbnailUrl ?? undefined} controls playsInline className="aspect-[9/16] w-full bg-primary-deep object-contain" />
                  ) : (
                    <div className="flex aspect-[9/16] items-center justify-center bg-primary-deep"><Film className="h-8 w-8 text-primary-foreground" /></div>
                  )}
                  <div className="space-y-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-extrabold text-primary-foreground">{c.score}% viral</span>
                      <span className="text-xs text-muted-foreground">{fmt(c.start)} – {fmt(c.end)}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{c.title || `Clip ${i + 1}`}</p>
                    {c.quote && <p className="line-clamp-2 text-xs italic text-muted-foreground">“{c.quote}”</p>}
                    <div className="flex gap-2">
                      {c.videoUrl && (
                        <a href={c.videoUrl} download className="flex-1"><Button size="sm" fullWidth variant="outline"><Download className="h-4 w-4" /> MP4</Button></a>
                      )}
                      <Link to="/tools/thumbnail-creator" className="flex-1"><Button size="sm" fullWidth variant="outline"><Palette className="h-4 w-4" /> Thumbnail</Button></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
