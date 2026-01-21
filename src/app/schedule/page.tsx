"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function SchedulePage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[40px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 40px)" }}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-[343px] mx-auto mb-0"
        >
          <nav className="w-full flex justify-start mb-6">
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

          {/* Header / Title */}
          <div className="font-libertinus mb-6"
            style={{
              fontWeight: 400,
              fontSize: "36px",
              lineHeight: "95%",
              textTransform: "uppercase",
              background: "linear-gradient(90deg, #f4d990 0%, #cb9b3d 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            РАСПИСАНИЕ
          </div>

          {/* Images */}
          <div className="flex flex-col gap-4">
            <div
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                  padding: "10px"
                }}
            >
                <img src="/1расп.jpg" alt="Расписание 1" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />
            </div>
             <div
                style={{
                  width: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)",
                   padding: "10px"
                }}
            >
                <img src="/2расп.jpg" alt="Расписание 2" style={{ width: "100%", height: "auto", borderRadius: "10px" }} />
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
