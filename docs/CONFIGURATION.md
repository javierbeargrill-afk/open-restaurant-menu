# Configuration dictionary

The main public configuration file is:

`config/site.json`

The goal is to let most restaurants personalize the project without editing application code.

## Business identity

| Field | Meaning | Example |
|---|---|---|
| `name` | Public business name | `Demo Burger` |
| `tagline` | Short description | `Fresh food, simple ordering` |
| `city` | Public city/service area | `Panama City` |
| `country` | Country | `Panama` |
| `phone` | Public phone | `50760000000` |
| `whatsappPhone` | WhatsApp order number, digits only | `50760000000` |
| `instagramUrl` | Public Instagram link | URL |
| `logoUrl` | Public logo image URL | URL |

## Currency and locale

| Field | Meaning |
|---|---|
| `currency` | ISO currency code such as `USD`, `PAB`, `COP` |
| `currencySymbol` | Visual symbol used where needed |
| `locale` | Formatting locale, e.g. `es-PA` or `en-US` |
| `timezone` | Business time zone used to determine open/closed status |

## Menu source

| Field | Meaning |
|---|---|
| `dataSource: "static"` | Read products from `data/menu.json` |
| `dataSource: "supabase"` | Read products from Supabase `menu_cache` |
| `supabaseUrl` | Public Supabase project URL |
| `supabaseAnonKey` | Public anon/publishable key; never substitute the service-role key |

## Hours

`hours` maps each weekday to opening and closing times.

```json
"mon": ["15:30", "23:30"]
```

If a day is omitted, it is treated as closed.

`enforceHours: true` disables normal ordering when the real schedule is closed.

Developer/Test mode can bypass this temporarily without changing `hours`.

## Delivery zones

```json
"deliveryZones": [
  {"name": "Nearby", "price": 1},
  {"name": "Extended", "price": 2}
]
```

The selected zone contributes to the order total in Delivery mode.

## Location sharing

`locationSharing: true` enables the browser geolocation button.

The resulting coordinates are turned into a Google Maps link and inserted into the WhatsApp order. They are not stored by the basic template.

## Delivery and pickup

```json
"fulfillment": {
  "delivery": true,
  "pickup": true,
  "default": "delivery",
  "pickupLabel": "Pickup",
  "pickupAddress": "Public pickup address",
  "pickupInstructions": "Wait for confirmation before arriving.",
  "pickupMapUrl": ""
}
```

- `delivery`: show Delivery.
- `pickup`: show Pickup.
- `default`: initial option.
- `pickupAddress`: public address customers may visit.
- `pickupInstructions`: extra instructions.
- `pickupMapUrl`: optional public map link.

## Payment methods

```json
"paymentMethods": [
  {"id": "cash", "label": "Cash"},
  {"id": "card", "label": "Card"}
]
```

These options are shown to the customer and included in the WhatsApp order.

## Demo mode

`demoMode: true` prevents the public demonstration from contacting an arbitrary real WhatsApp number. Instead it opens an order preview.

Set it to `false` in a real deployment after configuring your actual WhatsApp number.

## Admin

```json
"admin": {
  "mode": "local-demo",
  "apiUrl": "",
  "openWithFiveFooterTaps": true
}
```

Supported modes:

- `disabled`: no admin panel.
- `local-demo`: public demonstration only; not secure.
- `supabase`: secure server-side admin authentication.

Real admin passwords must never be placed in this JSON file.
