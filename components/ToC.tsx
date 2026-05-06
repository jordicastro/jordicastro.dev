"use client"

import { useRef } from "react";
import { Section } from "@/types/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollToPlugin, ScrollTrigger } from "gsap/all";
import { twMerge } from "tailwind-merge";
import { useScrollMask } from "@/hooks/useScrollMask";
import { useTheme } from "next-themes";
import { cn, scrollTo } from "@/lib/utils";

interface ToCInterface {
    sections: Section[];
}

const ToC = ({ sections }: ToCInterface) => {
    const { theme } = useTheme();
    
    const panelRef = useRef<HTMLDivElement>(null);
    const scope = useRef<HTMLDivElement>(null);
    const { activeSectionId, setActiveSection } = useScrollMask();
    const activeColor = sections[0].activeColor || "#222222"; // Default : 155DFC
    const inactiveBarColor = theme === "light" ? 
        'var(--color-neutral-200)' :
        'var(--color-neutral-500)';

    gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

    const { contextSafe } = useGSAP( () => {
        // set panel autoAlpha to 0
        gsap.set(panelRef.current, { autoAlpha: 0, x: 16 });

        const sectionTriggers = sections.map((s, i) => {
            const el = document.getElementById(s.id);
            if (!el) return null;

            return ScrollTrigger.create({
                trigger: el,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveSection(s.id),
                onEnterBack: () => setActiveSection(s.id),
            })
        });

        return () => sectionTriggers.forEach(t => t?.kill());
    }, { scope: scope } );

    const openPanel = contextSafe(() => {
        gsap.to(panelRef.current, { autoAlpha: 1, x: 0, duration: 0.2, ease: "power1.out", overwrite: true }); // kill conflicting tweens, if any
    });
    const closePanel = contextSafe(() => {
        gsap.to(panelRef.current, { autoAlpha: 0, x: 16, duration: 0.2, ease: "power1.in", overwrite: true, delay: 0.08 });
    });

    return (
        <div ref={scope} className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 z-50">
            <div
                className="relative"
                onMouseEnter={openPanel}
                onMouseLeave={closePanel}
            >
                {/* bars */}
                <div
                    className="max-h-3/4 py-16 w-10 flex flex-col justify-center items-end gap-3"
                >
                    {sections.map( (s, i) => (
                        <div
                            key={s.id}
                            className={twMerge(
                                `w-4.5 h-0.75 rounded-full transition-all duration-500 ease-out`,
                                s.id === activeSectionId ? "w-4.75" : "w-4.5",
                            )}
                            style={{ backgroundColor: s.id === activeSectionId ? activeColor : inactiveBarColor }}
                        />
                    ))}
                </div>

                {/* panel */}
                <div
                    ref={panelRef}
                    className={cn(
                        'w-52 max-h-106.5 absolute right-0 top-1/2 -translate-y-1/2 border rounded-2xl backdrop-blur shadow-lg p-5 flex flex-col justify-start items-center gap-1',
                        theme === "light" ? "border-neutral-300 bg-white/85" :
                            "border-neutral-800 bg-neutral-900/85",
                    )}
                    style={{ visibility: "hidden" }}

                >
                    {sections.map( (s, i) => (
                        <button
                            key={s.id}
                            style={s.id === activeSectionId ? { color: activeColor } : undefined}
                            className={cn(
                                'w-full rounded-lg px-2 py-1 text-start line-clamp-1 text-ellipsis text-sm hover:bg-neutral-100/90 dark:hover:bg-neutral-800/90 hover:cursor-pointer transition-all duration-250 ease-out',
                                s.id === activeSectionId
                                ? "" 
                                : "text-neutral-500 hover:text-neutral-600"
                            )}
                            onClick={() => scrollTo(s.id)}
                            data-cursor='pointer'
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default ToC