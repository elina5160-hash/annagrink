import { NextResponse } from "next/server"
import { getDb, requireAdmin } from "../_utils"

export async function POST(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  try {
    const body = await req.json()
    const action: string = String(body?.action || "")
    const details: any = body?.details || null
    const db = getDb()
    const payload: Record<string, any> = { action, details: details ? JSON.stringify(details) : null }
    const { error } = await db.from("school_admin_logs").insert(payload)
    if (error) return NextResponse.json({ ok: false })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
