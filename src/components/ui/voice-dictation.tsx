import { useEffect, useRef, useState, type RefObject } from "react";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Field = HTMLInputElement | HTMLTextAreaElement;

/** Writes text into a controlled React input so its onChange fires as if the user typed. */
function setNativeValue(el: Field, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Mic button: speech-to-text into the target field. User reviews the text before proceeding. */
export function VoiceDictationButton({ target, className }: { target: RefObject<Field | null>; className?: string }) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => () => recRef.current?.stop?.(), []);

  const toggle = () => {
    if (listening) { recRef.current?.stop(); return; }
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { toast.error("Voice notes aren't supported in this browser. Try Chrome, Edge or Safari."); return; }
    const el = target.current;
    if (!el) return;
    const base = el.value ? el.value.replace(/\s*$/, " ") : "";
    const rec = new SR();
    rec.lang = navigator.language || "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      if (target.current) setNativeValue(target.current, base + text.trim());
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") toast.error("Allow microphone access to use voice notes.");
    };
    rec.onend = () => {
      setListening(false);
      target.current?.focus();
      toast.success("Voice note typed in — read it and edit if needed.");
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={listening ? "Stop voice note" : "Speak instead of typing"}
      title={listening ? "Stop voice note" : "Speak instead of typing"}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors",
        listening ? "animate-pulse bg-primary text-primary-foreground" : "bg-primary-soft text-primary hover:bg-primary-light",
        className,
      )}
    >
      {listening ? <><Square className="h-3.5 w-3.5" /> Listening…</> : <Mic className="h-4 w-4" />}
    </button>
  );
}
