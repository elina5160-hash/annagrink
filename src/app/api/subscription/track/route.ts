import { NextResponse } from "next/server"
import { getSupabaseServer } from "../../../../lib/supabase"

function nowMoscow() {
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  return new Date(s)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId: string | null = body?.userId || null
    const nextChargeAt: string | null = body?.nextChargeAt || null
    const source: string | null = body?.source || null
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
    const supabase = getSupabaseServer()
    const lastSeen = nowMoscow().toISOString()
    const payload: Record<string, any> = { user_id: String(userId), last_seen_at: lastSeen }
    if (nextChargeAt) payload.next_charge_at = new Date(nextChargeAt).toISOString()
    if (source) payload.source = String(source)
    const { error } = await supabase.from("school_subscription").upsert(payload, { onConflict: "user_id" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}
