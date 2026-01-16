const subs = new Map<string, { last_seen_at: string; status?: string | null }>()
const watched = new Map<string, Array<{ slug: string; count: number; viewed_at: string }>>()

export function devStoreConfigured() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  return !!url
}

export function devTrackSubscription(userId: string, lastSeenAt: string, status?: string | null) {
  subs.set(String(userId), { last_seen_at: lastSeenAt, status: status ?? null })
}

export function devGetSubscriptions() {
  const arr: Array<{ user_id: string; last_seen_at: string; status?: string | null }> = []
  subs.forEach((v, k) => arr.push({ user_id: k, last_seen_at: v.last_seen_at, status: v.status ?? null }))
  return arr
}

export function devUpsertWatched(userId: string, slug: string, viewedAt: string) {
  const uid = String(userId)
  const list = watched.get(uid) || []
  const idx = list.findIndex((r) => r.slug === slug)
  if (idx >= 0) {
    list[idx] = { slug, count: (list[idx].count || 0) + 1, viewed_at: viewedAt }
  } else {
    list.push({ slug, count: 1, viewed_at: viewedAt })
  }
  watched.set(uid, list)
}

export function devDeleteWatched(userId: string, slug: string) {
  const uid = String(userId)
  const list = watched.get(uid) || []
  watched.set(uid, list.filter((r) => r.slug !== slug))
}

export function devGetWatched(userId: string) {
  const uid = String(userId)
  return watched.get(uid) || []
}
