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
    <div className="relative min-h-screen w-full flex items-start justify-center app-stars pt-5 pb-[80px]">
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="max-w-4xl mx-auto">
          <div className="mx-auto mt-5 mb-6 w-[342px] h-[127px] rounded-[20px]" style={{ background: "linear-gradient(180deg, #08102d 0%, #1a285b 100%)" }}>
            <div className="flex h-full items-center justify-between px-3">
              <Image src="/assets/person.png" alt="person" width={110} height={120} />
              <div className="flex flex-col items-end gap-2">
                <Image src="/assets/institute-logo.png" alt="logo" width={172} height={34} />
                <Image src="/assets/special-offer.png" alt="offer" width={180} height={41} />
              </div>
            </div>
          </div>
          <div className="mt-[30px] flex justify-center">
            <Image
              src="/assets/school-logo.png"
              alt="school logo"
              width={80}
              height={82}
              className="w-[79px] h-[81px]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}