import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ClipResult {
  path: string;
  thumbnailPath?: string | null;
  start: number;
  end: number;
  title: string;
  score: number;
  quote?: string;
}

/** Gives the signed-in user a one-time upload slot for a long source video. */
export const createClipSourceUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ ext: z.enum(["mp4", "mov", "webm", "m4v"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const path = `${context.userId}/sources/${crypto.randomUUID()}.${data.ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: up, error } = await supabaseAdmin.storage.from("generated-videos").createSignedUploadUrl(path);
    if (error) throw new Error(error.message);
    return { path, token: up.token };
  });

const clipSchema = z.object({
  sourcePath: z.string().min(10).max(300),
  title: z.string().max(200).default("Untitled source"),
  clipLength: z.union([z.literal(15), z.literal(30), z.literal(60)]).default(30),
  ratio: z.enum(["9:16", "1:1", "16:9"]).default("9:16"),
  count: z.number().int().min(3).max(5).default(5),
  captions: z.boolean().default(true),
});

/** Queues a clipping job for the local worker (PySceneDetect + Whisper + Qwen + FFmpeg). */
export const enqueueClipJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => clipSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (!data.sourcePath.startsWith(`${context.userId}/sources/`)) throw new Error("Invalid source");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: job, error } = await supabaseAdmin
      .from("generation_jobs")
      .insert({ user_id: context.userId, kind: "clip", input: data as never })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { jobId: job.id };
  });

/** Status of a clip job plus short-lived links to each finished clip. */
export const getClipJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: job, error } = await context.supabase
      .from("generation_jobs")
      .select("id,status,progress,stage,error,input,created_at")
      .eq("id", data.jobId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!job) return null;
    const input = (job.input ?? {}) as { clips?: ClipResult[]; title?: string };
    const clips: (ClipResult & { videoUrl: string | null; thumbnailUrl: string | null })[] = [];
    if (job.status === "completed" && Array.isArray(input.clips)) {
      const bucket = context.supabase.storage.from("generated-videos");
      for (const c of input.clips.slice(0, 10)) {
        const v = await bucket.createSignedUrl(c.path, 3600);
        const t = c.thumbnailPath ? await bucket.createSignedUrl(c.thumbnailPath, 3600) : null;
        clips.push({ ...c, videoUrl: v.data?.signedUrl ?? null, thumbnailUrl: t?.data?.signedUrl ?? null });
      }
      clips.sort((a, b) => b.score - a.score);
    }
    return { id: job.id, status: job.status, progress: job.progress, stage: job.stage, error: job.error, title: input.title ?? "", clips };
  });
