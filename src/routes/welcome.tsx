import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/seo";
import welcomeHero from "@/assets/welcome-hero.jpg";

export const Route = createFileRoute("/welcome")({
  head: pageHead("Welcome", "Create amazing UGC videos with AI — no filming required."),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background px-6 pb-10 pt-6">
      <LogoMark />
      <div className="mt-6 overflow-hidden rounded-3xl shadow-card">
        <img
          src={welcomeHero}
          alt="Creator recording a video with their AI character"
          className="aspect-[7/8] w-full object-cover"
          width={896}
          height={1024}
        />
      </div>
      <div className="mt-8 text-center">
        <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-tight text-foreground">
          Create amazing UGC videos with AI.
        </h1>
        <p className="mx-auto mt-3 max-w-72 text-[15px] leading-relaxed text-muted-foreground">
          Turn your ideas, products and stories into engaging videos without filming everything yourself.
        </p>
      </div>
      <div className="mt-auto space-y-3 pt-10">
        <Link to="/register" className="block">
          <Button size="lg" fullWidth>
            Get Started
          </Button>
        </Link>
        <Link to="/login" className="block">
          <Button size="lg" variant="outline" fullWidth>
            Sign In
          </Button>
        </Link>
        <p className="pt-2 text-center text-xs font-medium text-muted-foreground">
          Create content. Edit it. Publish it.
        </p>
      </div>
    </div>
  );
}
