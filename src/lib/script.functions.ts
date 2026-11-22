import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MONETIZATION_SAFE_PROMPT } from "@/lib/monetization-safe";

const scriptShape = z.object({ hook: z.string().max(2000), body: z.string().max(8000), cta: z.string().max(1000) });

const schema = z.object({
  idea: z.string().trim().max(5000).default(""),
  topic: z.string().max(200).default(""),
  audience: z.string().max(200).default(""),
  tone: z.string().max(100).default(""),
  platform: z.string().max(100).default(""),
  cta: z.string().max(200).default(""),
  duration: z.number().int().min(5).max(600).default(30),
  template: z.string().max(200).default(""),
  productUrl: z.string().max(2000).default(""),
  monetizationSafe: z.boolean().default(true),
  instruction: z.string().max(200).default(""),
  current: scriptShape.optional(),
});

export type ScriptResult = { ok: true; script: { hook: string; body: string; cta: string } } | { ok: false; error: string };

/** Writes a new UGC script, or rewrites the current one with an instruction (e.g. "Make Shorter"). */
export const writeScript = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<ScriptResult> => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const brief = `Idea: ${data.idea || "none"}
Topic: ${data.topic || "any"}
Audience: ${data.audience || "general"}
Tone: ${data.tone || "casual"}
Platform: ${data.platform || "TikTok"}
Length: about ${data.duration} seconds spoken
Call to action: ${data.cta || "follow for more"}
${data.template ? `Format: ${data.template}` : ""}
${data.productUrl ? `Product link: ${data.productUrl}` : ""}`;
    const task = data.current && data.instruction
      ? `Rewrite this script. Instruction: ${data.instruction}.\nCurrent script JSON: ${JSON.stringify(data.current)}`
      : `Write a fresh UGC video script.`;
    const prompt = `You are an expert short-form UGC scriptwriter. ${task}
Brief:
${brief}
${data.monetizationSafe ? `Follow these platform-safety rules:\n${MONETIZATION_SAFE_PROMPT}` : ""}
Write natural spoken lines, first person. Return ONLY JSON: {"hook": string, "body": string, "cta": string}.`;
    try {
      const res = await generateResponse({ model: "openai/gpt-6-astra", input: prompt, text: { format: { type: "json_object" } } });
      let out = "";
      for (const item of (res as { output?: { type: string; content?: { type: string; text?: string }[] }[] }).output ?? []) {
        if (item.type !== "message") continue;
        for (const c of item.content ?? []) if (c.type === "output_text" && c.text) out += c.text;
      }
      const parsed = scriptShape.parse(JSON.parse(out.replace(/^```json|```$/g, "").trim()));
      return { ok: true, script: parsed };
    } catch (e) {
      if (e instanceof GatewayError) {
        if (e.httpStatus === 429) return { ok: false, error: "Too many requests right now. Please wait a moment." };
        if (e.httpStatus === 402) return { ok: false, error: "AI credits are used up. Please top up to keep going." };
      }
      console.error("script generation failed", e);
      return { ok: false, error: "Could not write the script. Please try again." };
    }
  });
