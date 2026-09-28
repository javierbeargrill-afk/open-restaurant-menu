import { createClient } from "npm:@supabase/supabase-js@2";

const encoder = new TextEncoder();

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = must("SUPABASE_URL");
    const serviceRole = must("SUPABASE_SERVICE_ROLE_KEY");

    const rawBody = new Uint8Array(await req.arrayBuffer());
    const signature = req.headers.get("x-loyverse-signature");
    const apiVersion = req.headers.get("x-loyverse-api-version");

    if (signature) {
      const clientSecret = must("LOYVERSE_CLIENT_SECRET");
      const valid = await verifyHmacSha1(rawBody, clientSecret, signature);
      if (!valid) return json({ error: "Invalid webhook signature" }, 401);
    } else {
      // Personal-access-token webhooks are unsigned in Loyverse.
      // Protect that mode with a separate, unguessable endpoint token.
      const sharedSecret = must("LOYVERSE_WEBHOOK_SHARED_SECRET");
      const supplied = new URL(req.url).searchParams.get("token") || "";
      if (!constantTimeEqual(supplied, sharedSecret)) {
        return json({ error: "Unauthorized webhook" }, 401);
      }
    }

    const rawText = new TextDecoder().decode(rawBody);
    const payload = JSON.parse(rawText);

    const merchantId = String(payload?.merchant_id || "").trim();
    const eventType = String(payload?.type || "").trim();
    const eventCreatedAt = String(payload?.created_at || "").trim();

    if (!merchantId || !eventType || !eventCreatedAt) {
      return json({ error: "Invalid Loyverse webhook envelope" }, 400);
    }

    const payloadSha256 = await sha256Hex(rawBody);
    const client = createClient(supabaseUrl, serviceRole, {
      auth: { persistSession: false },
    });

    const row = {
      merchant_id: merchantId,
      event_type: eventType,
      event_created_at: eventCreatedAt,
      api_version: apiVersion,
      signature_present: Boolean(signature),
      payload,
      payload_sha256: payloadSha256,
      status: "observed",
    };

    const { error } = await client
      .from("loyverse_webhook_inbox")
      .upsert(row, {
        onConflict: "merchant_id,event_type,event_created_at,payload_sha256",
        ignoreDuplicates: true,
      });

    if (error) throw error;

    // Phase 3A is observation-only: acknowledge quickly and do not mutate
    // inventory, orders, receipts, or the public menu from this endpoint.
    return json({ ok: true, mode: "observation" });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
});

function must(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

async function verifyHmacSha1(
  rawBody: Uint8Array,
  secret: string,
  expectedHex: string,
) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );

  const digest = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, rawBody),
  );

  return constantTimeEqual(toHex(digest), expectedHex.trim().toLowerCase());
}

async function sha256Hex(rawBody: Uint8Array) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", rawBody));
  return toHex(digest);
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: string, b: string) {
  const aa = encoder.encode(a);
  const bb = encoder.encode(b);
  const length = Math.max(aa.length, bb.length);
  let diff = aa.length ^ bb.length;

  for (let i = 0; i < length; i++) {
    diff |= (aa[i] || 0) ^ (bb[i] || 0);
  }

  return diff === 0;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
