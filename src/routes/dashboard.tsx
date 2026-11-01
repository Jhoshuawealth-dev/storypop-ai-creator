import { createFileRoute, redirect } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: pageHead("Dashboard", "Your Storypop AI creator workspace."),
  beforeLoad: () => {
    throw redirect({ to: "/home", replace: true });
  },
});
