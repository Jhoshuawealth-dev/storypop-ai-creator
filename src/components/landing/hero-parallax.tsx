import { useEffect, useRef } from "react";
import { Check, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Multi-layer 3D parallax preview that tilts toward the pointer and idles with a float. */
export function HeroParallax() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const loop = (t: number) => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      const idleX = Math.sin(t / 1800) * 0.25;
      const idleY = Math.cos(t / 2200) * 0.2;
      stage.style.transform = `rotateY(${(cx + idleX) * 14}deg) rotateX(${-(cy + idleY) * 12}deg)`;
      stage.style.setProperty("--gx", `${50 + cx * 30}%`);
      stage.style.setProperty("--gy", `${50 + cy * 30}%`);
      raf = requestAnimationFrame(loop);
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const steps = ["Writing script", "Generating scenes", "Animating character", "Adding voice"];

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-sm py-8 [perspective:1100px]" aria-hidden>
      <div className="pointer-events-none absolute inset-6 rounded-full bg-primary/50 blur-3xl animate-glow-pulse" />
      <div ref={stageRef} className="relative [transform-style:preserve-3d] will-change-transform">
        {/* Main card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-primary-foreground/15 bg-primary-foreground/5 p-6 shadow-fab backdrop-blur-md [transform:translateZ(0px)]">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),color-mix(in_oklab,var(--primary-foreground)_18%,transparent),transparent_55%)]" />
          <p className="text-xs font-bold tracking-widest text-primary-light">CREATE · SCENE 3 OF 4</p>
          <p className="mt-2 font-display text-xl font-extrabold">Creating your video…</p>
          <ul className="mt-6 space-y-3.5 text-sm">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${300 + i * 150}ms` }}>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", i < 2 ? "bg-primary text-primary-foreground" : "bg-primary-foreground/10 text-primary-light")}>
                  {i < 2 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={i < 2 ? "font-semibold" : "text-primary-light/80"}>{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-primary-foreground/10">
            <div className="h-full rounded-full bg-primary animate-progress" />
          </div>
        </div>

        {/* Character avatar */}
        <div className="absolute -left-6 -top-6 [transform:translateZ(50px)]">
          <div className="animate-float flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-foreground/20 bg-primary text-4xl shadow-fab">
            🧑🏾‍🎤
          </div>
        </div>

        {/* Hook bubble */}
        <div className="absolute -right-8 top-16 [transform:translateZ(80px)]">
          <div className="animate-float-slow max-w-[11rem] rounded-2xl rounded-tr-sm border border-primary-foreground/20 bg-primary-deep/90 px-3.5 py-2.5 text-xs shadow-fab backdrop-blur">
            <span className="flex items-center gap-1.5 font-bold text-primary-light"><Sparkles className="h-3.5 w-3.5" /> AI Script</span>
            <span className="mt-0.5 block font-semibold">Viral 3-sec hook generated</span>
          </div>
        </div>

        {/* Voice wave */}
        <div className="absolute -bottom-6 -left-4 [transform:translateZ(70px)]">
          <div className="animate-float flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-deep/90 px-3.5 py-2 shadow-fab backdrop-blur" style={{ animationDelay: "-2s" }}>
            <Mic className="h-4 w-4 text-primary-light" />
            <span className="flex h-4 items-end gap-0.5">
              {[0, 1, 2, 3, 4].map((b) => (
                <span key={b} className="w-1 rounded-full bg-primary-light animate-wave" style={{ animationDelay: `${b * 120}ms` }} />
              ))}
            </span>
          </div>
        </div>

        {/* Platforms */}
        <div className="absolute -bottom-8 -right-6 [transform:translateZ(40px)]">
          <div className="animate-float-slow flex gap-1.5" style={{ animationDelay: "-1s" }}>
            {["TikTok", "Reels", "Shorts"].map((p) => (
              <span key={p} className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-fab">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
