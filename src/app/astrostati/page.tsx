"use client"
import Link from "next/link"
import { useState, useSyncExternalStore, useEffect } from "react"

const ASTRO_WATCHED_EVENT = "astrostati:watched-change"
const ASTRO_WATCHED_KEY = "astrostati:watched"
const ASTRO_EMPTY_WATCHED: string[] = []
let ASTRO_WATCHED_CACHE: string[] = ASTRO_EMPTY_WATCHED
function astroSubscribeWatched(cb: () => void) {
  const handler = () => {
    try {
      const w = JSON.parse(localStorage.getItem(ASTRO_WATCHED_KEY) || "[]")
      if (Array.isArray(w)) ASTRO_WATCHED_CACHE = w
      else ASTRO_WATCHED_CACHE = ASTRO_EMPTY_WATCHED
    } catch {}
    cb()
  }
  if (typeof window !== "undefined") window.addEventListener(ASTRO_WATCHED_EVENT, handler as EventListener)
  return () => {
    if (typeof window !== "undefined") window.removeEventListener(ASTRO_WATCHED_EVENT, handler as EventListener)
  }
}

export default function AstrostatyiPage() {
  const defaultTopics = [
    "От кого зависит ваш социальный статус и успех?",
    "Голубая кровь в роду",
    "Семья или карьера",
    "Родовые сценарии в личной жизни",
    "Идеальный мужчина или абъюзер?",
    "Что будет, если не выполнять предназначение",
    "Фундамент вашей жизни",
    "Сфера твоего везения",
    "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?",
    "Почему вы годами не можете встретить партнёра",
    "Указания в натальной карте на богатого партнёра",
    "Плутон: долги или богатство",
  ]
  const [topics, setTopics] = useState<string[]>(defaultTopics)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("astrostati:topics")
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr) && arr.length) setTopics(arr.map((s: any) => String(s)))
    } catch {}
    const handler = () => {
      try {
        const raw = localStorage.getItem("astrostati:topics")
        const arr = raw ? JSON.parse(raw) : []
        if (Array.isArray(arr)) setTopics(arr.map((s: any) => String(s)))
      } catch {}
    }
    if (typeof window !== "undefined") window.addEventListener("astrostati:topics-change", handler as EventListener)
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("astrostati:topics-change", handler as EventListener)
    }
  }, [])
  const LINK_URL = "https://t.me/c/2474417642/542"
  const INITIAL_LINK_PAIRS: Array<{ title: string; url: string }> = [
    { title: "От кого зависит ваш социальный статус и успех?", url: LINK_URL },
    { title: "Голубая кровь в роду", url: LINK_URL },
    { title: "Семья или карьера", url: LINK_URL },
    { title: "Родовые сценарии в личной жизни", url: LINK_URL },
    { title: "Идеальный мужчина или абъюзер?", url: LINK_URL },
    { title: "Что будет, если не выполнять предназначение", url: LINK_URL },
    { title: "Фундамент вашей жизни", url: LINK_URL },
    { title: "Сфера твоего везения", url: LINK_URL },
    { title: "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?", url: LINK_URL },
    { title: "Почему вы годами не можете встретить партнёра", url: LINK_URL },
    { title: "Указания в натальной карте на богатого партнёра", url: LINK_URL },
    { title: "Плутон: долги или богатство", url: LINK_URL },
  ]
  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[,.:?]/g, "")
      .replace(/\s+/g, "-")
  }
  const [badgeSlug, setBadgeSlug] = useState<string | null>(null)
  const watched = useSyncExternalStore(
    astroSubscribeWatched,
    () => ASTRO_WATCHED_CACHE,
    () => ASTRO_EMPTY_WATCHED
  )
  useEffect(() => {
    try {
      const initRaw = localStorage.getItem(ASTRO_WATCHED_KEY)
      const init = initRaw ? JSON.parse(initRaw) : []
      ASTRO_WATCHED_CACHE = Array.isArray(init) ? init : ASTRO_EMPTY_WATCHED
      window.dispatchEvent(new Event(ASTRO_WATCHED_EVENT))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      const raw = localStorage.getItem("astrostati:links")
      const prev = raw ? JSON.parse(raw) : {}
      const next = { ...prev }
      INITIAL_LINK_PAIRS.forEach(({ title, url }) => {
        const key = slugify(title)
        if (!next[key]) next[key] = url
      })
      const prevStr = JSON.stringify(prev)
      const nextStr = JSON.stringify(next)
      if (prevStr !== nextStr) localStorage.setItem("astrostati:links", nextStr)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      const total = String(topics.length)
      const prev = localStorage.getItem("astrostati:total")
      if (prev !== total) localStorage.setItem("astrostati:total", total)
    } catch {}
  }, [topics])

  function toggleWatched(slug: string) {
    try {
      const prev = Array.isArray(ASTRO_WATCHED_CACHE) ? ASTRO_WATCHED_CACHE : ASTRO_EMPTY_WATCHED
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem(ASTRO_WATCHED_KEY, JSON.stringify(next))
        ASTRO_WATCHED_CACHE = next
      } catch {}
      try {
        window.dispatchEvent(new Event(ASTRO_WATCHED_EVENT))
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
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "342px",
            height: "127px",
            borderRadius: "20px",
            background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)",
          }}
        >
          <img
            src="/1d.png"
            alt=""
            style={{ position: "absolute", top: "15px", right: "15px", width: "45px", height: "auto", objectFit: "contain" }}
          />
          <img
             src="/3d.png"
             alt=""
             style={{ position: "absolute", bottom: "20px", left: "55%", width: "12px", height: "auto", objectFit: "contain" }}
           />
           <img
             src="/2d.png"
             alt=""
             style={{ position: "absolute", bottom: "35px", right: "45px", width: "18px", height: "auto", objectFit: "contain" }}
           />
          <img
            src="/woman.png"
            alt="woman"
            style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", alignSelf: "flex-end", zIndex: 1 }}
          />
          <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, background: "linear-gradient(90deg, #F4D990 0%, #CB9B3D 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textTransform: "uppercase", textAlign: "left", lineHeight: "110%", marginLeft: "-10px", zIndex: 1 }}>
            Клуб<br />«Предназначение»
          </div>
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
              Астростатьи
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
            Доступная астропсихология для каждого из вас. Каждый месяц Анна и ее команда пишут для вас новые статьи, по котором вы можете открыть натальную карту и разобрать важные точки своего навигатора. Если у вас есть вопросы и\xa0вы не можете разобраться в своей карте, то обязательно пишите в чате – куратору Марии Першиной.
          </div>
        </div>
        <div className="w-full max-w-[343px]" style={{ marginTop: "12px" }}>
          <ul className="space-y-2">
              {topics.map((t) => (
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
                      e.preventDefault()
                      const slug = slugify(t)
                      try {
                        if (!watched.includes(slug)) toggleWatched(slug)
                        setBadgeSlug(slug)
                        setTimeout(() => {
                          setBadgeSlug((s) => (s === slug ? null : s))
                        }, 1200)
                      } catch {}
                      try {
                        const raw = localStorage.getItem("astrostati:links")
                        const map = raw ? JSON.parse(raw) : {}
                        const url = map ? map[slug] : null
                        if (url && /^https?:/.test(url)) {
                          window.open(url, "_blank", "noopener,noreferrer")
                        }
                      } catch {}
                    }}
                  >
                    <div className="flex items-center">
                      <img src="/ikonastro.svg" alt="ikonastro" width={24} height={24} style={{ objectFit: "contain" }} />
                      <div
                        className="font-libertinus"
                        style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word", marginLeft: "12px" }}
                      >
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
                            if (!watched.includes(slug)) toggleWatched(slug)
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
                        <circle cx="12" cy="12" r="11" fill="url(#astro_paint0_linear)" />
                        <svg x="8.5" y="7.5" width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.00964 4.047L0 8.09402V0L7.00964 4.047Z" fill="#0d1739" />
                        </svg>
                        <defs>
                          <linearGradient id="astro_paint0_linear" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
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
        <div
          style={{
            width: "calc(100% - 140px)",
            marginLeft: "70px",
            marginRight: "70px",
            marginTop: "44px",
            position: "relative",
          }}
        >
          <img
            src="/куратору2.png"
            alt="написать куратору"
            style={{ width: "100%", height: "auto", borderRadius: "12px", display: "block" }}
          />
          
        </div>
      </div>
    </div>
  )
}
