"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const PortfolioV1Thumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const width = 120;
    const height = 120;
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (shouldPlayThumbnail) {
            tlRef.current?.play();
        } else {
            tlRef.current?.pause();
            tlRef.current?.seek(0);
        }
    }, [shouldPlayThumbnail])

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            const wrappers = gsap.utils.toArray<HTMLElement>(".eye-wrapper", root);
            const pupils = wrappers.map((wrapper) => gsap.utils.toArray<HTMLElement>(".eye", wrapper)[0]);
            const v1Logo = gsap.utils.toArray<HTMLElement>(".v1-logo", root)[0];
            if (!wrappers.length || pupils.some((pupil) => !pupil) || !v1Logo) return;

            tlRef.current = gsap.timeline({ paused: true, defaults: { duration: 0.8, ease: "back.out(1.7)" }})
            .fromTo([wrappers, v1Logo], {
                autoAlpha: 0,
                scale: 0.8,
            }, {
                autoAlpha: 1,
                scale: 1,
            }, 0.2)

            const xSetters = pupils.map((pupil) => gsap.quickTo(pupil, "x", { duration: 0.15, ease: "power2.out" }));
            const ySetters = pupils.map((pupil) => gsap.quickTo(pupil, "y", { duration: 0.15, ease: "power2.out" }));

            const resetEyes = () => {
                xSetters.forEach((setX) => setX(0));
                ySetters.forEach((setY) => setY(0));
            };

            if (!shouldPlayThumbnail) {
                resetEyes();
                return;
            }

            const onPointerMove = (event: PointerEvent) => {
                wrappers.forEach((wrapper, index) => {
                    const pupil = pupils[index];
                    if (!pupil) return;

                    const rect = wrapper.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const deltaX = event.clientX - centerX;
                    const deltaY = event.clientY - centerY;
                    const distance = Math.hypot(deltaX, deltaY) || 1;
                    const maxOffsetX = Math.max((rect.width - pupil.offsetWidth) / 2, 0);
                    const maxOffsetY = Math.max((rect.height - pupil.offsetHeight) / 2, 0);

                    xSetters[index]((deltaX / distance) * maxOffsetX);
                    ySetters[index]((deltaY / distance) * maxOffsetY);
                });
            };

            window.addEventListener("pointermove", onPointerMove);

            return () => {
                window.removeEventListener("pointermove", onPointerMove);
                resetEyes();
            };

        },
        { scope: scopeRef, dependencies: [shouldPlayThumbnail], revertOnUpdate: true }
    )

    return (
        <div ref={scopeRef} className="relative w-full h-full flex-center pb-5">
            <div className="relative w-auto h-auto">
                <Image
                    src="/images/logos/jordple_v1_eyeless.png"
                    alt="logo"
                    width={width}
                    height={height}
                    draggable={false}
                    className="v1-logo"
                />
                <Eye className="left-eye left-7" />
                <Eye className="right-eye right-7" />
             </div>
        </div>
    )
}

const Eye = ({ className }: { className: string }) => {
    return (
        <div className={cn(
            "eye-wrapper absolute top-15 flex-center w-5.75 h-5.75 overflow-hidden rounded-full",
            className
        )}>
            <div className="eye w-4 h-4 rounded-full bg-neutral-950" />
        </div>
    )
}

export default PortfolioV1Thumbnail