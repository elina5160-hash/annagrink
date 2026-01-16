import { NextResponse } from "next/server"
import { getDb, requireAdmin, slugify } from "../_utils"

export async function GET(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const u = new URL(req.url)
  const q = u.searchParams.get("q") || ""
  const limit = Number(u.searchParams.get("limit") || 20)
  const offset = Number(u.searchParams.get("offset") || 0)
  const db = getDb()
  let query = db.from("school_podcasts").select("id,slug,title,url,created_at").order("created_at", { ascending: false }).range(offset, offset + limit - 1)
  if (q) query = query.ilike("title", `%${q}%`)
  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data || [], limit, offset, count: count ?? (data?.length || 0) })
}

export async function POST(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const body = await req.json()
  const title: string = String(body?.title || "")
  const url: string = String(body?.url || "")
  let slug: string = String(body?.slug || "")
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 })
  if (!slug) slug = slugify(title)
  const db = getDb()
  const { data, error } = await db.from("school_podcasts").upsert({ slug, title, url }).select("id,slug,title,url,created_at").limit(1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: Array.isArray(data) ? data[0] : data })
}

export async function DELETE(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const body = await req.json()
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.map((s: any) => String(s)) : []
  if (!ids.length) return NextResponse.json({ error: "ids required" }, { status: 400 })
  const db = getDb()
  const { error } = await db.from("school_podcasts").delete().in("id", ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, deleted: ids.length })
}
