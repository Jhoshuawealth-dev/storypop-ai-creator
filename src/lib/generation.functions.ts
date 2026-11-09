import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MONETIZATION_SAFE_PROMPT } from "@/lib/monetization-safe";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const draftSchema = z.object({
  title: z.string().max(200).default("Untitled video"),
  idea: z.string().max(5000).default(""),
  script: z.object({ hook: z.string(), body: z.string(), cta: z.string() }).partial().default({}),
  scenes: z.array(z.record(z.string(), z.unknown())).max(50).default([]),
  voiceId: z.string().max(100).default(""),
  styleId: z.string().max(100).default(""),
  ratio: z.enum(["9:16", "16:9", "1:1"]).default("9:16"),
  duration: z.number().int().min(5).max(600).default(30),
  monetizationSafe: z.boolean().default(true),
});

/** Saves the draft as a project and queues a generation job for the local worker. */
export const enqueueGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => draftSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: project, error: pErr } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: data.title || "Untitled video",
        idea: data.idea,
        script: data.script,
        scenes: data.scenes as never,
        voice_id: data.voiceId,
        style_id: data.styleId,
        ratio: data.ratio,
        duration_seconds: data.duration,
        status: "queued",
      })
      .select("id")
      .single();
    if (pErr) throw new Error(pErr.message);

    // Jobs are insert-protected from users; create with admin after auth succeeded.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: job, error: jErr } = await supabaseAdmin
      .from("generation_jobs")
      .insert({
        user_id: userId,
        project_id: project.id,
        input: {
          ...data,
          projectId: project.id,
          scriptRules: data.monetizationSafe ? MONETIZATION_SAFE_PROMPT : null,
        } as never,
      })
      .select("id")
      .single();
    if (jErr) throw new Error(jErr.message);
    return { jobId: job.id, projectId: project.id };
  });

/** Current status of one of the caller's jobs, plus a short-lived video link when done. */
export const getGenerationJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { jobId: string }) => z.object({ jobId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: job, error } = await context.supabase
      .from("generation_jobs")
      .select("id,status,progress,stage,error,output_path,created_at")
      .eq("id", data.jobId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!job) return null;
    let videoUrl: string | null = null;
    if (job.status === "completed" && job.output_path) {
      const { data: signed } = await context.supabase.storage.from("generated-videos").createSignedUrl(job.output_path, 3600);
      videoUrl = signed?.signedUrl ?? null;
    }
    let queuePosition = 0;
    if (job.status === "queued") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { count } = await supabaseAdmin
        .from("generation_jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "queued")
        .lt("created_at", job.created_at);
      queuePosition = (count ?? 0) + 1;
    }
    return { ...job, videoUrl, queuePosition };
  });
