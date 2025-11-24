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
            <rect x="22.9453" y="7.63574" width="110.389" height="120.333" rx="6" fill="#0B173D" />
            <rect x="145.062" y="66.0885" width="163.938" height="41.1548" rx="4.43713" fill="#92764D" />
            <rect x="128.883" y="66.0884" width="40.9453" height="40.9453" rx="4" fill="#1A285B" />
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
        </motion.div>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="max-w-[343px] mx-auto mb-0">
          <svg width="343" height="418" viewBox="0 0 343 418" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08102d" />
                <stop offset="100%" stopColor="#1a285b" />
              </linearGradient>
            </defs>
            <rect y="0" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
            <rect y="145.168" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
            <rect y="290.336" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
            <rect x="180.023" y="0" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
            <rect x="180.023" y="145.168" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
            <rect x="180.023" y="290.336" width="162.906" height="127.441" rx="20" fill="url(#grad)" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}