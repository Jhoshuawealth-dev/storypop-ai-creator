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
  src?: string;
  name?: string;
  className?: string;
  alt?: string;
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

/** Square media thumbnail with a neutral fallback. */
export function Thumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={cn("object-cover", className)} loading="lazy" />;
  }
  return <span className={cn("block bg-primary-soft", className)} aria-label={alt} />;
}
