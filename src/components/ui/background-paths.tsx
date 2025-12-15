"use client";
import { motion } from "framer-motion";
import { BottomBar } from "./bottom-bar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

 

export default function BackgroundWithBar(props: { title?: string }) {
  return (
    <>
      <BackgroundPaths {...props} />
      <BottomBar />
    </>
  );
}

export function BackgroundPaths({ title = "ИНТЕНСИВ" }: { title?: string }) {
  const words = title.split(" ")
  const isHome = title === "ДОМОЙ";
  const isSupport = title === "ПОДДЕРЖКА";
  const isClub = title === "О КЛУБЕ";
  const [hiddenBanners, setHiddenBanners] = useState<string[]>([])
  const [homeCategories, setHomeCategories] = useState<Array<{ title: string; iconSrc?: string; href?: string }>>([])
  const [openAudience, setOpenAudience] = useState(false)
  const [openInside, setOpenInside] = useState(false)
  const [openTariff, setOpenTariff] = useState(false)
  const [podcastsWatched, setPodcastsWatched] = useState<string[]>([])
  const [astrostatiWatched, setAstrostatiWatched] = useState<string[]>([])
  const [podcastsTotal, setPodcastsTotal] = useState<number>(0)
  const [astrostatiTotal, setAstrostatiTotal] = useState<number>(0)
  useEffect(() => {
    if (!isHome) return
    const readTotalsAndWatched = () => {
      try {
        const p = JSON.parse(localStorage.getItem("podcasts:watched") || "[]")
        if (Array.isArray(p)) setPodcastsWatched(p)
      } catch {}
      try {
        const a = JSON.parse(localStorage.getItem("astrostati:watched") || "[]")
        if (Array.isArray(a)) setAstrostatiWatched(a)
      } catch {}
      try {
        const pt = parseInt(localStorage.getItem("podcasts:total") || "0", 10)
        if (!isNaN(pt) && pt > 0) setPodcastsTotal(pt)
      } catch {}
      try {
        const at = parseInt(localStorage.getItem("astrostati:total") || "0", 10)
        if (!isNaN(at) && at > 0) setAstrostatiTotal(at)
      } catch {}
    }
    readTotalsAndWatched()
    const onPodcasts = () => readTotalsAndWatched()
    const onAstrostati = () => readTotalsAndWatched()
    try {
      window.addEventListener("podcasts:watched-change", onPodcasts as EventListener)
      window.addEventListener("astrostati:watched-change", onAstrostati as EventListener)
    } catch {}
    return () => {
      try {
        window.removeEventListener("podcasts:watched-change", onPodcasts as EventListener)
        window.removeEventListener("astrostati:watched-change", onAstrostati as EventListener)
      } catch {}
    }
  }, [isHome])
  useEffect(() => {
    try {
      const hb = JSON.parse(localStorage.getItem("home:banners:hidden") || "[]")
      if (Array.isArray(hb)) setHiddenBanners(hb)
    } catch {}
    try {
      const hc = JSON.parse(localStorage.getItem("home:categories") || "[]")
      if (Array.isArray(hc)) setHomeCategories(hc)
    } catch {}
    const onBanners = () => {
      try {
        const hb = JSON.parse(localStorage.getItem("home:banners:hidden") || "[]")
        if (Array.isArray(hb)) setHiddenBanners(hb)
      } catch {}
    }
    const onCategories = () => {
      try {
        const hc = JSON.parse(localStorage.getItem("home:categories") || "[]")
        if (Array.isArray(hc)) setHomeCategories(hc)
      } catch {}
    }
    try {
      window.addEventListener("home:banners-change", onBanners as EventListener)
      window.addEventListener("home:categories-change", onCategories as EventListener)
    } catch {}
    return () => {
      try {
        window.removeEventListener("home:banners-change", onBanners as EventListener)
        window.removeEventListener("home:categories-change", onCategories as EventListener)
      } catch {}
    }
  }, [])
  const percent = useMemo(() => {
    const totalWatched = podcastsWatched.length + astrostatiWatched.length
    const totalItems = podcastsTotal + astrostatiTotal
    if (!totalItems) return 0
    const p = Math.min(100, Math.max(0, Math.round((totalWatched / totalItems) * 100)))
    return p
  }, [podcastsWatched, astrostatiWatched, podcastsTotal, astrostatiTotal])
  if (isSupport) {
    return (
      <div
        className="relative min-h-screen w-full flex items-center justify-center app-stars pt-0 pb-[110px] md:pb-[80px] lg:pb-[65px]"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
      >
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: 0 }}>
            <svg width="343" height="114" viewBox="0 0 343 114" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="support_grad_only" x1="171.5" y1="0" x2="171.5" y2="114" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#08102D" />
                  <stop offset="1" stopColor="#1A285B" />
                </linearGradient>
              </defs>
              <rect width="343" height="114" rx="20" fill="url(#support_grad_only)" />
            </svg>
            <a
              href="https://t.me/Levi_Antonina"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute z-20"
              style={{
                left: 0,
                top: 0,
                width: "343px",
                height: "114px",
                display: "block",
                padding: "16px",
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
              <div className="flex items-center justify-between w-full h-full">
                <div
                  className="font-libertinus"
                  style={{
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Поддержка
                </div>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" stroke="#CB9B3D" strokeWidth="2" />
                  <path d="M12 18l4 4 8-8" stroke="#CB9B3D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          {isHome && homeCategories.length > 0 && (
            <div className="w-full max-w-[343px]" style={{ marginTop: "18px" }}>
              <ul className="space-y-2">
                {homeCategories.map((c, idx) => (
                  <li key={`${c.title}-${idx}`}>
                    <a
                      href={c.href || "#"}
                      target={c.href ? "_blank" : undefined}
                      rel={c.href ? "noopener noreferrer" : undefined}
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
                    >
                      <div className="flex items-center">
                        {c.iconSrc ? (
                          <img src={c.iconSrc} alt="icon" width={24} height={24} style={{ objectFit: "contain" }} />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="11" fill="#D9D9D9" />
                            <circle cx="12" cy="12" r="11" fill="url(#home_cat_grad)" />
                            <defs>
                              <linearGradient id="home_cat_grad" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F4D990" />
                                <stop offset="1" stopColor="#CB9B3D" />
                              </linearGradient>
                            </defs>
                          </svg>
                        )}
                        <div className="font-libertinus" style={{ fontSize: "14px", lineHeight: "120%", wordBreak: "break-word", marginLeft: "12px" }}>
                          {c.title}
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          right: 16,
                          top: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: "#192656",
                          color: "#fff",
                          fontFamily: "var(--font-family)",
                          fontWeight: 400,
                          fontSize: 9,
                          lineHeight: "130%",
                        }}
                      >
                        перейти
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
  if (isClub) {
    return (
      <div
        className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[110px] md:pb-[80px] lg:pb-[65px]"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
      >
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0">
            <Link href="/admin" className="block" style={{ borderRadius: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
                <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", alignSelf: "flex-end" }} />
                <img src="/Group 454.png" alt="decor" style={{ width: "172px", height: "34px", objectFit: "contain" }} />
              </div>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "18px" }}>
            <div style={{ width: "343px" }}>
              <div
                style={{
                  width: "343px",
                  borderRadius: "20px",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  padding: "16px",
                  color: "#fff",
                }}
              >
                <div className="font-libertinus"
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
                  О КЛУБЕ
                </div>
                <div
                  style={{
                    marginTop: "5px",
                    fontFamily: "var(--font-family)",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  «Секретный клуб Анны Гриньковой» – это клуб по подписке для тех, кто хочет быть в поддерживающем пространстве и&nbsp;нуждается в мягкой трансформации.
                </div>
              </div>
              <div
                style={{
                  marginTop: "15px",
                  width: "343px",
                  borderRadius: "20px",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  padding: "16px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="font-libertinus"
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
                    ДЛЯ КОГО ЭТОТ КЛУБ?
                  </div>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpenAudience((v) => !v)} style={{ cursor: "pointer" }}>
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_43_39)" />
                    <path d="M7.59375 14.1958L12.2891 9.49805L16.9868 14.1958" stroke="#091130" strokeWidth="1.25" />
                    <defs>
                      <linearGradient id="paint0_linear_43_39" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {openAudience && (
                  <div style={{ marginTop: "5px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                      <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                        Для новичков, которые только начинают погружение в астропсихологию
                      </div>
                    </div>
                    <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                      <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                        Для профессиональных астропсихологов, которые хотят находиться в поддерживающем пространстве и находить клиентов
                      </div>
                    </div>
                    <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                      <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                        Для тех, кто хочет расти и становиться лучше день за днём, находить путь к самому себе
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  width: "343px",
                  borderRadius: "20px",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  padding: "16px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="font-libertinus"
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
                    что внутри клуба?
                  </div>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpenInside((v) => !v)} style={{ cursor: "pointer" }}>
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_inside)" />
                    <path d="M7.59375 14.1958L12.2891 9.49805L16.9868 14.1958" stroke="#091130" strokeWidth="1.25" />
                    <defs>
                      <linearGradient id="paint0_linear_inside" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {openInside && (
                  <div style={{ marginTop: "5px" }} />
                )}
              </div>
              <div
                style={{
                  marginTop: "15px",
                  width: "343px",
                  borderRadius: "20px",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  padding: "16px",
                  color: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div className="font-libertinus"
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
                    клубный тариф
                  </div>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpenTariff((v) => !v)} style={{ cursor: "pointer" }}>
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_tariff)" />
                    <path d="M7.59375 14.1958L12.2891 9.49805L16.9868 14.1958" stroke="#091130" strokeWidth="1.25" />
                    <defs>
                      <linearGradient id="paint0_linear_tariff" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {openTariff && (
                  <div style={{ marginTop: "5px", fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                    клубный тариф
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[110px] md:pb-[80px] lg:pb-[65px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mt-[20px] mb-0">
          <svg width="343" height="128" viewBox="0 0 343 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="diz2_grad" x1="171.465" y1="0" x2="171.465" y2="127.969" gradientUnits="userSpaceOnUse">
                <stop stopColor="#08102D" />
                <stop offset="1" stopColor="#1A285B" />
              </linearGradient>
            </defs>
            <rect width="342.93" height="127.969" rx="20" fill="url(#diz2_grad)" />
          </svg>
          <Link
            href="/admin"
            className="absolute z-10"
            style={{
              left: "22.9453px",
              top: "7.63574px",
              width: "110.389px",
              height: "120.333px",
              display: "block",
              borderRadius: "6px",
              overflow: "hidden",
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
            <img
              src="/woman.svg"
              alt="woman"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Link>
          {hiddenBanners.includes("ikonkatx") ? null : (
            <img
              src="/ikonkatx.svg"
              alt="ikonkatx"
              className="absolute z-10"
              style={{
                right: "25px",
                top: "15px",
                width: "173px",
                height: "35px",
              }}
            />
          )}
          {hiddenBanners.includes("спецпредл") ? null : (
            <img
              src="/спецпредл.svg"
              alt="спецпредл"
              className="absolute z-10"
              style={{
                right: "25px",
                top: "64px",
                width: "189px",
                height: "70px",
              }}
            />
          )}
        </motion.div>
        {!isHome && (
          <div
            className="mx-auto z-20"
            style={{
              width: "79.88px",
              height: "81.76px",
              backgroundImage: "url('/gold gradient  3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              marginTop: "25px",
              marginBottom: "25px",
            }}
          />
        )}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: isHome ? "18px" : undefined }}>
          <svg width="343" height={isHome ? 270 : 414} viewBox={`0 0 343 ${isHome ? 270 : 414}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08102d" />
                <stop offset="100%" stopColor="#1a285b" />
              </linearGradient>
            </defs>
            <rect y={0} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect x={181} y={0} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect y={144} width={162} height={126} rx={20} fill="url(#grad)" />
            {!isHome && (
              <rect y={288} width={162} height={126} rx={20} fill="url(#grad)" />
            )}
            <rect x={181} y={144} width={162} height={126} rx={20} fill="url(#grad)" />
            {!isHome && (
              <rect x={181} y={288} width={162} height={126} rx={20} fill="url(#grad)" />
            )}
          </svg>
          {isHome && (
            <>
              <Link
                href="/astrostati"
                className="absolute z-20"
                style={{
                  left: 0,
                  top: 0,
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <img
                  src="/1пл.svg"
                  alt="2751"
                  width="82"
                  height="82"
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "17px",
                    width: "81px",
                    height: "81px",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    width: "128px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    астростатьи
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </Link>
              <Link
                href="/podcasts"
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: 0,
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <img
                  src="/mikro.svg"
                  alt="mikro"
                  width="82"
                  height="82"
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "17px",
                    width: "81px",
                    height: "81px",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    width: "128px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    подкасты
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </Link>
              <a
                href="https://t.me/c/2474417642/542"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "144px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <img
                  src="/kalendar.svg"
                  alt="kalendar"
                  width="82"
                  height="82"
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "17px",
                    width: "81px",
                    height: "81px",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    width: "128px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    расписание
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </a>
              <a
                href="https://t.me/+Fm-0h0ZFMxYwNGJi"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "144px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <img
                  src="/monet.svg"
                  alt="monet"
                  width="82"
                  height="82"
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "17px",
                    width: "81px",
                    height: "81px",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    width: "128px",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    чат
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </a>
            </>
          )}
          {!isHome && (
            <>
              <div
                className="absolute z-20"
                style={{
                  left: 0,
                  top: 0,
                  width: "162px",
                  height: "126px",
                }}
              >
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  1500
                  <br />
                  студентов
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  прошли обучение и&nbsp;успешно внедрили астропсихологию в&nbsp;свою жизнь
                </div>
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: 0,
                  width: "162px",
                  height: "126px",
                }}
              >
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  кураторы
                  <br />
                  на обучении
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  выпускники института и практикующие астропсихологи
                </div>
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "144px",
                  width: "162px",
                  height: "126px",
                }}
              >
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  синергия
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  трансформационных практик и академической психологии для максимального результата
                </div>
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "144px",
                  width: "162px",
                  height: "126px",
                }}
              >
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  институт входит в&nbsp;топ-100
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  школ на платформе getcourse
                </div>
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "288px",
                  width: "162px",
                  height: "126px",
                }}
              >
                
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  весь мир
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  у нас учатся студенты из&nbsp;России, стран СНГ, Канады, САШ, стран Европы
                </div>
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "288px",
                  width: "162px",
                  height: "126px",
                }}
              >
                
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "17px",
                    width: "150px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textAlign: "left",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  диплом
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    bottom: "18px",
                    width: "130px",
                    fontFamily: "var(--font-family, var(--font-geist-sans))",
                    fontWeight: 300,
                    fontSize: "10px",
                    lineHeight: "130%",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  астропсихолога от&nbsp;ведущего нишевого института получают выпускники
                </div>
              </div>
            </>
          )}
        </motion.div>
        {isHome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "18px" }}>
            <svg width="342" height="264" viewBox="0 0 342 264" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dyn_grad" x1="171" y1="264" x2="171" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#08102d" />
                  <stop offset="100%" stopColor="#1a285b" />
                </linearGradient>
              </defs>
              <rect width="342" height="264" rx="20" fill="url(#dyn_grad)" />
            </svg>
            <div
              className="absolute z-20"
              style={{
                left: 0,
                top: 0,
                width: "342px",
                height: "264px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "18px",
                  top: "18px",
                  fontFamily: "var(--second-family)",
                  fontWeight: 400,
                  fontSize: "17px",
                  lineHeight: "95%",
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Личная динамика
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: "72px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "149px", height: "149px", borderRadius: "100%" }}>
                  <svg width="149" height="149" viewBox="0 0 149 149" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <defs>
                      <linearGradient id="dyn_ring_gold" x1="0" y1="74.5" x2="149" y2="74.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                      <linearGradient id="dyn_ring_blue" x1="0" y1="0" x2="0" y2="149" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#08102D" />
                        <stop offset="100%" stopColor="#1A285B" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="74.5"
                      cy="74.5"
                      r="64"
                      stroke="url(#dyn_ring_gold)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(percent / 100) * (2 * Math.PI * 64)} ${(100 / 100) * (2 * Math.PI * 64)}`}
                      strokeLinecap="butt"
                      transform="rotate(-90 74.5 74.5)"
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "var(--second-family)", fontWeight: 400, fontSize: "29px", lineHeight: "95%", textTransform: "uppercase", color: "#d3b589" }}>{percent}%</div>
                    <div style={{ opacity: 0.6, fontFamily: "var(--second-family)", fontWeight: 400, fontSize: "12px", lineHeight: "130%", color: "#d3b589", textTransform: "none" }}>обучения<br />пройдено</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {isSupport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "18px" }}>
            <svg width="343" height="114" viewBox="0 0 343 114" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="support_grad" x1="171.5" y1="0" x2="171.5" y2="114" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#08102D" />
                  <stop offset="1" stopColor="#1A285B" />
                </linearGradient>
              </defs>
              <rect width="343" height="114" rx="20" fill="url(#support_grad)" />
            </svg>
            <a
              href="https://t.me/Levi_Antonina"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute z-20"
              style={{
                left: 0,
                top: 0,
                width: "343px",
                height: "114px",
                display: "block",
                padding: "16px",
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
              <div className="flex items-center justify-between w-full h-full">
                <div
                  className="font-libertinus"
                  style={{
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    background: "linear-gradient(180deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Поддержка
                </div>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" stroke="#CB9B3D" strokeWidth="2" />
                  <path d="M12 18l4 4 8-8" stroke="#CB9B3D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
