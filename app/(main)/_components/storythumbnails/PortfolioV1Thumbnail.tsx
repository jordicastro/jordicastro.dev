"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useRef } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const PortfolioV1Thumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const width = 120;
    const height = 120;

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            const wrappers = gsap.utils.toArray<HTMLElement>(".eye-wrapper", root);
            const pupils = wrappers.map((wrapper) => gsap.utils.toArray<HTMLElement>(".eye", wrapper)[0]);
            if (!wrappers.length || pupils.some((pupil) => !pupil)) return;

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
                    src="/images/logos/jordple-v1-eyeless.png"
                    alt="logo"
                    width={width}
                    height={height}
                    draggable={false}
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