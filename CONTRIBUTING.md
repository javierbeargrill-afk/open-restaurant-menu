# Contributing

Contributions are welcome through issues and pull requests.

The project intentionally keeps the core generic. A contribution should work for many restaurants rather than hard-code one business, country, currency, address, POS account or Supabase project.

Before opening a pull request:

1. Remove secrets and personal/customer data from screenshots, logs and test fixtures.
2. Keep business-specific values in `config/site.json` or environment variables.
3. Run the validation workflow locally where practical.
4. Explain any database migration or breaking change.
5. Prefer backward-compatible changes.

Maintainers should review external code before deploying it to a production restaurant. Community pull requests should never be auto-deployed directly to a live business.


## Areas where expert help is especially welcome

The project has an experimental **Phase 2** focused on Google discovery and restaurant menu distribution.

We welcome issues, design reviews, proof-of-concepts and pull requests from contributors with experience in:

- Google Business Profile APIs and OAuth;
- restaurant menu/FoodMenus integrations;
- Business Profile media/photo workflows;
- Search Console API;
- Schema.org Restaurant/Menu structured data;
- local restaurant SEO;
- reliable sync/idempotency patterns.

Please avoid hard-coding one restaurant's Google location, project IDs, credentials or API tokens. The goal is a reusable adapter that any eligible restaurant can configure.

See [docs/GOOGLE-PHASE-2.md](docs/GOOGLE-PHASE-2.md).


## Phase 3 — omnichannel help wanted

We are also designing a reusable omnichannel layer with **Loyverse as the source of truth** and web/WhatsApp as additional sales channels.

Expert input is especially welcome for:

- Loyverse Receipts API and order write-back;
- WhatsApp Business Platform / Cloud API;
- Meta catalogs and product synchronization;
- Meta Business Agent integrations;
- webhook verification, retries and deduplication;
- restaurant kitchen printer/KDS behavior for remotely originated orders;
- lightweight local print bridges.

The most important architectural rule is that online channels should not become independent product databases. They should read from the same catalog and write confirmed sales back into the same operational system.

See [docs/PHASE-3-OMNICHANNEL.md](docs/PHASE-3-OMNICHANNEL.md).
