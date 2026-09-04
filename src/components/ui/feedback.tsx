import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import type { ProjectStatus } from "@/lib/catalog";

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus | string }) {
  const styles: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    completed: "bg-primary-soft text-primary",
    scheduled: "bg-accent text-accent-foreground",
    published: "bg-primary text-primary-foreground",
  };
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold capitalize", styles[status] ?? styles["draft"])}>
      {status}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-soft">
        <Icon className="h-9 w-9 text-primary" strokeWidth={1.6} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-60 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6">
          <Button size="md">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  secondaryLabel,
  secondaryTo,
  className,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
        <AlertCircle className="h-9 w-9 text-destructive" strokeWidth={1.6} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-64 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-6 flex w-full max-w-64 flex-col gap-2.5">
        {onRetry && <Button onClick={onRetry}>{retryLabel}</Button>}
        {secondaryLabel && secondaryTo && (
          <Link to={secondaryTo}>
            <Button variant="outline" fullWidth>
              {secondaryLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
