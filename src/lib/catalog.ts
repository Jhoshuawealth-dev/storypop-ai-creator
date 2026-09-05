/**
 * Static product catalog + shared domain types.
 *
 * This file contains ONLY real, static product configuration (voices, visual
 * styles, plans, platforms, help content). All user content — projects,
 * characters, posts, notifications, analytics — lives in the app store and
 * starts empty for every new account.
 */

/* ---------------- Shared types ---------------- */

export type ProjectStatus = "draft" | "generating" | "completed" | "scheduled" | "published";

export interface Project {
  id: string;
  title: string;
  thumb?: string;
  durationSeconds: number;
  createdAt: string;
  status: ProjectStatus;
  platform?: string;
  script?: { hook: string; body: string; cta: string };
  scenes?: Scene[];
}

export interface Character {
  id: string;
  name: string;
  style: string;
  voice: string;
  image?: string;
  videos: number;
  created: string;
}

export interface Scene {
  id: string;
  title: string;
  durationSeconds: number;
  description: string;
}

export interface Voice {
  id: string;
  name: string;
  gender: "Male" | "Female";
  style: string;
  sample: string;
}

export type NotificationType = "video" | "publish" | "schedule" | "subscription" | "tip";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ScheduledPost {
  id: string;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "draft" | "scheduled" | "published";
  thumb?: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  minutes: string;
  minuteSeconds: number;
  features: string[];
  recommended?: boolean;
}

/* ---------------- Helpers ---------------- */

export function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, Math.round(totalSeconds % 60));
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------------- Creation catalog ---------------- */

export const characterStyles = [
  { id: "3d", label: "3D Avatar", desc: "Pixar-like animated look" },
  { id: "cartoon", label: "Cartoon", desc: "Bold, playful 2D feel" },
  { id: "anime", label: "Anime", desc: "Japanese animation style" },
  { id: "realistic", label: "Realistic", desc: "Lifelike digital human" },
  { id: "stylized", label: "Stylized", desc: "Editorial illustration look" },
];

export const voices: Voice[] = [
  { id: "david", name: "David", gender: "Male", style: "Energetic", sample: "Hey! You need to see this..." },
  { id: "mark", name: "Mark", gender: "Male", style: "Professional", sample: "Let me walk you through it." },
  { id: "john", name: "John", gender: "Male", style: "Calm", sample: "Here's the simple truth." },
  { id: "sarah", name: "Sarah", gender: "Female", style: "Friendly", sample: "Okay, so I tried this and..." },
  { id: "ava", name: "Ava", gender: "Female", style: "Calm", sample: "This changed my routine." },
  { id: "lola", name: "Lola", gender: "Female", style: "Funny", sample: "Wait for it... wait for it!" },
];

export const videoStyles = [
  { id: "3d", label: "3D", desc: "Animated 3D character scenes" },
  { id: "cartoon", label: "Cartoon", desc: "Fun, expressive 2D motion" },
  { id: "anime", label: "Anime", desc: "Vibrant anime aesthetic" },
  { id: "realistic", label: "Realistic", desc: "True-to-life UGC feel" },
  { id: "stylized", label: "Stylized", desc: "Bold editorial look" },
  { id: "ugc", label: "UGC", desc: "Native selfie-style content" },
  { id: "cinematic", label: "Cinematic", desc: "Film-grade lighting" },
];

export const emptyScript = { hook: "", body: "", cta: "" };

/** Structure suggestions used when a user starts a new scene plan. */
export const sceneTemplate: Scene[] = [
  { id: "s1", title: "Hook", durationSeconds: 5, description: "" },
  { id: "s2", title: "Problem", durationSeconds: 7, description: "" },
  { id: "s3", title: "Solution", durationSeconds: 8, description: "" },
  { id: "s4", title: "Call to action", durationSeconds: 10, description: "" },
];

/* ---------------- Publishing ---------------- */

