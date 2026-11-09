import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  prompt: z.string().trim().min(3).max(800),
  ratio: z.enum(["9:16", "16:9", "1:1"]).default("9:16"),
});

/** Generates a thumbnail background image from a text prompt. Returns a data URL. */
export const generateThumbnailImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const { generateImage, GatewayError } = await import("@lovable.dev/ai-gateway");
    const size = data.ratio === "9:16" ? "1024x1536" : data.ratio === "16:9" ? "1536x1024" : "1024x1024";
    try {
      const res = await generateImage({
        model: "openai/gpt-image-2.5-sunburst",
        prompt: `Eye-catching social media video thumbnail background, no text, no words, no letters. ${data.prompt}`,
        size,
        quality: "medium",
        output_format: "jpeg",
      });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) return { ok: false as const, error: "No image was returned. Try a different prompt." };
      return { ok: true as const, image: `data:image/jpeg;base64,${b64}` };
    } catch (e) {
      if (e instanceof GatewayError) {
        const status = e.httpStatus;
        if (status === 429) return { ok: false as const, error: "Too many requests right now. Please wait a moment." };
        if (status === 402) return { ok: false as const, error: "AI credits are used up. Please top up to keep generating." };
      }
      console.error("thumbnail generation failed", e);
      return { ok: false as const, error: "Could not generate the image. Please try again." };
    }
  });
