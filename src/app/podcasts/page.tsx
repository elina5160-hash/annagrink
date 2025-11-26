"use client"
import { useState } from "react"
import Link from "next/link"

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

function loadItems(): Item[] {
  try {
    const raw = localStorage.getItem("podcasts:items")
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

const initialItems = (() => {
  return loadItems()
})()

const listTopics = initialItems.length ? initialItems.map((i) => i.title) : topics
const materialsBySlug: Record<string, string> = (() => {
  if (initialItems.length) {
    const map: Record<string, string> = {}
    for (const it of initialItems) map[slugify(it.title)] = it.url
    return map
  }
  return Object.fromEntries(
    topics.map((t) => {
      const s = slugify(t)
      return [s, `https://example.com/materials/${encodeURIComponent(s)}`]
    })
  )
})()

export default function PodcastsPage() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const f = JSON.parse(localStorage.getItem("podcasts:favorites") || "[]")
      return Array.isArray(f) ? f : []
    } catch {
      return []
    }
  })
  const [watched, setWatched] = useState<string[]>(() => {
    try {
      const w = JSON.parse(localStorage.getItem("podcasts:watched") || "[]")
      return Array.isArray(w) ? w : []
    } catch {
      return []
    }
  })

  function toggleFavorite(slug: string) {
    try {
      setFavorites((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        try {
          localStorage.setItem("podcasts:favorites", JSON.stringify(next))
        } catch {}
        return next
      })
    } catch {}
  }

  function toggleWatched(slug: string) {
    try {
      setWatched((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        try {
          localStorage.setItem("podcasts:watched", JSON.stringify(next))
        } catch {}
        return next
      })
    } catch {}
  }
  return (
    <div className="app-stars min-h-screen flex flex-col items-center px-4 py-6">
      <nav className="w-full max-w-[343px] flex justify-end gap-2 mb-2">
        <Link
          href="/home"
          className="font-libertinus"
          style={{
            padding: "8px 12px",
            borderRadius: "9999px",
            background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
            color: "#08102d",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          домой
          <img src="/Vector%2027.svg" alt="arrow" width={18} height={12} />
        </Link>
      </nav>
      <div
        className="font-libertinus"
        style={{
          fontWeight: 400,
          fontSize: "22px",
          lineHeight: "95%",
          textTransform: "uppercase",
          background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Подкасты
      </div>
      <div className="w-full max-w-[343px] mt-4 mb-24">
        <ul className="space-y-2">
          {listTopics.map((t) => (
            <li key={t}>
              <details
                className="group rounded-xl"
                style={{
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  color: "#fff",
                  overflow: "hidden",
                }}
              >
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
                  <div
                    className="font-libertinus"
                    style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word" }}
                  >
                    {t}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="favorite"
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.9)"
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(slugify(t))
                      }}
                      style={{
                        transition: "transform 150ms ease",
                        lineHeight: 1,
                      }}
                    >
                      <span
                        style={{
                          color: favorites.includes(slugify(t)) ? "#e63946" : "#9ca3af",
                          fontSize: "18px",
                        }}
                      >
                        {favorites.includes(slugify(t)) ? "❤️" : "♡"}
                      </span>
                    </button>
                    <button
                      aria-label="watched"
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = "scale(0.9)"
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleWatched(slugify(t))
                      }}
                      style={{
                        transition: "transform 150ms ease",
                        lineHeight: 1,
                      }}
                    >
                      <span
                        style={{
                          color: watched.includes(slugify(t)) ? "#10b981" : "#9ca3af",
                          fontSize: "18px",
                        }}
                      >
                        ✓
                      </span>
                    </button>
                  </div>
                </summary>
                <div className="px-4 pb-4">
                  <div
                    className="rounded-xl"
                    style={{
                      background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                      padding: "12px",
                    }}
                  >
                    <a
                      href={materialsBySlug[slugify(t)] || "#"}
                      className="font-libertinus"
                      onClick={(e) => {
                        const slug = slugify(t)
                        const url = materialsBySlug[slug]
                        if (!url) {
                          e.preventDefault()
                          return
                        }
                        try {
                          const viewsRaw = localStorage.getItem("podcasts:views")
                          const views = viewsRaw ? JSON.parse(viewsRaw) : {}
                          views[slug] = (views[slug] || 0) + 1
                          views[`${slug}:last`] = Date.now()
                          localStorage.setItem("podcasts:views", JSON.stringify(views))
                        } catch {}
                        try {
                          if (!watched.includes(slug)) {
                            const next = [...watched, slug]
                            localStorage.setItem("podcasts:watched", JSON.stringify(next))
                            setWatched(next)
                          }
                        } catch {}
                      }}
                      style={{
                        marginTop: "10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        borderRadius: "9999px",
                        background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                        color: "#08102d",
                        textTransform: "uppercase",
                        transition: "transform 150ms ease",
                      }}
                      onMouseDown={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(0.98)"
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"
                      }}
                    >
                      Открыть урок
                      <img src="/Vector%2027.svg" alt="arrow" width={18} height={12} />
                    </a>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
