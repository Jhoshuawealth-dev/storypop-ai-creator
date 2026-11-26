<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Video generation runs on an external worker (worker/storypop_worker.py) that polls /api/public/worker with a bearer STORYPOP_WORKER_TOKEN; the app only enqueues generation_jobs, so models can live on any machine without inbound networking.
- AI image generation runs only in server functions via @lovable.dev/ai-gateway (keys stay server-side); thumbnails are composed client-side on canvas so PNG/JPG export needs no server.
- Plan locks are gated by FEATURES_UNLOCKED in src/lib/catalog.ts; flip it to false to restore Pro/Business restrictions in one place.

- Profile photos live in the private `avatars` bucket; `profiles.avatar_url` stores `storage:<path>` and the app signs it on load, because public buckets are blocked for this workspace.
- Account deletion and data export run in authenticated server functions (src/lib/account.functions.ts); only deletion uses the admin client, after verifying the caller.
- User library mutations use an account-keyed durable outbox and the atomic sync_user_library RPC; per-item patches and idempotent receipts prevent multi-device overwrites, replayed writes, and stale deletion resurrection. Normalized tables remain for worker jobs.
