import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import { voices } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/editor/audio")({
  head: pageHead("Audio Editor", "Balance voice, music and sound effects."),
  component: AudioEditor,
});

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <span className="text-sm font-bold tabular-nums text-primary">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} volume`}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${value}%, var(--color-muted) ${value}%)`,
        }}
      />
    </div>
  );
}

const tracks = ["Upbeat Pop", "Chill Lo-fi", "Cinematic Rise", "Street Energy"];

function AudioEditor() {
  const [voice, setVoice] = useState(80);
  const [music, setMusic] = useState(60);
  const [sound, setSound] = useState(70);
  const [track, setTrack] = useState(tracks[0]!);
  const [selectedVoice, setSelectedVoice] = useState("david");

  return (
    <FlowShell title="Audio Editor" backTo="/editor">
      <section className="mt-5 space-y-5 rounded-2xl bg-card p-4 shadow-card">
        <Slider label="Voice" value={voice} onChange={setVoice} />
        <Slider label="Music" value={music} onChange={setMusic} />
        <Slider label="Sound effects" value={sound} onChange={setSound} />
      </section>

      <p className="mt-6 text-sm font-bold text-foreground">Voice</p>
      <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {voices.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedVoice(v.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-all",
              selectedVoice === v.id ? "bg-primary text-primary-foreground shadow-fab" : "bg-card text-foreground shadow-card"
            )}
          >
            {v.name} · {v.style}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-bold text-foreground">Background music</p>
      <div className="mt-2.5 space-y-2">
        {tracks.map((t) => (
          <button
            key={t}
            onClick={() => setTrack(t)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl p-4 text-left shadow-card transition-all",
              track === t ? "bg-primary-soft ring-2 ring-primary" : "bg-card"
            )}
          >
            <span className="font-semibold text-foreground">{t}</span>
            <span className="flex items-end gap-0.5" aria-hidden="true">
              {[8, 14, 6, 12, 9].map((h, i) => (
                <span key={i} className="w-1 rounded-full bg-primary" style={{ height: h, opacity: track === t ? 1 : 0.35 }} />
              ))}
            </span>
          </button>
        ))}
      </div>

      <Button size="lg" fullWidth className="mt-6" onClick={() => toast.success("Audio settings saved")}>
        Done
      </Button>
    </FlowShell>
  );
}
