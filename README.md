# Open Restaurant Menu

A free, privacy-conscious, open-source menu and WhatsApp ordering starter for small restaurants, food trucks, home kitchens and delivery businesses.

It can run in two modes:

- **Basic:** GitHub Pages + a JSON menu. No backend required.
- **Advanced:** Loyverse → Supabase → GitHub Pages, with automatic menu synchronization.

The project came from a real small delivery restaurant workflow and is shared back with the community so other businesses can launch a useful web menu without paying for a website platform.

## Features

- Mobile-first menu with categories and search.
- Cart and WhatsApp order handoff.
- Delivery or pickup fulfillment.
- Optional browser geolocation that adds a Google Maps link to delivery orders.
- Static JSON or Supabase menu source.
- Optional Loyverse synchronization through a Supabase Edge Function.
- GitHub Pages friendly.
- SEO-ready foundation with Schema.org markup, sitemap and robots file.
- MIT license.
- No analytics or installation tracking by default.
- Privacy-first: customer data storage is not required for the core product.

## Quick start — free/basic mode

1. Create a repository from this project or fork it.
2. Edit `config/site.json` with your public business information.
3. Edit `data/menu.json` with your products.
4. Configure delivery/pickup and optional location sharing in `config/site.json`.
5. Replace the placeholder domain in `sitemap.xml`.
6. Enable GitHub Pages for the `main` branch.

## Advanced mode — Loyverse + Supabase

1. Create a Supabase project.
2. Apply `supabase/migrations/001_init.sql`.
3. Deploy `supabase/functions/loyverse-menu`.
4. Set server-side secrets from `.env.example` in Supabase — **do not commit their real values**.
5. Call the function with `?sync=true` and the `x-sync-secret` header.
6. Set `dataSource` to `supabase` in `config/site.json`, and add the public Supabase URL and anon/publishable key.
7. Optionally adapt `supabase/migrations/002_optional_cron.sql` to schedule synchronization.

## What belongs in public GitHub?

Code, public branding, public menu data and documentation can be public. POS tokens, service-role keys, customer information, private addresses, internal recipes, costs, margins and financial data should not be.

See [SECURITY.md](SECURITY.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## How do I know if people use it?

GitHub exposes public signals such as Stars, Forks, contributors, pull requests and repository traffic. Actual deployments are intentionally not tracked. Businesses can voluntarily add themselves to [ADOPTERS.md](ADOPTERS.md).

## Can community improvements flow back into my restaurant?

Yes. The recommended model is to keep this repository as the reusable upstream core. Production restaurants periodically review upstream releases or pull requests and selectively merge safe improvements. Never auto-deploy unreviewed community code directly to a live business.

## License

MIT. Use it, modify it, fork it and improve it.
