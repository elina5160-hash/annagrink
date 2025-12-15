"use client"
import { useSyncExternalStore, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const topics = [
  "Почему опасно объединять рода и бездумно делать детей",
  "Живые/мёртвые энергии в натальной карте",
  "Бесхребетные женщины",
  "Личные границы",
  "Как перестать выбирать жестоких мужчин?",
  "Уровни дохода",
  "Подкаст с Косенко",
  "Про богатых мужчин",
  "Моя философия жизни",
  "Как найти идеального мужчину?",
  "Секреты больших денег",
  "Релокация",
  "Как не выбрасывать деньги на обучения?",
  "Как уйти из найма?",
  "Как общаться с мужем, чтобы вас слышали?",
  "Беременность, дети",
  "Как научиться работать за деньги",
  "Как я научилась быть слабой",
  "Как справиться с критикой?",
  "Про обучение",
  "Любовь или деньги?",
  "Труп моего бизнеса",
  "Как сливают продажи и клиентов?",
  "Почему вы НЕ зарабатываете много",
  "Как не разрушать жизнь на эмоциях",
  "Почему я ушла от мужа",
]

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\?/g, "")
    .replace(/[,.:]/g, "")
    .replace(/\s+/g, "-")
}

type Item = { title: string; description?: string; url: string }

const EMPTY_ITEMS: Item[] = []
const EMPTY_WATCHED: string[] = []

const POD_LINK_URL = "https://t.me/c/2474417642/542"
const INITIAL_PODCAST_ITEMS: Item[] = topics.map((t) => ({ title: t, url: POD_LINK_URL }))

const defaultMaterialsBySlug: Record<string, string> = Object.fromEntries(
  topics.map((t) => {
    const s = slugify(t)
    return [s, `https://example.com/materials/${encodeURIComponent(s)}`]
  })
)

const ITEMS_EVENT = "podcasts:items-change"
let ITEMS_CACHE: Item[] = EMPTY_ITEMS
function subscribeItems(cb: () => void) {
  const handler = () => {
    try {
      const raw = localStorage.getItem("podcasts:items")
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr)) {
        const same = ITEMS_CACHE.length === arr.length && ITEMS_CACHE.every((v, i) => v.title === arr[i].title && v.url === arr[i].url)
        if (!same) ITEMS_CACHE = arr
      } else {
        if (ITEMS_CACHE.length) ITEMS_CACHE = []
      }
    } catch {}
    cb()
  }
  if (typeof window !== "undefined") window.addEventListener(ITEMS_EVENT, handler as EventListener)
  return () => {
    if (typeof window !== "undefined") window.removeEventListener(ITEMS_EVENT, handler as EventListener)
  }
}

const WATCHED_EVENT = "podcasts:watched-change"
const WATCHED_KEY = "podcasts:watched"
let WATCHED_CACHE: string[] = EMPTY_WATCHED
function subscribeWatched(cb: () => void) {
  const handler = () => {
    try {
      const w = JSON.parse(localStorage.getItem(WATCHED_KEY) || "[]")
      if (Array.isArray(w)) {
        const same = WATCHED_CACHE.length === w.length && WATCHED_CACHE.every((v, i) => v === w[i])
        if (!same) WATCHED_CACHE = w
      } else {
        if (WATCHED_CACHE.length) WATCHED_CACHE = []
      }
    } catch {}
    cb()
  }
  if (typeof window !== "undefined") window.addEventListener(WATCHED_EVENT, handler as EventListener)
  return () => {
    if (typeof window !== "undefined") window.removeEventListener(WATCHED_EVENT, handler as EventListener)
  }
}

