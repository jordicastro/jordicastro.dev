"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useAnonUser } from "@/hooks/useAnonUser";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const LoadingScreen = () => {
    const loadingScope = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const resolveRafRef = useRef<number | null>(null);
    const [introComplete, setIntroComplete] = useState(false);
    const { isLoading, setIsResolved } = useAnonUser();

    useEffect(() => {
        if (isLoading || !introComplete) return;

        if (resolveRafRef.current !== null) {
            cancelAnimationFrame(resolveRafRef.current);
        }

        // resolve on the next frame so the end state can paint before unmount.
        resolveRafRef.current = requestAnimationFrame(() => {
            const tl = gsap.timeline()
            .to(loadingScope.current, { autoAlpha: 0, duration: 0.2, ease: "power2.inOut" })
            .call(() => {
                setIsResolved(true);
            })
            resolveRafRef.current = null;
        });

        return () => {
            if (resolveRafRef.current !== null) {
                cancelAnimationFrame(resolveRafRef.current);
                resolveRafRef.current = null;
            }
        };
    }, [isLoading, introComplete, setIsResolved]);

    useGSAP((

        ) => {
            const root = loadingScope.current;
            if (!root) return;

            const logo = gsap.utils.selector(root)(".loading-logo")[0] as HTMLElement | null;
            const motionPath = root.querySelector(".loading-pill-motion-path") as SVGPathElement | null;
            const revealRect = root.querySelector(".loading-pill-reveal-rect") as SVGRectElement | null;
            if (!logo || !motionPath || !revealRect) return;

            setIntroComplete(false);

            gsap.set(logo, {
                motionPath: {
                    path: motionPath,
                    align: motionPath,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start: 0,
                    end: 0,
                }
            });
            gsap.set(revealRect, { attr: { width: 0 } });

            tlRef.current = gsap.timeline({ defaults: {
                duration: 0.2,
                ease: "power2.inOut"
            }, onComplete: () => {
                setIntroComplete(true);
            }})
            .to(logo, {
                motionPath: {
                    path: motionPath,
                    align: motionPath,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                    start: 0,
                    end: 1,
                },
            }, "<")
            .to(revealRect, {
                attr: { width: 176 },
            }, "<")


            return () => {
                if (resolveRafRef.current !== null) {
                    cancelAnimationFrame(resolveRafRef.current);
                    resolveRafRef.current = null;
                }
                tlRef.current?.kill();
                tlRef.current = null;
            }
        },
        { scope: loadingScope, dependencies: []}
    )

    return (
        <div ref={loadingScope} className="loading-screen w-full h-svh flex-center flex-col gap-3">
            <h4 className="title-el tracking-widest">
                Loading...
            </h4>
            <div className="relative loading-pill w-48 h-10 text-neutral-500">
                <svg
                    className="loading-pill-svg w-full h-full overflow-visible"
                    viewBox="0 0 192 40"
                    fill="none"
                    aria-hidden="true"
                >
                    <defs>
                        <clipPath id="loading-pill-reveal-clip">
                            <rect
                                className="loading-pill-reveal-rect"
                                x="8"
                                y="8"
                                width="0"
                                height="24"
                                rx="12"
                                ry="12"
                            />
                        </clipPath>
                    </defs>
                    <path
                        className="loading-pill-outline-bg"
                        d="M20 8 H172 A12 12 0 0 1 184 20 A12 12 0 0 1 172 32 H20 A12 12 0 0 1 8 20 A12 12 0 0 1 20 8 Z"
                        stroke="none"
                        fill="currentColor"
                        fillOpacity="0.35"
                        clipPath="url(#loading-pill-reveal-clip)"
                    />
                    <path
                        className="loading-pill-outline-path"
                        d="M20 8 H172 A12 12 0 0 1 184 20 A12 12 0 0 1 172 32 H20 A12 12 0 0 1 8 20 A12 12 0 0 1 20 8 Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        className="loading-pill-motion-path"
                        d="M20 20 H172"
                        fill="none"
                        stroke="none"
                    />
                </svg>
                <Logo className="loading-logo abs-y-center left-0 w-10 h-10" />
            </div>
        </div>
    )
}

export default LoadingScreen