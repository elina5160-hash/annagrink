"use client";
import { motion } from "framer-motion";
import { BottomBar } from "@/components/ui/bottom-bar";
import Image from "next/image";

 

export default function BackgroundWithBar(props: { title?: string }) {
  return (
    <>
      <BackgroundPaths {...props} />
      <BottomBar />
    </>
  );
}

export function BackgroundPaths({ title = "ИНТЕНСИВ" }: { title?: string }) {
  const words = title.split(" ");
  const isHome = title === "ДОМОЙ";
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
          <img
            src="/woman.svg"
            alt="woman"
            className="absolute z-10"
            style={{
              left: "22.9453px",
              top: "7.63574px",
              width: "110.389px",
              height: "120.333px",
              borderRadius: "6px",
            }}
          />
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
          <svg width="343" height="418" viewBox="0 0 343 418" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08102d" />
                <stop offset="100%" stopColor="#1a285b" />
              </linearGradient>
            </defs>
            <rect y="0" width="162" height="114" rx="20" fill="url(#grad)" />
            <rect x="181" y="0" width="162" height="114" rx="20" fill="url(#grad)" />
            <rect y="132" width="162" height="114" rx="20" fill="url(#grad)" />
            {!isHome && (
              <rect y="264" width="162" height="114" rx="20" fill="url(#grad)" />
            )}
            <rect x="181" y="132" width="162" height="114" rx="20" fill="url(#grad)" />
            {!isHome && (
              <rect x="181" y="264" width="162" height="114" rx="20" fill="url(#grad)" />
            )}
          </svg>
          {isHome && (
            <>
              <div
                className="absolute z-20"
                style={{
                  left: 0,
                  top: 0,
                  width: "162px",
                  height: "114px",
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
                    gap: "5px",
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
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: 0,
                  width: "162px",
                  height: "114px",
                }}
              >
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
                    gap: "5px",
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
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: 0,
                  top: "132px",
                  width: "162px",
                  height: "114px",
                }}
              >
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
                    gap: "5px",
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
              </div>
              <div
                className="absolute z-20"
                style={{
                  left: "181px",
                  top: "132px",
                  width: "162px",
                  height: "114px",
                }}
              >
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
                    gap: "5px",
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
              </div>
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
                  height: "114px",
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
                  height: "114px",
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
                  top: "132px",
                  width: "162px",
                  height: "114px",
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
                  top: "132px",
                  width: "162px",
                  height: "114px",
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
                  top: "264px",
                  width: "162px",
                  height: "114px",
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
                  top: "264px",
                  width: "162px",
                  height: "114px",
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
      </div>
    </div>
  );
}
