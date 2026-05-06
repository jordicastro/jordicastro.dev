"use client";
import { useCursor } from "@/hooks/useCursor";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { useResolvedSidebar } from "@/hooks/useSidebar";
// import { ScrollToPlugin, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(useGSAP);

type CursorVariant = "default" | "pointer" | "hand" | "grab";

const CustomCursor = () => {
    const { resolvedTheme } = useTheme();
    const { isCollapsed } = useResolvedSidebar();
    const { cursor } = useCursor();
    const className = "text-neutral-800 dark:text-neutral-300";
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
        console.log('isCollapsed! or cursor mounted ', isCollapsed);

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
            <CustomMouse className={className} fill={fill} />
            <CustomPointer className={cn('abs-center scale-0', className)} fill={fill} />
            <CustomHand className={cn('abs-center scale-0', className)} fill={fill} />
            <CustomGrab className={cn('abs-center scale-0', className)} fill={fill} />
        </div>
        : null;

}

interface CustomMouseProps {
    className?: string;
    fill?: string | undefined;
}

const CustomMouse = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-mouse", className)}
        >
            <path
                d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
                fill={fill}
            />
        </svg>
    )
}
const CustomPointer = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-pointer", className)}
        >
            <path d="M22 14a8 8 0 0 1-8 8"/>
            <path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/>
            <path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/>
            <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
    )
}
const CustomHand = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-hand", className)}
        >
            <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/>
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
        </svg>
    )
}
const CustomGrab = ({ fill, className }: CustomMouseProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={cn("custom-grab", className)}
        >
            <path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"/>
            <path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/>
            <path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"/>
            <path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/>
            <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/>
        </svg>
    )
}

export default CustomCursor