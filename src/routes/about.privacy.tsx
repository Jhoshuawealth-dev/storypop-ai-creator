import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about/privacy")({
  head: pageHead("Privacy Policy", "How Storypop AI collects, uses and protects your data."),
  component: Privacy,
});

const sections = [
  {
    title: "1. What we collect",
    body: "Account details (name, email), content you create (scripts, characters, videos), usage data (features used, generation history) and device information needed to run the app.",
  },
  {
    title: "2. Photos you upload",
    body: "Photos uploaded to create AI characters are used only to build your character model. They are never used to train shared models, never sold, and deleted within 30 days if you delete the character or your account.",
  },
  {
    title: "3. How we use data",
    body: "To provide and improve the service, personalise script suggestions, process payments, prevent abuse, and send service notifications. We don't sell your personal data to anyone.",
  },
  {
    title: "4. Third-party processors",
    body: "We use trusted providers for AI generation, cloud hosting, analytics and payments. Each is bound by data-processing agreements and only receives the minimum data needed to operate.",
  },
  {
    title: "5. Your rights",
    body: "You can access, correct, export or delete your data anytime from Settings → Security & Privacy → Download my data, or by deleting your account. You can also opt out of marketing emails with one tap.",
  },
  {
    title: "6. Retention",
    body: "We keep your data while your account is active. After deletion, backups are purged within 30 days and billing records are kept only as long as the law requires.",
  },
  {
    title: "7. Security",
    body: "Data is encrypted in transit and at rest. Access is limited to authorised staff under strict controls. Enable two-factor authentication for an extra layer of protection.",
  },
  {
    title: "8. Contact",
    body: "For privacy questions or requests, email privacy@storypop.ai. We respond to all requests within 30 days.",
  },
];

function Privacy() {
  return (
    <AppShell title="Privacy Policy" showBack backTo="/about">
      <p className="mt-4 text-xs font-semibold text-muted-foreground">Last updated: August 15, 2026</p>
      <div className="mt-4 space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-base font-bold text-foreground">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
