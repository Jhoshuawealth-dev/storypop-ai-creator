import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  url: z.string().trim().url().max(2000).refine((v) => /^https?:\/\//i.test(v), "Use an http(s) link"),
  notes: z.string().trim().max(1000).default(""),
  platform: z.enum(["TikTok", "Instagram", "YouTube", "Facebook"]).default("TikTok"),
  length: z.union([z.literal(30), z.literal(60)]).default(30),
});

export interface AffiliateAnalysis {
  productName: string;
  summary: string;
  audience: string;
  painPoints: string[];
  sellingPoints: string[];
  hooks: string[];
  script: { hook: string; body: string; cta: string };
  caption: string;
  hashtags: string[];
}

/** Reads the product page title/description so the AI has real context. */
function isSafePublicUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return false;
  if (u.username || u.password) return false;
  if (u.port && u.port !== "80" && u.port !== "443") return false;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (!host.includes(".") || host.includes(":")) return false; // no bare names or IPv6 literals
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain)$/.test(host)) return false;
  if (/^[0-9.]+$/.test(host) || /^0x/i.test(host)) {
    const p = host.split(".").map(Number);
    if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
    const [a, b] = p as [number, number, number, number];
    if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
  }
  return true;
}

async function readPage(url: string) {
  try {
    if (!isSafePublicUrl(url)) return { title: "", desc: "", text: "" };
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 StorypopBot" }, redirect: "manual", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { title: "", desc: "", text: "" };
    const html = (await res.text()).slice(0, 200_000);
    const pick = (re: RegExp) => html.match(re)?.[1]?.trim() ?? "";
    const title = pick(/<title[^>]*>([^<]{1,300})<\/title>/i);
    const desc = pick(/<meta[^>]+(?:name|property)=["'](?:og:)?description["'][^>]+content=["']([^"']{1,1000})/i);
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 3000);
    return { title, desc, text };
  } catch {
    return { title: "", desc: "", text: "" };
  }
}

export const analyzeAffiliateLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const page = await readPage(data.url);
    const prompt = `You are a UGC affiliate video strategist. Analyze this product and write a ${data.length}-second ${data.platform} UGC video.
Link: ${data.url}
Page title: ${page.title || "unknown"}
Page description: ${page.desc || "unknown"}
Page text: ${page.text || "unavailable"}
Creator notes: ${data.notes || "none"}

Rules: be honest, no fake claims, no income promises, include a short affiliate disclosure in the caption (e.g. "#ad"). If the page could not be read, base it on the link and notes and keep claims general.
Return ONLY JSON with keys: productName, summary, audience, painPoints (3 strings), sellingPoints (3-5 strings), hooks (3 strings), script {hook, body, cta}, caption, hashtags (5-8 strings without #).`;
    try {
      const res = await generateResponse({
        model: "openai/gpt-6-astra",
        input: prompt,
        text: { format: { type: "json_object" } },
      });
      let out = "";
      for (const item of (res as { output?: { type: string; content?: { type: string; text?: string }[] }[] }).output ?? []) {
        if (item.type !== "message") continue;
        for (const c of item.content ?? []) if (c.type === "output_text" && c.text) out += c.text;
      }
      const parsed = JSON.parse(out.replace(/^```json|```$/g, "").trim()) as AffiliateAnalysis;
      return { ok: true as const, analysis: parsed };
    } catch (e) {
      if (e instanceof GatewayError) {
        if (e.httpStatus === 429) return { ok: false as const, error: "Too many requests right now. Please wait a moment." };
        if (e.httpStatus === 402) return { ok: false as const, error: "AI credits are used up. Please top up to keep going." };
      }
      console.error("affiliate analysis failed", e);
      return { ok: false as const, error: "Could not analyze that link. Check it and try again." };
    }
  });
