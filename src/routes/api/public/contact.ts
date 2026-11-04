import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        const schema = z.object({
          name: z.string().trim().min(2).max(100),
          email: z.string().trim().max(255).email(),
          subject: z.string().trim().min(1).max(100),
          message: z.string().trim().min(10).max(2000),
        });

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Please check the form fields and try again." }, { status: 422 });
        }

        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) {
          return Response.json({ error: "Service temporarily unavailable." }, { status: 503 });
        }

        // Opaque sb_ keys are not JWTs: send only apikey, never the default Authorization bearer.
        const supabasePublic = createClient<Database>(url, key, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const { error } = await supabasePublic.from("contact_submissions").insert({
          name: parsed.data.name,
          email: parsed.data.email,
          subject: parsed.data.subject,
          message: parsed.data.message,
        });

        if (error) {
          return Response.json({ error: "Could not save your message. Please try again." }, { status: 500 });
        }

        return Response.json({ ok: true }, { status: 201 });
      },
    },
  },
});
