"use client"
import Link from "next/link"
import { BottomBar } from "../../components/ui/bottom-bar"

export default function LessonsPage() {
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
          <div
            className="font-libertinus"
            style={{
              fontSize: "17px",
              fontWeight: 400,
              background: "linear-gradient(90deg, #F4D990 0%, #CB9B3D 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              textAlign: "left",
              lineHeight: "110%",
              marginLeft: "-10px",
              zIndex: 1,
            }}
          >
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
              Уроки
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
            <p>
              Здесь собраны уроки с культовых обучений Института – «Квантовый скачок», «Чит-код денег», «Свободная женщина»,
              «Марафон Желаний» и уникальные эфиры, которые проводятся Анной и кураторами для клуба.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[343px] mt-4">
        <ul className="space-y-2">
          {[
            "Урок 1. «Какие качества нужно проявлять, чтобы прийти к успеху и перестать стоять на одном месте?»",
            "Урок 2. «Какая сфера жизни изменится на 180 градусов в 2026?»",
            "Урок 3. «Как преодолеть финансовый потолок?»",
            "Урок 4. «Большие деньги в астропсихологии: как найти ключ»",
          ].map((t, idx) => (
            <li key={idx}>
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
                  minHeight: "58px",
                  borderRadius: "20px",
                }}
                onClick={(e) => e.preventDefault()}
              >
                <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", alignItems: "center", columnGap: 12 }}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="#D9D9D9" />
                    <circle cx="12.5483" cy="12.5483" r="12.5483" fill="url(#paint0_linear_280_563)" />
                    <path d="M17.2187 12.5481L10.2091 16.5951L10.2091 8.50108L17.2187 12.5481Z" fill="#0D1739" />
                    <defs>
                      <linearGradient id="paint0_linear_280_563" x1="0" y1="12.5483" x2="25.0967" y2="12.5483" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F4D990" />
                        <stop offset="1" stopColor="#CB9B3D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, lineHeight: "120%", wordBreak: "break-word" }}>
                    {t}
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 12,
                    color: "#fff",
                    fontFamily: "var(--font-family)",
                    fontWeight: 400,
                    fontSize: 10,
                    lineHeight: "130%",
                    opacity: 0.8,
                  }}
                >
                  6:33
                </div>
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", paddingBottom: "75px" }}>
          <img src="/плашкаснизу.png" alt="" style={{ width: "107px", height: "21px", objectFit: "contain" }} />
        </div>
      </div>
      <BottomBar />
    </div>
  )
}
