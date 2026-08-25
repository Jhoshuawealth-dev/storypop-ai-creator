import { forwardRef, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
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
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, rightSlot, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        className={cn(inputBase, "h-[52px]", invalid && "border-destructive focus:border-destructive focus:ring-destructive/10", rightSlot && "pr-12", className)}
        {...props}
      />
      {rightSlot && <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div>}
    </div>
  )
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
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(inputBase, "min-h-28 resize-none py-3.5 leading-relaxed", invalid && "border-destructive focus:border-destructive focus:ring-destructive/10", className)}
      {...props}
    />
  )
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
