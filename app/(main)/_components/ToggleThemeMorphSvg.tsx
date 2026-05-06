"use client";

import { useTheme } from 'next-themes';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/all";
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export type ToggleThemeMorphSvgHandle = {
    toggleMorphTheme: () => void;
}
// passing a forwardRef to allow the parent component to trigger the morph animation on group hover
const ToggleThemeMorphSvg = forwardRef<ToggleThemeMorphSvgHandle, { onClick?: () => void }>(function ToggleThemeMorphSvg({ onClick }, ref) {
    const scopeRef = useRef<HTMLDivElement>(null);
    let themeMorphRef = useRef<gsap.core.Timeline | null>(null);
    const [toggleCount, setToggleCount] = useState(0);
    const { theme, setTheme } = useTheme();

    gsap.registerPlugin(useGSAP, MorphSVGPlugin);

    const { contextSafe } = useGSAP(
        () => {
            const moonPath = scopeRef.current?.querySelector<SVGPathElement>("#moon-path");
            const sunPath = scopeRef.current?.querySelector<SVGPathElement>("#sun-path");
            if (!moonPath || !sunPath) return;

            const currentPath = theme === "light" ? moonPath : sunPath;
            const targetPath = theme === "light" ? sunPath : moonPath;

            gsap.set(currentPath, { display: "block" });
            gsap.set(targetPath, { display: "none" });

            themeMorphRef.current = gsap.timeline({ paused: true, defaults: { duration: 0.5, ease: "expo.inOut", overwrite: "auto" } })
            .to(currentPath, {
                morphSVG: {
                    shape: targetPath,
                    type: "rotational",
                }
            })
        },
        { scope: scopeRef}
    );

    const toggleMorphTheme = contextSafe(() => {
        if (!themeMorphRef.current) return;
        if (toggleCount % 2 === 0)
            themeMorphRef.current.play(0);
        else
            themeMorphRef.current.reverse();

        setToggleCount(prev => prev + 1);
        setTheme(theme === "light" ? "dark" : "light");
        if (onClick) onClick();
    })

    useImperativeHandle(ref, () => ({
        toggleMorphTheme,
    }), [toggleMorphTheme]);

    return (
        <div ref={scopeRef} className="theme-icon-wrapper">
            <svg id="theme-morph" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path
                    id="moon-path"
                    d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
                />
                <path
                    id="sun-path"
                    d="M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                />
            </svg>
        </div>
    )
})

export default ToggleThemeMorphSvg