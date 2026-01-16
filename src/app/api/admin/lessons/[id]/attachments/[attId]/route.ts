import { NextResponse } from "next/server"
import { getDb, requireAdmin } from "../../../../_utils"

export async function PUT(req: Request, { params }: { params: { id: string; attId: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const attId = params.attId
  const body = await req.json()
  const type: string | undefined = body?.type ? String(body.type) : undefined
  const title: string | undefined = body?.title ? String(body.title) : undefined
  const url: string | undefined = body?.url ? String(body.url) : undefined
  const contentId: string | undefined = body?.contentId ? String(body.contentId) : undefined
  const contentSlug: string | undefined = body?.contentSlug ? String(body.contentSlug) : undefined
  if (!attId) return NextResponse.json({ error: "attId required" }, { status: 400 })
  const db = getDb()
  const payload: Record<string, any> = {}
  if (type !== undefined) payload.type = type
  if (title !== undefined) payload.title = title
  if (url !== undefined) payload.url = url
  if (contentId !== undefined) payload.content_id = contentId
  if (contentSlug !== undefined) payload.content_slug = contentSlug
  const { data, error } = await db.from("school_lesson_attachments").update(payload).eq("id", attId).select("id,lesson_id,type,content_id,content_slug,title,url,created_at").limit(1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: Array.isArray(data) ? data[0] : data })
}

export async function DELETE(req: Request, { params }: { params: { id: string; attId: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const attId = params.attId
  if (!attId) return NextResponse.json({ error: "attId required" }, { status: 400 })
  const db = getDb()
  const { error } = await db.from("school_lesson_attachments").delete().eq("id", attId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
