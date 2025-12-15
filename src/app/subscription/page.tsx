"use client"
import { BottomBar } from "../../components/ui/bottom-bar"
import { Suspense, useEffect, useMemo, useState } from "react"
export const dynamic = "force-dynamic"
import { useSearchParams } from "next/navigation"

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div />}>
      <SubscriptionContent />
    </Suspense>
  )
}

function SubscriptionContent() {
  const params = useSearchParams()
  const [uid, setUid] = useState<string | null>(null)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  const [nextChargeAtIso, setNextChargeAtIso] = useState<string | null>(null)

  function nowMoscow() {
    const s = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" })
    return new Date(s)
  }
  function toMoscow(dateIso: string) {
    const s = new Date(dateIso).toLocaleString("en-US", { timeZone: "Europe/Moscow" })
    return new Date(s)
  }
  function calcDays(a: Date, b: Date) {
    const ms = b.getTime() - a.getTime()
    return Math.max(0, Math.ceil(ms / 86400000))
  }

  useEffect(() => {
    const p = params
    const q = p.get("uid") || p.get("user_id")
    const n = p.get("next") || p.get("nextChargeAt")
    let id = q
    try {
      const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id
      if (!id && tg) id = String(tg)
    } catch {}
    setUid(id || null)
    if (n) {
      setNextChargeAtIso(n)
      const now = nowMoscow()
      const next = toMoscow(n)
      setDaysLeft(calcDays(now, next))
    }
  }, [params])

  useEffect(() => {
    if (!uid) return
    const url = `/api/subscription/status?uid=${encodeURIComponent(uid)}`
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (typeof j?.daysLeft === "number") setDaysLeft(j.daysLeft)
      })
      .catch(() => {})
    fetch(`/api/subscription/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: uid, nextChargeAt: nextChargeAtIso, source: "subscription-page" }),
    }).catch(() => {})
  }, [uid])

  const plural = useMemo(() => {
    const n = typeof daysLeft === "number" ? daysLeft : 0
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return "день"
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня"
    return "дней"
  }, [daysLeft])
  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[110px] md:pb-[80px] lg:pb-[65px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="relative max-w-[343px] mx-auto mb-0">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
            <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", alignSelf: "flex-end" }} />
            <img src="/Group 454.svg" alt="decor" style={{ width: "172px", height: "34px", objectFit: "contain" }} />
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                className="font-libertinus"
                style={{
                  fontWeight: 400,
                  fontSize: "36px",
                  lineHeight: "95%",
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textAlign: "left",
                }}
              >
                подписка
              </div>
              <div
                style={{
                  width: "87px",
                  height: "24px",
                  borderRadius: "150px",
                  background: "#22926b",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-family)",
                    fontWeight: 700,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textTransform: "none",
                  }}
                >
                  активна
                </span>
              </div>
            </div>
            {typeof daysLeft === "number" && (
              <div
                style={{
                  marginTop: "6px",
                  fontFamily: "var(--font-family)",
                  fontWeight: 700,
                  fontSize: "10px",
                  lineHeight: "130%",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                Осталось {daysLeft} {plural} до списания{uid ? ` · ID ${uid}` : ""}
              </div>
            )}
            <div
              style={{
                marginTop: "6px",
                fontFamily: "var(--font-family)",
                fontWeight: 400,
                fontSize: "10px",
                lineHeight: "130%",
                color: "#fff",
                textAlign: "left",
                paddingRight: "71px",
              }}
            >
              Чтобы отменить подписку, напишите отменить подписку в чат-бот по кнопке ниже
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <a
                href="#"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "21px",
                  marginBottom: "23px",
                  width: "242px",
                  height: "35px",
                  borderRadius: "5px",
                  background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                  fontFamily: "var(--font-family)",
                  fontWeight: 400,
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#48351b",
                }}
              >
                отменить подписку
              </a>
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
            <a
              href="https://docs.google.com/document/d/1ZryJ12WGbel56gGrR5QMn35TG73mSs34/edit?usp=drivesdk&ouid=110591871595540032054&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none" }}
            >
              <div
                className="font-libertinus"
                style={{
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
                пользовательское соглашение
              </div>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_43_86)" />
                <path d="M10.1995 7.85156L14.8972 12.5469L10.1995 17.2446" stroke="#091130" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_43_86" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F4D990" />
                    <stop offset="1" stopColor="#CB9B3D" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
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
            <a
              href="https://docs.google.com/document/d/1EG8f1lMqyAhsPSORcBLhi-Yl9dIkXCn4/edit?usp=drivesdk&ouid=110591871595540032054&rtpof=true&sd=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none" }}
            >
              <div
                className="font-libertinus"
                style={{
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
                политика конфиденциальности
              </div>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_43_86)" />
                <path d="M10.1995 7.85156L14.8972 12.5469L10.1995 17.2446" stroke="#091130" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_43_86" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F4D990" />
                    <stop offset="1" stopColor="#CB9B3D" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  )
}
