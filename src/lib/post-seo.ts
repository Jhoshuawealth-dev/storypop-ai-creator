import { platformSpecs, type PlatformSpec } from "./catalog";

export interface SeoCheck {
  id: string;
  label: string;
  hint: string;
  passed: boolean;
  weight: number;
}

export interface SeoReport {
  score: number;
  checks: SeoCheck[];
  passedCount: number;
  grade: "Needs work" | "Good" | "Strong";
}

export interface PostInput {
  title: string;
  description: string;
  hashtags: string[];
  cta: string;
  keyword: string;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "your", "you",
  "this", "that", "it", "is", "are", "was", "be", "at", "by", "from", "as", "my", "we", "our",
]);

export function specFor(platformId: string): PlatformSpec {
  return platformSpecs.find((p) => p.id === platformId) ?? platformSpecs[0]!;
}

/** The strictest limits across the selected platforms. */
export function combinedLimits(platformIds: string[]) {
  const specs = platformIds.length
    ? platformSpecs.filter((p) => platformIds.includes(p.id))
    : platformSpecs;
  return {
    titleMax: Math.min(...specs.map((s) => s.titleMax)),
    descriptionMax: Math.min(...specs.map((s) => s.descriptionMax)),
    hashtagsMax: Math.min(...specs.map((s) => s.hashtagsMax)),
    specs,
  };
}

function includesKeyword(text: string, keyword: string) {
  if (!keyword.trim()) return false;
  return text.toLowerCase().includes(keyword.trim().toLowerCase());
}

export function analysePost(post: PostInput, platformIds: string[]): SeoReport {
  const limits = combinedLimits(platformIds);
  const title = post.title.trim();
  const description = post.description.trim();
  const hasKeyword = Boolean(post.keyword.trim());

  const checks: SeoCheck[] = [
    {
      id: "title",
      label: "Title is present and the right length",
      hint: `Aim for 25–${limits.titleMax} characters so nothing gets cut off.`,
      passed: title.length >= 25 && title.length <= limits.titleMax,
      weight: 20,
    },
    {
      id: "keyword-title",
      label: "Focus keyword appears in the title",
      hint: hasKeyword
        ? "Search on TikTok, Instagram and YouTube matches the title first."
        : "Add a focus keyword above to unlock this check.",
      passed: includesKeyword(title, post.keyword),
      weight: 20,
    },
    {
      id: "keyword-description",
      label: "Focus keyword appears early in the description",
      hint: "Use it inside the first 150 characters — that's what gets indexed.",
      passed: includesKeyword(description.slice(0, 150), post.keyword),
      weight: 15,
    },
    {
      id: "description",
      label: "Description is descriptive enough",
      hint: `Write at least 80 characters (max ${limits.descriptionMax}).`,
      passed: description.length >= 80 && description.length <= limits.descriptionMax,
      weight: 15,
    },
    {
      id: "hashtags",
      label: "Between 3 and the platform limit of hashtags",
      hint: `Use 3–${limits.hashtagsMax} specific tags instead of generic ones.`,
      passed: post.hashtags.length >= 3 && post.hashtags.length <= limits.hashtagsMax,
      weight: 15,
    },
    {
      id: "cta",
      label: "There's a clear call to action",
      hint: "Tell viewers exactly what to do next — comment, follow or tap the link.",
      passed: post.cta.trim().length >= 10,
      weight: 15,
    },
  ];

  const score = checks.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0);
  const passedCount = checks.filter((c) => c.passed).length;
  const grade: SeoReport["grade"] = score >= 85 ? "Strong" : score >= 55 ? "Good" : "Needs work";
  return { score, checks, passedCount, grade };
}

/** Suggests hashtags from the title, description and focus keyword. */
export function suggestHashtags(post: PostInput, max: number): string[] {
  const source = `${post.keyword} ${post.title} ${post.description}`.toLowerCase();
  const words = source
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);

  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => `#${w}`);
  const keywordTag = post.keyword.trim()
    ? `#${post.keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}`
    : "";

  const result: string[] = [];
  for (const tag of [keywordTag, ...ranked]) {
    if (tag && tag.length > 2 && !result.includes(tag)) result.push(tag);
    if (result.length >= max) break;
  }
  return result;
}

export function normaliseHashtag(raw: string) {
  const cleaned = raw.trim().replace(/^#+/, "").replace(/[^a-zA-Z0-9_]/g, "");
  return cleaned ? `#${cleaned.toLowerCase()}` : "";
}
