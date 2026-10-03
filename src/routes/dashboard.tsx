import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./home";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: pageHead("Dashboard", "Your Storypop AI creator workspace."),
  component: Home,
});