# Getting Started — no advanced knowledge required

This guide explains the shortest path from **“I found this repository”** to **“my restaurant has a working menu online.”**

## Before you begin

For the basic version you need only:

1. A GitHub account.
2. A public WhatsApp number for orders.
3. Your menu: product names, descriptions and prices.
4. Your opening hours.
5. Delivery zones and/or pickup information.

You do **not** need Supabase or Loyverse for the basic setup.

## Step 1 — make your own copy

Use **Fork** on GitHub.

Think of a fork as your own editable copy of the project.

## Step 2 — configure the restaurant

Open:

`config/site.json`

Change the sample values for:

- business name;
- city/country;
- WhatsApp number;
- currency;
- colors;
- opening hours;
- delivery zones;
- pickup;
- payment methods.

Use [CONFIGURATION.md](CONFIGURATION.md) if you do not know what a field means.

## Step 3 — add your menu

Open:

`data/menu.json`

Each section contains products.

Example:

```json
{
  "name": "Burgers",
  "items": [
    {
      "id": "classic",
      "name": "Classic Burger",
      "description": "Beef, cheese and house sauce.",
      "price": 5.99,
      "image": ""
    }
  ]
}
```

## Step 4 — publish with GitHub Pages

In your repository:

`Settings → Pages → Deploy from a branch → main → / (root) → Save`

After GitHub finishes deploying, it will show your public URL.

## Step 5 — test like a customer

Check:

- products load;
- prices are correct;
- cart totals are correct;
- Delivery/Pickup works;
- location sharing works if enabled;
- business hours block ordering when closed;
- WhatsApp message looks correct.

## Step 6 — use Developer/Test mode when closed

Open the Admin panel by tapping the footer credit five times.

Enable **Test mode**.

This temporarily enables ordering in your browser even outside business hours. It does not alter the real published schedule.

## When should I add Supabase?

Add Supabase when you want one or more of these:

- automatic Loyverse synchronization;
- secure admin login;
- runtime settings without editing GitHub files;
- a database-backed menu cache.

Until then, the basic version is intentionally enough.
