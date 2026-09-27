# Security and privacy

This project is designed so a public GitHub repository does **not** need to contain private business data.

Never commit:

- Loyverse access tokens.
- Supabase `service_role` keys.
- Admin passwords or password hashes.
- Customer names, phone numbers, addresses, order histories, invoices or payment data.
- Private residential addresses used only as an operational base.
- `.env` files or exported production databases.

Public-by-design values such as a public restaurant phone number, public social links, public menu prices and a Supabase anon/publishable key may be present in a deployment repository, but the reusable upstream project should use placeholders whenever possible.

If you discover a vulnerability, do not post credentials or private records in a public issue. Contact the repository maintainer privately and rotate any exposed secret immediately.
