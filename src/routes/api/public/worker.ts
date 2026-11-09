import { createFileRoute } from "@tanstack/react-router";

/**
 * Endpoint used by the Storypop worker running on the creator's GPU laptop.
 * Auth: `Authorization: Bearer <STORYPOP_WORKER_TOKEN>`.
 *
 * POST body actions:
 *  { action: "claim", workerId }                         -> next queued job (or null)
 *  { action: "progress", jobId, progress, stage }        -> update progress
 *  { action: "upload-url", jobId }                       -> signed upload URL for the MP4
 *  { action: "complete", jobId, path }                   -> mark done
 *  { action: "fail", jobId, error }                      -> mark failed
 */
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const Route = createFileRoute("/api/public/worker")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["STORYPOP_WORKER_TOKEN"];
        const got = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        if (!expected || expected.length < 16 || !safeEqual(got, expected)) return json({ error: "Unauthorized" }, 401);

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const jobId = typeof body["jobId"] === "string" ? body["jobId"] : "";
        const now = new Date().toISOString();

        switch (body["action"]) {
          case "claim": {
            const workerId = String(body["workerId"] ?? "laptop").slice(0, 64);
            const { data, error } = await supabaseAdmin.rpc("claim_next_job", { _worker_id: workerId });
            if (error) return json({ error: error.message }, 500);
            const job = Array.isArray(data) ? data[0] ?? null : data;
            if (job?.project_id) {
              await supabaseAdmin.from("projects").update({ status: "generating", updated_at: now }).eq("id", job.project_id);
            }
            return json({ job });
          }
          case "progress": {
            const progress = Math.max(0, Math.min(99, Math.round(Number(body["progress"]) || 0)));
            const stage = String(body["stage"] ?? "").slice(0, 120);
            const { error } = await supabaseAdmin
              .from("generation_jobs")
              .update({ progress, stage, updated_at: now })
              .eq("id", jobId)
              .eq("status", "processing");
            return error ? json({ error: error.message }, 500) : json({ ok: true });
          }
          case "upload-url": {
            const { data: job } = await supabaseAdmin.from("generation_jobs").select("id,user_id").eq("id", jobId).maybeSingle();
            if (!job) return json({ error: "Job not found" }, 404);
            const kind = body["kind"] === "thumbnail" ? "thumbnail" : "video";
            const path = kind === "thumbnail" ? `${job.user_id}/${job.id}.jpg` : `${job.user_id}/${job.id}.mp4`;
            const { data, error } = await supabaseAdmin.storage.from("generated-videos").createSignedUploadUrl(path, { upsert: true });
            return error ? json({ error: error.message }, 500) : json({ path, signedUrl: data.signedUrl, token: data.token });
          }
          case "complete": {
            const { data: job } = await supabaseAdmin.from("generation_jobs").select("id,user_id,project_id").eq("id", jobId).maybeSingle();
            if (!job) return json({ error: "Job not found" }, 404);
            const path = String(body["path"] ?? "");
            if (!path.startsWith(`${job.user_id}/`)) return json({ error: "Invalid path" }, 400);
            const rawThumb = typeof body["thumbnailPath"] === "string" ? body["thumbnailPath"] : "";
            const thumb = rawThumb && rawThumb.startsWith(`${job.user_id}/`) ? rawThumb : null;
            await supabaseAdmin
              .from("generation_jobs")
              .update({ status: "completed", progress: 100, stage: "Done", output_path: path, thumbnail_path: thumb, completed_at: now, updated_at: now })
              .eq("id", jobId);
            if (job.project_id) {
              await supabaseAdmin.from("projects").update({ status: "ready", video_path: path, thumbnail_path: thumb, updated_at: now }).eq("id", job.project_id);
            }
            return json({ ok: true });
          }
          case "fail": {
            const message = String(body["error"] ?? "Generation failed").slice(0, 1000);
            const { data: job } = await supabaseAdmin
              .from("generation_jobs")
              .update({ status: "failed", error: message, updated_at: now })
              .eq("id", jobId)
              .select("project_id")
              .maybeSingle();
            if (job?.project_id) await supabaseAdmin.from("projects").update({ status: "failed", updated_at: now }).eq("id", job.project_id);
            return json({ ok: true });
          }
          default:
            return json({ error: "Unknown action" }, 400);
        }
      },
    },
  },
});
