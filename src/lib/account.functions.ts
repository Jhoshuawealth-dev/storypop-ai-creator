import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Permanently deletes the signed-in user's data, files and login. */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ confirm: z.literal("DELETE") }).parse(input))
  .handler(async ({ context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Remove stored files owned by this user.
    for (const bucket of ["avatars", "generated-videos", "character-references"]) {
      const { data: files } = await supabaseAdmin.storage.from(bucket).list(userId, { limit: 1000 });
      if (files?.length) await supabaseAdmin.storage.from(bucket).remove(files.map((f) => `${userId}/${f.name}`));
    }

    // Remove app rows (children first).
    await supabaseAdmin.from("posts").delete().eq("user_id", userId);
    await supabaseAdmin.from("generation_jobs").delete().eq("user_id", userId);
    await supabaseAdmin.from("projects").delete().eq("user_id", userId);
    await supabaseAdmin.from("characters").delete().eq("user_id", userId);
    await supabaseAdmin.from("social_accounts").delete().eq("user_id", userId);

    // Deleting the login cascades to profile and credit balance.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw new Error("Could not delete your account. Please try again.");
    return { ok: true };
  });

/** Collects everything stored for the signed-in user for download. */
export const exportMyData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const sb = context.supabase;
    const [profile, balance, projects, characters, posts, social, jobs] = await Promise.all([
      sb.from("profiles").select("*").eq("id", context.userId).maybeSingle(),
      sb.from("credit_balances").select("*").eq("user_id", context.userId).maybeSingle(),
      sb.from("projects").select("*"),
      sb.from("characters").select("*"),
      sb.from("posts").select("*"),
      sb.from("social_accounts").select("*"),
      sb.from("generation_jobs").select("id, kind, status, stage, created_at, completed_at, project_id"),
    ]);
    return {
      profile: profile.data,
      credits: balance.data,
      projects: projects.data ?? [],
      characters: characters.data ?? [],
      posts: posts.data ?? [],
      socialAccounts: social.data ?? [],
      generationJobs: jobs.data ?? [],
    };
  });
