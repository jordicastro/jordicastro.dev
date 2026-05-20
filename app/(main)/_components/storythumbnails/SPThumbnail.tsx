"use client"

import { useEffect, useId, useRef } from "react";
import { SPLogo, SPSLogo } from "@/components/svgs/svgs";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from 'gsap/all';
import gsap from "gsap";
import { StoryThumbnailProps } from "@/types/types";

const SPThumbnail = ({ isHovered }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const gradientId = useId();
    const maskId = useId();
    const logoWidth = 72;
    const logoHeight = 52.57;
    const logoX = (126 - logoWidth) / 2;
    const logoY = (92 - logoHeight) / 2;
    const spsWidth = 28;
    const spsHeight = 26.54;
    const spsX = 88;
    const spsY = 33;
    const dividerWidth = 2;
    const dividerHeight = 24;
    const dividerCenterY = 46;
    const dividerX = 67.5;
    const dividerY = dividerCenterY - dividerHeight / 2;
    const lockupX = logoX - 30;
    const lockupY = Math.min(logoY, dividerY, spsY);
    const lockupWidth = spsX + spsWidth - lockupX;
    const lockupHeight = Math.max(logoY + logoHeight, dividerY + dividerHeight, spsY + spsHeight) - lockupY;
    const expandedThumbnailTl = useRef<gsap.core.Timeline | null>(null);

    gsap.registerPlugin(useGSAP, DrawSVGPlugin);

    useGSAP( () => {
        if (isHovered) {
            expandedThumbnailTl.current?.play();
        } else {
            expandedThumbnailTl.current?.reverse();
        }
    }, [isHovered]);

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            const baseLogo = root.querySelector(".sp-logo-base");
            const baseLogos = root.querySelectorAll(".logo-base");
            const washLayer = root.querySelector(".sp-logo-wash-layer");
            const maskLogo = root.querySelector(".sp-logo-mask-mark");
            const dividerLayer = root.querySelector(".sp-divider-layer");
            const dividerMask = root.querySelector(".sp-divider-mask");
            const spsLogoLayer = root.querySelector(".sps-logo-layer");
            const spsLogoMask = root.querySelector(".sps-logo-mask");
            const SPLogo = [baseLogo, maskLogo]; // for easier reference when setting initial styles
            const divider = [dividerLayer, dividerMask];
            const SPSLogo = [spsLogoLayer, spsLogoMask];
            const basePaths = root.querySelectorAll(".sp-logo-base path");
            const gradientEl = root.querySelector("#" + gradientId);
            if (!baseLogo || !baseLogos.length || !basePaths.length || !washLayer || !maskLogo || !gradientEl) return;
            const proxy = { angle: 0};

            gsap.set(basePaths, { drawSVG: "0%" });
            gsap.set(baseLogos, { color: "#0066FF" });
            // hide the expanded thumbnail elements
            gsap.set([divider, SPSLogo], { autoAlpha: 0});
            gsap.set(washLayer, {
                attr: {
                    x: lockupX - lockupWidth,
                    y: lockupY - lockupHeight,
                },
                opacity: 1,
            });

            const masterTl = gsap.timeline();
            const drawInLogoTl = gsap.timeline();
            const gradientWashTl = gsap.timeline();
            const gradientRotateTl = gsap.timeline({ repeat: -1, defaults: { ease: "none", duration: 6 } });

            drawInLogoTl.to(basePaths, {
                drawSVG: "100%",
                duration: 1.5,
                ease: "power2.out",
                stagger: 0.5,
            })
            .to(baseLogos, {
                color: "#A78BFA",
                duration: 3,
                ease: "power1.inOut",
            }, ">");

            gradientWashTl.to(washLayer, {
                attr: {
                    x: lockupX,
                    y: lockupY,
                },
                duration: 3,
                ease: "power2.inOut",
            });
            gradientRotateTl.to(proxy, {
                angle: 360,
                onUpdate: () => {
                    gradientEl?.setAttribute(
                        "gradientTransform",
                        `rotate(${proxy.angle}, 0.5, 0.5)`
                    );
                }
            });

            masterTl.add(drawInLogoTl)
            .add(gradientWashTl, "-=2")
            .add(gradientRotateTl, ">");

            expandedThumbnailTl.current = gsap.timeline({ paused: true })
            .to(SPLogo, {
                scale: 0.5,
                x: -5,
                transformOrigin: "left center",
                duration: 0.5,
                ease: "power1.inOut",
            })
            .to([divider, SPSLogo], {
                autoAlpha: 1,
                duration: 0.4,
                ease: "power1.inOut",
                stagger: {
                    each: 0.08,
                    from: "start",
                }
            }, "<=0.2");


            return () => {
                masterTl.kill();
                drawInLogoTl.kill();
                gradientWashTl.kill();
                gsap.set(basePaths, { clearProps: "all" });
                gsap.set(washLayer, { clearProps: "all" });
            };
        },
        { scope: scopeRef, dependencies: [] }
    )

    return (
        <div ref={scopeRef} className="relative w-full h-full flex-center pb-5">
            <svg viewBox="0 0 126 92" preserveAspectRatio="xMidYMid meet" className="w-full h-full ">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="52%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="126" height="92">
                        <rect x="0" y="0" width="126" height="92" fill="black" />
                        <svg x={logoX} y={logoY} width={logoWidth} height={logoHeight} viewBox="0 0 126 92" color="white" className="sp-logo-mask-mark">
                            <SPLogo pathOnly={true} />
                        </svg>
                        <svg x={dividerX} y={dividerY} width={dividerWidth} height={dividerHeight} viewBox={`0 0 2 ${dividerHeight}`} color="white" className="sp-divider-mask" opacity="100">
                            <rect x="0" y="0" width="2" height={dividerHeight} rx="1" fill="currentColor" />
                        </svg>
                        <svg x={spsX} y={spsY} width={spsWidth} height={spsHeight} viewBox="0 0 1551 1470" color="white" className="sps-logo-mask" opacity="100">
                            <SPSLogo pathOnly={true} />
                        </svg>
                    </mask>
                </defs>
                <svg x={logoX} y={logoY} width={logoWidth} height={logoHeight} viewBox="0 0 126 92" color="#0066FF" className="sp-logo-base logo-base">
                    <SPLogo pathOnly={true} />
                </svg>
                <svg x={dividerX} y={dividerY} width={dividerWidth} height={dividerHeight} viewBox={`0 0 2 ${dividerHeight}`} color="#A78BFA" className="sp-divider-layer logo-base" opacity="100">
                    <rect x="0" y="0" width="2" height={dividerHeight} rx="1" fill="currentColor" />
                </svg>
                <svg x={spsX} y={spsY} width={spsWidth} height={spsHeight} viewBox="0 0 1551 1470" color="#A78BFA" className="sps-logo-layer logo-base" opacity="100">
                    <SPSLogo pathOnly={true} />
                </svg>
                <rect
                    className="sp-logo-wash-layer border rounded-lg border-green-500"
                    x={lockupX - lockupWidth}
                    y={lockupY - lockupHeight}
                    width={lockupWidth}
                    height={lockupHeight}
                    fill={`url(#${gradientId})`}
                    mask={`url(#${maskId})`}
                />
            </svg>
        </div>
    )
}

export default SPThumbnail