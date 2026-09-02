import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about/terms")({
  head: pageHead("Terms of Service", "The terms that govern your use of Storypop AI."),
  component: Terms,
});

const sections = [
  {
    title: "1. Using Storypop AI",
    body: "Storypop AI gives you tools to generate scripts, characters, voices and videos with AI. You must be at least 16 years old to create an account, and you're responsible for everything that happens under it.",
  },
  {
    title: "2. Your content",
    body: "You own the videos you create on a paid plan, including for commercial use. You grant us a limited licence to host and process your content solely to operate the service. Don't upload photos of other people to create AI characters without their consent.",
  },
  {
    title: "3. Acceptable use",
    body: "You may not use Storypop AI to create deceptive, defamatory, hateful or unlawful content, impersonate real people without disclosure, or generate spam. We may suspend accounts that break these rules.",
  },
  {
    title: "4. Plans & video minutes",
    body: "Paid plans include a monthly allowance of video minutes that resets each billing cycle and doesn't roll over. Additional minutes can be bought as credit packs and never expire while your account is active.",
  },
  {
    title: "5. Billing & cancellation",
    body: "Subscriptions renew automatically until cancelled. You can cancel anytime from Settings → Subscription; your plan stays active until the end of the paid period. Failed generations never deduct minutes.",
  },
  {
    title: "6. AI-generated output",
    body: "AI output can occasionally be inaccurate or unexpected. You're responsible for reviewing videos before publishing them. We don't guarantee that generated content is unique or free of third-party claims.",
  },
  {
    title: "7. Liability",
    body: "The service is provided \"as is\". To the maximum extent permitted by law, Storypop AI is not liable for indirect or consequential damages, and our total liability is limited to the amount you paid in the last 12 months.",
  },
  {
    title: "8. Changes",
    body: "We may update these terms from time to time. We'll notify you of material changes in the app at least 14 days before they take effect. Continued use after that means you accept the new terms.",
  },
];

function Terms() {
  return (
    <AppShell title="Terms of Service" showBack backTo="/about">
      <p className="mt-4 text-xs font-semibold text-muted-foreground">Last updated: August 15, 2026</p>
      <div className="mt-4 space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-base font-bold text-foreground">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">Questions? Contact legal@storypop.ai</p>
    </AppShell>
  );
}
