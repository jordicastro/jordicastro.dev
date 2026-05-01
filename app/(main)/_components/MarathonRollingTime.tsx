"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, SplitText);

export default function MarathonRollingTime({className, textSize, widthHeight}: {className?: string, textSize?: string, widthHeight?: string}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const times: string[] = [
        "5:48", "5:26", "5:09", "4:54", "4:41",
        "4:29", "4:18", "4:07", "3:57", "3:48",
        "3:39", "3:31", "3:22", "3:12", "3:01"
    ];
    
    useGSAP(
        () => {
            const container = containerRef.current;
            if (!container) return;

            gsap.set(container, { visibility: "visible" });

            const lines = gsap.utils.toArray<HTMLElement>(".line", container);

            const splits = lines.map(
                (line) =>
                    new SplitText(line, {
                        type: "chars",
                        charsClass: "split-char-class",
                    })
            );


            const width = container.offsetWidth || 600;
            const depth = -width / 8;
            const transformOrigin = `center center ${depth}px`;

            gsap.set(lines, { perspective: 700, transformStyle: "preserve-3d" });

            const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "restart none none none",
                // markers: true,

            }
        });
            const tl = gsap.timeline({});
            const animTime = 0.9; // duration of each line's animation

            const sliceSplits = splits.slice(0, -1); // all but last line

            sliceSplits.forEach((split, index) => {
                const lineEl = split.elements[0] as HTMLElement;
                tl.fromTo(
                    split.chars,
                    { rotationX: -90 },
                    {
                        rotationX: 90,
                        stagger: 0.08,
                        duration: animTime,
                        ease: "power4.inOut",
                        transformOrigin,
                    },
                    index * 0.2 // stagger the start time of each line's animation
                ).to( // hide the line as it rotates away
                    lineEl, { autoAlpha: 0, duration: 0.1 }, "-=0.3"
                )
            });
            tl.fromTo(
                splits[splits.length - 1].chars, // the last line
                {
                    rotationX: -90, 
                },
                {
                    rotationX: 0,
                    stagger: 0.08,
                    duration: animTime,
                    ease: "power4.inOut",
                    transformOrigin,
                },
                "-=1"
            );
      
            masterTl.add(tl, 0);

            masterTl.to(
                tl,
                {
                    timeScale: 1.5,
                    duration: tl.duration() * 0.75,
                    ease: "power3.inOut",
                },
                0
            );

            masterTl.to(
                tl,
                {
                    timeScale: 1,
                    duration: tl.duration() * 0.25,
                    ease: "power3.inOut",
                },
                tl.startTime() + tl.duration() * 0.75
            );

            return () => {
                tl.kill();
                splits.forEach((s) => s.revert());
            };
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} id="rolling-text-container" className={`${className}`}>
            <div className={cn("tube", widthHeight)}>
                {Array.from({ length: 15 }, (_, i) => (
                    <h1 key={i} className={`line line${i + 1} ${textSize ?? "text-7xl"}`}>
                        {times[i]}
                    </h1>
                ))}
            </div>
        </div>
    );
}
