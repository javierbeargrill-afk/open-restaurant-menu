# Roadmap

Open Restaurant Menu grows in phases so the basic product stays understandable and useful even without advanced integrations.

## Phase 1 — Core ordering experience

Status: **working**

- GitHub Pages deployment.
- Public restaurant configuration.
- Static menu mode.
- Cart and WhatsApp handoff.
- Delivery and Pickup.
- Optional location sharing.
- Business-hours enforcement.
- Admin/Developer panel.
- Session-only Test mode.
- Optional Loyverse → Supabase menu synchronization.

## Phase 2 — Google discovery, SEO and menu distribution

Status: **in progress / experimental**

Goal: let the same restaurant data feed both the website and eligible Google surfaces, instead of maintaining separate copies manually.

Planned work:

- Google Business Profile API integration where supported.
- Food/menu synchronization for eligible restaurant profiles.
- Product photo/media synchronization or mapping.
- A stable image pipeline so changed photos can be detected and updated without unnecessary duplicate uploads.
- Search Console connection for sitemap submission and indexing/coverage visibility.
- Stronger Schema.org Restaurant/Menu structured data.
- Automatic sitemap/canonical generation for deployments.
- Local SEO documentation for restaurant owners.
- Clear sync logs, error states and last-success timestamps in the Admin panel.
- Safe one-product test mode before enabling full Google synchronization.
- Keep all Google integrations optional and isolated from the core ordering flow.

### Help wanted

We would especially welcome contributors with practical experience in:

- Google Business Profile APIs;
- restaurant FoodMenus/menu data;
- Google Business Profile media/photos;
- Search Console API;
- Schema.org Restaurant/Menu markup;
- local restaurant SEO;
- OAuth and Google API quota/approval workflows.

See [docs/GOOGLE-PHASE-2.md](docs/GOOGLE-PHASE-2.md).

## Later community milestones

- Easier one-click setup documentation.
- Optional image caching and optimization.
- More POS adapters beyond Loyverse.
- Internationalization and translation files.
- Accessible themes and custom branding packs.
- Optional analytics adapters that are disabled by default.
- Release/update notifications for production forks.
