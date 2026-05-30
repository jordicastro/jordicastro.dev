"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/all";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Car, LicensePlate } from "@/components/svgs/svgs";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

const LicensePlateThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scope = useRef<HTMLDivElement>(null);
    const fadeInTl = useRef<gsap.core.Timeline | null>(null);
    const hoverTl = useRef<gsap.core.Timeline | null>(null);
    const scrambleTl = useRef<gsap.core.Timeline | null>(null);
    const bgText = "License Plate Recognition is a form of comput er vision where a model is trained to classify and read the characters on a license plate. I trained a robust model using augmentation techniques that can handle various conditions such as different angles, lighting, and occlusions. this model achieved high accuracy and realtime performance, making it suitable for applications like traffic monitoring and parking"

    useEffect(() => {
        if (shouldPlayThumbnail) {
            fadeInTl.current?.play();
        } else {
            fadeInTl.current?.pause(0);
        }
    }, [shouldPlayThumbnail])
    useEffect(() => {
        if (isHovered && fadeInTl.current?.progress() === 1) {
            hoverTl.current?.play();
            scrambleTl.current?.play(0);
        } else {
            hoverTl.current?.reverse();
            scrambleTl.current?.pause();
            gsap.delayedCall(0.5, () => { // delayed Calls prevent state leaks
                scrambleTl.current?.seek(0);
            })
        }
    }, [isHovered])

    // timeline animations 
    useGSAP(() => {
        if (!scope.current) return;

        const car = gsap.utils.selector(scope.current)(".car");
        const licensePlate = gsap.utils.selector(scope.current)(".license-plate");
        const bgText = gsap.utils.selector(scope.current)(".bg-text");

        if (!car || !licensePlate || !bgText) return;

        gsap.set([car, licensePlate, bgText], { autoAlpha: 0 });

        fadeInTl.current = gsap.timeline({ paused: true })
        .fromTo(car, {
            autoAlpha: 0,
            scale: 1.2,
        }, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out",
        }, 0.45);

        hoverTl.current = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 0.4 } })
        .fromTo(licensePlate, {
            autoAlpha: 0,
            scale: 1.2,
        }, {
            autoAlpha: 1,
            scale: 1,
        })
        .fromTo(bgText, {
            autoAlpha: 0
        }, {
            autoAlpha: 1,
        }, "<");

        scrambleTl.current = gsap.timeline({ paused: true })
        .to(bgText, {
            scrambleText: {
                text: bgText[0].textContent,
                chars: "upperAndLowerCase",
                revealDelay: Infinity,
                speed: 0.4,
                delimiter: " ",
                rightToLeft: false,
            },
            duration: Infinity,
            ease: "none",
            overwrite: "auto",
        })

        return () => {
            fadeInTl.current?.kill();
            hoverTl.current?.kill();
            scrambleTl.current?.kill();
        }

    }, {scope, dependencies: []})

    // cursor mask quickTo
    useGSAP(
        () => {
            if (!scope.current) return;

            const element = scope.current;
            const storyContainer = element.closest(".story-card") as HTMLElement | null;
            const cursorMask = element.querySelector(".cursor-mask-layer") as HTMLElement | null;

            if (!storyContainer || !cursorMask) return;

            const HALF_W = element.clientWidth / 2;
            const HALF_H = element.clientHeight / 2;
            const MASK_RADIUS_X = 34;
            const MASK_RADIUS_Y = 24;
            const MAX_OFFSET_X = Math.max(0, HALF_W - MASK_RADIUS_X);
            const MAX_OFFSET_Y = Math.max(0, HALF_H - MASK_RADIUS_Y);
            const clampX = gsap.utils.clamp(-MAX_OFFSET_X, MAX_OFFSET_X);
            const clampY = gsap.utils.clamp(-MAX_OFFSET_Y, MAX_OFFSET_Y);
            const maskXTo = gsap.quickTo(cursorMask, "x", { duration: 0.2, ease: "power2.out" });
            const maskYTo = gsap.quickTo(cursorMask, "y", { duration: 0.2, ease: "power2.out" });

            gsap.set(cursorMask, { x: 0, y: 0 });
            
            const onPointerMove = (e: PointerEvent) => {
                const rect = element.getBoundingClientRect();
                const x = clampX(e.clientX - rect.left - HALF_W);
                const y = clampY(e.clientY - rect.top - HALF_H);

                maskXTo(x);
                maskYTo(y);
            }

            const onPointerLeave = () => {
                gsap.delayedCall(0.5, () => {
                    maskXTo(0);
                    maskYTo(0);
                })
            }


            storyContainer.addEventListener("pointermove", onPointerMove);
            storyContainer.addEventListener("pointerleave", onPointerLeave);

            return () => {
                storyContainer.removeEventListener("pointermove", onPointerMove);
                storyContainer.removeEventListener("pointerleave", onPointerLeave);
            }
        },
        { scope, dependencies: [isHovered] }
    )


    return (
        <div ref={scope} className="relative w-full h-full flex-center pb-5 p-0">
            {/* oval mask */}
            <div
                className="oval-mask-layer pointer-events-none absolute inset-0 overflow-hidden"
                style={{
                    WebkitClipPath: "ellipse(48% 100% at 50% 50%)",
                    clipPath: "ellipse(48% 100% at 50% 50%)",
                }}
            >
                <div
                    className="cursor-mask-layer pointer-events-none absolute inset-0"
                    style={{
                        WebkitMaskImage: "radial-gradient(circle 2rem at 50% 50%, black 99%, transparent 100%)",
                        maskImage: "radial-gradient(circle 2rem at 50% 50%, black 99%, transparent 100%)",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                    }}
                >
                    <p className={cn("bg-text w-full break-all px-1 text-text-tertiary/90 text-xl font-medium leading-6")}>
                        {bgText}
                    </p>
                </div>
            </div>
            <div className="w-36 h-36 flex-center rounded-full bg-bg-primary z-10">
                <Car className="z-20" />
                <LicensePlate className="abs-center z-20" />
            </div>
        </div>
    )
}

export default LicensePlateThumbnail