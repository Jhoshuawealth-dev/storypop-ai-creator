import avatarJoshua from "@/assets/avatar-joshua.jpg";
import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarDavid from "@/assets/avatar-david.jpg";
import avatarAva from "@/assets/avatar-ava.jpg";
import thumbSneaker from "@/assets/thumb-sneaker.jpg";

export { avatarJoshua, avatarSarah, avatarDavid, avatarAva, thumbSneaker };

/* ---------------- User & plan ---------------- */

export const currentUser = {
  name: "Joshua",
  fullName: "Joshua Adeyemi",
  email: "joshua@storypop.ai",
  avatar: avatarJoshua,
  plan: "Pro",
};

export const usage = {
  plan: "Pro Plan",
  totalSeconds: 480, // 8:00
  usedSeconds: 78, // 1:18
  resetDate: "Sep 12, 2026",
};

export function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------------- Projects ---------------- */

export type ProjectStatus = "draft" | "completed" | "scheduled" | "published";

export interface Project {
  id: string;
  title: string;
  thumb: string;
  durationSeconds: number;
  createdAt: string;
  status: ProjectStatus;
  platform?: string;
}

export const projects: Project[] = [
  {
    id: "sneaker-promo",
    title: "Sneaker Promo",
    thumb: thumbSneaker,
    durationSeconds: 30,
    createdAt: "2 hours ago",
    status: "completed",
  },
  {
    id: "brand-promo",
    title: "Brand Promo",
    thumb: avatarJoshua,
    durationSeconds: 34,
    createdAt: "May 10 · 0:34",
    status: "draft",
  },
  {
    id: "product-review",
    title: "Product Review",
    thumb: avatarSarah,
    durationSeconds: 45,
    createdAt: "May 8 · 0:45",
    status: "scheduled",
    platform: "TikTok",
  },
  {
    id: "lifestyle-tips",
    title: "Lifestyle Tips",
    thumb: avatarAva,
    durationSeconds: 60,
    createdAt: "May 6 · 1:00",
    status: "published",
    platform: "Instagram",
  },
  {
    id: "fitness-tips",
    title: "Fitness Tips",
    thumb: avatarDavid,
    durationSeconds: 30,
    createdAt: "May 4 · 0:30",
    status: "scheduled",
    platform: "YouTube",
  },
  {
    id: "skincare-routine",
    title: "Skincare Routine",
    thumb: avatarAva,
    durationSeconds: 38,
    createdAt: "Apr 29 · 0:38",
    status: "published",
    platform: "TikTok",
  },
];

/* ---------------- Characters ---------------- */

export interface Character {
  id: string;
  name: string;
  style: string;
  voice: string;
  image: string;
  videos: number;
  created: string;
}

export const characters: Character[] = [
  {
    id: "joshua",
    name: "Joshua",
    style: "3D Avatar",
    voice: "David · Energetic",
    image: avatarJoshua,
    videos: 12,
    created: "Apr 2, 2026",
  },
  {
    id: "sarah",
    name: "Sarah",
    style: "Cartoon",
    voice: "Sarah · Friendly",
    image: avatarSarah,
    videos: 8,
    created: "Apr 11, 2026",
  },
  {
    id: "david",
    name: "David",
    style: "Realistic",
    voice: "Mark · Professional",
    image: avatarDavid,
    videos: 5,
    created: "Apr 20, 2026",
  },
  {
    id: "ava",
    name: "Ava",
    style: "Stylized",
    voice: "Ava · Calm",
    image: avatarAva,
    videos: 3,
    created: "May 1, 2026",
  },
];

export const characterStyles = [
  { id: "3d", label: "3D Avatar", desc: "Pixar-like animated look" },
  { id: "cartoon", label: "Cartoon", desc: "Bold, playful 2D feel" },
  { id: "anime", label: "Anime", desc: "Japanese animation style" },
  { id: "realistic", label: "Realistic", desc: "Lifelike digital human" },
  { id: "stylized", label: "Stylized", desc: "Editorial illustration look" },
];

/* ---------------- Voices & styles ---------------- */

export interface Voice {
  id: string;
  name: string;
  gender: "Male" | "Female";
  style: string;
  sample: string;
}

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

/* ---------------- Script & scenes ---------------- */

export const defaultScript = {
  hook: "Want sneakers that turn heads?",
  body: "Our sneakers give you style, comfort and confidence — without breaking the bank. Handcrafted materials, all-day cushioning, and a look that works everywhere from the gym to the streets.",
  cta: "Tap the link and grab yours before they sell out!",
};

export interface Scene {
  id: string;
  title: string;
  durationSeconds: number;
  description: string;
}

export const defaultScenes: Scene[] = [
  { id: "s1", title: "Hook", durationSeconds: 5, description: "Character looks at camera and asks the hook question." },
  { id: "s2", title: "Problem", durationSeconds: 7, description: "Show the frustration of uncomfortable, boring shoes." },
  { id: "s3", title: "Solution", durationSeconds: 8, description: "Reveal the sneaker, highlight comfort and style." },
  { id: "s4", title: "CTA", durationSeconds: 10, description: "Invite viewers to tap the link and order today." },
];

/* ---------------- Notifications ---------------- */

