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

  const getRankMessage = (p: number) => {
    let rank = "ТОП-100";
    if (p >= 90) rank = "ТОП-1";
    else if (p >= 75) rank = "ТОП-10";
    else if (p >= 50) rank = "ТОП-20";
    else if (p >= 25) rank = "ТОП-50";

    return (
      <>
        Вы входите в {rank} <br />
        участников
      </>
    );
  }

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
                        <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, lineHeight: "120%", wordBreak: "break-word", marginLeft: "12px" }}>
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
                <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", alignSelf: "flex-end" }} />
                <img src="/Group 454_hq.png" alt="decor" style={{ width: "172px", height: "34px", objectFit: "contain" }} />
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
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
            <img src="/1d.png" alt="" style={{ position: "absolute", top: "15px", right: "15px", width: "45px", height: "auto", objectFit: "contain" }} />
            <img src="/3d.png" alt="" style={{ position: "absolute", bottom: "20px", left: "55%", width: "12px", height: "auto", objectFit: "contain" }} />
            <img src="/2d.png" alt="" style={{ position: "absolute", bottom: "20px", right: "45px", width: "18px", height: "auto", objectFit: "contain" }} />
            <Link href="/admin" style={{ alignSelf: "flex-end", zIndex: 1 }}>
              <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", display: "block" }} />
            </Link>
            <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, background: "linear-gradient(90deg, #F4D990 0%, #CB9B3D 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textTransform: "uppercase", textAlign: "left", lineHeight: "110%", marginLeft: "-10px", zIndex: 1 }}>
              Клуб<br />«Предназначение»
            </div>
          </div>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: isHome ? "18px" : "15px" }}>
          <svg width="343" height={414} viewBox="0 0 343 414" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08102d" />
                <stop offset="100%" stopColor="#1a285b" />
              </linearGradient>
            </defs>
            <rect y={0} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect x={181} y={0} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect y={144} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect x={181} y={144} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect y={288} width={162} height={126} rx={20} fill="url(#grad)" />
            <rect x={181} y={288} width={162} height={126} rx={20} fill="url(#grad)" />
          </svg>
          {isHome && (
            <>
              <Link
                href="/astrostati"
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "288px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <svg width="51" height="39" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "20px", top: "40px", zIndex: 20 }}>
                  <g opacity="0.4">
                    <path d="M12.0169 25.2474L7.41684 22.801L2.79653 25.1967L3.70843 20.0703L0 16.4158L5.15736 15.6951L7.48779 11.0356L9.76756 15.7255L14.9147 16.5072L11.1658 20.121L12.0169 25.2474ZM7.41684 22.5573L11.7434 24.8617L10.9429 20.0195L14.4791 16.6188L9.62569 15.888L7.47765 11.4722L5.27894 15.8575L0.425552 16.5376L3.9212 19.9789L3.05995 24.8109L7.41684 22.5573Z" fill="#F4E4C3" />
                    <path d="M9.63258 11.7247L9.4502 11.6435C9.46033 11.6232 10.4837 9.23766 13.2498 6.62878C15.8031 4.22293 20.3931 1.12679 27.7897 0L27.8201 0.203026C20.4741 1.31967 15.9247 4.3955 13.3917 6.7709C10.6559 9.35947 9.64271 11.7044 9.63258 11.7247Z" fill="#F4E4C3" />
                    <path d="M12.1931 12.7103L12.0107 12.6291C12.0209 12.6088 13.0138 10.2537 16.1751 7.77675C19.0932 5.50286 24.5039 2.65035 33.7445 1.97021L33.7547 2.17324C24.5647 2.84322 19.1844 5.67543 16.2967 7.93916C13.176 10.3856 12.2033 12.69 12.1931 12.7103Z" fill="#F4E4C3" />
                    <path d="M14.5599 14.202L14.3877 14.1005C14.3978 14.0802 15.2996 12.5068 17.1741 10.8014C18.9067 9.22792 21.8451 7.22811 26.0196 6.60889L26.05 6.81191C21.9261 7.42099 19.0283 9.40049 17.3159 10.9536C15.4617 12.6286 14.5701 14.1817 14.5599 14.202Z" fill="#F4E4C3" />
                  </g>
                </svg>
                <img
                  src="/книга.png"
                  alt="книга"
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
                    left: "15px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
                <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "70px", top: "15px" }}>
                    <path d="M10.478 11.0969C7.95718 12.992 4.59055 12.3232 2.97534 9.59618C1.36013 6.86919 2.10415 3.11018 4.62498 1.21513C5.08172 0.871775 5.58347 0.604442 6.11269 0.426321L6.43247 0.323249L6.22525 0.616356C4.75218 2.63009 4.59429 5.38543 5.8268 7.46631C7.06494 9.55669 9.38395 10.45 11.5943 9.681L11.9141 9.57792L11.7068 9.87103C11.3465 10.3342 10.9348 10.7536 10.478 11.0969ZM4.73754 1.40516C2.31333 3.22758 1.59771 6.84164 3.15101 9.46412C4.70432 12.0866 7.94124 12.7293 10.3655 10.9069C10.7168 10.6428 11.0312 10.3377 11.3231 9.99471C9.1243 10.5903 6.87239 9.66024 5.64551 7.58887C4.41862 5.51749 4.51188 2.82447 5.85278 0.759036C5.45958 0.931036 5.08888 1.14104 4.73754 1.40516Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "35px", top: "55px" }}>
                    <path d="M5.76917 13.59L5.67476 13.5539C6.70793 8.35256 6.52508 7.98689 1.78489 5.78993L1.81158 5.69062C6.73856 7.19239 7.05607 7.01816 8.75952 2.07331L8.85392 2.10943C7.82076 7.31073 8.0036 7.6764 12.7438 9.87337L12.7171 9.97268C7.79013 8.47091 7.46318 8.64152 5.76917 13.59ZM2.44964 5.9895C6.39271 7.85958 6.72455 8.5232 5.89665 12.8831C7.34763 8.7616 7.94097 8.45196 12.0602 9.66657C8.11709 7.79649 7.78526 7.13287 8.61315 2.77302C7.17162 6.89809 6.57827 7.20773 2.44964 5.9895Z" fill="#F4E4C3" />
                  </svg>
                </div>
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
                    left: "15px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
              <Link
                href="/schedule"
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "144px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
                  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "35px", top: "25px" }}>
                    <path d="M5.76917 13.59L5.67476 13.5539C6.70793 8.35256 6.52508 7.98689 1.78489 5.78993L1.81158 5.69062C6.73856 7.19239 7.05607 7.01816 8.75952 2.07331L8.85392 2.10943C7.82076 7.31073 8.0036 7.6764 12.7438 9.87337L12.7171 9.97268C7.79013 8.47091 7.46318 8.64152 5.76917 13.59ZM2.44964 5.9895C6.39271 7.85958 6.72455 8.5232 5.89665 12.8831C7.34763 8.7616 7.94097 8.45196 12.0602 9.66657C8.11709 7.79649 7.78526 7.13287 8.61315 2.77302C7.17162 6.89809 6.57827 7.20773 2.44964 5.9895Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "55px", top: "55px" }}>
                    <path d="M10.478 11.0969C7.95718 12.992 4.59055 12.3232 2.97534 9.59618C1.36013 6.86919 2.10415 3.11018 4.62498 1.21513C5.08172 0.871775 5.58347 0.604442 6.11269 0.426321L6.43247 0.323249L6.22525 0.616356C4.75218 2.63009 4.59429 5.38543 5.8268 7.46631C7.06494 9.55669 9.38395 10.45 11.5943 9.681L11.9141 9.57792L11.7068 9.87103C11.3465 10.3342 10.9348 10.7536 10.478 11.0969ZM4.73754 1.40516C2.31333 3.22758 1.59771 6.84164 3.15101 9.46412C4.70432 12.0866 7.94124 12.7293 10.3655 10.9069C10.7168 10.6428 11.0312 10.3377 11.3231 9.99471C9.1243 10.5903 6.87239 9.66024 5.64551 7.58887C4.41862 5.51749 4.51188 2.82447 5.85278 0.759036C5.45958 0.931036 5.08888 1.14104 4.73754 1.40516Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "25px", top: "70px" }}>
                    <path d="M2.51782 6.68706L2.4767 6.67117C3.0227 4.06981 2.94813 3.8924 0.889891 2.90444L0.903393 2.85462C3.05614 3.49385 3.19952 3.40065 4.0375 0.912114L4.07862 0.928004C3.53261 3.52936 3.60719 3.70678 5.66542 4.69474L5.65192 4.74456C3.49917 4.10533 3.35169 4.19694 2.51782 6.68706ZM1.18039 2.98917C2.89178 3.8321 3.02713 4.15407 2.58631 6.33378C3.29854 4.25895 3.5662 4.0927 5.3667 4.60682C3.65531 3.7639 3.51997 3.44192 3.96078 1.26222C3.25267 3.33863 2.98501 3.50488 1.18039 2.98917Z" fill="#F4E4C3" />
                  </svg>
                </div>
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "15px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
              </Link>
              <Link
                href="/club"
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "144px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "20px", top: "35px" }}>
                    <path d="M10.478 11.0969C7.95718 12.992 4.59055 12.3232 2.97534 9.59618C1.36013 6.86919 2.10415 3.11018 4.62498 1.21513C5.08172 0.871775 5.58347 0.604442 6.11269 0.426321L6.43247 0.323249L6.22525 0.616356C4.75218 2.63009 4.59429 5.38543 5.8268 7.46631C7.06494 9.55669 9.38395 10.45 11.5943 9.681L11.9141 9.57792L11.7068 9.87103C11.3465 10.3342 10.9348 10.7536 10.478 11.0969ZM4.73754 1.40516C2.31333 3.22758 1.59771 6.84164 3.15101 9.46412C4.70432 12.0866 7.94124 12.7293 10.3655 10.9069C10.7168 10.6428 11.0312 10.3377 11.3231 9.99471C9.1243 10.5903 6.87239 9.66024 5.64551 7.58887C4.41862 5.51749 4.51188 2.82447 5.85278 0.759036C5.45958 0.931036 5.08888 1.14104 4.73754 1.40516Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "45px", top: "75px" }}>
                    <path d="M5.76917 13.59L5.67476 13.5539C6.70793 8.35256 6.52508 7.98689 1.78489 5.78993L1.81158 5.69062C6.73856 7.19239 7.05607 7.01816 8.75952 2.07331L8.85392 2.10943C7.82076 7.31073 8.0036 7.6764 12.7438 9.87337L12.7171 9.97268C7.79013 8.47091 7.46318 8.64152 5.76917 13.59ZM2.44964 5.9895C6.39271 7.85958 6.72455 8.5232 5.89665 12.8831C7.34763 8.7616 7.94097 8.45196 12.0602 9.66657C8.11709 7.79649 7.78526 7.13287 8.61315 2.77302C7.17162 6.89809 6.57827 7.20773 2.44964 5.9895Z" fill="#F4E4C3" />
                  </svg>
                </div>
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
                    left: "15px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
              </Link>
              <Link
                href="/lessons"
                className="absolute z-20"
                style={{
                  left: 0,
                  top: 0,
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
                  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "25px", top: "25px" }}>
                    <path opacity="0.5" d="M3.19025 0L4.82663 2.35525L7.48058 2.18592L5.98172 4.64894L6.95804 7.43521L4.38659 6.60395L2.32393 8.482L2.24143 5.51099L0 3.89463L2.5027 2.87865L3.19025 0Z" fill="#F4E4C3" />
                  </svg>
                </div>
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
                    left: "19px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
                    уроки
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </Link>
              <Link
                href="/razbory"
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "288px",
                  width: "162px",
                  height: "126px",
                  display: "block",
                }}
              >
                <div style={{ position: "absolute", left: "0px", top: "0px", width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}>
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "25px", top: "45px" }}>
                    <path d="M10.478 11.0967C7.95718 12.9917 4.59055 12.3229 2.97534 9.59594C1.36013 6.86894 2.10415 3.10994 4.62498 1.21488C5.08172 0.87153 5.58347 0.604198 6.11269 0.426077L6.43247 0.323005L6.22525 0.616112C4.75218 2.62985 4.59429 5.38518 5.8268 7.46606C7.06494 9.55644 9.38395 10.4498 11.5943 9.68075L11.9141 9.57768L11.7068 9.87079C11.3465 10.334 10.9348 10.7533 10.478 11.0967ZM4.73754 1.40492C2.31333 3.22734 1.59771 6.8414 3.15101 9.46388C4.70432 12.0864 7.94124 12.7291 10.3655 10.9066C10.7168 10.6425 11.0312 10.3375 11.3231 9.99446C9.1243 10.59 6.87239 9.66 5.64551 7.58862C4.41862 5.51725 4.51188 2.82422 5.85278 0.758792C5.45958 0.930792 5.08888 1.1408 4.73754 1.40492Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="22" height="24" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "65px", top: "15px" }}>
                    <path d="M5.76917 13.59L5.67476 13.5539C6.70793 8.35256 6.52508 7.98689 1.78489 5.78993L1.81158 5.69062C6.73856 7.19239 7.05607 7.01816 8.75952 2.07331L8.85392 2.10943C7.82076 7.31073 8.0036 7.6764 12.7438 9.87337L12.7171 9.97268C7.79013 8.47091 7.46318 8.64152 5.76917 13.59ZM2.44964 5.9895C6.39271 7.85958 6.72455 8.5232 5.89665 12.8831C7.34763 8.7616 7.94097 8.45196 12.0602 9.66657C8.11709 7.79649 7.78526 7.13287 8.61315 2.77302C7.17162 6.89809 6.57827 7.20773 2.44964 5.9895Z" fill="#F4E4C3" />
                  </svg>
                  <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", left: "45px", top: "30px" }}>
                    <path d="M2.51782 6.68706L2.4767 6.67117C3.0227 4.06981 2.94813 3.8924 0.889891 2.90444L0.903393 2.85462C3.05614 3.49385 3.19952 3.40065 4.0375 0.912114L4.07862 0.928004C3.53261 3.52936 3.60719 3.70678 5.66542 4.69474L5.65192 4.74456C3.49917 4.10533 3.35169 4.19694 2.51782 6.68706ZM1.18039 2.98917C2.89178 3.8321 3.02713 4.15407 2.58631 6.33378C3.29854 4.25895 3.5662 4.0927 5.3667 4.60682C3.65531 3.7639 3.51997 3.44192 3.96078 1.26222C3.25267 3.33863 2.98501 3.50488 1.18039 2.98917Z" fill="#F4E4C3" />
                  </svg>
                </div>
                <img
                  src="/планета.png"
                  alt="планета"
                  width="82"
                  height="82"
                  className="absolute z-20"
                  style={{
                    right: "8px",
                    top: "22px",
                    width: "81px",
                    height: "81px",
                    opacity: 0.7,
                  }}
                />
                <div
                  className="font-libertinus"
                  style={{
                    position: "absolute",
                    left: "19px",
                    bottom: "18px",
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
                    разборы
                  </span>
                  <img src="/Vector%2027.svg" alt="arrow" width="18" height="12" style={{ width: "18px", height: "12px" }} />
                </div>
              </Link>
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
                    left: "19px",
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
        <div className="relative max-w-[358px] mx-auto" style={{ marginTop: "13px" }}>
          <a href="https://t.me/anna_grinkovaa" target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
            <img src="/плашкадл.png" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
          </a>
        </div>
        {isHome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative max-w-[343px] mx-auto mb-0" style={{ marginTop: "13px" }}>
            <svg width="342" height="160" viewBox="0 0 342 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dyn_grad" x1="171" y1="160" x2="171" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#08102d" />
                  <stop offset="100%" stopColor="#1a285b" />
                </linearGradient>
              </defs>
              <rect width="342" height="160" rx="20" fill="url(#dyn_grad)" />
            </svg>
            <div
              className="absolute z-20"
              style={{
                left: 0,
                top: 0,
                width: "342px",
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start", maxWidth: "160px" }}>
                <div
                  className="font-libertinus"
                  style={{
                    fontWeight: 400,
                    fontSize: "17px",
                    lineHeight: "95%",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textAlign: "left",
                  }}
                >
                  Личная динамика
                </div>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "11px",
                  lineHeight: "120%",
                  color: "#fff",
                  textAlign: "left",
                }}>
                  {getRankMessage(percent)}
                </div>
              </div>
              <div style={{ position: "relative", width: "120px", height: "120px", borderRadius: "100%" }}>
                <svg width="120" height="120" viewBox="0 0 149 149" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                  <defs>
                    <linearGradient id="dyn_ring_gold" x1="0" y1="74.5" x2="149" y2="74.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F4D990" />
                      <stop offset="1" stopColor="#CB9B3D" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="74.5"
                    cy="74.5"
                    r="64"
                    stroke="#1A285B"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="74.5"
                    cy="74.5"
                    r="64"
                    stroke="url(#dyn_ring_gold)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(percent / 100) * (2 * Math.PI * 64)} ${(2 * Math.PI * 64)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 74.5 74.5)"
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: "Select, sans-serif", fontWeight: 400, fontSize: "28px", lineHeight: "95%", textTransform: "uppercase", color: "#d3b589" }}>{percent}%</div>
                  <div style={{ opacity: 0.6, fontFamily: "var(--second-family)", fontWeight: 400, fontSize: "10px", lineHeight: "130%", color: "#d3b589", textTransform: "none", textAlign: "center" }}>пройденной<br />информации</div>
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
        {isHome && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", paddingBottom: "75px" }}>
            <img src="/плашкаснизу.png" alt="" style={{ width: "107px", height: "21px", objectFit: "contain" }} />
          </div>
        )}
      </div>
    </div>
  );
}
