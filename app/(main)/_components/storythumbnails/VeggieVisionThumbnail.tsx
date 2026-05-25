"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from 'react';
import IPhoneWrapper from "@/components/IPhoneWrapper";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

const VeggieVisionThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const hoverBtnTlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (shouldPlayThumbnail) {
            tlRef.current?.play();
        } else {
            tlRef.current?.pause();
            tlRef.current?.seek(0);
        }
    }, [shouldPlayThumbnail])

    useEffect(() => {
        if (tlRef.current?.progress() !== 1) return; 

        if (isHovered && shouldPlayThumbnail) {
            hoverBtnTlRef.current?.play();
        } else {
            hoverBtnTlRef.current?.reverse();
        }
    }, [isHovered])

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            const iPhoneWrapper = root;
            const logo = gsap.utils.toArray<HTMLElement>(".veggievision-logo", root)[0];
            const title = gsap.utils.toArray<HTMLElement>(".veggievision-title", root)[0];
            const startBtn = gsap.utils.toArray<HTMLElement>(".veggievision-start-btn", root)[0];
            if (!iPhoneWrapper || !logo || !title || !startBtn) return;

            tlRef.current = gsap.timeline({ paused: true, defaults: { duration: 0.8 }})
            .fromTo(iPhoneWrapper, {
                autoAlpha: 0,
                scale: 0.8,
            }, {
                autoAlpha: 1,
                scale: 1,
                ease: "back.out(2)",
            })
            .fromTo([logo, title, startBtn], {
                autoAlpha: 0,
                scale: 0.9,
                y: 10,
            }, {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                ease: "power1.out",
                stagger: {
                    each: 0.2,
                    from: "start",
                }
            }, ">")

            hoverBtnTlRef.current = gsap.timeline({ paused: true})
            .to(startBtn, {
                scale: 1.1,
                ease: "power1.inOut",
                duration: 0.3,
            })

            return () => {
                tlRef.current?.kill();
                tlRef.current = null;
                hoverBtnTlRef.current?.kill();
                hoverBtnTlRef.current = null;
                gsap.set([iPhoneWrapper, logo, title, startBtn], { clearProps: "all" });
            }
        },
        { scope: scopeRef, dependencies: [], revertOnUpdate: true }
    )

    return (
        <IPhoneWrapper ref={scopeRef}>
            {/* VeggieVision Logo */}
                <Image
                    src="/images/logos/veggievision-logo.png"
                    alt="VeggieVision Logo"
                    width={125}
                    height={125}
                    className="veggievision-logo abs-x-center top-20 object-contain pointer-events-none select-none"
                />
                <Image
                    src="/images/stories/veggievision-title.png"
                    alt="VeggieVision Title"
                    width={120}
                    height={100}
                    className="veggievision-title abs-x-center top-48 object-contain pointer-events-none select-none"
                />
                <Image
                    src="/images/stories/veggievision-start-btn.png"
                    alt="VeggieVision Start Button"
                    width={100}
                    height={50}
                    className="veggievision-start-btn abs-x-center bottom-4 object-contain pointer-events-none select-none"
                />

        </IPhoneWrapper>
    )
}

export default VeggieVisionThumbnail