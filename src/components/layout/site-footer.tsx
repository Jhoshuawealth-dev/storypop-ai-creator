import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo";

const linkSections = [
  {
    title: "Product",
    links: [
      { label: "Pricing", to: "/#pricing" },
      { label: "FAQ", to: "/#faq" },
      { label: "Support", to: "/support" },
      { label: "Log In", to: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", to: "/about/terms" },
      { label: "Privacy Policy", to: "/about/privacy" },
      { label: "Content Guidelines", to: "/about/guidelines" },
      { label: "Licenses", to: "/about/licenses" },
    ],
  },
  {
    title: "Get in touch",
    links: [{ label: "Contact Us", to: "/contact" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-8">
        <div>
          <LogoMark className="text-primary-foreground" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
            Turn one photo into endless AI UGC videos. Create, edit and publish — all in one place.
          </p>
        </div>
        {linkSections.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary-foreground/50">{section.title}</p>
            <ul className="mt-4 space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-primary-foreground/10">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-primary-foreground/50 md:px-8">
          © {new Date().getFullYear()} Storypop AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
