import { NextResponse } from "next/server"
import { requireAdmin } from "../../_utils"

export async function POST(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  try {
    const body = await req.json()
    const token: string = String(body?.token || "")
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 })
    const url = `https://api.telegram.org/bot${encodeURIComponent(token)}/getMe`
    const r = await fetch(url, { method: "GET" })
    const j = await r.json().catch(() => ({}))
    if (!r.ok || !j?.ok) {
      const msg = j?.description || "invalid token"
      return NextResponse.json({ ok: false, error: msg }, { status: 200 })
    }
    const bot = j?.result ? {
      id: j.result.id,
      is_bot: j.result.is_bot,
      first_name: j.result.first_name,
      username: j.result.username,
    } : null
    return NextResponse.json({ ok: true, bot })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 200 })
  }
}
