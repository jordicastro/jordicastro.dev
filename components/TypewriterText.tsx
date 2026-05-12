"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import { codeTextStyling } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type TypewriterBuilder = () => gsap.core.Timeline | null;
type twFonts = "font-sans" | "font-serif" | "font-mono";

interface TypewriterTextProps {
    text: string;
    parentWidth?: number;
    fontSize?: number;
    speed?: number; // step multiplier for typing speed: 0.05 (FAST) --> 0.3 (SLOW)
    lineDelay?: number; // delay between lines in seconds, default 0
    lineGap?: number; // TODO: gap between lines in seconds, default 0.1
    codeText?: boolean; // whether to apply code text styling
    variableTimeScale?: boolean;
    randomBackspace?: boolean;
    className?: string;
    animationKey?: string;
    font?: twFonts;
    registerAnimation?: (key: string, build: TypewriterBuilder) => void;
}

const TypewriterText = ({ text, parentWidth=440, fontSize=30, speed=0.15, lineDelay=0, codeText=false, variableTimeScale=false, randomBackspace=true, className, animationKey, registerAnimation, font }: TypewriterTextProps) => {
    const { resolvedTheme } = useTheme();
    const codeBgColor = resolvedTheme === "light" ? "oklch(97% 0 0)": "oklch(20.5% 0 0)";
    const textRef = useRef<HTMLDivElement>(null);
    const barColor = codeText ? "#EC6765" : "#FFFFFF";
    const barColorSecondary = codeText ? "#222222" : "#222222";
    const effectiveFontSize = codeText ? 18 : fontSize;

    gsap.registerPlugin(useGSAP);

    // useMemo so lines are ready before parent useGSAP hook
    const lines = useMemo(() => {
        const calcWidth = (t: string) => t.length * (effectiveFontSize * 0.6);
        if (calcWidth(text) <= parentWidth) return [text];
        const words = text.split(" ");
        const result: string[] = [];
        let currentLine = 0;
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (calcWidth((result[currentLine] ?? "") + word) < parentWidth) {
                result[currentLine] = result[currentLine] ? result[currentLine] + " " + word : word;
            } else {
                currentLine++;
                result[currentLine] = word;
            }
        }
        return result;
    }, [text, parentWidth, effectiveFontSize]);

    useGSAP( () => {
        if (!registerAnimation) return;

        const key = animationKey ?? text;
        registerAnimation(key, () => {
            const el = textRef.current;
            if (!el) return null;

            const resetTypewriterVisualState = () => {
                const lineEls = gsap.utils.toArray<HTMLElement>(".anim-typewriter", el);
                lineEls.forEach((lineEl) => {
                    gsap.killTweensOf(lineEl, "--whiteBar");
                    gsap.set(lineEl, { width: 0, "--whiteBar": "transparent" });
                });

                if (codeText) {
                    const rowEls = gsap.utils.toArray<HTMLElement>("[class*='code-row-']", el);
                    rowEls.forEach((rowEl) => {
                        gsap.set(rowEl, { padding: 0, backgroundColor: "transparent", borderRadius: "10 0 0 10" });
                    });
                }
            };

            // Hard reset at the start of every play/restart.
            resetTypewriterVisualState();

            // masterTL controls each line's typewriter animation in a sequence with steps, duration, and gap
            const masterTl = gsap.timeline();
            masterTl.add(() => {
                resetTypewriterVisualState();
            }, 0);
            const textLines = lines.length ? lines : [text];

            textLines.forEach((line, index) => {
                const lineEl = el.querySelector(`.line-${index + 1}`) as HTMLElement | null;
                const rowEl = el.querySelector(`.code-row-${index + 1}`) as HTMLElement | null;
                if (!lineEl) return;

                const steps = line.length;
                const duration = steps * speed;


                // initial state: width 0 (left edge) and blinking cursor hidden
                gsap.set(lineEl, { width: 0, "--whiteBar": "transparent" });
                if (codeText && rowEl) {
                    gsap.set(rowEl, { padding: 0, backgroundColor: "transparent", borderRadius: "10 0 0 10" });
                }

                const tl = gsap.timeline();

                // show cursor
                tl.to(lineEl, { "--whiteBar": barColor, duration: 0.01 });

                const typeTween = tl.fromTo(
                    lineEl,
                    { width: 0 },
                    {
                    width: "auto",
                    ease: `steps(${steps})`,
                    duration: duration,
                    immediateRender: false,
                    }
                );
                if (codeText && rowEl) {
                    // animate the code bg row separately
                    tl.set(rowEl, { padding: 8, backgroundColor: codeBgColor}, 0);
                }
                let blinkTween: gsap.core.Tween | null = null;
                tl.add(() => {
                    blinkTween?.kill(); // kill any existing blink tween before starting a new one
                    blinkTween = gsap.to(lineEl, {
                    "--whiteBar": barColorSecondary,
                    duration: 0.5,
                    ease: `steps(${steps})`,
                    repeat: -1,
                    yoyo: true,
                    });
                }, typeTween.startTime()); // same time as typing starts

                tl.add(() => {
                    // immediately kill ongoing blink tween
                    gsap.killTweensOf(lineEl, "--whiteBar" );
                    blinkTween?.kill();
                    gsap.set(lineEl, { "--whiteBar": "transparent" }); // final state: hide cursor

                }, typeTween.endTime());

                if (codeText && rowEl) { // round the right corner at the end of the animation
                    tl.to(rowEl, { borderRadius: "10px 10px 10px 10px", duration: 0.3, ease: "power1.out" }, typeTween.endTime() - 0.3);
                }

                // add to the masterTl with gap gap
                masterTl.add(tl, index === 0 ? 0 : `>+=${lineDelay}`); // add lineDelay between lines
            });

            return masterTl;
        });

        return () => {
            if (!textRef.current) return;
            const lineEls = gsap.utils.toArray<HTMLElement>(".anim-typewriter", textRef.current);
            lineEls.forEach((lineEl) => {
                gsap.killTweensOf(lineEl, "--whiteBar");
                gsap.set(lineEl, { "--whiteBar": "transparent" });
            });
        };
    }, { scope: textRef, dependencies: [registerAnimation, animationKey, lines, text, speed, lineDelay, codeText, barColor, barColorSecondary, variableTimeScale, randomBackspace] });

    return (
        <div className={`${className}`} style={{width: parentWidth}}>
            <div ref={textRef} id="typewriter-container">
                {(lines.length ? lines : [text]).map((line, index) => (
                    <div key={index} className={cn(
                        `code-row-${index + 1}`,
                        codeText ? codeTextStyling : "",
                    )}  style={codeText ? {} : {fontSize: effectiveFontSize}}>
                        <span className={`line-${index + 1} anim-typewriter ${font ? font : ""}`}>
                            {line}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TypewriterText