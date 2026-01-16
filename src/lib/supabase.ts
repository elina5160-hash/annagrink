import { createClient } from "@supabase/supabase-js"

export function getSupabaseServer() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  return createClient(url, key)
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const service = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET || ""
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const isDev = process.env.NODE_ENV !== "production"
  const key = service || (isDev ? anon : "")
  return createClient(url, key)
}
