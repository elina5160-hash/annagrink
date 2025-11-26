"use client"
import { BottomBar } from "@/components/ui/bottom-bar"

export default function SubscriptionPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center app-stars pt-0 pb-[110px] md:pb-[80px] lg:pb-[65px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}
    >
      <BottomBar />
    </div>
  )
}
