import { NextResponse } from "next/server"

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const service = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SECRET || ""
  return NextResponse.json({
    supabaseUrlPresent: !!url,
    anonKeyPresent: !!anon,
    serviceRolePresent: !!service,
  })
}
