"use client"
import { useSyncExternalStore, useState } from "react"
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
  const watched = useSyncExternalStore(subscribeWatched, () => WATCHED_CACHE, () => EMPTY_WATCHED)


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
            <path d="M2.37549 0.312988L0.641113 2.47421L2.37549 4.63586" stroke="white" />
          </svg>
          назад
        </Link>
      </nav>
      <div className="relative max-w-[343px] mx-auto mb-0">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
          <Image src="/woman.svg" alt="woman" width={110} height={120} style={{ objectFit: "cover", alignSelf: "flex-end" }} />
          <Image src="/Group 454.svg" alt="decor" width={172} height={34} style={{ objectFit: "contain" }} />
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
                <div className="flex items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 3V15.5C21 16.4283 20.6313 17.3185 19.9749 17.9749C19.3185 18.6313 18.4283 19 17.5 19C16.5717 19 15.6815 18.6313 15.0251 17.9749C14.3687 17.3185 14 16.4283 14 15.5C14 14.5717 14.3687 13.6815 15.0251 13.0251C15.6815 12.3687 16.5717 12 17.5 12C18.04 12 18.55 12.12 19 12.34V6.47L9 8.6V17.5C9 18.4283 8.63125 19.3185 7.97487 19.9749C7.3185 20.6313 6.42826 21 5.5 21C4.57174 21 3.6815 20.6313 3.02513 19.9749C2.36875 19.3185 2 18.4283 2 17.5C2 16.5717 2.36875 15.6815 3.02513 15.0251C3.6815 14.3687 4.57174 14 5.5 14C6.04 14 6.55 14.12 7 14.34V6L21 3Z" fill="black" />
                    <path d="M21 3V15.5C21 16.4283 20.6313 17.3185 19.9749 17.9749C19.3185 18.6313 18.4283 19 17.5 19C16.5717 19 15.6815 18.6313 15.0251 17.9749C14.3687 17.3185 14 16.4283 14 15.5C14 14.5717 14.3687 13.6815 15.0251 13.0251C15.6815 12.3687 16.5717 12 17.5 12C18.04 12 18.55 12.12 19 12.34V6.47L9 8.6V17.5C9 18.4283 8.63125 19.3185 7.97487 19.9749C7.3185 20.6313 6.42826 21 5.5 21C4.57174 21 3.6815 20.6313 3.02513 19.9749C2.36875 19.3185 2 18.4283 2 17.5C2 16.5717 2.36875 15.6815 3.02513 15.0251C3.6815 14.3687 4.57174 14 5.5 14C6.04 14 6.55 14.12 7 14.34V6L21 3Z" fill="url(#paint0_linear_43_140)" />
                    <defs>
                      <linearGradient id="paint0_linear_43_140" x1="2" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    className="font-libertinus"
                    style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word", marginLeft: "12px" }}
                  >
                    {t}
                  </div>
                  {/* серую галочку перенесём в правую группу */}
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
                    opacity: badgeSlug === slugify(t) ? 1 : 0,
                    transform: badgeSlug === slugify(t) ? "translateY(0)" : "translateY(-10px)",
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                >
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
                    <path d="M1.5 4.5 L4.5 7.5 L10.5 1.5" stroke="#D9D9D9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_43_138)" />
                    <svg x="9.5" y="8.5" width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.00964 4.047L-3.81168e-07 8.09402L-2.73667e-08 -2.27177e-05L7.00964 4.047Z" fill="#0d1739" />
                    </svg>
                    <defs>
                      <linearGradient id="paint0_linear_43_138" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
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
