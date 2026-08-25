import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 140,
  stroke = 12,
  children,
  className,
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  children?: ReactNode;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-primary-soft", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  );
}

export interface GenStep {
  label: string;
  status: "done" | "active" | "pending";
}

export function StepList({ steps }: { steps: GenStep[] }) {
  return (
    <ul className="w-full space-y-3">
      {steps.map((step) => (
        <li key={step.label} className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
              step.status === "done" && "bg-primary text-primary-foreground",
              step.status === "active" && "bg-primary-soft text-primary animate-dot-pulse",
              step.status === "pending" && "bg-muted text-muted-foreground"
            )}
          >
            {step.status === "done" ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : step.status === "active" ? (
              <span className="h-2 w-2 rounded-full bg-primary" />
            ) : null}
          </span>
          <span
            className={cn(
              "text-[15px] font-medium transition-colors",
              step.status === "done" && "text-foreground",
              step.status === "active" && "font-semibold text-primary",
              step.status === "pending" && "text-muted-foreground"
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
