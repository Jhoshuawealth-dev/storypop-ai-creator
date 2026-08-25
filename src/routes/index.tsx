import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: pageHead("Welcome", "Turn your ideas into engaging UGC videos with AI."),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const authed = window.localStorage.getItem("storypop-auth") === "1";
      navigate({ to: authed ? "/home" : "/welcome", replace: true });
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-between bg-primary-deep px-6 py-16 text-primary-foreground">
      <div />
      <div className="flex flex-col items-center text-center">
        <span className="animate-splash-logo">
          <Logo size={88} className="bg-primary ring-8 ring-primary/30" />
        </span>
        <h1 className="mt-8 font-display text-3xl font-extrabold tracking-tight">STORYPOP AI</h1>
        <p className="mt-1.5 text-xs font-bold tracking-[0.28em] text-primary-light">AI UGC CREATOR APP</p>
        <p className="mt-5 max-w-64 text-sm leading-relaxed text-primary-light/90">
          Turn your ideas into engaging UGC videos with AI.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-dot-pulse rounded-full bg-primary-light"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-primary-light/80">Creating your next story...</p>
      </div>
    </div>
  );
}
