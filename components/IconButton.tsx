"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/all";
import { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { useTheme } from "next-themes";

interface IconButtonProps {
    text: string;
    icon: LucideIcon;
    activeColor?: string;
    drawBorder?: boolean;
    onClick: () => void;
    className?: string;
    autoResize?: boolean;
}
const IconButton = ({ text, icon:Icon, activeColor="#2b7fff", drawBorder=false, onClick, className, autoResize=false }: IconButtonProps) => {
    const { theme } = useTheme();
    const scopeRef = useRef<HTMLDivElement>(null);
    const gap = text.length > 15 ? "gap-5" : text.length > 14 ? "gap-10" : text.length > 13 ? "gap-12" : "gap-15";
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const baseColor = theme === "light" ? 
        "rgb(112, 112, 112)" :
        "rgb(212, 212, 212)";

    const sm = useMediaQuery("(max-width: 640px)");
    const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
    const md = useMediaQuery("(max-width: 768px) and (min-width: 641px)");
    const  textSize = autoResize ? 
        sm ? "text-sm" : md ? "text-base" : "text-lg" :
        'text-lg';
    const iconSize = autoResize ?
        sm ? "w-5 h-5" : md ? "w-5 h-5" : "w-6 h-6" :
        "w-6 h-6";
    const widthHeight = autoResize ?
        sm ? "w-60 h-15" : md ? "w-65 h-16.25" : "w-75 h-18.75" :
        "w-75 h-18.75";

    gsap.registerPlugin(useGSAP, DrawSVGPlugin);

    const { contextSafe } = useGSAP(
        () => {
            if (!scopeRef.current) return;
            const root = scopeRef.current;
            const path = root.querySelector("#btn-path") as SVGPathElement | null;
            const colorTargets = root.querySelectorAll(".color-text");
            if (!path) return;
            if (!colorTargets.length) return;

            gsap.set(path, { drawSVG: "0%" });
            gsap.set(colorTargets, { color: baseColor });

            tlRef.current = gsap.timeline({ paused: true });

            tlRef.current.to(colorTargets, {
                color: activeColor,
                duration: 0.55,
                ease: "sine.inOut",
                stagger: 0.01,
                overwrite: "auto",
            })
            .to(path, {
                drawSVG: "100%",
                duration: 1.5,
                delay: 0.3,
                ease: "power1.inOut",
            }, "<")
        },
        { scope: scopeRef, dependencies: [baseColor] }
    )

    const onHover = contextSafe(() => {
        if (!canHover) return;
        tlRef.current?.play();
    });

    const onHoverLeave = contextSafe(() => {
        if (!canHover) return;
        tlRef.current?.reverse();
    });

    return (
        <div
            ref={scopeRef}
            className={cn(
                'w-75 h-18.75 rounded-full relative bg-bg-tertiary',
                className,
                widthHeight
            )}
        >
            {/* button */}
            <div
                className={twMerge(
                    `w-full h-full rounded-full flex items-center justify-start pl-8 pr-6 text-xl text-neutral-300 hover:cursor-pointer text-ellipsis font-semibold`,
                    gap,
                )}
                role="button"
                onClick={onClick}
                data-cursor="pointer-2"
                onMouseEnter={() => onHover()}
                onMouseLeave={() => onHoverLeave()}
            >
                <Icon
                    className={cn(
                        'stroke-width-4 color-text',
                        iconSize
                    )}
                    strokeWidth={2.5}
                />
                <p className={cn(
                    'tracking-wider line-clamp-1 color-text',
                    textSize
                )}>
                    {text}
                </p>
            </div>
            {/* border svg */}
            {drawBorder && (
                <svg
                    className={`absolute inset-0 rounded-full pointer-events-none`}
                    viewBox="0 0 300 75"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M 37.5 2.5 L 262.5 2.5 C 281.785 2.5 297.5 18.2153 297.5 37.5 L 297.5 37.5 C 297.5 56.7847 281.785 72.5 262.5 72.5 L 37.5 72.5 C 18.2153 72.5 2.5 56.7847 2.5 37.5 L 2.5 37.5 C 2.5 18.2153 18.2153 2.5 37.5 2.5 Z"
                        stroke={activeColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        id="btn-path"
                    />
                </svg>
            )}

        </div>
    )
}

export default IconButton