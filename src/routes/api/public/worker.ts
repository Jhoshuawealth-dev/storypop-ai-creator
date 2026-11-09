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
 *  { action: "source-url", jobId }                       -> signed download URL of a clip job's source video
 *  { action: "upload-url", jobId, kind: "clip", index }  -> signed upload URL for clip N (kind "clip-thumb" for its JPG)
 *  { action: "complete", jobId, clips: [...] }           -> finish a clip job with its clip list
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
            const kind = String(body["kind"] ?? "video");
            const idx = Math.max(0, Math.min(9, Math.floor(Number(body["index"]) || 0)));
            const path =
              kind === "thumbnail" ? `${job.user_id}/${job.id}.jpg`
              : kind === "clip" ? `${job.user_id}/clips/${job.id}_${idx}.mp4`
              : kind === "clip-thumb" ? `${job.user_id}/clips/${job.id}_${idx}.jpg`
              : `${job.user_id}/${job.id}.mp4`;
            const { data, error } = await supabaseAdmin.storage.from("generated-videos").createSignedUploadUrl(path, { upsert: true });
            return error ? json({ error: error.message }, 500) : json({ path, signedUrl: data.signedUrl, token: data.token });
          }
          case "source-url": {
            const { data: job } = await supabaseAdmin.from("generation_jobs").select("id,user_id,input").eq("id", jobId).maybeSingle();
            const src = String((job?.input as { sourcePath?: string } | null)?.sourcePath ?? "");
            if (!job || !src.startsWith(`${job.user_id}/sources/`)) return json({ error: "Source not found" }, 404);
            const { data, error } = await supabaseAdmin.storage.from("generated-videos").createSignedUrl(src, 3600);
            return error ? json({ error: error.message }, 500) : json({ signedUrl: data.signedUrl });
          }
          case "complete": {
            const { data: job } = await supabaseAdmin.from("generation_jobs").select("id,user_id,project_id,kind,input").eq("id", jobId).maybeSingle();
            if (!job) return json({ error: "Job not found" }, 404);
            if (job.kind === "clip") {
              const prefix = `${job.user_id}/clips/${job.id}_`;
              const raw = Array.isArray(body["clips"]) ? (body["clips"] as Record<string, unknown>[]) : [];
              const clips = raw.slice(0, 10).flatMap((c) => {
                const p = String(c["path"] ?? "");
                if (!p.startsWith(prefix)) return [];
                const t = String(c["thumbnailPath"] ?? "");
                return [{
                  path: p,
                  thumbnailPath: t.startsWith(prefix) ? t : null,
                  start: Number(c["start"]) || 0,
                  end: Number(c["end"]) || 0,
                  title: String(c["title"] ?? "Clip").slice(0, 120),
                  score: Math.max(0, Math.min(100, Math.round(Number(c["score"]) || 0))),
                  quote: String(c["quote"] ?? "").slice(0, 300),
                }];
              });
              if (!clips.length) return json({ error: "No valid clips" }, 400);
              await supabaseAdmin
                .from("generation_jobs")
                .update({ status: "completed", progress: 100, stage: "Done", output_path: clips[0]!.path, input: { ...(job.input as object), clips } as never, completed_at: now, updated_at: now })
                .eq("id", jobId);
              return json({ ok: true });
            }
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