export default function PodcastsPage() {
  const [badgeSlug, setBadgeSlug] = useState<string | null>(null)
  const items = useSyncExternalStore(subscribeItems, () => ITEMS_CACHE, () => EMPTY_ITEMS)
  const listTopics = items.length ? items.map((i: Item) => i.title) : topics
  const materialsBySlug: Record<string, string> = (() => {
    if (items.length) {
      const map: Record<string, string> = {}
      for (const it of items) map[slugify(it.title)] = it.url
      return map
    }
    return defaultMaterialsBySlug
  })()
  const watched = useSyncExternalStore(
    subscribeWatched,
    () => WATCHED_CACHE,
    () => EMPTY_WATCHED
  )
  useEffect(() => {
    try {
      const initRaw = localStorage.getItem(WATCHED_KEY)
      const init = initRaw ? JSON.parse(initRaw) : []
      WATCHED_CACHE = Array.isArray(init) ? init : EMPTY_WATCHED
      window.dispatchEvent(new Event(WATCHED_EVENT))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      const raw = localStorage.getItem("podcasts:items")
      const prev: Item[] = raw ? JSON.parse(raw) : []
      const bySlug = (arr: Item[]) => {
        const m: Record<string, Item> = {}
        if (Array.isArray(arr)) for (const it of arr) m[slugify(it.title)] = it
        return m
      }
      const prevMap = bySlug(prev)
      const next: Item[] = topics.map((t) => {
        const s = slugify(t)
        const existing = prevMap[s]
        const url = POD_LINK_URL
        return existing ? { title: t, url: existing.url || url } : { title: t, url }
      })
      const same = Array.isArray(prev) && prev.length === next.length && prev.every((v, i) => v.title === next[i].title && v.url === next[i].url)
      if (!same) {
        localStorage.setItem("podcasts:items", JSON.stringify(next))
        window.dispatchEvent(new Event(ITEMS_EVENT))
      }
    } catch {}
  }, [])
  try {
    if (typeof window !== "undefined") {
      const total = String(listTopics.length)
      const prev = localStorage.getItem("podcasts:total")
      if (prev !== total) localStorage.setItem("podcasts:total", total)
    }
  } catch {}


  function toggleWatched(slug: string) {
    try {
      const prev = Array.isArray(WATCHED_CACHE) ? WATCHED_CACHE : []
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem(WATCHED_KEY, JSON.stringify(next))
        WATCHED_CACHE = next
      } catch {}
      try {
        window.dispatchEvent(new Event(WATCHED_EVENT))
      } catch {}
    } catch {}
  }
  return (
    <div className="app-stars min-h-screen flex flex-col items-center px-4 py-6">
      <nav className="w-full max-w-[343px] flex justify-start mb-2">
        <Link
          href="/home"
          prefetch={false}
          onClick={(e) => {
            e.preventDefault()
            try {
              window.location.assign("/home")
            } catch {
              window.location.href = "/home"
            }
          }}
          style={{
            width: "62px",
            height: "21px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            textDecoration: "none",
            fontFamily: "var(--font-family)",
            fontWeight: 300,
            fontSize: "10px",
            lineHeight: "130%",
            color: "#fff",
            background: "#192656",
            borderRadius: "5px",
          }}
        >
          <svg width="3" height="5" viewBox="0 0 3 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.37549 0.312988L0.641113 2.47421L2.37549 4.63586" stroke="white" strokeWidth="1" />
          </svg>
          назад
        </Link>
      </nav>
      <div className="relative max-w-[343px] mx-auto mb-0">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
          <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", alignSelf: "flex-end" }} />
          <img src="/Group 454.png" alt="decor" style={{ width: "172px", height: "34px", objectFit: "contain" }} />
        </div>
      </div>
      <div className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "15px" }}>
        <div
          style={{
            width: "343px",
            borderRadius: "20px",
            background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
            padding: "16px",
            color: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <div
              className="font-libertinus"
              style={{
                marginLeft: "0",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "95%",
                textTransform: "uppercase",
                background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "left",
              }}
            >
              Аудио подкасты
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "12px",
              lineHeight: "130%",
              color: "#fff",
              textAlign: "left",
            }}
          >
            — это психологические и астрологические разборы повседневных ситуаций из жизни Анны и других людей. Они позволяют на любую ситуацию научиться смотреть с разных сторон, слушайте и делитесь обратной связью в чате. После каждого подкаста можно попасть на мини-разбор по теме подкаста.
          </div>
        </div>
      </div>
      <div className="w-full max-w-[343px] mt-4 mb-24">
        <ul className="space-y-2">
          {listTopics.map((t) => (
            <li key={t}>
              <a
                href="#"
                className="group rounded-xl"
                style={{
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  position: "relative",
                  minHeight: "48px",
                }}
                onClick={(e) => {
                  ;(e as any).nativeEvent?.stopImmediatePropagation?.()
                  const slug = slugify(t)
                  const url = materialsBySlug[slug]
                  e.preventDefault()
                  try {
                    const viewsRaw = localStorage.getItem("podcasts:views")
                    const views = viewsRaw ? JSON.parse(viewsRaw) : {}
                    views[slug] = (views[slug] || 0) + 1
                    views[`${slug}:last`] = Date.now()
                    localStorage.setItem("podcasts:views", JSON.stringify(views))
                  } catch {}
                  try {
                    if (!watched.includes(slug)) {
                      const prev = Array.isArray(WATCHED_CACHE) ? WATCHED_CACHE : []
                      const next = [...prev, slug]
                      localStorage.setItem(WATCHED_KEY, JSON.stringify(next))
                      WATCHED_CACHE = next
                      window.dispatchEvent(new Event(WATCHED_EVENT))
                    }
                    setBadgeSlug(slug)
                    setTimeout(() => {
                      setBadgeSlug((s) => (s === slug ? null : s))
                    }, 1200)
                  } catch {}
                  try {
                    if (url && /^https?:/.test(url)) {
                      window.open(url, "_blank", "noopener,noreferrer")
                    }
                  } catch {}
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", alignItems: "center", columnGap: 12 }}>
                  <svg width="24" height="24" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M19 0V12.5C19 13.4283 18.6313 14.3185 17.9749 14.9749C17.3185 15.6313 16.4283 16 15.5 16C14.5717 16 13.6815 15.6313 13.0251 14.9749C12.3687 14.3185 12 13.4283 12 12.5C12 11.5717 12.3687 10.6815 13.0251 10.0251C13.6815 9.36875 14.5717 9 15.5 9C16.04 9 16.55 9.12 17 9.34V3.47L7 5.6V14.5C7 15.4283 6.63125 16.3185 5.97487 16.9749C5.3185 17.6313 4.42826 18 3.5 18C2.57174 18 1.6815 17.6313 1.02513 16.9749C0.368749 16.3185 0 15.4283 0 14.5C0 13.5717 0.368749 12.6815 1.02513 12.0251C1.6815 11.3687 2.57174 11 3.5 11C4.04 11 4.55 11.12 5 11.34V3L19 0Z" fill="black" />
                    <path d="M19 0V12.5C19 13.4283 18.6313 14.3185 17.9749 14.9749C17.3185 15.6313 16.4283 16 15.5 16C14.5717 16 13.6815 15.6313 13.0251 14.9749C12.3687 14.3185 12 13.4283 12 12.5C12 11.5717 12.3687 10.6815 13.0251 10.0251C13.6815 9.36875 14.5717 9 15.5 9C16.04 9 16.55 9.12 17 9.34V3.47L7 5.6V14.5C7 15.4283 6.63125 16.3185 5.97487 16.9749C5.3185 17.6313 4.42826 18 3.5 18C2.57174 18 1.6815 17.6313 1.02513 16.9749C0.368749 16.3185 0 15.4283 0 14.5C0 13.5717 0.368749 12.6815 1.02513 12.0251C1.6815 11.3687 2.57174 11 3.5 11C4.04 11 4.55 11.12 5 11.34V3L19 0Z" fill="url(#paint0_linear_43_162)" />
                    <defs>
                      <linearGradient id="paint0_linear_43_162" x1="0" y1="9" x2="19" y2="9" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word" }}>
                    {t}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: -12,
                    zIndex: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "2px 8px",
                    borderRadius: 5,
                    background: "#22926B",
                    color: "#fff",
                    fontFamily: "var(--font-family)",
                    fontWeight: 400,
                    fontSize: 9,
                    lineHeight: "130%",
                    opacity: watched.includes(slugify(t)) || badgeSlug === slugify(t) ? 1 : 0,
                    transform: watched.includes(slugify(t)) || badgeSlug === slugify(t) ? "translateY(0)" : "translateY(-10px)",
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                    <svg width="10" height="10" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 4.5 L4.5 7.5 L10.5 1.5" stroke="#D9D9D9" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <svg width="10" height="10" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 4.5 L4.5 7.5 L10.5 1.5" stroke="#D9D9D9" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ marginLeft: 4 }}>Прослушано</span>
                </div>

                <div className="flex items-center gap-3" style={{ position: "relative" }}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 12 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      const slug = slugify(t)
                      try {
                        if (!watched.includes(slug)) {
                          const prev = Array.isArray(WATCHED_CACHE) ? WATCHED_CACHE : []
                          const next = [...prev, slug]
                          localStorage.setItem(WATCHED_KEY, JSON.stringify(next))
                          WATCHED_CACHE = next
                          window.dispatchEvent(new Event(WATCHED_EVENT))
                        }
                        setBadgeSlug(slug)
                        setTimeout(() => {
                          setBadgeSlug((s) => (s === slug ? null : s))
                        }, 1200)
                      } catch {}
                    }}
                  >
                    <path d="M1.5 4.5 L4.5 7.5 L10.5 1.5" stroke="#D9D9D9" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="#D9D9D9" />
                    <circle cx="12" cy="12" r="11" fill="url(#paint0_linear_43_138)" />
                    <svg x="8.5" y="7.5" width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.00964 4.047L0 8.09402V0L7.00964 4.047Z" fill="#0d1739" />
                    </svg>
                    <defs>
                      <linearGradient id="paint0_linear_43_138" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
