"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      <Image
        src="/login-bg.jpg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="/login-bg.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
