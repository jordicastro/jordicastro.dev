"use client"

import { useScreenMask } from "@/hooks/useScreenMask";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const ScreenMask = () => {
  const scope = useRef<HTMLDivElement>(null);
  const isVisible = useScreenMask((state) => state.isVisible);
  const duration = useScreenMask((state) => state.duration);

  useGSAP(() => {
    const mask = scope.current;
    if (!mask) return;

    gsap.killTweensOf(mask);
    gsap.to(mask, {
      autoAlpha: isVisible ? 1 : 0,
      duration,
      ease: "power2.out",
    });
  }, { scope, dependencies: [isVisible, duration] });

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[55] bg-bg-primary/75 pointer-events-none backdrop-brightness-75"
      style={{ opacity: 0, visibility: "hidden" }}
      aria-hidden="true"
    />
  )
}

export default ScreenMask