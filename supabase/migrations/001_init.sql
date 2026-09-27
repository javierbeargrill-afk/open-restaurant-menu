create table if not exists public.menu_cache (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.menu_cache enable row level security;

drop policy if exists "public can read menu cache" on public.menu_cache;
create policy "public can read menu cache"
on public.menu_cache for select
to anon, authenticated
using (true);

insert into public.menu_cache(id, data)
values (1, '[]'::jsonb)
on conflict (id) do nothing;

create table if not exists public.restaurant_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.restaurant_config enable row level security;

drop policy if exists "public can read restaurant config" on public.restaurant_config;
create policy "public can read restaurant config"
on public.restaurant_config for select
to anon, authenticated
using (true);
