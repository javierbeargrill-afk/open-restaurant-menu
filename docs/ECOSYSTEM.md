# The ecosystem — what every piece does

This document explains the complete project in plain language.

## The big idea

Open Restaurant Menu separates the system into small parts so a restaurant can use only what it needs.

```mermaid
flowchart TB
    OWNER["Restaurant owner"] --> GH["GitHub"]
    GH --> PAGE["GitHub Pages website"]
    CUSTOMER["Customer"] --> PAGE
    PAGE --> WA["WhatsApp"]

    LV["Loyverse (optional)"] --> EDGE["Supabase Edge Function"]
    EDGE --> CACHE["Supabase menu cache"]
    CACHE --> PAGE

    ADMIN["Admin panel (optional)"] --> ADMINAPI["Supabase admin API"]
    ADMINAPI --> CACHE

    GOOGLE["Google integrations (optional/future)"] -.-> PAGE
    GOOGLE -.-> CACHE
```

## GitHub

### What it is here

GitHub stores the project's source code and history.

It also provides the workflow where improvements can be proposed, reviewed and merged.

### What GitHub should contain

- source code;
- public configuration;
- public menu data;
- documentation;
- database migrations;
- examples;
- automated validation.

### What GitHub should not contain

- passwords;
- access tokens;
- private customer data;
- private business addresses;
- secret keys;
- financial records.

## GitHub Pages

GitHub Pages turns the repository into the public restaurant website.

The browser runs the menu application directly.

## config/site.json

This is the restaurant's **public control panel in file form**.

It tells the frontend things like:

- business name;
- opening hours;
- currency;
- delivery zones;
- pickup availability;
- colors;
- WhatsApp number;
- whether hours are enforced;
- whether the menu comes from JSON or Supabase.

## data/menu.json

This is the menu source in basic mode.

It is simple, human-editable JSON.

## Supabase

Supabase is optional.

In advanced mode it provides:

- database tables;
- public menu cache;
- Edge Functions;
- secure admin sessions;
- runtime configuration;
- optional scheduled jobs.

## Loyverse

Loyverse is optional.

When connected, it becomes the main product/price source instead of editing `data/menu.json` manually.

```mermaid
sequenceDiagram
    participant POS as Loyverse
    participant F as Edge Function
    participant DB as menu_cache
    participant WEB as Website

    F->>POS: Ask for current catalog
    POS-->>F: Products + prices
    F->>DB: Save clean public menu
    WEB->>DB: Read menu
    DB-->>WEB: Current catalog
```

## WhatsApp

WhatsApp is the final order handoff.

The project builds the order text in the customer's browser and opens WhatsApp with that message.

The basic project does not need to store customer data.

## Admin panel

The admin panel has two modes:

- **local-demo**: for public demo/testing only;
- **supabase**: for a real restaurant with server-side authentication.

## Developer/Test mode

Test mode solves a practical problem: how do you test a restaurant that is currently closed?

Instead of editing the real schedule, Test mode temporarily bypasses the schedule only in the current browser session.

```mermaid
flowchart LR
    CLOSED["Real schedule: CLOSED"] --> TEST{"Test mode?"}
    TEST -->|No| BLOCK["Order button disabled"]
    TEST -->|Yes| ENABLE["Order button enabled"]
    ENABLE --> LABEL["Message marked TEST ORDER"]
```

## Google integrations — Phase 2

Google is intentionally optional. The core ordering system must continue to work even if no Google account or API is connected.

The Phase 2 idea is to avoid maintaining three separate copies of the same restaurant information.

```mermaid
flowchart TD
    SOURCE["Loyverse or another menu source"] --> NORMALIZE["Supabase normalization layer"]
    NORMALIZE --> SITE["Restaurant website"]
    NORMALIZE --> GBP["Google Business Profile"]
    SITE --> SEARCH["Google Search crawling"]
    GBP --> MAPS["Google Maps / Business surfaces"]
    SITE --> SC["Search Console visibility"]
```

### Intended responsibilities

**Website / SEO**
- crawlable menu content;
- Schema.org Restaurant/Menu markup;
- canonical URL;
- sitemap;
- fast public images;
- clear category/product information.

