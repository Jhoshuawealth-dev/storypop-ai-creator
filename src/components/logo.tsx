import { cn } from "@/lib/utils";

export function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-[28%] bg-primary shadow-fab", className)}
      style={{ width: size, height: size }}
      aria-label="Storypop AI logo"
    >
      <svg
        width={size * 0.52}
        height={size * 0.52}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M8 5.5v13l11-6.5-11-6.5z" fill="white" />
        <path
          d="M18.5 3.2l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Logo size={32} />
      <span className="font-display text-lg font-bold tracking-tight text-foreground">
        Storypop <span className="text-primary">AI</span>
      </span>
    </span>
  );
}
