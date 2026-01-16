import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "../../../../lib/supabase"
import { devStoreConfigured, devGetWatched, devUpsertWatched, devDeleteWatched } from "../../_dev_store"

function nowMoscow() {
  const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  return new Date(s)
}

export async function GET(req: Request) {
  try {
    const u = new URL(req.url)
    const userId = u.searchParams.get("uid") || u.searchParams.get("user_id")
    if (!userId) return NextResponse.json({ error: "uid required" }, { status: 400 })
    if (!devStoreConfigured()) {
      const data = devGetWatched(String(userId))
      const watched = Array.isArray(data) ? data.map((r: any) => String(r.slug)) : []
      return NextResponse.json({ userId, watched, history: data || [] })
    }
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from("school_lessons_watched")
        .select("slug, viewed_at, count")
        .eq("user_id", String(userId))
        .order("viewed_at", { ascending: false })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      const watched = Array.isArray(data) ? data.map((r: any) => String(r.slug)) : []
      return NextResponse.json({ userId, watched, history: data || [] })
    } catch (e: any) {
      return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const uid: string | null = body?.uid || body?.userId || null
    const slug: string | null = body?.slug || null
    const action: string | null = body?.action || null
    if (!uid || !slug) return NextResponse.json({ error: "uid and slug required" }, { status: 400 })
    if (!devStoreConfigured()) {
      if (action === "unwatch") {
        devDeleteWatched(String(uid), String(slug))
        return NextResponse.json({ ok: true, uid, slug, watched: false })
      }
      const viewedAt = nowMoscow().toISOString()
      devUpsertWatched(String(uid), String(slug), viewedAt)
      return NextResponse.json({ ok: true, uid, slug, watched: true, viewedAt })
    }
    try {
      const supabase = getSupabaseAdmin()
      if (action === "unwatch") {
        const { error } = await supabase.from("school_lessons_watched").delete().eq("user_id", String(uid)).eq("slug", String(slug))
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ ok: true, uid, slug, watched: false })
      }
      const viewedAt = nowMoscow().toISOString()
      const payload = { user_id: String(uid), slug: String(slug), viewed_at: viewedAt, count: 1 }
      const { error } = await supabase.from("school_lessons_watched").upsert(payload, { onConflict: "user_id,slug" })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, uid, slug, watched: true, viewedAt })
    } catch (e: any) {
      return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 })
  }
}