**Google Business Profile**
- keep eligible menu information aligned with the restaurant's source of truth;
- explore item names, descriptions, prices and photos where supported;
- avoid manual re-entry when a product changes.

**Search Console**
- observe crawl/indexing status;
- submit/refresh sitemap when appropriate;
- help diagnose discoverability problems.

### Important limitation

This is an experimental roadmap, not a promise that every Google Business Profile supports every menu/media capability. API access, account approval, category eligibility and Google product behavior may vary.

For that reason, implementation should start with a small controlled test before any full automatic synchronization.

See [GOOGLE-PHASE-2.md](GOOGLE-PHASE-2.md).

## Omnichannel operations — Phase 3

Phase 3 expands the project from a web menu into a small-business omnichannel system.

The design principle is:

> **Loyverse is the operational source of truth. Supabase moves and caches data; it should not become a competing product catalog.**

```mermaid
flowchart TB
    subgraph Source["ONE SOURCE OF TRUTH"]
      L["Loyverse"]
    end

    subgraph Local["LOCAL BUSINESS"]
      POS["POS tablet"]
      PRINT["Receipt / kitchen printer"]
      KDS["Kitchen display"]
    end

    subgraph Online["ONLINE CHANNELS"]
      WEB["Restaurant website"]
      META["Meta catalog"]
      WA["WhatsApp Business"]
    end

    subgraph Integration["INTEGRATION LAYER"]
      CACHE["Supabase catalog cache"]
      QUEUE["Order queue"]
      API["Edge Functions / adapters"]
    end

    L --> CACHE
    CACHE --> WEB
    CACHE --> META
    META --> WA
    L --> POS
    POS --> PRINT
    POS --> KDS
    WEB --> QUEUE
    WA --> QUEUE
    QUEUE --> API
    API --> L
```

### Catalog direction

Catalog data flows **outward** from Loyverse:

```text
Loyverse
  → normalized cache
     → website
     → Meta catalog / WhatsApp
     → Google (Phase 2)
```

A price should not need to be edited separately in each channel.

### Order direction

Sales flow **back inward**:

```text
Local POS ──────────────→ Loyverse
Website → order queue ─→ Loyverse
WhatsApp → order queue → Loyverse
```

Online orders should be validated against the current catalog before becoming a sale.

### Why use an order queue?

A WhatsApp conversation is not automatically a confirmed sale. A customer can abandon the chat, change the order or ask a question.

So Phase 3 separates:

1. **conversation/order intent**;
2. **accepted order**;
3. **confirmed sale in Loyverse**.

This prevents abandoned messages from polluting sales and inventory.

### Printing and kitchen displays

Loyverse documents automatic kitchen printing/KDS for orders handled by the POS app. We should not assume API-created receipts produce the same local print event.

That behavior must be tested. If it is not supported, the reusable architecture may need an optional local bridge that listens for accepted online orders and prints/displays them while the sale is still recorded in Loyverse.

### WhatsApp and AI

The WhatsApp layer is optional.

The target architecture is:

```text
Loyverse catalog
   ↓
Meta catalog
   ↓
WhatsApp Business
   ↓
optional Meta Business Agent
   ↓
structured order / human handoff
   ↓
order queue
   ↓
Loyverse confirmed sale
```

AI may help answer product questions and recommend catalog items, but final pricing, products and availability must come from the real catalog/backend.

See [PHASE-3-OMNICHANNEL.md](PHASE-3-OMNICHANNEL.md).

## What is mandatory?

| Component | Basic | Advanced |
|---|---:|---:|
| GitHub repository | ✅ | ✅ |
| GitHub Pages | ✅ | ✅ |
| `config/site.json` | ✅ | ✅ |
| `data/menu.json` | ✅ | Optional |
| WhatsApp | Recommended | Recommended |
| Supabase | ❌ | ✅ |
| Loyverse | ❌ | Optional |
| Google APIs | ❌ | Optional |

## Design principle

A beginner should be able to deploy the basic version without understanding databases, APIs or serverless functions.

Advanced integrations should be added progressively, not required from day one.
