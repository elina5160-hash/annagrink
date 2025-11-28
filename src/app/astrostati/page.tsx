"use client"
import Link from "next/link"
import { useState } from "react"

export default function AstrostatyiPage() {
  const topics = [
    "С кем необходимо общаться в роду, чтобы расти в финансах?",
    "Что просить у мужика? Подарки адекватной женщины",
    "Жесткость или жестокость?",
    "Женщины, которые могут погубить род",
  ]
  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[,.:?]/g, "")
      .replace(/\s+/g, "-")
  }
  const [badgeSlug, setBadgeSlug] = useState<string | null>(null)
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
        <div
          style={{
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
            src="/woman.svg"
            alt="woman"
            style={{ width: "110px", height: "120px", objectFit: "cover", alignSelf: "flex-end" }}
          />
          <img
            src="/Group 454.svg"
            alt="decor"
            style={{ width: "172px", height: "34px", objectFit: "contain" }}
          />
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
          <div style={{ marginTop: "12px" }}>
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
                      setBadgeSlug(slug)
                      setTimeout(() => {
                        setBadgeSlug((s) => (s === slug ? null : s))
                      }, 1200)
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
                          setBadgeSlug(slug)
                          setTimeout(() => {
                            setBadgeSlug((s) => (s === slug ? null : s))
                          }, 1200)
                        }}
                      >
                        <path d="M1.5 4.5 L4.5 7.5 L10.5 1.5" stroke="#D9D9D9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <img src="/astrgal.svg" alt="astrgal" width={24} height={24} style={{ objectFit: "contain" }} />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
