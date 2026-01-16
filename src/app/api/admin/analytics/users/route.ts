import { NextResponse } from "next/server"
import { getDb, requireAdmin } from "../../_utils"
import { devStoreConfigured, devGetSubscriptions, devGetWatched } from "../../../_dev_store"

type WatchedRow = { user_id: string; slug: string; count: number; viewed_at: string | null }
type SubRow = { user_id: string; last_seen_at: string | null; status?: string | null }

export async function GET(req: Request) {
  const auth = requireAdmin(req)
  if (auth) return auth
  const u = new URL(req.url)
  const limit = Number(u.searchParams.get("limit") || 20)
  const inactiveDays = Number(u.searchParams.get("inactiveDays") || 14)
  let watched: any[] = []
  let subs: any[] = []
  if (!devStoreConfigured()) {
    const subsDev = devGetSubscriptions()
    const usersSet = new Set<string>(subsDev.map((s) => String(s.user_id)))
    subs = subsDev
    usersSet.forEach((uid) => {
      const hist = devGetWatched(uid)
      for (const r of hist) watched.push({ user_id: uid, slug: r.slug, count: r.count, viewed_at: r.viewed_at })
    })
    if (!subs.length && !watched.length) {
      const now = new Date().toISOString()
      subs = [{ user_id: "1001", last_seen_at: now }, { user_id: "1002", last_seen_at: now }]
      watched = [
        { user_id: "1001", slug: "demo-1", count: 3, viewed_at: now },
        { user_id: "1002", slug: "demo-2", count: 1, viewed_at: now },
      ]
    }
  } else {
    const db = getDb()
    const { data: wdata, error: werr } = await db
      .from("school_lessons_watched")
      .select("user_id,slug,count,viewed_at")
      .order("viewed_at", { ascending: false })
      .limit(10000)
    if (werr) return NextResponse.json({ error: werr.message }, { status: 500 })
    watched = wdata || []
    const { data: sdata, error: serr } = await db
      .from("school_subscription")
      .select("user_id,last_seen_at,status")
      .order("last_seen_at", { ascending: false })
      .limit(10000)
    if (serr) return NextResponse.json({ error: serr.message }, { status: 500 })
    subs = sdata || []
  }
  const agg: Record<string, { total: number; lastViewed: number }> = {}
  const now = Date.now()
  for (const row of (watched || []) as WatchedRow[]) {
    const uid = String(row.user_id)
    const cnt = Number(row.count || 0)
    const t = row.viewed_at ? Date.parse(row.viewed_at) : 0
    if (!agg[uid]) agg[uid] = { total: 0, lastViewed: 0 }
    agg[uid].total += isFinite(cnt) ? cnt : 0
    if (t && t > agg[uid].lastViewed) agg[uid].lastViewed = t
  }
  const subMap: Record<string, SubRow> = {}
  for (const s of (subs || []) as SubRow[]) {
    subMap[String(s.user_id)] = s
  }
  const active = Object.keys(agg)
    .map((uid) => {
      const sub = subMap[uid]
      const lastSeenTs = sub?.last_seen_at ? Date.parse(sub.last_seen_at) : 0
      const last = Math.max(agg[uid].lastViewed || 0, lastSeenTs || 0)
      return { user_id: uid, total_views: agg[uid].total, last_seen_at: sub?.last_seen_at || null, last_activity_ts: last }
    })
    .sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
    .slice(0, limit)
  const inactiveThresholdMs = inactiveDays * 86400000
  const inactiveCandidates = new Set<string>(Object.keys(subMap))
  for (const uid of Object.keys(agg)) inactiveCandidates.add(uid)
  const inactive = Array.from(inactiveCandidates)
    .map((uid) => {
      const sub = subMap[uid]
      const lastSeenTs = sub?.last_seen_at ? Date.parse(sub.last_seen_at) : 0
      const lastViewTs = agg[uid]?.lastViewed || 0
      const lastTs = Math.max(lastSeenTs, lastViewTs)
      const daysSince = lastTs ? Math.floor((now - lastTs) / 86400000) : Infinity
      return { user_id: uid, last_seen_at: sub?.last_seen_at || null, days_since_seen: daysSince }
    })
    .filter((it) => it.days_since_seen >= inactiveDays)
    .sort((a, b) => (b.days_since_seen || 0) - (a.days_since_seen || 0))
    .slice(0, limit)
  return NextResponse.json({ topActive: active, topInactive: inactive, limit, inactiveDays })
}
