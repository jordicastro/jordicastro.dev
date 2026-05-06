"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/all";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useCursor } from '@/hooks/useCursor';

export type ToggleCursorMorphSvgHandle = {
    toggleMorphCursor: () => void;
}
// passing a forwardRef to allow the parent component to trigger the morph animation on group hover
const ToggleCursorMorphSvg = forwardRef<ToggleCursorMorphSvgHandle, { onClick?: () => void }>(function ToggleCursorMorphSvg({ onClick }, ref) {
    const scopeRef = useRef<HTMLDivElement>(null);
    const cursorMorphRef = useRef<gsap.core.Timeline | null>(null);
    const [hasHydrated, setHasHydrated] = useState(false);
    const { cursor, setCursor } = useCursor();

    gsap.registerPlugin(useGSAP, MorphSVGPlugin);

    useEffect(() => {
        setHasHydrated(useCursor.persist.hasHydrated());

        const unsubscribeHydrate = useCursor.persist.onHydrate(() => {
            setHasHydrated(false);
        });

        const unsubscribeFinishHydration = useCursor.persist.onFinishHydration(() => {
            setHasHydrated(true);
        });

        return () => {
            unsubscribeHydrate();
            unsubscribeFinishHydration();
        };
    }, []);

    const { contextSafe } = useGSAP(
        () => {
            if (!hasHydrated) return;

            const mouseNonePath = scopeRef.current?.querySelector<SVGPathElement>("#mouse-none");
            const mouseCustomPath = scopeRef.current?.querySelector<SVGPathElement>("#mouse-custom");
            if (!mouseNonePath || !mouseCustomPath) return;

            cursorMorphRef.current?.kill();

            gsap.set(mouseNonePath, { display: "none" });
            gsap.set(mouseCustomPath, { display: "block" });

            cursorMorphRef.current = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "expo.inOut", overwrite: "auto" } })
                .to(mouseCustomPath, {
                    morphSVG: {
                        shape: mouseNonePath,
                        type: "rotational",
                    },
                    onComplete: () => setCursor(true),
                    onReverseComplete: () => setCursor(false),
                });

            cursorMorphRef.current.progress(cursor ? 1 : 0).pause();
        },
        { scope: scopeRef, dependencies: [hasHydrated] }
    );

    useEffect(() => {
        if (!hasHydrated || !cursorMorphRef.current || cursorMorphRef.current.isActive()) return;

        cursorMorphRef.current.progress(cursor ? 1 : 0).pause();
    }, [cursor, hasHydrated]);

    const toggleMorphCursor = contextSafe(() => {
        if (!hasHydrated || !cursorMorphRef.current || cursorMorphRef.current.isActive()) return;

        if (cursor) {
            cursorMorphRef.current.reverse();
        }
        else {
            cursorMorphRef.current.play();
        }

        if (onClick) onClick();
    });

    useImperativeHandle(ref, () => ({
        toggleMorphCursor,
    }), [toggleMorphCursor]);

    return (
        <div ref={scopeRef} className="theme-icon-wrapper">
            <svg id="theme-morph" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path
                    id="mouse-none"
                    d="M12.586 12.586 19 19M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"
                />
                <path
                    id="mouse-custom"
                    d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                />
            </svg>
        </div>
    )
})

export default ToggleCursorMorphSvg