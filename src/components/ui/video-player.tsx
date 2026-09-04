import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/catalog";

export function VideoPreviewPlayer({
  poster,
  durationSeconds = 30,
  className,
  autoPlay = false,
}: {
  poster: string;
  durationSeconds?: number;
  className?: string;
  autoPlay?: boolean;
}) {
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= durationSeconds) {
            setPlaying(false);
            return durationSeconds;
          }
          return e + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, durationSeconds]);

  const progress = durationSeconds ? elapsed / durationSeconds : 0;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-primary-deep shadow-card", className)}>
      <img src={poster} alt="Video preview" className="h-full w-full object-cover" loading="lazy" />
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-primary-deep/20 transition-colors"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-fab transition-transform hover:scale-105">
            <Play className="ml-1 h-7 w-7" fill="currentColor" />
          </span>
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-primary-deep/80 to-transparent px-4 pb-3 pt-8">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="text-primary-foreground"
        >
          {playing ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
        </button>
        <button
          className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/25"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setElapsed(Math.round(((e.clientX - rect.left) / rect.width) * durationSeconds));
          }}
          aria-label="Seek"
        >
          <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
        </button>
        <span className="text-xs font-semibold tabular-nums text-primary-foreground">
          {formatDuration(elapsed)} / {formatDuration(durationSeconds)}
        </span>
        <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="text-primary-foreground">
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
