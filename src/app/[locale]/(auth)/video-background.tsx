"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Pause, Play } from "lucide-react";
import Image from "next/image";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoAutoPlay, setVideoAutoPlay] = useLocalStorage(
    "videoAutoPlay",
    true,
  );
  const [isPlaying, setIsPlaying] = useState(videoAutoPlay);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  useEffect(() => {
    setMount(true);
  }, []);

  useEffect(() => {
    if (mount && videoRef.current) {
      setIsPlaying(videoAutoPlay);
      if (videoAutoPlay) {
        videoRef.current.play().catch(() => {
          // Handle autoplay failure silently
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoAutoPlay, mount]);

  const toggleVideo = () => {
    if (videoRef.current) {
      const newPlayState = !isPlaying;
      if (newPlayState) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(newPlayState);
      setVideoAutoPlay(newPlayState);
    }
  };
  if (!mount) return null;

  return (
    <div className="absolute inset-0 h-full w-full">
      <Image
        src="/login-bg.jpg"
        alt="Background"
        fill
        className="rounded-4xl absolute inset-0 z-0 h-full w-full object-cover p-2"
        priority
      />
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        poster="/login-bg.jpg"
        className="rounded-4xl absolute inset-0 z-0 h-full w-full object-cover p-2 brightness-[0.45]"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0">
        <Button
          variant="ghost"
          onClick={toggleVideo}
          className="pointer-events-auto absolute bottom-6 left-6 z-50 h-10 w-10 cursor-pointer rounded-full bg-gray-600 p-0 text-white hover:bg-gray-200"
          style={{
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
