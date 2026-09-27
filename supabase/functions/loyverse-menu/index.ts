import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-sync-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  try {
    const loyverseToken = must("LOYVERSE_TOKEN");
    const storeId = must("LOYVERSE_STORE_ID");
    const supabaseUrl = must("SUPABASE_URL");
    const serviceRole = must("SUPABASE_SERVICE_ROLE_KEY");
    const syncSecret = must("SYNC_SECRET");
    const url = new URL(req.url);

    if (url.searchParams.get("sync") !== "true") {
      const client = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
      const { data, error } = await client.from("menu_cache").select("data,updated_at").eq("id", 1).single();
      if (error) throw error;
      return json(data);
    }

    if ((req.headers.get("x-sync-secret") || "") !== syncSecret) return json({ error: "Unauthorized" }, 401);

    const excluded = new Set((Deno.env.get("MENU_EXCLUDED_CATEGORIES") || "")
      .split(",").map(x => x.trim().toLowerCase()).filter(Boolean));
    const headers = { Authorization: `Bearer ${loyverseToken}` };

    const categoriesRes = await fetch("https://api.loyverse.com/v1.0/categories?limit=250", { headers });
    if (!categoriesRes.ok) throw new Error(`Loyverse categories: ${categoriesRes.status}`);
    const categoriesData = await categoriesRes.json();
    const categoryMap = new Map((categoriesData.categories || []).map((c: any) => [c.id, c.name]));

    let cursor = "";
    const items: any[] = [];
    do {
      const endpoint = new URL("https://api.loyverse.com/v1.0/items");
      endpoint.searchParams.set("limit", "250");
      if (cursor) endpoint.searchParams.set("cursor", cursor);
      const res = await fetch(endpoint, { headers });
      if (!res.ok) throw new Error(`Loyverse items: ${res.status}`);
      const body = await res.json();
      items.push(...(body.items || []));
      cursor = body.cursor || "";
    } while (cursor);

    const groups = new Map<string, any[]>();
    for (const item of items) {
      if (item.is_deleted || !item.variants?.length) continue;
      const variant = item.variants[0];
      const store = (variant.stores || []).find((s: any) => s.store_id === storeId) || variant.stores?.[0];
      if (!store?.available_for_sale) continue;
      const price = Number(store.price ?? variant.default_price ?? 0);
      if (!price) continue;
      const category = String(categoryMap.get(item.category_id) || item.category_name || "Menu");
      if (excluded.has(category.toLowerCase())) continue;
      const row = {
        n: String(item.item_name || "").trim(),
        p: price,
        d: clean(item.description),
        img: item.image_url || null,
      };
      if (!row.n) continue;
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category)!.push(row);
    }

    const menu = [...groups.entries()].map(([n, i]) => ({ n, i: i.sort((a, b) => a.n.localeCompare(b.n)) }));
    const client = createClient(supabaseUrl, serviceRole, { auth: { persistSession: false } });
    const { error } = await client.from("menu_cache").upsert({ id: 1, data: menu, updated_at: new Date().toISOString() });
    if (error) throw error;
    return json({ ok: true, categories: menu.length, items: menu.reduce((n, c) => n + c.i.length, 0) });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }

  function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  }
});

function must(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function clean(input?: string | null) {
  if (!input) return null;
  const value = input.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
  return value || null;
}
