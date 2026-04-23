"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import Image from "next/image";
import AccessCard from "./AccessCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LogoBounceProps {
    onComplete: () => void;
}

const LogoBounce = ({ onComplete }: LogoBounceProps) => {
    const speed = 0.5;
    const tolerance = 5; // how close to the wall to consider it a corner for proper bouncing
    const scopeRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const killRef = useRef<boolean>(false);
    const isActiveRef = useRef<boolean>(false);
    const timeoutIdsRef = useRef<number[]>([]);
    const x = useRef(0);
    const y = useRef(0);
    const angle = useRef(0);
    const logoVariants = [
        "/images/JordPle.png", // default
        "/images/JordPle-old.png", 
        "/images/JordPle-oldest.png",

    ] 

    // clear any future schedule bounces
    const clearScheduledBounces = () => {
        timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        timeoutIdsRef.current = [];
    };

    const { contextSafe } = useGSAP(
        () => {
            isActiveRef.current = true;
            tlRef.current = gsap.timeline({
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: true,
                    onEnter: () => {
                        console.log('LogoBounce: onEnter');
                        setupAnimation();
                    },
                    onLeave: () => tlRef.current?.kill(),
                    onLeaveBack: () => tlRef.current?.kill(),
                    markers: true,
                }
            })
            const logo = gsap.utils.selector(scopeRef.current)('.bounce-logo')[0] as HTMLElement;
            if (!logo) return;

            const setupAnimation = () => {
                // set/reset animation
                tlRef.current?.kill();
                clearScheduledBounces();


                // entire main animation loop
                let totalDelay = 0;
                for (let i = 0; i < 20; i++) { 
                    if (killRef.current) break;
                    const randTimeout = i === 0 ? 0 : gsap.utils.random(10000, 20000); // 10-20s delay
                    totalDelay += randTimeout;
                    const timeoutId = window.setTimeout(() => {
                        if (killRef.current || !scopeRef.current) return;
                        const logo = i === 0 ? logoVariants[0] : getWeightedRandomLogo();
                        const randPos = getRandomPosition();
                        const randAngle = getRandomAngle();
                        const bounceLogo = new BounceLogo(scopeRef.current, logo, randPos.x, randPos.y, randAngle);
                        bounceLogo.start();
                    }, totalDelay);
                    timeoutIdsRef.current.push(timeoutId);
                }
            }

            const scheduleNextBounce = (bounceLogo: BounceLogo) => {
                if (
                    killRef.current ||
                    !isActiveRef.current ||
                    !scopeRef.current ||
                    !bounceLogo.el ||
                    !bounceLogo.el.isConnected
                ) {
                    bounceLogo.stop();
                    return;
                }

                const { el, x: currX, y: currY, angle: currAngle } = bounceLogo;
                const nextBounce = getNextBounce(currX, currY, currAngle, el);
                if (!nextBounce) {
                    bounceLogo.stop();
                    return;
                }

                const { targetX, targetY, wall } = nextBounce;
                const distance = Math.sqrt((targetX - currX) ** 2 + (targetY - currY) ** 2);
                const duration = distance / (300 * speed); // 1000 pixels per second at normal speed

                gsap.to(el, {
                    x: targetX,
                    y: targetY,
                    duration: duration,
                    ease: "none",
                    onUpdate: () => {
                        if (killRef.current) { // immediately kill and fade all logos if access granted (onCorrectPassword)
                            bounceLogo.stop();
                        }
                    },
                    onComplete: () => {
                        if (
                            killRef.current ||
                            !isActiveRef.current ||
                            !scopeRef.current ||
                            !el.isConnected
                        ) {
                            bounceLogo.stop();
                            return;
                        }

                        // update x, y, angle to the new position and angle
                        bounceLogo.x = targetX;
                        bounceLogo.y = targetY;
                        if (wall === "xr" || wall === "xl") {
                            bounceLogo.angle = 180 - bounceLogo.angle;
                            gsap.set(el, { rotation: bounceLogo.angle });
                            if (wall === "xr") { // flip vertically on right wall
                                gsap.set(el, { scaleY: -1 });
                            } else { // reset vertical flip on left wall
                                gsap.set(el, { scaleY: 1 });
                            }

                        } else if (wall === "yt" || wall === "yb") {
                            bounceLogo.angle = 360 - bounceLogo.angle;
                            gsap.set(el, { rotation: bounceLogo.angle });
                        }
                        scheduleNextBounce(bounceLogo); 
                    }
                })
            }

            const getNextBounce = (currX: number, currY: number, angle: number, el: HTMLElement) => {
                const scopeElement = scopeRef.current;
                if (!scopeElement || !el.isConnected) {
                    return null;
                }

                // calculate the container border targetX and targetY based on current position and angle
                const angleToRad = angle * (Math.PI / 180);
                const dx = Math.cos(angleToRad);
                const dy = Math.sin(angleToRad);
                const scopeWidth = scopeElement.clientWidth - el.clientWidth;
                const scopeHeight = scopeElement.clientHeight - el.clientHeight;

                // calculate time to hit each wall
                let tX, wallX;
                if (dx > 0) {
                    tX = (scopeWidth - currX) / dx;
                    wallX = "xr"; // right
                } else if (dx < 0) {
                    tX = -currX / dx;
                    wallX = "xl"; // left
                } else {
                    tX = Infinity;
                    wallX = null;
                }

                let tY, wallY;
                if (dy > 0) {
                    tY = (scopeHeight - currY) / dy;
                    wallY = "yb"; // bottom
                } else if (dy < 0) {
                    tY = -currY / dy;
                    wallY = "yt"; // top
                } else {
                    tY = Infinity;
                    wallY = null;
                }

                tX = tX > 0 ? tX : Infinity;
                tY = tY > 0 ? tY : Infinity;

                let t, wall;
                if (tX < tY) {
                    t = tX;
                    wall = wallX;
                } else {
                    t = tY;
                    wall = wallY;
                }

                const targetX = currX + dx * t;
                const targetY = currY + dy * t;
                // check for a corner bounce
                const nearLeft = Math.abs(targetX - 0) < tolerance;
                const nearRight = Math.abs(targetX - scopeWidth) < tolerance;
                const nearTop = Math.abs(targetY - 0) < tolerance;
                const nearBottom = Math.abs(targetY - scopeHeight) < tolerance;
                const isCorner = (nearLeft || nearRight) && (nearTop || nearBottom);
                if (isCorner) {
                    console.log('isCorner!', wall);
                }

                return { targetX, targetY, wall, isCorner };
            }

            class BounceLogo {
                container: HTMLElement;
                logo: string;
                x: number;
                y: number;
                angle: number;
                el: HTMLElement | null;

                constructor(container: HTMLElement, logo: string, x: number, y: number , angle: number) {
                    this.container = container;
                    this.logo = logo;
                    this.x = x;
                    this.y = y;
                    this.angle = angle;
                    this.el = null;
                }

                createElement() {
                    const el = document.createElement('img');
                    el.src = this.logo;
                    el.style.position = 'absolute';
                    el.style.pointerEvents = 'none';
                    el.style.width = '64px';
                    el.style.height = '64px';
                    el.className = 'bounce-logo';
                    this.container.appendChild(el);
                    return el;
                }

                start() {
                    this.el = this.createElement();
                    gsap.set(this.el, {
                        x: this.x,
                        y: this.y,
                        rotation: this.angle,
                    });

                    // start the bounce loop
                    scheduleNextBounce(this);
                }

                stop() {
                    if (this.el) {
                        gsap.killTweensOf(this.el);
                        gsap.to(this.el, { autoAlpha: 0, scale: 0, duration: 0.5, ease: "power2.in", onComplete: () => {
                            if (this.el && this.container.contains(this.el)) {
                                this.container.removeChild(this.el);
                            }
                            this.el = null;
                        } });
                    }
                }

                getState() {
                    return {
                        el: this.el,
                        x: x.current,
                        y: y.current,
                        angle: angle.current,
                    }
                }
            }

            return () => {
                isActiveRef.current = false;
                clearScheduledBounces();
                tlRef.current?.kill();
            }
        }, {scope: scopeRef }
        
    );

    const getRandomAngle = contextSafe(() => {
        // get a random angle that is not too vertical or horizontal to avoid boring bounces
        const range1 = [15, 75]; const range2 = [105, 165]; const range3 = [195, 255]; const range4 = [285, 345];
        const selectedRange = gsap.utils.random([range1, range2, range3, range4]);
        const angle = gsap.utils.random(selectedRange[0], selectedRange[1], 1); // clamp to nearest integer
        return angle;
    });

    const getWeightedRandomLogo = contextSafe(() => { // 60% default, 30% old, 10% oldest
        const rand = gsap.utils.random(0, 1); // 0 to 1

        return rand < 0.6 ? logoVariants[0] : rand < 0.8 ? logoVariants[1] : logoVariants[2]
    });

    const getRandomPosition = contextSafe(() => {
        const logo = gsap.utils.selector(scopeRef.current)('.bounce-logo')[0] as HTMLElement;
        if (!logo) return { x: 0, y: 0 };
        const x = gsap.utils.random(0, scopeRef.current!.clientWidth - logo.clientWidth);
        const y = gsap.utils.random(0, scopeRef.current!.clientHeight - logo.clientHeight);

        return { x, y };
    });
    return (
        <div ref={scopeRef} className="relative w-full h-full">
            <Image
                src="/images/JordPle.png"
                alt="logo"
                width={64}
                height={64}
                className="bounce-logo absolute pointer-events-auto select-none hidden"
                draggable={false}
            />
            <AccessCard
                title="App currently under maintenance."
                onAccessGranted={() => {
                    killRef.current = true;
                    clearScheduledBounces();
                }}
                onComplete={onComplete}
            />
        </div>
    )
}

export default LogoBounce