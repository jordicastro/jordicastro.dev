"use client";
import { useCursor } from "@/hooks/useCursor";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { useResolvedSidebar } from "@/hooks/useSidebar";
import { CustomGrab, CustomHand, CustomMouse, CustomPointer } from "@/components/svgs/svgs";
import { cursorThemeCn } from "@/constants/constants";
// import { ScrollToPlugin, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(useGSAP);

type CursorVariant = "default" | "pointer" | "hand" | "grab";

const CustomCursor = () => {
    const { resolvedTheme } = useTheme();
    const { isCollapsed } = useResolvedSidebar();
    const { cursor } = useCursor();
    const fill = resolvedTheme === "light"
        ? "oklch(0.92 0.01 255 / 0.25)"
        : "oklch(0.32 0.02 255 / 0.25)";
    const scopeRef = useRef<HTMLDivElement>(null);

    const xTo = useRef<gsap.QuickToFunc | null>(null);
    const yTo = useRef<gsap.QuickToFunc | null>(null);
    const currentVariant = useRef<CursorVariant>("default");
    const visibleVariant = useRef<CursorVariant>("default");
    const x = useRef(0);
    const y = useRef(0);
    const isMouseDown = useRef(false);
    const animateCursorVariantRef = useRef<((nextVariant: CursorVariant) => void) | null>(null);

    useEffect(() => {
        if (!cursor) return;

        if (isCollapsed) {
            isMouseDown.current = false;
        }
        
        setTimeout(() => { // wait for the sidebar to 1/2 open/collapse before updating cursorVariant state, full collapse/open duration is 600ms
            animateCursorVariantRef.current?.("default");
        }, 150);
    }, [cursor, isCollapsed]);

    useGSAP(
        () => {
            if (!cursor) return;

            const customWrapper = scopeRef.current;
            if (!customWrapper) return;

            const selectWithin = gsap.utils.selector(customWrapper);
            const customMouse = selectWithin(".custom-mouse");
            const customPointer = selectWithin(".custom-pointer");
            const customHand = selectWithin(".custom-hand");
            const customGrab = selectWithin(".custom-grab");
            if (!customMouse.length || !customPointer.length || !customHand.length || !customGrab.length) return;

            const variantElements: Record<CursorVariant, gsap.TweenTarget> = {
                default: customMouse,
                pointer: customPointer,
                hand: customHand,
                grab: customGrab,
            };

            gsap.set(customWrapper, { xPercent: -25, yPercent: -25, autoAlpha: 1});
            gsap.set([customPointer, customHand, customGrab], { scale: 0, transformOrigin: "center" });
            xTo.current = gsap.quickTo(customWrapper, "x", { duration: 0.01, ease: "power1.out" });
            yTo.current = gsap.quickTo(customWrapper, "y", { duration: 0.01, ease: "power1.out" });

            const animateCursorVariant = (nextVariant: CursorVariant) => {
                if (currentVariant.current === nextVariant) return;

                const previousVariant = visibleVariant.current;
                currentVariant.current = nextVariant;
                visibleVariant.current = nextVariant;

                const tl = gsap.timeline({ defaults: { duration: 0.2, ease: "power1.out", overwrite: true } });
                const previousVariantEl = variantElements[previousVariant];
                const nextVariantEl = variantElements[nextVariant];

                tl
                    .to(previousVariantEl, { scale: 0 })
                    .to(nextVariantEl, { scale: 1, delay: nextVariant === "default" ? 0.05 : 0 }, "<");
            };

            const onMouseDown = () => { // handle "grabbing" actions
                if (currentVariant.current !== "hand") return;
                isMouseDown.current = true;
                visibleVariant.current = "grab";

                const tl = gsap.timeline({ defaults: { duration: 0.01, ease: "power1.out", overwrite: true } });
                tl
                    .to(customHand, { scale: 0 })
                    .to(customGrab, { scale: 1 }, "<");
            };

            const onMouseUp = () => { // handle release grab
                if (currentVariant.current !== "hand") return;
                isMouseDown.current = false;
                // determine whether the cursor should go back to default or hand based on what's underneath
                const variant = getCursorVariantAtPoint(x.current, y.current);
                const toVarientEl = variantElements[variant];
                const duration = variant === "hand" ? 0.01 : 0.2; 
                visibleVariant.current = variant;
                currentVariant.current = variant;

                const tl = gsap.timeline({ defaults: { duration, ease: "power1.out", overwrite: true } });
                tl
                    .to(customGrab, { scale: 0 })
                    .to(toVarientEl, { scale: 1 }, "<");
            };

            const getCursorVariantAtPoint = (clientX: number, clientY: number): CursorVariant => {
                const hoveredElement = document.elementFromPoint(clientX, clientY);
                if (!hoveredElement) return "default";

                if (hoveredElement.closest("[data-cursor='pointer']")) {
                    return "pointer";
                } else if (hoveredElement.closest("[data-cursor='hand']")) {
                    return "hand";
                }

                return "default";
            };

            animateCursorVariantRef.current = animateCursorVariant;

            const onMove = (e: MouseEvent) => {
                xTo.current?.(e.clientX);
                yTo.current?.(e.clientY);
                x.current = e.clientX;
                y.current = e.clientY;
                if (isMouseDown.current) return; // avoid changing cursor variant while dragging
                animateCursorVariant(getCursorVariantAtPoint(e.clientX, e.clientY));
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);

            return () => {
                animateCursorVariantRef.current = null;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mouseup', onMouseUp);
            }
        },
        { scope: scopeRef, dependencies: [cursor] }
    );

    return cursor ? 
        <div ref={scopeRef} className="custom-cursor-wrapper hidden md:block fixed top-0 left-0 z-99 pointer-events-none">
            <CustomMouse className={cursorThemeCn} fill={fill} />
            <CustomPointer className={cn('abs-center scale-0', cursorThemeCn)} fill={fill} />
            <CustomHand className={cn('abs-center scale-0', cursorThemeCn)} fill={fill} />
            <CustomGrab className={cn('abs-center scale-0', cursorThemeCn)} fill={fill} />
        </div>
        : null;

}



export default CustomCursor