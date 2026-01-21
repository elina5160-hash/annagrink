"use client"
import Link from "next/link"
import { useState } from "react"
import { BottomBar } from "../../components/ui/bottom-bar"
import { motion } from "framer-motion"

export default function ClubPage() {
  const [openAudience, setOpenAudience] = useState(false)
  const [openInside, setOpenInside] = useState(false)
  const [openTariff, setOpenTariff] = useState(false)

  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[110px] md:pb-[80px] lg:pb-[65px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="relative max-w-[343px] mx-auto mb-0">
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "342px", height: "127px", borderRadius: "20px", background: "linear-gradient(180deg, #08102D 0%, #1A285B 100%)" }}>
            <img src="/1d.png" alt="" style={{ position: "absolute", top: "15px", right: "15px", width: "45px", height: "auto", objectFit: "contain" }} />
            <img src="/3d.png" alt="" style={{ position: "absolute", bottom: "20px", left: "55%", width: "12px", height: "auto", objectFit: "contain" }} />
            <img src="/2d.png" alt="" style={{ position: "absolute", bottom: "20px", right: "45px", width: "18px", height: "auto", objectFit: "contain" }} />
            <img src="/woman.png" alt="woman" style={{ width: "110px", height: "120px", objectFit: "cover", objectPosition: "top", alignSelf: "flex-end", zIndex: 1 }} />
            <div className="font-libertinus" style={{ fontSize: "17px", fontWeight: 400, background: "linear-gradient(90deg, #F4D990 0%, #CB9B3D 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textTransform: "uppercase", textAlign: "left", lineHeight: "110%", marginLeft: "-10px", zIndex: 1 }}>
              Клуб<br />«Предназначение»
            </div>
          </div>
        </div>
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
                Клуб «Предназначение» – это клуб по подписке для тех, кто хочет быть в поддерживающем пространстве и&nbsp;нуждается в мягкой трансформации.
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
                      для тех, кто хочет найти свое предназначение в жизни
                    </div>
                  </div>
                  <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                    <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                      для людей, которые хотят понять, как богатеть без усилий, вернуть себе поток и начать принимать масштабные решения в жизни
                    </div>
                  </div>
                  <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                    <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                      для тех, кто хочет выйти из разрушительных родовых сценариев, не отрицая род, а занимая свое корректное место
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
                        <div style={{ marginTop: "5px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                            <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                              Ежемесячные индивидуальные разборы от астропсихологов Института
                            </div>
                          </div>
                          <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                            <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                              Ежемесячный урок с Анной Гриньковой по теме месяца
                            </div>
                          </div>
                          <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                            <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                              Психологические подкасты и разборы жизненных ситуаций
                            </div>
                          </div>
                          <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ width: "6px", height: "6px", background: "#fff", borderRadius: "9999px" }} />
                            <div style={{ fontSize: "10px", lineHeight: "130%", fontWeight: 300, textAlign: "left" }}>
                              Живое сообщество, в котором ты можешь поделиться, чем угодно и найти соратников и поддержку
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
                        <div style={{ marginTop: "5px" }}>
                          <div style={{ fontFamily: "var(--font-family)", fontWeight: 300, fontSize: "10px", lineHeight: "130%", color: "#fff", textAlign: "left" }}>
                            Для участников клуба доступны специальные цены на каждое обучение в институте (обучение астропсихологии, прогнозирование).
                          </div>
                          <div style={{ marginTop: "6px", fontFamily: "var(--font-family)", fontWeight: 300, fontSize: "10px", lineHeight: "130%", color: "#fff", textAlign: "left" }}>
                            Чтобы забрать обучение по клубному тарифу ⬇️ напишите на аккаунт по кнопке ниже и скажите, что вы из клуба
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-start" }}>
                            <Link
                              href="/support"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "21px",
                                marginBottom: "3px",
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
                                textDecoration: "none",
                              }}
                            >
                              КЛУБНЫЙ ТАРИФ
                            </Link>
                          </div>
                        </div>
                      )}
            </div>
          </div>
        </motion.div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px", paddingBottom: "75px" }}>
          <img src="/плашкаснизу.png" alt="" style={{ width: "107px", height: "21px", objectFit: "contain" }} />
        </div>
      </div>
      <BottomBar />
    </div>
  )
}