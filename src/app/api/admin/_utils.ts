import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "../../../lib/supabase"

export function requireAdmin(req: Request) {
  const key = req.headers.get("x-admin-key")
  const expected = process.env.ADMIN_API_KEY || ""
  const isDev = process.env.NODE_ENV !== "production"
  if (isDev && !expected && key) {
    return null
  }
  if (!key || !expected || key !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  return null
}

export function getDb() {
  return getSupabaseAdmin()
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[,.:?«»"']/g, "").replace(/\s+/g, "-")
}
