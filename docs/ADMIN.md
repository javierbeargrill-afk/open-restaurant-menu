# Admin and developer mode

Open Restaurant Menu has two admin modes.

## Local demo mode

Use `"mode": "local-demo"` only for demos and prototypes. It has no real authentication and changes to hours are limited to the current browser session.

## Secure Supabase mode

For a live restaurant:

1. Apply `supabase/migrations/003_admin.sql`.
2. Deploy `supabase/functions/admin-api/index.ts`.
3. Configure server-side Supabase secrets for `ADMIN_PASSWORD`, `ADMIN_ALLOWED_ORIGINS`, and `SYNC_SECRET`.
4. Set `admin.mode` to `supabase` in `config/site.json`.

If `admin.apiUrl` is blank, the frontend derives the Edge Function URL from `supabaseUrl`.

## Opening the panel

Tap the footer credit five times. During setup you can also append `?admin=1` to the site URL.

## Test mode

Test mode is designed for development and operational checks outside business hours.

- It does not change the published opening hours.
- It is kept in browser session storage only.
- It enables the order button even when the real schedule is closed.
- The page clearly shows that Test mode is active.
- Orders made while testing are prefixed with `TEST ORDER — DO NOT PREPARE`.

This avoids editing business hours just to test ordering and then forgetting to restore them.

## Security

Do not place an admin password in HTML, JavaScript, JSON, GitHub Pages configuration, or a URL parameter. Static-site code is public. In secure mode the password is checked only by the Supabase Edge Function, which returns a temporary random session token after a successful login.
