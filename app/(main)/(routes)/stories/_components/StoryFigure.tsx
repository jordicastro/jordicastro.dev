"use client"

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useScreenMask } from "@/hooks/useScreenMask";

gsap.registerPlugin(useGSAP);

interface StoryFigureProps {
    src: string;
    alt: string;
    component?: React.ComponentType;
    className?: string;
    desc?: string;
    scaleMultiplier?: number; // optional prop to customize the scale multiplier
}

const StoryFigure = ({ src, alt, component: Component, className, desc, scaleMultiplier}: StoryFigureProps) => {
    const scope = useRef<HTMLDivElement>(null);
    const showMask = useScreenMask((state) => state.showMask);
    const hideMask = useScreenMask((state) => state.hideMask);
    const expandTl = useRef<gsap.core.Timeline | null>(null);
    const collapseTl = useRef<gsap.core.Timeline | null>(null);
    const isExpanded = useRef(false);
    const isAnimating = useRef(false);
    const cleanupDismissListenersRef = useRef<(() => void) | null>(null);

    const expandImage = () => {
        if (!expandTl.current || isExpanded.current || isAnimating.current) return;

        expandTl.current.invalidate().restart();
    }

    const collapseImage = () => {
        if (!collapseTl.current || !isExpanded.current || isAnimating.current) return;

        collapseTl.current.invalidate().restart();
    }

    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const figureImage = gsap.utils.selector(root)(".story-figure-image-wrapper")[0] as HTMLDivElement | undefined;
            if (!figureImage) return;

            const cleanupDismissListeners = () => {
                cleanupDismissListenersRef.current?.();
                cleanupDismissListenersRef.current = null;
            }

            const getTranslateX = () => {
                const imageRect = figureImage.getBoundingClientRect();
                const imageMidX = imageRect.left + imageRect.width / 2;

                return window.innerWidth / 2 - imageMidX;
            }

            const getTranslateY = () => {
                const imageRect = figureImage.getBoundingClientRect();
                const imageMidY = imageRect.top + imageRect.height / 2;

                return window.innerHeight / 2 - imageMidY;
            }

            const getScale = () => {
                const imageRect = figureImage.getBoundingClientRect();
                const scaleX = window.innerWidth / imageRect.width;
                const scaleY = window.innerHeight / imageRect.height;
                const viewportScale = window.innerWidth >= 1024 ? 0.5 : 0.75;

                return scaleMultiplier ? Math.min(scaleX, scaleY) * scaleMultiplier : Math.min(scaleX, scaleY) * viewportScale;

            }

            const syncExpandedFigure = () => {
                if (!isExpanded.current || isAnimating.current) return;

                gsap.set(figureImage, {
                    x: getTranslateX(),
                    y: getTranslateY(),
                    scale: getScale(),
                });
            }

            const resizeDebounce = gsap.delayedCall(0.12, syncExpandedFigure).pause();
            let frameId: number | null = null;

            const requestSync = () => {
                if (frameId !== null) return;

                frameId = window.requestAnimationFrame(() => {
                    frameId = null;
                    syncExpandedFigure();
                });
            }

            const handleResize = () => {
                resizeDebounce.restart(true);
            }

            const resizeObserver = new ResizeObserver(() => {
                resizeDebounce.restart(true);
            });

            resizeObserver.observe(figureImage);
            window.addEventListener("resize", handleResize);
            window.addEventListener("scroll", requestSync, { passive: true });

            const addDismissListeners = () => {
                cleanupDismissListeners();

                const handleKeyDown = (e: KeyboardEvent) => {
                    if (e.key === "Escape") {
                        collapseImage();
                    }
                }

                const handleClickOutside = (e: MouseEvent) => {
                    if (!figureImage.contains(e.target as Node)) {
                        collapseImage();
                    }
                }

                document.addEventListener("keydown", handleKeyDown);
                document.addEventListener("click", handleClickOutside);

                cleanupDismissListenersRef.current = () => {
                    document.removeEventListener("keydown", handleKeyDown);
                    document.removeEventListener("click", handleClickOutside);
                };
            }

            expandTl.current = gsap.timeline({
                paused: true,
                defaults: { duration: 0.75, ease: "expo.out" },
                onStart: () => {
                    cleanupDismissListeners();
                    isAnimating.current = true;
                    gsap.set(figureImage, { zIndex: 60 });
                    showMask(0.3);
                },
                onComplete: () => {
                    isAnimating.current = false;
                    isExpanded.current = true;
                    addDismissListeners();
                },
            }).to(figureImage, {
                x: getTranslateX,
                y: getTranslateY,
                scale: getScale,
            });

            collapseTl.current = gsap.timeline({
                paused: true,
                defaults: { duration: 0.75, ease: "expo.out" },
                onStart: () => {
                    cleanupDismissListeners();
                    isAnimating.current = true;
                    hideMask(0.3);
                },
                onComplete: () => {
                    isAnimating.current = false;
                    isExpanded.current = false;
                    gsap.set(figureImage, { clearProps: "zIndex,transform" });
                },
            }).to(figureImage, {
                x: 0,
                y: 0,
                scale: 1,
            });

            return () => {
                cleanupDismissListeners();
                resizeObserver.disconnect();
                resizeDebounce.kill();
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("scroll", requestSync);

                if (frameId !== null) {
                    window.cancelAnimationFrame(frameId);
                }

                if (expandTl.current) {
                    expandTl.current.kill();
                    expandTl.current = null;
                }

                if (collapseTl.current) {
                    collapseTl.current.kill();
                    collapseTl.current = null;
                }

                isAnimating.current = false;
                isExpanded.current = false;
                hideMask(0);
                gsap.set(figureImage, { clearProps: "zIndex,transform" });
            }
        },
        { scope, dependencies: [] }
    )

    return (
    <div ref={scope}className={cn("story-figure w-full h-auto flex flex-col items-center justify-center gap-2 my-4 z-60", className)}>
        { Component ? (
            <Component />
        ) : (
            <div
                className="story-figure-image-wrapper w-auto h-auto cursor-pointer"
                role="button"
                onClick={expandImage}
                data-cursor="pointer"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={600}
                    className="max-w-90 h-auto lg:w-full object-contain rounded-md"
                />
            </div>
        )}
        {desc && (
            <p className="story-figure-desc text-xs text-center">
                {desc}
            </p>
        )}
    </div>
    )
}

export default StoryFigure