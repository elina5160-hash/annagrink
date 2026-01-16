import { NextResponse } from "next/server"
import { getDb, requireAdmin } from "../../_utils"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const id = params.id
  const body = await req.json()
  const title: string | undefined = body?.title ? String(body.title) : undefined
  const url: string | undefined = body?.url ? String(body.url) : undefined
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  const payload: Record<string, any> = {}
  if (title !== undefined) payload.title = title
  if (url !== undefined) payload.url = url
  const { data, error } = await db.from("school_articles").update(payload).eq("id", id).select("id,slug,title,url,created_at").limit(1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: Array.isArray(data) ? data[0] : data })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const id = params.id
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const db = getDb()
  const { error } = await db.from("school_articles").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
