import { User } from "lucide-react";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/** Avatar that falls back to initials (or an icon) when no image exists. */
export function Avatar({
  src,
  name,
  className,
  alt,
}: {
  src?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
  alt?: string | undefined;
}) {
  if (src) {
    return <img src={src} alt={alt ?? name ?? "Avatar"} className={cn("object-cover", className)} loading="lazy" />;
  }
  const label = name ? initials(name) : "";
  return (
    <span
      className={cn(
        "flex items-center justify-center bg-primary-soft font-display font-extrabold text-primary",
        className
      )}
      aria-label={alt ?? name ?? "Avatar"}
    >
      {label || <User className="h-1/2 w-1/2" strokeWidth={1.8} />}
    </span>
  );
}

/** Media thumbnail with a neutral fallback when no render exists yet. */
export function Thumb({ src, alt, className }: { src?: string | undefined; alt: string; className?: string | undefined }) {
  if (src) {
    return <img src={src} alt={alt} className={cn("object-cover", className)} loading="lazy" />;
  }
  return <span className={cn("block bg-primary-soft", className)} aria-label={alt} />;
}
