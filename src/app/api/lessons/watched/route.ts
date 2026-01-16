import { NextResponse } from "next/server"
import { getSupabaseServer } from "../../../../lib/supabase"

export async function GET(req: Request) {
  try {
    const u = new URL(req.url)
    const userId = u.searchParams.get("uid") || u.searchParams.get("user_id")
    if (!userId) return NextResponse.json({ slugs: [] })
    const supabase = getSupabaseServer()
    const { data, error } = await supabase.from("lessons_watched").select("slug").eq("user_id", String(userId))
    if (error) return NextResponse.json({ slugs: [], error: error.message }, { status: 200 })
    const slugs = Array.isArray(data) ? data.map((r: any) => String(r.slug)) : []
    return NextResponse.json({ slugs })
  } catch (e: any) {
    return NextResponse.json({ slugs: [], error: String(e?.message || e) }, { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userId: string | null = body?.userId || null
    const slug: string | null = body?.slug || null
    const watched: boolean = !!body?.watched
    if (!userId || !slug) return NextResponse.json({ error: "userId and slug required" }, { status: 400 })
    const supabase = getSupabaseServer()
    if (watched) {
      const { error } = await supabase.from("lessons_watched").upsert({ user_id: String(userId), slug: String(slug) }, { onConflict: "user_id,slug" })
      if (error) return NextResponse.json({ error: error.message }, { status: 200 })
      return NextResponse.json({ ok: true })
    } else {
      const { error } = await supabase.from("lessons_watched").delete().eq("user_id", String(userId)).eq("slug", String(slug))
      if (error) return NextResponse.json({ error: error.message }, { status: 200 })
      return NextResponse.json({ ok: true })
    }
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 200 })
  }
}
