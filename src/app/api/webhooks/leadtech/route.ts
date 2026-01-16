import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "../../../../lib/supabase"

function nowMoscow() {
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  return new Date(s)
}

function getHeader(req: Request, name: string) {
  try {
    return req.headers.get(name) || req.headers.get(name.toLowerCase()) || req.headers.get(name.toUpperCase()) || null
  } catch {
    return null
  }
}

function parseNextChargeAt(payload: Record<string, any>) {
  const candidates = [payload?.next_charge_at, payload?.nextChargeAt, payload?.renewal_date, payload?.next]
  for (const v of candidates) {
    if (!v) continue
    try {
      const d = new Date(String(v))
      if (!isNaN(d.getTime())) return d.toISOString()
    } catch {}
  }
  return null
}

function parseUserId(payload: Record<string, any>) {
  const candidates = [payload?.userId, payload?.uid, payload?.telegram_id, payload?.telegramId, payload?.customer_id, payload?.customerId]
  for (const v of candidates) {
    if (v) return String(v)
  }
  return null
}

export async function POST(req: Request) {
  try {
    const secretHeader = getHeader(req, "x-leadtech-secret")
    const expectedSecret = process.env.LEADTECH_WEBHOOK_SECRET || ""
    if (!expectedSecret) return NextResponse.json({ error: "LEADTECH_WEBHOOK_SECRET not set" }, { status: 500 })
    if (secretHeader !== expectedSecret) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

    const payload = await req.json()
    const type: string = String(payload?.type || payload?.event || "unknown")
    const userId = parseUserId(payload)
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
    const nextChargeAt = parseNextChargeAt(payload)
    const status = String(payload?.status || payload?.subscription_status || "active")

    const supabase = getSupabaseAdmin()
    const lastSeen = nowMoscow().toISOString()
    const update: Record<string, any> = {
      user_id: String(userId),
      last_seen_at: lastSeen,
      source: "leadtech-webhook",
      event_type: type,
      status,
    }
    if (nextChargeAt) update.next_charge_at = nextChargeAt

    const { error } = await supabase.from("school_subscription").upsert(update, { onConflict: "user_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, userId, nextChargeAt, status, type })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}
