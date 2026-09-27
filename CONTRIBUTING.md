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
