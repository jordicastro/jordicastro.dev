"use client"

import { StoryThumbnailProps } from "@/types/types"
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { RunningLogo } from "@/components/svgs/svgs";
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";

gsap.registerPlugin(useGSAP);

const RunningThumbnail = ({ shouldPlayThumbnail, isHovered }: StoryThumbnailProps) => {
  const { resolvedTheme } = useTheme();
  const [preferTransparentWebm, setPreferTransparentWebm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldPlayThumbnailRef = useRef(shouldPlayThumbnail);
  const isHoveredRef = useRef(isHovered);
  const scopeRef = useRef<HTMLDivElement>(null);
  const shouldShowAnimation = Boolean(shouldPlayThumbnail && isHovered);
  const videoSrc = resolvedTheme === "dark"
    ? "/videos/stories/running-animation-dark.mp4"
    : "/videos/stories/running-animation-light.mp4";
  const transitionTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafariBrowser = /Safari/i.test(userAgent) && !/Chrome|Chromium|CriOS|Edg|Android/i.test(userAgent);

    setPreferTransparentWebm(!isSafariBrowser);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    shouldPlayThumbnailRef.current = shouldPlayThumbnail;
    isHoveredRef.current = isHovered;

    if (!video) return;

    if (shouldShowAnimation) {
      void video.play().catch(() => {
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [shouldShowAnimation, isHovered, shouldPlayThumbnail]);

  useGSAP(
    () => {
      const video = videoRef.current;
      if (!video) return;


      const runningLogo = gsap.utils.toArray<HTMLElement>(".running-logo", scopeRef.current)[0];
      const runningAnimation = gsap.utils.toArray<HTMLElement>(".running-animation", scopeRef.current)[0];
      if (!runningLogo || !runningAnimation) return;

      transitionTlRef.current = gsap.timeline({ paused: true })
      .fromTo(runningLogo, {
        autoAlpha: 1,
        scale: 1,
      }, {
        autoAlpha: 0,
        scale: 1,
        duration: 0.2,
        ease: "power1.in",
      })
      .fromTo(runningAnimation, {
        autoAlpha: 0,
        scale: 1,
      }, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.2,
        ease: "power1.out",
      },"<")


      if (shouldShowAnimation) {
        transitionTlRef.current.play();
      } else {
        // let the animation play through its cycle before reversing, to avoid cutting it off abruptly if the user quickly hovers on and off
        transitionTlRef.current.reverse();
      }

      return () => {
        transitionTlRef.current?.kill();
        transitionTlRef.current = null;
      }
    }, 
    { scope: scopeRef, dependencies: [shouldShowAnimation] }
);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (!shouldPlayThumbnailRef.current || !isHoveredRef.current) return;

      void video.play().catch(() => {
      });
    };

    video.addEventListener("loadeddata", handleLoadedData);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, []);

  return (
    <div ref={scopeRef} className="running-thumbnail relative w-full h-full flex-center pb-5">
      <RunningLogo />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        loop
        key={`${resolvedTheme}-${preferTransparentWebm ? "webm" : "mp4"}`}
        className={cn("absolute running-animation invisible opacity-0 w-20 h-20")}
      >
        {preferTransparentWebm && (
          <source src="/videos/stories/running-animation.webm" type="video/webm; codecs=vp9" />
        )}
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  )
}

export default RunningThumbnail