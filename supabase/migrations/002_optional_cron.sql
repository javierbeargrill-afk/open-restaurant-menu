-- Optional: schedule automatic menu synchronization in Supabase.
-- Replace YOUR_PROJECT_REF and YOUR_SYNC_SECRET before running.
-- Keep the secret out of Git history. Prefer Supabase Vault for production.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;

-- Example only. For production, store the secret in Vault and read it inside the job.
-- select cron.schedule(
--   'restaurant-menu-sync-hourly',
--   '7 * * * *',
--   $$
--   select net.http_get(
--     url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/loyverse-menu?sync=true',
--     headers := jsonb_build_object('x-sync-secret', 'YOUR_SYNC_SECRET')
--   );
--   $$
-- );
