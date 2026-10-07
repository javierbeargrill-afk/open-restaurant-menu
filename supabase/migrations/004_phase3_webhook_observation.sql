-- Phase 3A: raw Loyverse webhook observation inbox.
-- This table is intentionally private. It is written by the Edge Function
-- with the service-role key and has no public read policy.

create table if not exists public.loyverse_webhook_inbox (
  id bigint generated always as identity primary key,
  merchant_id text not null,
  event_type text not null,
  event_created_at timestamptz not null,
  api_version text,
  signature_present boolean not null default false,
  payload jsonb not null,
  payload_sha256 text not null,
  received_at timestamptz not null default now(),
  status text not null default 'observed'
    check (status in ('observed', 'pending', 'processed', 'ignored', 'failed')),
  last_error text
);

create unique index if not exists loyverse_webhook_inbox_dedupe_idx
on public.loyverse_webhook_inbox (
  merchant_id,
  event_type,
  event_created_at,
  payload_sha256
);

create index if not exists loyverse_webhook_inbox_received_at_idx
on public.loyverse_webhook_inbox (received_at desc);

create index if not exists loyverse_webhook_inbox_event_type_idx
on public.loyverse_webhook_inbox (event_type, received_at desc);

alter table public.loyverse_webhook_inbox enable row level security;

revoke all on table public.loyverse_webhook_inbox from anon, authenticated;