export type NotificationType = "video" | "publish" | "schedule" | "subscription" | "tip";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export const notifications: AppNotification[] = [
  { id: "n1", type: "video", title: "Your video is ready", body: "Sneaker Promo finished generating.", time: "12 min ago", read: false },
  { id: "n2", type: "publish", title: "Post published", body: "Lifestyle Tips is now live on Instagram.", time: "1 h ago", read: false },
  { id: "n3", type: "schedule", title: "Scheduled post", body: "Fitness Tips will publish May 12 at 6:00 PM.", time: "3 h ago", read: true },
  { id: "n4", type: "subscription", title: "Subscription updated", body: "You are now on the Pro Plan. Enjoy 8:00 minutes monthly.", time: "1 d ago", read: true },
  { id: "n5", type: "tip", title: "Tips for you", body: "Videos with a strong first 3 seconds keep 40% more viewers.", time: "2 d ago", read: true },
];

/* ---------------- Calendar ---------------- */

export interface ScheduledPost {
  id: string;
  title: string;
  date: string;
  time: string;
  platform: string;
  status: "draft" | "scheduled" | "published";
  thumb: string;
}

export const scheduledPosts: ScheduledPost[] = [
  { id: "p1", title: "Sneaker Promo", date: "May 12", time: "10:00 AM", platform: "TikTok", status: "scheduled", thumb: thumbSneaker },
  { id: "p2", title: "Fitness Tips", date: "May 12", time: "6:00 PM", platform: "YouTube", status: "scheduled", thumb: avatarDavid },
  { id: "p3", title: "Lifestyle Tips", date: "May 8", time: "9:00 AM", platform: "Instagram", status: "published", thumb: avatarAva },
  { id: "p4", title: "Brand Promo", date: "Not scheduled", time: "", platform: "—", status: "draft", thumb: avatarJoshua },
];

export const platforms = [
  { id: "tiktok", name: "TikTok", connected: true, handle: "@joshua.creates" },
  { id: "instagram", name: "Instagram", connected: true, handle: "@joshua.ai" },
  { id: "youtube", name: "YouTube", connected: false, handle: "" },
  { id: "facebook", name: "Facebook", connected: false, handle: "" },
];

/* ---------------- Analytics ---------------- */

export const analyticsSeries = [
  { label: "W1", views: 12 },
  { label: "W2", views: 19 },
  { label: "W3", views: 15 },
  { label: "W4", views: 26 },
  { label: "W5", views: 22 },
  { label: "W6", views: 34 },
  { label: "W7", views: 30 },
  { label: "W8", views: 44 },
  { label: "W9", views: 39 },
  { label: "W10", views: 52 },
  { label: "W11", views: 61 },
  { label: "W12", views: 58 },
];

export const retentionSeries = [100, 82, 71, 64, 58, 52, 47, 43, 38, 34];

export const analyticsTotals = {
  views: "128.4K",
  likes: "12.6K",
  comments: "1.2K",
  shares: "3.4K",
  followers: "2,140",
  engagement: "6.8%",
  watchTime: "12h 36m",
  completion: "63%",
};

export const aiInsights = [
  "Your storytelling videos are performing better than product-only videos — 34% more watch time.",
  "Videos with stronger hooks are getting higher retention. Front-load the payoff in the first 3 seconds.",
  "Posting between 6–8 PM on TikTok is driving most of your engagement.",
  "Your 3D character Joshua outperforms other characters by 2.1x on completion rate.",
];

/* ---------------- Subscription ---------------- */

export interface Plan {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  minutes: string;
  features: string[];
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: "creator",
    name: "Creator",
    priceMonthly: "₦9,900",
    priceYearly: "₦99,000",
    minutes: "3:00 video minutes / month",
    features: ["3:00 video minutes monthly", "1 AI character", "720p exports", "Basic AI script writer", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "₦24,900",
    priceYearly: "₦249,000",
    minutes: "8:00 video minutes / month",
    recommended: true,
    features: ["8:00 video minutes monthly", "5 AI characters", "1080p exports", "AI editor & captions", "Multi-platform publishing", "Priority support"],
  },
  {
    id: "business",
    name: "Business",
    priceMonthly: "₦59,900",
    priceYearly: "₦599,000",
    minutes: "20:00 video minutes / month",
    features: ["20:00 video minutes monthly", "Unlimited AI characters", "4K exports", "Team workspace", "Advanced analytics", "Dedicated manager"],
  },
];

export const creditPacks = [
  { id: "c1", minutes: "2:00", price: "₦4,500" },
  { id: "c2", minutes: "5:00", price: "₦9,900" },
  { id: "c3", minutes: "12:00", price: "₦19,900" },
];

/* ---------------- Editor & captions ---------------- */

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

export const captionMock = {
  caption: "Don't just wear sneakers, wear confidence. 🔥 These changed how I move through my day — comfort + style in one.",
  hashtags: ["#sneakers", "#style", "#fashion", "#confidence", "#ugc", "#sneakerhead"],
  cta: "Tap the link in bio to grab yours before they sell out.",
};

/* ---------------- FAQs ---------------- */

export const faqs = [
  { q: "How do video minutes work?", a: "Every plan includes a monthly allowance of video minutes. Generating a video deducts its final duration from your balance, which resets each billing cycle." },
  { q: "Can I reuse my AI character?", a: "Yes. Characters you create are saved to your library and can be reused in unlimited future videos on supported plans." },
  { q: "Which platforms can I publish to?", a: "TikTok, Instagram, YouTube and Facebook. Connect your accounts in Settings → Social Accounts." },
  { q: "What happens if generation fails?", a: "Failed generations never deduct minutes. You can retry instantly from the result screen." },
];
