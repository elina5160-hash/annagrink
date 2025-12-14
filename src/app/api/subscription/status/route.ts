import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

function nowMoscow() {
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  return new Date(s)
}

function toMoscow(dateIso: string) {
  const s = new Date(dateIso).toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  return new Date(s)
}

function daysDiff(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.ceil(ms / 86400000))
}

export async function GET(req: Request) {
  try {
    const u = new URL(req.url)
    const userId = u.searchParams.get("uid") || u.searchParams.get("user_id")
    if (!userId) return NextResponse.json({ error: "uid required" }, { status: 400 })
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("school_subscription").select("user_id,next_charge_at,last_seen_at").eq("user_id", String(userId)).maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const now = nowMoscow()
    let nextIso: string | null = null
    let daysLeft = null as number | null
    if (data?.next_charge_at) {
      const n = toMoscow(data.next_charge_at as string)
      daysLeft = daysDiff(now, n)
      nextIso = new Date(data.next_charge_at as string).toISOString()
    }
    return NextResponse.json({ userId, nextChargeAt: nextIso, daysLeft })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

