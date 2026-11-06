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
  credits?: number;
  idealFor?: string;
  custom?: boolean;
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

export const CREDITS_PER_MINUTE = 80;

/** Every new account gets this many seconds of video on the Free plan. */
export const FREE_PLAN_SECONDS = 300;

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMonthly: "$0",
    priceYearly: "$0",
    credits: 400,
    minutes: "400 AI credits · 5 minutes",
    minuteSeconds: FREE_PLAN_SECONDS,
    idealFor: "Try Storypop AI before choosing a plan.",
    features: [
      "5 minutes of AI video",
      "AI Character Creation",
      "AI Script and Idea Generation",
      "AI Voice and Narration",
      "Basic AI Video Editor",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    priceMonthly: "$9",
    priceYearly: "Annual pricing coming soon",
    credits: 1500,
    minutes: "1,500 AI credits · 18.75 minutes",
    minuteSeconds: 1125,
    idealFor: "Ideal for individuals and beginner content creators.",
    features: [
      "AI Character Creation",
      "Photo-to-Video Generation",
      "AI Script and Idea Generation",
      "AI Voice and Narration",
      "AI Video Editor",
      "Content Formats and Variations",
      "1 Content DNA profile",
      "Basic Social Media Scheduling",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    priceMonthly: "$29",
    priceYearly: "Annual pricing coming soon",
    credits: 6000,
    minutes: "6,000 AI credits · 75 minutes",
    minuteSeconds: 4500,
    recommended: true,
    idealFor: "Ideal for serious creators, influencers and growing businesses.",
    features: [
      "Everything in Starter",
      "Storypop Brain",
      "Trend-to-You Content Strategy",
      "Advanced AI Video Generation",
      "Advanced Content Formats and Variations",
      "Community Agent",
      "3 Content DNA profiles",
      "Social Media Publishing and Scheduling",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    priceMonthly: "$59",
    priceYearly: "Annual pricing coming soon",
    credits: 15000,
    minutes: "15,000 AI credits · 187.5 minutes",
    minuteSeconds: 11250,
    idealFor: "Ideal for professional creators, influencers and agencies.",
    features: [
      "Everything in Creator",
      "Premium AI Video Generation",
      "Advanced AI Video Editor",
      "Advanced Clipping",
      "Revenue Intelligence",
      "Affiliate-to-Video",
      "10 Content DNA profiles",
      "Advanced Community Agent",
      "Advanced Analytics",
      "Priority Processing",
    ],
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: "$149",
    priceYearly: "Annual pricing coming soon",
    credits: 50000,
    minutes: "50,000 AI credits · 625 minutes",
    minuteSeconds: 37500,
    idealFor: "Ideal for agencies, brands and marketing teams.",
    features: [
      "Everything in Professional",
      "Multiple Brand Workspaces",
      "Team Collaboration",
      "Advanced AI Workflows",
      "Higher Video Generation Capacity",
      "Advanced Revenue Intelligence",
      "Multiple Content DNA profiles",
      "Campaign Management",
      "Team Usage Analytics",
      "Priority Processing and Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    credits: 0,
    minutes: "Custom monthly credit allocation",
    minuteSeconds: 0,
    custom: true,
    idealFor: "For large organisations that need custom limits and support.",
    features: [
      "Everything in Business",
      "Custom monthly credit allocation",
      "Custom generation limits",
      "Dedicated infrastructure options",
      "Custom AI workflows",
      "Multiple teams and workspaces",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

/** Plan rank used for feature gating. "none" = no active plan. */
export const planLevels: Record<string, number> = { none: 0, free: 0, starter: 1, creator: 2, pro: 3, professional: 3, business: 4, enterprise: 5 };

export const creditPacks = [
  { id: "c1", minutes: "2:00", seconds: 120, price: "$5" },
  { id: "c2", minutes: "5:00", seconds: 300, price: "$10" },
  { id: "c3", minutes: "12:00", seconds: 720, price: "$20" },
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
