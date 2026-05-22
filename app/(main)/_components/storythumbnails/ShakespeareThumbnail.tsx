"use client";

import { FlourishBuilder, StoryThumbnailProps } from '@/types/types'
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import TypewriterText from '@/components/TypewriterText';
import { cn } from '@/lib/utils';

const ShakespeareThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery('(max-width: 640px)');
    const twoXl = useMediaQuery('(min-width: 1536px)');
    const fontSize = twoXl ? 30 : isMobile ? 24 : 28;
    const parentWidth = twoXl ? 390: 360;
    const quoteBuildersRef = useRef<Record<string, FlourishBuilder>>({});
    const registeredQuoteKeysRef = useRef<Set<string>>(new Set());
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const [registrationVersion, setRegistrationVersion] = useState(0);
    const shouldPlayThumbnailRef = useRef(shouldPlayThumbnail);

    const quotes = [
        "To be, or not to be, that is the question",
        "If music be the food of love, play on",
        "Some are born great, some achieve greatness",
    ]

    // kill/reset timeline while updating the registration version to force a rebuild via the useEffect
    const registerShakespeareQuoteAnimation = useCallback((key: string, build: FlourishBuilder) => {
        const currentBuild = quoteBuildersRef.current[key];
        if (currentBuild && currentBuild !== build) {
            tlRef.current?.kill();
            tlRef.current = null;
            quoteBuildersRef.current = { [key]: build };
            registeredQuoteKeysRef.current = new Set([key]);
            return;
        }

        quoteBuildersRef.current[key] = build;
        const registeredKeys = registeredQuoteKeysRef.current;
        const previousSize = registeredKeys.size;

        registeredKeys.add(key);
        if (registeredKeys.size === quotes.length && registeredKeys.size !== previousSize) {
            setRegistrationVersion((version) => version + 1);
        }
    }, [quotes.length]);

    useEffect(() => {
        shouldPlayThumbnailRef.current = shouldPlayThumbnail;
    }, [shouldPlayThumbnail])

    const resetThumbnailVisualState = useCallback((root: HTMLDivElement | null) => {
        if (!root) return;

        const typewriterLines = gsap.utils.toArray<HTMLElement>(".anim-typewriter", root);
        const shakespeareQuotes = gsap.utils.toArray<HTMLElement>(".shakespeare-quote", root);

        gsap.killTweensOf(typewriterLines, "--whiteBar");
        gsap.set(typewriterLines, { width: 0, "--whiteBar": "transparent" });
        gsap.set(shakespeareQuotes, { opacity: 0 });
    }, []);

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            const quoteAnimationKeys = quotes.map((_, index) => `shakespeare-quote-${index}`);
            if (!quoteAnimationKeys.every((key) => quoteBuildersRef.current[key])) return;
            resetThumbnailVisualState(root);

            tlRef.current = gsap.timeline({
                paused: true,
                defaults: { ease: "power2.inOut", duration: 0.5},
                onComplete: () => {
                    if (shouldPlayThumbnailRef.current) {
                        resetThumbnailVisualState(root);
                        tlRef.current?.restart();
                    }
                } 
            })
                .fromTo(root, {
                    autoAlpha: 0,
                }, {
                    autoAlpha: 1,
            });

            const resetQuoteVisualState = (quoteEl: Element) => {
                const quoteLines = gsap.utils.toArray<HTMLElement>(".anim-typewriter", quoteEl);
                gsap.killTweensOf(quoteLines, "--whiteBar");
                gsap.set(quoteLines, { width: 0, "--whiteBar": "transparent" });
            };

            quotes.forEach((quote, index) => {
                const quoteTween = quoteBuildersRef.current['shakespeare-quote-' + index]?.();
                const shakespeareQuote = root.querySelector(".shakespeare-quote-" + index);
                if (!shakespeareQuote) return;

                tlRef.current?.add(() => {
                    resetQuoteVisualState(shakespeareQuote);
                }, ">");
                tlRef.current?.to(shakespeareQuote, { opacity: 1, ease: "power2.in" }, ">")
                if (quoteTween) {
                    tlRef.current?.add(quoteTween, ">");
                    tlRef.current?.to(shakespeareQuote, { opacity: 0, ease: "power2.out" }, ">=3");
                    tlRef.current?.add(() => {
                        resetQuoteVisualState(shakespeareQuote);
                    }, ">");
                }
            })
            tlRef.current.pause(0);

            return () => {
                tlRef.current?.kill();
                tlRef.current = null;
            }

        },
        { scope: scopeRef, dependencies: [registrationVersion, fontSize], revertOnUpdate: true }
    )

    // reset and rebuild the typewriter animation and restart the timeline
    useEffect(() => {
        const root = scopeRef.current;
        const timeline = tlRef.current;
        if (!root || !timeline) return;

        if (shouldPlayThumbnail) {
            resetThumbnailVisualState(root);
            timeline.restart();
            return;
        }

        timeline.pause(0);
        resetThumbnailVisualState(root);
    }, [shouldPlayThumbnail, registrationVersion, fontSize, parentWidth, resetThumbnailVisualState]);

    return (
        <div ref={scopeRef} className="relative w-full h-full flex-center pb-5">
            {quotes.map((quote, index) => (
                <TypewriterText
                    key={index}
                    text={quote}
                    speed={0.15}
                    parentWidth={parentWidth}
                    fontSize={fontSize}
                    className={cn(
                        "shakespeare-quote absolute top-4 font-normal",
                        "shakespeare-quote-" + index,
                        isMobile ? "top-6" : "top-4",
                        // twoXl ? "border-debug-p" : "border-debug-l"
                    )}
                    animationKey={'shakespeare-quote-' + index}
                    registerAnimation={registerShakespeareQuoteAnimation}
                    lineDelay={0.1}
                />
            ))}
        </div>
    )
}

export default ShakespeareThumbnail