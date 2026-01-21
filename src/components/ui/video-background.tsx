"use client"

import { useEffect, useRef } from "react"

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-black select-none pointer-events-none">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-80 transition-opacity duration-1000 ease-in-out"
      >
        <source src="/движ.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay for better text readability and smoothing */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  )
}
