"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Physics2DPlugin } from "gsap/all"
import { useEffect, useMemo, useRef } from "react"

interface EmojiExplosionProps {
    className?: string;
    trigger: number; // number that the parent manipulates to trigger a play/replay of the explosion
}

const EmojiExplosion = ({ className = "", trigger }: EmojiExplosionProps) => {
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const scope = useRef<HTMLDivElement>(null);
    
    const EMOJIS = ["❤️", "👍", "🔥"] as const;
    const emojiExplosionArray = useMemo( // useMemo to create the array once and avoid extra render cycles
        () => Array.from({ length: 20 }, (_, i) => EMOJIS[i % EMOJIS.length]),
        []
    );
    
    gsap.registerPlugin(useGSAP, Physics2DPlugin);

    useEffect( () => {
        if (!trigger) return;
        playExplosion();
    }, [trigger])
    
    const { contextSafe } = useGSAP ( () => {
        createExplosion();
    }, { scope: scope})

    const createExplosion = contextSafe( () => {

        const speed = 2;
        const gravity = 2;
        const launchStagger = { each: 0.02, from: "random" as const }

        const emojis = scope.current?.querySelectorAll(".explosion-emoji");
        const container = scope.current?.querySelector("#emoji-explosion-container");
        if (!emojis || !container) return;

        const tl = gsap.timeline({ paused: true });

        tl
            .set(container, { autoAlpha: 1}) // unHide the container after the first click
            .to(emojis, {
                scale: () => gsap.utils.random(0.5, 1.5),
                physics2D: {
                    angle: () => gsap.utils.random(210, 330),
                    velocity: () => gsap.utils.random(100, 250) * speed,
                    gravity: gsap.utils.random(300, 350) * gravity,
                    friction: 0.02,
                },
                stagger: launchStagger,
                duration: 3,
                ease: "power2.out",
            })
            .to(emojis, {
                autoAlpha: 0,
                duration: 0.5,
                stagger: launchStagger,
                ease: "power1.out",
            }, 1)
        tlRef.current = tl;

    });

    const playExplosion = contextSafe( () => {
        tlRef.current?.restart();
    });




    return (
        <div className={className} ref={scope}>
            <button
                className="relative flex-center w-full h-full select-none"
            >
                <div
                    className="abs-center w-full h-full flex-center" id="emoji-explosion-container"
                    style={{visibility: "hidden"}}
                >
                    {emojiExplosionArray.map((_, i) => (
                        <span
                            key={i}
                            className="absolute text-lg explosion-emoji select-none"
                        >
                            {emojiExplosionArray[i]}
                        </span>
                    ))}

                </div>
            </button>

        </div>
    )
}

export default EmojiExplosion