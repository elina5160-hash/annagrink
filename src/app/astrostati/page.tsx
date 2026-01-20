"use client"
import Link from "next/link"
import { BottomBar } from "../../components/ui/bottom-bar"
import { useState, useSyncExternalStore, useEffect, useMemo } from "react"

const ASTRO_WATCHED_EVENT = "astrostati:watched-change"
const ASTRO_WATCHED_KEY = "astrostati:watched"
const ASTRO_EMPTY_WATCHED: string[] = []
function astroSubscribeWatched(cb: () => void) {
  const handler = () => {
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
  const [topics, setTopics] = useState<string[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("astrostati:topics") : null
      const arr = raw ? JSON.parse(raw) : []
      if (Array.isArray(arr) && arr.length) return arr.map((s: any) => String(s))
    } catch {}
    return defaultTopics
  })
  useEffect(() => {
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
    { title: "От кого зависит ваш социальный статус и успех?", url: "https://drive.google.com/file/d/1X6x_O0Z7vK_uG-D2d5u8tyoJb_q2y3rF/view?usp=sharing" },
    { title: "Голубая кровь в роду", url: "https://drive.google.com/file/d/1trj-q3FFOA_3lelo36goxB379snv4R0e/view?usp=sharing" },
    { title: "Семья или карьера", url: "https://drive.google.com/file/d/1PElEdzwkpg3PRcCNt1HJw42uvbXPZ3VQ/view?usp=sharing" },
    { title: "Родовые сценарии в личной жизни", url: "https://disk.yandex.ru/d/VsYSRdgYkN5f7g" },
    { title: "Идеальный мужчина или абъюзер?", url: "https://disk.yandex.ru/d/hU430VCKbqTdvw" },
    { title: "Что будет, если не выполнять предназначение", url: "https://drive.google.com/file/d/1i_yXj_s_w_k_2_0_2_4/view?usp=sharing" },
    { title: "Фундамент вашей жизни", url: "https://drive.google.com/file/d/13C9CESsoCs4OMgNoUu2J9L37-KHPZPlK/view?usp=sharing" },
    { title: "Сфера твоего везения", url: "https://drive.google.com/file/d/1-GvJf_DlQa0OTfWIomNdDtPzIr4ngRdC/view?usp=sharing" },
    { title: "Кому необходимо переехать из своего города, а кому остаться, чтобы много зарабатывать?", url: "https://drive.google.com/file/d/1E7m1kcO_-c32iOmFoy8CLPrw56vUwbC4/view?usp=sharing" },
    { title: "Почему вы годами не можете встретить партнёра", url: "https://drive.google.com/file/d/1n7jHWfZ-uEAO04Bms73ObjssH69F2Eip/view?usp=sharing" },
    { title: "Указания в натальной карте на богатого партнёра", url: "https://drive.google.com/file/d/1A9Q4Db9Z856NI3wYyQX8DmGGEE442RSs/view?usp=sharing" },
    { title: "Плутон: долги или богатство", url: "https://drive.google.com/file/d/1zdhqtUKNMt8D3Lu6XD65bzZVCvtOy5V1/view?usp=sharing" },
  ]
  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[,.:?]/g, "")
      .replace(/\s+/g, "-")
  }
  const [badgeSlug, setBadgeSlug] = useState<string | null>(null)
  const watchedStr = useSyncExternalStore(
    astroSubscribeWatched,
    () => {
      try {
        return localStorage.getItem(ASTRO_WATCHED_KEY) || "[]"
      } catch {
        return "[]"
      }
    },
    () => "[]"
  )
  const watched = useMemo(() => {
    try {
      const w = JSON.parse(watchedStr)
      return Array.isArray(w) ? w.map((s: any) => String(s)) : ASTRO_EMPTY_WATCHED
    } catch {
      return ASTRO_EMPTY_WATCHED
    }
  }, [watchedStr])
  useEffect(() => {
    try {
      const initRaw = localStorage.getItem(ASTRO_WATCHED_KEY)
      const init = initRaw ? JSON.parse(initRaw) : []
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
        next[key] = url
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
      const prevRaw = localStorage.getItem(ASTRO_WATCHED_KEY) || "[]"
      const prevArr = JSON.parse(prevRaw)
      const prev = Array.isArray(prevArr) ? prevArr.map((s: any) => String(s)) : ASTRO_EMPTY_WATCHED
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem(ASTRO_WATCHED_KEY, JSON.stringify(next))
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
            <path d="M2.37549 0.312988L0.641113 2.47421L2.37549 4.63426" stroke="white" strokeWidth="1" />
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
            src="/woman.png"
            alt="woman"
            style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", alignSelf: "flex-end", zIndex: 1 }}
          />
          <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, background: "linear-gradient(90deg, #F4D990 0%, #CB9B3D 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textTransform: "uppercase", textAlign: "left", lineHeight: "110%", marginLeft: "-10px", zIndex: 1 }}>
            ЗАКРЫТЫЙ КЛУБ<br />ПРЕДНАЗНАЧЕНИЕ
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
                        style={{ fontSize: "17px", fontWeight: 400, lineHeight: "120%", wordBreak: "break-word", marginLeft: "12px" }}
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
                          <path d="M7.00964 4.047L0 8.09402V0L7.00964 4.047Z" fill="#0d1819" />
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
          <a
            href="https://t.me/+Fm-0h0ZFMxYwNGJi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block" }}
          >
            <img
              src="/куратору2.png"
              alt="написать куратору"
              style={{ width: "100%", height: "auto", borderRadius: "5px", display: "block" }}
            />
          </a>
          
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", paddingBottom: "75px" }}>
          <img src="/плашкаснизу.png" alt="" style={{ width: "107px", height: "21px", objectFit: "contain" }} />
        </div>
      </div>
      <BottomBar />
    </div>
  )
}
