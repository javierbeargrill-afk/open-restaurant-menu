# Architecture

## Basic mode

GitHub Pages → `config/site.json` + `data/menu.json` → browser cart → WhatsApp.

This mode needs no database and is suitable for a small menu updated by Git commits.

## Advanced mode

Loyverse → Supabase Edge Function → `menu_cache` → GitHub Pages → WhatsApp.

The Edge Function is the only component that knows the private Loyverse token and Supabase service-role key. The browser receives only public menu data.

## Privacy boundary

**Public:** source code, menu names, public prices, branding, business contact channels and public delivery zones.

**Private:** POS tokens, service-role keys, admin credentials, customer records, invoices, recipes, costs, margins, internal inventory and private residential addresses.

## Community model

Keep the reusable core in this repository. Each restaurant should use a fork or deployment repository for its public configuration. Business-sensitive systems should live in private repositories or secured backend services.
