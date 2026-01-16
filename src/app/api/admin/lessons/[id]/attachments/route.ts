import { NextResponse } from "next/server"
import { getDb, requireAdmin } from "../../../_utils"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const lessonId = params.id
  const db = getDb()
  const { data, error } = await db
    .from("school_lesson_attachments")
    .select("id,lesson_id,type,content_id,content_slug,title,url,created_at")
    .eq("lesson_id", String(lessonId))
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data || [] })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const lessonId = params.id
  const body = await req.json()
  const type: string = String(body?.type || "")
  const title: string = String(body?.title || "")
  const url: string = String(body?.url || "")
  const contentId: string | null = body?.contentId ? String(body.contentId) : null
  const contentSlug: string | null = body?.contentSlug ? String(body.contentSlug) : null
  if (!lessonId || !type) return NextResponse.json({ error: "lessonId and type required" }, { status: 400 })
  const db = getDb()
  const payload: Record<string, any> = { lesson_id: String(lessonId), type }
  if (title) payload.title = title
  if (url) payload.url = url
  if (contentId) payload.content_id = contentId
  if (contentSlug) payload.content_slug = contentSlug
  const { data, error } = await db.from("school_lesson_attachments").insert(payload).select("id,lesson_id,type,content_id,content_slug,title,url,created_at").limit(1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: Array.isArray(data) ? data[0] : data })
}
