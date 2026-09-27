const DEFAULT_TTL_HOURS = 12;

function cors(req: Request) {
  const configured = (Deno.env.get("ADMIN_ALLOWED_ORIGINS") || "")
    .split(",").map(x => x.trim()).filter(Boolean);
  const origin = req.headers.get("origin") || "";
  const allow = configured.length
    ? (configured.includes(origin) ? origin : configured[0])
    : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: cors(req) });
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let raw = "";
  for (const b of bytes) raw += String.fromCharCode(b);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sameSecret(a: string, b: string) {
  if (!a || !b) return false;
  const [ha, hb] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const adminPassword = Deno.env.get("ADMIN_PASSWORD") || "";
  const syncSecret = Deno.env.get("SYNC_SECRET") || "";
  if (!supabaseUrl || !serviceRole || !adminPassword) {
    return json(req, { error: "Admin server is not configured" }, 500);
  }

  const serviceHeaders = {
    apikey: serviceRole,
    Authorization: `Bearer ${serviceRole}`,
    "Content-Type": "application/json",
  };
  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "");

  async function requireSession() {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (!token) return { ok: false, token: "", hash: "" };
    const hash = await sha256Hex(token);
    const now = encodeURIComponent(new Date().toISOString());
    const res = await fetch(
      `${supabaseUrl}/rest/v1/admin_sessions?token_hash=eq.${hash}&expires_at=gt.${now}&select=token_hash&limit=1`,
      { headers: serviceHeaders },
    );
    if (!res.ok) return { ok: false, token: "", hash: "" };
    const rows = await res.json();
    return rows.length ? { ok: true, token, hash } : { ok: false, token: "", hash: "" };
  }

  if (action === "login") {
    const password = String(body?.password || "");
    if (password.length > 256 || !(await sameSecret(password, adminPassword))) {
      await new Promise(r => setTimeout(r, 450));
      return json(req, { error: "Invalid credentials" }, 401);
    }

    await fetch(
      `${supabaseUrl}/rest/v1/admin_sessions?expires_at=lt.${encodeURIComponent(new Date().toISOString())}`,
      { method: "DELETE", headers: { ...serviceHeaders, Prefer: "return=minimal" } },
    ).catch(() => {});

    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const ttl = Math.max(1, Math.min(24, Number(Deno.env.get("ADMIN_SESSION_HOURS") || DEFAULT_TTL_HOURS)));
    const expiresAt = new Date(Date.now() + ttl * 3600000).toISOString();
    const insert = await fetch(`${supabaseUrl}/rest/v1/admin_sessions`, {
      method: "POST",
      headers: { ...serviceHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({ token_hash: tokenHash, expires_at: expiresAt }),
    });
    if (!insert.ok) return json(req, { error: "Could not create admin session" }, 500);
    return json(req, { ok: true, token, expires_at: expiresAt });
  }

  const session = await requireSession();
  if (!session.ok) return json(req, { error: "Session expired or invalid" }, 401);

  if (action === "session") return json(req, { ok: true });

  if (action === "logout") {
    await fetch(`${supabaseUrl}/rest/v1/admin_sessions?token_hash=eq.${session.hash}`, {
      method: "DELETE",
      headers: { ...serviceHeaders, Prefer: "return=minimal" },
    });
    return json(req, { ok: true });
  }

  if (action === "sync") {
    if (!syncSecret) return json(req, { error: "SYNC_SECRET is not configured" }, 500);
    const res = await fetch(`${supabaseUrl}/functions/v1/loyverse-menu?sync=true`, {
      headers: { "x-sync-secret": syncSecret },
    });
    const text = await res.text();
    if (!res.ok) return json(req, { error: "Menu sync failed", detail: text.slice(0, 300) }, 502);
    try { return json(req, { ok: true, data: JSON.parse(text) }); }
    catch { return json(req, { ok: true, data: text }); }
  }

  if (action === "config_update") {
    const patch = body?.patch;
    if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
      return json(req, { error: "Invalid config patch" }, 400);
    }
    const allowed = new Set([
      "hours", "enforceHours", "deliveryZones", "fulfillment",
      "locationSharing", "paymentMethods", "tagline"
    ]);
    const safe: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(patch)) if (allowed.has(key)) safe[key] = value;
    if (!Object.keys(safe).length) return json(req, { error: "No allowed settings supplied" }, 400);

    const currentRes = await fetch(
      `${supabaseUrl}/rest/v1/restaurant_config?key=eq.runtime&select=value&limit=1`,
      { headers: serviceHeaders },
    );
    let current: Record<string, unknown> = {};
    if (currentRes.ok) {
      const rows = await currentRes.json();
      if (rows?.[0]?.value && typeof rows[0].value === "object") current = rows[0].value;
    }
    const value = { ...current, ...safe };
    const upsert = await fetch(`${supabaseUrl}/rest/v1/restaurant_config?on_conflict=key`, {
      method: "POST",
      headers: { ...serviceHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ key: "runtime", value, updated_at: new Date().toISOString() }),
    });
    if (!upsert.ok) return json(req, { error: "Could not save settings" }, 500);
    return json(req, { ok: true, value });
  }

  return json(req, { error: "Unknown action" }, 400);
});
