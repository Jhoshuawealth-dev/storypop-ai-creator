import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export function OtpInput({ length = 6, onComplete }: { length?: number; onComplete?: (code: string) => void }) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
    if (next.every((v) => v)) onComplete?.(next.join(""));
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setValues(next);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
    if (next.every((v) => v)) onComplete?.(next.join(""));
  };

  return (
    <div className="flex justify-center gap-2.5">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={v}
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "h-14 w-12 rounded-2xl border-2 border-input bg-card text-center font-display text-xl font-bold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10",
            v && "border-primary bg-primary-soft"
          )}
        />
      ))}
    </div>
  );
}
