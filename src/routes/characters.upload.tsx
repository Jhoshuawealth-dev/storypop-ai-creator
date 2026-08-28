import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { FlowShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/characters/upload")({
  head: pageHead("Upload Photo", "Upload a photo to create your AI character."),
  component: UploadPhoto,
});

function UploadPhoto() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pick = (file?: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <FlowShell title="Create Character" backTo="/characters">
      <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Create your AI character
      </h1>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
        Upload a clear photo of yourself. Good lighting and a visible face give the best results.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      {preview ? (
        <div className="relative mt-6 overflow-hidden rounded-3xl shadow-card">
          <img src={preview} alt="Your uploaded photo" className="aspect-square w-full object-cover" />
          <button
            onClick={() => setPreview(null)}
            aria-label="Remove photo"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-card"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary-light bg-primary-soft/50 transition-colors hover:bg-primary-soft"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
            <ImagePlus className="h-7 w-7 text-primary" strokeWidth={1.6} />
          </span>
          <span className="text-sm font-bold text-primary">Tap to upload a photo</span>
          <span className="text-xs text-muted-foreground">JPG or PNG · up to 10MB</span>
        </button>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
          <Camera className="h-4 w-4" /> Take Photo
        </Button>
        <Button variant="outline" size="lg" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="h-4 w-4" /> Upload
        </Button>
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-5"
        disabled={!preview}
        onClick={() => navigate({ to: "/characters/style" })}
      >
        Continue
      </Button>
      {!preview && (
        <p className="mt-2.5 text-center text-xs text-muted-foreground">Add a photo to continue.</p>
      )}
    </FlowShell>
  );
}
