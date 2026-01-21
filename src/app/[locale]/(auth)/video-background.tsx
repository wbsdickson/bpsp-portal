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
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster="/login-bg.jpg"
        className="rounded-4xl absolute inset-0 h-full w-full object-cover p-2"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