export interface PlatformSpec {
  id: string;
  name: string;
  /** Max characters the platform allows for the post title. */
  titleMax: number;
  /** Max characters for the post description / caption. */
  descriptionMax: number;
  /** Recommended number of hashtags. */
  hashtagsMax: number;
  tip: string;
}

export const platformSpecs: PlatformSpec[] = [
  {
    id: "tiktok",
    name: "TikTok",
    titleMax: 100,
    descriptionMax: 2200,
    hashtagsMax: 5,
    tip: "Front-load your keyword — TikTok search indexes the first words of the caption.",
  },
  {
    id: "instagram",
    name: "Instagram",
    titleMax: 125,
    descriptionMax: 2200,
    hashtagsMax: 10,
    tip: "Only the first 125 characters show before “more”. Put the hook there.",
  },
  {
    id: "youtube",
    name: "YouTube",
    titleMax: 100,
    descriptionMax: 5000,
    hashtagsMax: 15,
    tip: "YouTube ranks on title + first 150 characters of the description.",
  },
  {
    id: "facebook",
    name: "Facebook",
    titleMax: 120,
    descriptionMax: 5000,
    hashtagsMax: 5,
    tip: "Short captions with one clear question outperform long text on Facebook.",
  },
];

/* ---------------- Plans & billing ---------------- */

export const plans: Plan[] = [
  {
    id: "creator",
    name: "Creator",
    priceMonthly: "₦9,900",
    priceYearly: "₦99,000",
    minutes: "3:00 video minutes / month",
    minuteSeconds: 180,
    features: ["3:00 video minutes monthly", "1 AI character", "720p exports", "AI script writer", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "₦24,900",
    priceYearly: "₦249,000",
    minutes: "8:00 video minutes / month",
    minuteSeconds: 480,
    recommended: true,
    features: [
      "8:00 video minutes monthly",
      "5 AI characters",
      "1080p exports",
      "AI editor & captions",
      "Multi-platform publishing",
      "Priority support",
    ],
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: "₦59,900",
    priceYearly: "₦599,000",
    minutes: "20:00 video minutes / month",
    minuteSeconds: 1200,
    features: [
      "20:00 video minutes monthly",
      "Unlimited AI characters",
      "4K exports",
      "Team workspace",
      "Advanced analytics",
      "Dedicated manager",
    ],
  },
];

export const creditPacks = [
  { id: "c1", minutes: "2:00", seconds: 120, price: "₦4,500" },
  { id: "c2", minutes: "5:00", seconds: 300, price: "₦9,900" },
  { id: "c3", minutes: "12:00", seconds: 720, price: "₦19,900" },
];

/* ---------------- Editor ---------------- */

export const editorTools = [
  "Trim",
  "Split",
  "Text",
  "Captions",
  "Voice",
  "Music",
  "Effects",
  "Transitions",
  "Speed",
  "Background",
  "Character",
];

export const suggestedCommands = [
  "Make the first 3 seconds stronger",
  "Add captions",
  "Make it shorter",
  "Make it funnier",
  "Improve the CTA",
];

/* ---------------- Help ---------------- */

export const faqs = [
  {
    q: "How do video minutes work?",
    a: "Every plan includes a monthly allowance of video minutes. Generating a video deducts its final duration from your balance, which resets each billing cycle.",
  },
  {
    q: "Can I reuse my AI character?",
    a: "Yes. Characters you create are saved to your library and can be reused in unlimited future videos on supported plans.",
  },
  {
    q: "Which platforms can I publish to?",
    a: "TikTok, Instagram, YouTube and Facebook. Connect your accounts in Settings → Social Accounts.",
  },
  {
    q: "What happens if generation fails?",
    a: "Failed generations never deduct minutes. You can retry instantly from the result screen.",
  },
];

/** Short human date, e.g. "12 Sep 2026". Returns a dash for empty values. */
export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
