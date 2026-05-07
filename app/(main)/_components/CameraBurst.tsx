"use client"

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { CustomEase} from "gsap/all";

interface CameraBurstProps {
    path2Pictures: string; // path to the folder that contains the images named "path/...1.png", etc.
    imageCount: number; // number of images in the burst sequence
    className?: string;
}
const CameraBurst = ({ path2Pictures, imageCount, className }: CameraBurstProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const cameraTlRef = useRef<gsap.core.Timeline | null>(null);
    const burstTlRef = useRef<gsap.core.Timeline | null>(null);

    gsap.registerPlugin(useGSAP, CustomEase);

    const { contextSafe } = useGSAP(
        () => {
            if (!scopeRef.current) return;
            const root = scopeRef.current;
            const camera = root.querySelector(".camera") as HTMLElement | null;
            const burstPictures = gsap.utils.toArray<HTMLElement>(".burst-picture", root);
            if (!camera) return;
            if (!burstPictures.length) return;

            gsap.set(camera, { rotate: -15, transformOrigin: "center" });
            gsap.set(burstPictures, {
                autoAlpha: 0,
                scale: 0.8,
                xPercent: -50,
                y: 0,
                rotate: 0,
                transformOrigin: "center",
            });

            const shotGap = 0.45;
            const initialBurstDelay = 0.35;
            const pictureSequenceDuration = 1;
            const cycleDuration = imageCount * shotGap;
            const pictureRepeatDelay = Math.max((cycleDuration - pictureSequenceDuration), 0);

            cameraTlRef.current = gsap.timeline({
                paused: true,
            });
            cameraTlRef.current.to(camera, {
                rotate: 0,
                duration: 0.5,
                ease: CustomEase.create("snapBack.inOut", "M0,0 C0.122,0 0.216,-0.199 0.3,-0.095 0.403,0.031 0.482,0.473 0.496,0.496 0.538,0.569 0.605,0.985 0.703,1.101 0.783,1.195 0.884,1 1,1 "),
            });

            burstTlRef.current = gsap.timeline({ paused: true });
            let zCounter = 0;

            burstPictures.forEach((picture, i) => {
                const pictureTl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: pictureRepeatDelay,
                    onStart: () => {
                        gsap.set(picture, { zIndex: ++zCounter });
                    },
                    onRepeat: () => {
                        gsap.set(picture, { zIndex: ++zCounter, y: 0, rotate: 0, scale: 0.8, autoAlpha: 0 });
                    },
                });

                pictureTl.to(picture, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power1.out",
                })
                    .to(picture, {
                        y: gsap.utils.random(-40, -60),
                        duration: 0.45,
                        ease: CustomEase.create("burstGravity", "M0,0 C0,0.258 0.179,0.902 0.439,1.143 0.571,1.265 0.953,1.207 1,1 "),
                        rotate: gsap.utils.random(-10, 10),
                        delay: gsap.utils.random(0, 0.05),
                    }, 0.1)
                    .to(picture, {
                        scale: 0.8,
                        autoAlpha: 0,
                        ease: "back.in(2)",
                        duration: 0.3,
                    }, 0.70);

                burstTlRef.current?.add(pictureTl, initialBurstDelay + i * shotGap);
            });

            return () => {
                cameraTlRef.current?.kill();
                cameraTlRef.current = null;
                burstTlRef.current?.kill();
                burstTlRef.current = null;
            };
        },
        { scope: scopeRef }
    );

    const onHover = contextSafe(() => {
        cameraTlRef.current?.play();
        gsap.delayedCall(0, () => burstTlRef.current?.play());
    });

    const onHoverLeave = contextSafe(() => {
        burstTlRef.current?.pause();
        const burstPictures = gsap.utils.toArray<HTMLElement>(".burst-picture", scopeRef.current!);
        gsap.to(burstPictures, {
            autoAlpha: 0,
            scale: 0.8,
            ease: "power1.out",
            stagger: { each: 0.05, from: "random" },
            duration: 0.15,
            onComplete: () => {
                cameraTlRef.current?.reverse();
                burstTlRef.current?.restart().pause();
            }
        });
    });

    return (
        <div className={`` + className} ref={scopeRef}>
            <div className="camera-wrapper relative">
                {Array.from({ length: imageCount }, (_, i) => (
                    <img
                        key={i}
                        src={`${path2Pictures}/${i + 1}.png`}
                        alt={`Burst ${i + 1}`}
                        className="burst-picture absolute bottom-20 left-1/2 rounded-2xl w-auto h-auto max-w-3xs max-h-64 pointer-events-none"
                    />
                ))}
                <div
                    className="camera p-2"
                    onMouseEnter={() => onHover()}
                    onMouseLeave={() => onHoverLeave()}
                >
                    <span className="text-[84px]/[1] z-10">
                        📷
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CameraBurst