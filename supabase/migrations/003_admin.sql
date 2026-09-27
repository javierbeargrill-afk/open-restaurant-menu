create table if not exists public.admin_sessions (
  token_hash text primary key,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.admin_sessions enable row level security;

create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions(expires_at);

-- Intentionally no anon/authenticated policies.
-- Only the service-role key used by the admin Edge Function can access this table.
