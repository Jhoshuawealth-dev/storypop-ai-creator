import { forwardRef, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceDictationButton } from "@/components/ui/voice-dictation";

interface FieldProps {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-foreground">{label}</label>}
      {children}
      {error ? (
        <p className="text-sm font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "w-full rounded-2xl border-2 border-input bg-card px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  rightSlot?: ReactNode;
  /** Show a voice-note (speech-to-text) button. */
  dictation?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, rightSlot, dictation, ...props }, ref) => {
    const inner = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inner.current as HTMLInputElement);
    const slot = rightSlot ?? (dictation ? <VoiceDictationButton target={inner} /> : null);
    return (
      <div className="relative">
        <input
          ref={inner}
          className={cn(inputBase, "h-[52px]", invalid && "border-destructive focus:border-destructive focus:ring-destructive/10", slot && (dictation && !rightSlot ? "pr-14" : "pr-12"), className)}
          {...props}
        />
        {slot && <div className="absolute inset-y-0 right-3 flex items-center">{slot}</div>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <Input
      ref={ref}
      type={show ? "text" : "password"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = "PasswordInput";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Voice-note (speech-to-text) button; on by default for editable prompts. */
  dictation?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, invalid, dictation = true, ...props }, ref) => {
    const inner = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => inner.current as HTMLTextAreaElement);
    const showMic = dictation && !props.readOnly && !props.disabled;
    return (
      <div className="relative">
        <textarea
          ref={inner}
          className={cn(inputBase, "min-h-28 resize-none py-3.5 leading-relaxed", showMic && "pb-12", invalid && "border-destructive focus:border-destructive focus:ring-destructive/10", className)}
          {...props}
        />
        {showMic && <VoiceDictationButton target={inner} className="absolute bottom-2.5 right-2.5" />}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

export function SelectField({
  options,
  value,
  onChange,
  className,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, "h-[52px] appearance-none pr-10 font-medium", className)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
