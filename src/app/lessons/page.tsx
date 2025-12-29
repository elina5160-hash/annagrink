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
      <BottomBar />
    </div>
  )
}
