"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin, Observer, ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { timelineCardsData } from "@/constants/constants";
import { timelineCardDataType } from "@/types/types";
import { useScrollMask } from "@/hooks/useScrollMask";
import Logo from "@/components/Logo";
import { useResolvedSidebar } from "@/hooks/useSidebar";
import { useTheme } from "next-themes";
import ThreeDGridBackground from "./ThreeDGridBackground";

const ProgrammingTimeline = ({ id }: { id?: string }) => {
    return (
        <div className="w-full px-4 md:px-6 lg:px-8 mt-50" id={id}>
            <MotionPathTimeline />
        </div>
    )
}

const MotionPathTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scopeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [width, setWidth] = useState<number>(0);
    const [handedOff, setHandedOff] = useState<boolean>(false);
    const { isAnimating, setIsAnimating } = useScrollMask();
    const downScrollCounter = useRef<number>(0);
    const { isCollapsedSettled } = useResolvedSidebar();
    const isDebounceComplete = useRef<boolean>(false);
    const onDownDebounceMs = 100;
    let lockedScrollY = 0;


    gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin, Observer);
    
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // title fade in
    useGSAP(
        () => {
            if (!width || !titleRef.current) return;

            gsap.set(titleRef.current, { autoAlpha: 0, y: 30 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: "top 25%",
                }
            })

            tl.to(titleRef.current, {
                autoAlpha: 1,
                y: 0,
                ease: "power1.out",
                duration: 0.5,
            });
        },
        { scope: containerRef, dependencies: [width], revertOnUpdate: true }
    )

    // main timeline animation
    const { contextSafe } = useGSAP(
        () => {
            if (!width || isCollapsedSettled === false) return;

            const root = scopeRef.current;
            if (!root) return;

            const timelineNode = root.querySelector(".timeline-node") as HTMLElement | null;
            if (!timelineNode) return;

            const timelineNodeStartRec = timelineNode.getBoundingClientRect();
            const allContainers = gsap.utils.toArray(".keyframe-container", root) as HTMLElement[];
            const containers = gsap.utils.toArray(
                ".keyframe-container:not(.initial)",
                root
            ) as HTMLElement[];

            if (!containers.length) return;

            const points = containers.map((container) => {
                const marker = (container.querySelector(".marker") || container) as HTMLElement;
                const r = marker.getBoundingClientRect();

                return {
                    x:
                        r.left +
                        r.width / 2 -
                        (timelineNodeStartRec.left + timelineNodeStartRec.width / 2),
                    y:
                        r.top +
                        r.height / 2 -
                        (timelineNodeStartRec.top + timelineNodeStartRec.height / 2),
                };
            });
            const snapFunc = (value: number, self?: ScrollTrigger): number => {

                if (self && self.progress >= 0.88) { // if the user has scrolled pasted 90%, snap to the end to help the observer handoff
                    return 1;
                }
                return value;

            }

            let observer: Observer | null = null;
            let downDebounceTimer: ReturnType<typeof setTimeout> | null = null;

            const queueDownAction = () => {
                if (downDebounceTimer !== null) {
                    clearTimeout(downDebounceTimer);
                }

                downDebounceTimer = setTimeout(() => {
                    isDebounceComplete.current = true;
                    downDebounceTimer = null;
                }, onDownDebounceMs);
            };

            const clearDownAction = () => {
                if (downDebounceTimer !== null) {
                    clearTimeout(downDebounceTimer);
                    downDebounceTimer = null;
                }
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top 15%",
                    end: "bottom 85%",
                    scrub: 1.5,
                    snap: {
                        snapTo: snapFunc,
                        duration: { min: 0.2, max: 0.6 },
                        delay: 0.1,
                        ease: "power1.inOut",
                    },
                    // markers: true,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                    onUpdate: (self) => {
                        const v = self.getVelocity();
                        if (!handedOff && self.progress > 0.88) {
                            // fastest scroll velocity skips the scroll mask animation completely
                            if (v > 10000) {
                                console.log('extreme v', v);
                                return;
                            }
                            if (v > 5000) {
                                console.log('fast v', v);
                                setHandedOff(true);
                                !isAnimating && setIsAnimating(true, "down", 0.75);
                            }
                        } 
                        if (!handedOff && self.progress === 1.0) {
                            // if slow scroll velocity, enable observer to watch for scroll direction
                            lockScroll();
                            if (v >= 0) {
                                setHandedOff(false);
                            }
                        }
                        if (self.progress < 0.8) {
                            unlockScroll();
                            setHandedOff(false);
                        }
                    }
                },
            });
            const timelineST = tl.scrollTrigger;
            if (!timelineST) return;


            const nodeTween = tl.to(timelineNode, {
                motionPath: {
                    path: points,
                    curviness: 2,
                    autoRotate: false,
                },
                ease: "none",
                duration: 1,
            });

            nodeTween.addLabel("keyframe1", 0);
            nodeTween.addLabel("keyframe2", width < 750 ? 0.215 : 0.190);
            nodeTween.addLabel("keyframe3", width < 750 ? 0.435 : 0.450);
            nodeTween.addLabel("keyframe4", width < 750 ? 0.655 : 0.680);
            nodeTween.addLabel("keyframe5", width < 750 ? 0.825 : 0.836);
            nodeTween.addLabel("keyframe6", 0.995);

            allContainers.forEach((container, index) => {
                const card = container.querySelector(".timeline-card") as HTMLElement | null;
                if (!card) return;

                const label = `keyframe${index + 1}`;

                nodeTween.call(
                    () => {
                        gsap.to(card, getTweenVars(card));
                    }, undefined, label)
            });

            ScrollTrigger.refresh();

            let preventScroll = ScrollTrigger.observe({
                target: root,
                type: "wheel, touch",
                preventDefault: true,
                allowClicks: true,
                onEnable: (self) => { // save the scroll position
                    lockedScrollY = self.scrollY();
                    console.log('lockedScrollY: ', self.scrollY());
                },
                onChangeY: (self) => { // refuse to scroll
                    if (self.event) self.event.preventDefault(); // shut off momentum (i think)
                    self.scrollY(lockedScrollY);
                },
                onUp: () => {
                    clearDownAction();
                    isDebounceComplete.current = false;
                    console.log('onUp');
                    if (!handedOff) {
                        unlockScroll();
                    }
                },
                onDown: () => {
                    if (!isDebounceComplete.current) {
                        queueDownAction();
                        return;
                    } else {
                        console.log('onDown');
                        setHandedOff(true);
                        isDebounceComplete.current = false;
                        !isAnimating && setIsAnimating(true, "down");
                    }
                }
            });

            const lockScroll = () => {
                lockedScrollY = timelineST.scroll();
                preventScroll?.enable();
                // nuke wheel scroll, touch, and momentum 
                document.body.style.overflow = "hidden";
            }

            const unlockScroll = () => {
                preventScroll?.disable();
                // undo nuke
                document.body.style.overflow = "";
            }

            downScrollCounter.current === 0 && preventScroll.disable();

            return () => {
                clearDownAction();
                preventScroll?.kill();
            };
        },
        { scope: scopeRef, dependencies: [width, isCollapsedSettled], revertOnUpdate: true }
    );

    const getTweenVars = contextSafe( (card: HTMLElement): gsap.TweenVars => {
        if (card.className.includes("-bottom-46")) {
            return { y: 12, autoAlpha: 1, ease: "power1.out", duration: 0.3 }
        } else if (card.className.includes("-top-46")) {
            return { y: -12, autoAlpha: 1, ease: "power1.out", duration: 0.3 }
        } else if (card.className.includes("-left-67")) {
            return { x: -12, autoAlpha: 1, ease: "power1.out", duration: 0.3 }
        } else if (card.className.includes("-right-67")) {
            return { x: 12, autoAlpha: 1, ease: "power1.out", duration: 0.3 }
        }
        return {}
    });

    if (!width) return null;

    return (
        <div>
            <div className="max-w-500 mx-auto" ref={containerRef}>
            <h2 ref={titleRef} className="text-text-secondary programming-timeline-title opacity-0 translate-y-5">Programming Timeline</h2>
            <div
                className="w-auto h-[300vh] relative overflow-x-clip"
                ref={scopeRef}
                id="motion-path-tl"
            >
                <ThreeDGridBackground className="abs-x-center top-0 h-full w-auto max-w-none pointer-events-none z-0"/>
                <div className="keyframe-container initial">
                    <Logo width={75} height={75} className="timeline-node z-40" />
                    {/* <div className="timeline-node w-18.75 h-18.75 z-10 rounded-lg bg-linear-to-tr from-[#F96C7F] from-25% to-[#FDC204] -skew-0" /> */}
                    <TimelineCard
                        position={width < 700 ? "left" : "bottom"}
                        data={timelineCardsData[0]}
                        index={1}
                    />
                </div>

                <div className="keyframe-container second">
                    <div className="marker" />
                    <TimelineCard position="right" data={timelineCardsData[1]} index={2} />
                </div>

                <div className="keyframe-container third">
                    <div className="marker" />
                    <TimelineCard position="left" data={timelineCardsData[2]} index={3} />
                </div>

                <div className="keyframe-container fourth">
                    <div className="marker" />
                    <TimelineCard
                        position={width >= 1500 ? "left" : "right"}
                        data={timelineCardsData[3]}
                        index={4}
                    />
                </div>

                <div className="keyframe-container fifth">
                    <div className="marker" />
                    <TimelineCard position="left" data={timelineCardsData[4]} index={5} />
                </div>

                <div className="keyframe-container sixth">
                    <div className="marker" />
                    <TimelineCard
                        position={width < 700 ? "right" : "top"}
                        data={timelineCardsData[5]}
                        index={6}
                    />
                </div>
            </div>
            </div>
            <div className="h-41"/>
        </div>
    );
};

