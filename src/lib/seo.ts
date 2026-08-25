export function pageHead(title: string, description: string) {
  return () => ({
    meta: [
      { title: `${title} — Storypop AI` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Storypop AI` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  });
}
