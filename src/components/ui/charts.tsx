import { useId } from "react";
import { cn } from "@/lib/utils";

/** Smooth purple area chart (pure SVG, no deps). */
export function AreaChart({
  data,
  height = 140,
  className,
}: {
  data: number[];
  height?: number;
  className?: string;
}) {
  const id = useId();
  const width = 320;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const points = data.map((v, i) => [i * stepX, height - 12 - ((v - min) / range) * (height - 28)] as const);

  const path = points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      return `C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-full", className)} role="img" aria-label="Views over time">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={`url(#${id}-fill)`} />
      <path d={path} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
      {points.map(([x, y], i) =>
        i === points.length - 1 ? <circle key={i} cx={x} cy={y} r="4" fill="var(--color-primary)" stroke="white" strokeWidth="2" /> : null
      )}
    </svg>
  );
}

/** Purple retention bars. */
export function RetentionBars({ data, className }: { data: number[]; className?: string }) {
  return (
    <div className={cn("flex h-28 items-end gap-1.5", className)} role="img" aria-label="Audience retention">
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md bg-primary transition-all"
            style={{ height: `${(v / 100) * 96}px`, opacity: 0.35 + (v / 100) * 0.65 }}
          />
        </div>
      ))}
    </div>
  );
}

/** Simple donut for stats. */
export function DonutStat({ value, label, className }: { value: number; label: string; className?: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
        <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-primary-soft)" strokeWidth="9" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
        />
      </svg>
      <div>
        <p className="font-display text-xl font-bold text-foreground">{Math.round(value * 100)}%</p>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