interface TimelineCardProps {
    position: "top" | "bottom" | "left" | "right";
    data: timelineCardDataType;
    index: number;
}

const TimelineCard = ({ position, data, index }: TimelineCardProps) => {
    const { theme } = useTheme();
    const fill = theme === "dark" ? "#171717" : "#f5f5f5";

    return (
        <div
            className={twMerge(
                `absolute w-62.5 h-41.25 rounded-3xl p-6 flex flex-col justify-between items-center timeline-card timeline-card-${index} bg-bg-secondary`,
                position === "top" && "-top-46",
                position === "bottom" && "-bottom-46",
                position === "left" && "-left-67",
                position === "right" && "-right-67",
            )}
            style={{ visibility: "hidden" }}
        >
            <div className="flex flex-col gap-3 text-center">
                <h3 className="text-lg font-medium">{data.title}</h3>
                {data.subtitle && (
                    <p className="text-[12px] opacity-80">{data.subtitle}</p>
                )}
            </div>

            <div className="flex justify-between items-center text-neutral-200 w-full">
                <p>{data.company}</p>
                <p>{data.year}</p>
            </div>

            <svg
                width="40"
                height="10"
                viewBox="0 0 40 10"
                fill="none"
                className={twMerge(
                    `absolute`,
                    position === "bottom" && "-top-1.5",
                    position === "top" && "-bottom-1.5 rotate-180",
                    position === "left" &&
                        "-right-5.5 rotate-90 top-1/2 -translate-y-1/2",
                    position === "right" &&
                        "-left-5.5 -rotate-90 top-1/2 -translate-y-1/2"
                )}
            >
                <path
                    d="M23.5777 0.844521L40 9.05566L0 9.05567L16.4223 0.844519C18.6745 -0.281591 21.3255 -0.281589 23.5777 0.844521Z"
                    fill={fill}
                />
            </svg>
        </div>
    );
};

export default ProgrammingTimeline;