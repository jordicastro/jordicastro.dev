"use client";

import { useEffect } from "react";
import { useScrollMask } from "@/hooks/useScrollMask";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getNextSectionId } from "@/lib/utils";

const ScrollMask = () => {

    const { isAnimating, setIsAnimating, direction, activeSectionId, duration, setDuration } = useScrollMask();
    gsap.registerPlugin(useGSAP);

    const { contextSafe } = useGSAP( () => {
        if (isAnimating) {
            animateScrollMask();
        }
    }, [isAnimating, duration]);

    const animateScrollMask = contextSafe(
        () => {
            const mask = document.getElementById("scroll-mask") as HTMLElement | null;
            if (!mask) return;

            // calculate the next section to scroll to after mask animation
            const nextSectionId = getNextSectionId(activeSectionId, direction);
            if (!nextSectionId) {
                console.warn(`ScrollMask.tsx: No next section found for activeSectionId=${activeSectionId} and direction=${direction}`);
                setIsAnimating(false);
                return;
            }
            const el = document.getElementById(nextSectionId) as HTMLElement | null;
            if (!el) return;

            const tl = gsap.timeline({ defaults: { duration: duration, ease: "power2.inOut" }, onComplete: () => {
                setIsAnimating(false);
                duration !== 1 && setDuration(1);
            }});

            if (direction === "down") { // animate from bottom to top
                tl.fromTo(mask, 
                    { autoAlpha: 0, yPercent: 100 }, 
                    { autoAlpha: 1, yPercent: 0 }
                ).to(window, 
                    { scrollTo: { y: el, offsetY: 0 }, duration: 0.75 },
                    "-=0.25"
                ).to(mask, 
                    { autoAlpha: 0, yPercent: -100 },
                    ">"
                );
            } else { // animate from top to bottom
                tl.fromTo(mask, 
                    { autoAlpha: 0, yPercent: -100 }, 
                    { autoAlpha: 1, yPercent: 0 }
                ).to(window, 
                    { scrollTo: { y: el, offsetY: 0 }, duration: 0.75 },
                    "-=0.25"
                ).to(mask,
                    { autoAlpha: 0, yPercent: 100 },
                    ">"
                );
            }
        }
    );

    return (
        <div
            className="fixed bottom-0 px-0 pt-0 w-full h-full bg-neutral-950 opacity-50 pointer-events-none z-50"
            id="scroll-mask"
            style={{ visibility: "hidden" }}
        />
    )
}

export default ScrollMask