"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { Draggable, InertiaPlugin } from "gsap/all";
import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Ellipsis, Menu } from "lucide-react";
import Logo from "@/components/Logo";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

type Job = {
    name: string;
    date: string;
    id: string;
    status: string;
}

const PQCThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scope = useRef<HTMLDivElement>(null);
    const DATE_THRESHOLD = 245;
    const ID_THRESHOLD = 210;
    const [shouldShowDate, setShouldShowDate] = useState(false);
    const [shouldShowId, setShouldShowId] = useState(false);
    const fadeInTl = useRef<gsap.core.Timeline | null>(null);
    const visibleOptionalCols = Number(shouldShowDate) + Number(shouldShowId);
    const jobDataCols =
        visibleOptionalCols === 2
            ? "grid grid-cols-4 items-center gap-1"
            : visibleOptionalCols === 1
            ? "grid grid-cols-3 items-center gap-1"
            : "grid grid-cols-2 items-center gap-1";

    const jobs: Job[] = [
        { name: "AlphaSim", date: "12.02.2024", id: "101", status: "submitted" },
        { name: "BetaAnalysis", date: "11.17.2024", id: "102", status: "running" },
        { name: "GammaProc", date: "11.02.2024", id: "103", status: "complete" },
    ]
    const jobFields: Array<{ key: keyof Job; label: string; visible: boolean }> = [
        { key: "name", label: "Job Name", visible: true },
        { key: "date", label: "Date", visible: shouldShowDate },
        { key: "id", label: "ID", visible: shouldShowId },
        { key: "status", label: "Status", visible: true },
    ];
    const visibleJobFields = jobFields.filter((field) => field.visible);

    useEffect(() => {
        if (shouldPlayThumbnail) {
            fadeInTl.current?.play();
        } else {
            fadeInTl.current?.pause(0);
        }
    }, [shouldPlayThumbnail])

    // 3d tilt effect
    useGSAP(() => {
        if (!isHovered || !scope.current || !fadeInTl.current || fadeInTl.current.progress() < 1) return;

        const element = scope.current;
        const storyContainer = element.closest(".story-card") as HTMLElement | null;
        const outer = gsap.utils.selector(element)(".outer");
        const inner = gsap.utils.selector(element)(".inner");
        if (!storyContainer || !outer || !inner) return;

        gsap.set(storyContainer, { perspective: 700 });
        gsap.set(outer, { transformStyle: "preserve-3d", transformOrigin: "50% 50%" });
        gsap.set(inner, { transformStyle: "preserve-3d", transformOrigin: "50% 50%", z: 8 });

        const outerRX = gsap.quickTo(outer, "rotationX", { duration: 0.28, ease: "power3" });
        const outerRY = gsap.quickTo(outer, "rotationY", { duration: 0.28, ease: "power3" });
        const innerX = gsap.quickTo(inner, "x", { duration: 0.28, ease: "power3" });
        const innerY = gsap.quickTo(inner, "y", { duration: 0.28, ease: "power3" });
        const clamp01 = gsap.utils.clamp(0, 1);
        const OUTER_TILT = 21;
        const INNER_SHIFT = 3;

        const onPointerMove = (e: PointerEvent) => {
            const rect = storyContainer.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const xProgress = clamp01((e.clientX - rect.left) / rect.width);
            const yProgress = clamp01((e.clientY - rect.top) / rect.height);

            outerRX(gsap.utils.interpolate(OUTER_TILT, -OUTER_TILT, yProgress));
            outerRY(gsap.utils.interpolate(-OUTER_TILT, OUTER_TILT, xProgress));
            innerX(gsap.utils.interpolate(-INNER_SHIFT, INNER_SHIFT, xProgress));
            innerY(gsap.utils.interpolate(-INNER_SHIFT, INNER_SHIFT, yProgress));
        }

        const onPointerLeave = () => {
            outerRX(0);
            outerRY(0);
            innerX(0);
            innerY(0);
        }

        storyContainer.addEventListener("pointermove", onPointerMove);
        storyContainer.addEventListener("pointerleave", onPointerLeave);

        return () => {
            storyContainer.removeEventListener("pointermove", onPointerMove);
            storyContainer.removeEventListener("pointerleave", onPointerLeave);
        }

    }, [isHovered]);

    // debounce responsive layout
    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;
            const element = root;

            // a quicker debounce to avoid too big of a delay
            const debounce = gsap.delayedCall(0.15, update).pause();

            function update() {
                element.offsetWidth > DATE_THRESHOLD ?
                    setShouldShowDate(true) :
                    setShouldShowDate(false);
                element.offsetWidth > ID_THRESHOLD ?
                    setShouldShowId(true) :
                    setShouldShowId(false);
                // console.log('updating container width: ',element.offsetWidth);
            }

            const resizeObserver = new ResizeObserver(() => {
                // console.log('restarting with new size: ', element.offsetWidth);
                debounce.restart(true);
            });

            update();
            resizeObserver.observe(element);

            return () => {
                resizeObserver.disconnect();
                debounce.kill();
            };

        },
        {scope, dependencies: []}
    );

    // draggable
    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const webAppContainer = root.querySelector(".pqc-webapp-container") as HTMLElement;
            const windowItems = root.querySelector(".browser-window-items") as HTMLElement;

            if (!webAppContainer || !windowItems) return;

            const draggableInstances = Draggable.create(webAppContainer, {
                type: "x,y",
                inertia: true,
                trigger: windowItems,
                bounds: root,
                edgeResistance: 0.85,
                dragResistance: 0.1,
                zIndexBoost: false,
            });

            return () => {
                draggableInstances.forEach((instance) => instance.kill());
            };
        },
        {scope, dependencies: []}
    )

    // fade in Tl
    useGSAP(() => {
        const root = scope.current;
        if (!root) return;

        const webAppContainer = root.querySelector(".pqc-webapp-container") as HTMLElement;
        const navbar = gsap.utils.selector(root)(".navbar");
        const navbarItems = gsap.utils.selector(root)(".navbar-item");
        const dashboard = gsap.utils.selector(root)(".dashboard");
        const jobItems = gsap.utils.selector(root)(".job-item-field");

        if (!webAppContainer || !navbar || !dashboard || !navbarItems || !jobItems) return;

        gsap.set([webAppContainer, navbar, dashboard], { autoAlpha: 0 });
        gsap.set(navbar, { scaleY: 0, transformOrigin: "top" });
        gsap.set(dashboard, {scaleY: 0, transformOrigin: "bottom" });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 0.8 } })
            .fromTo(webAppContainer, {
                autoAlpha: 0,
                scale: 1.2,
                y: 20,
            }, {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                ease: "back.out",
            }, 0.1)
            .to(navbar, {
                scaleY: 1,
                autoAlpha: 1,
            }, "<=0.1")
            .to(dashboard, {
                scaleY: 1,
                autoAlpha: 1,
                duration: 0.9,
            }, "<=0.2")
            .fromTo(jobItems, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                stagger: {
                    each: 0.05,
                    from: "start",
                },
                duration: 0.8,
                ease: "power2.inOut",
            }, "<=0.2");

        fadeInTl.current = tl;

        if (shouldPlayThumbnail) {
            tl.play(0);
        }

        return () => {
            tl.kill();
            if (fadeInTl.current === tl) {
                fadeInTl.current = null;
            }
        };

    }, {scope, dependencies: [shouldShowDate, shouldShowId, shouldPlayThumbnail]})

    return (
        <div ref={scope} className="relative w-full h-full flex-center pb-5 p-0">
            <div className="pqc-webapp-container outer w-75 h-full overflow-hidden rounded-lg border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 select-none">
                <div className="browser-window inner w-full h-full flex flex-col items-center justify-start gap-1">
                {/* navbar */}
                <div
                    className="browser-window-items relative w-full h-5 flex-start gap-1.5 px-2 pt-1"
                    data-cursor='hand'
                >
                        <div className="w-2 h-2 rounded-full bg-red-500"/>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"/>
                        <div className="w-2 h-2 rounded-full bg-green-500"/>
                        <div className="w-20 h-2 rounded-full abs-center bg-bg-tertiary" />
                </div>
                <div className="navbar w-full h-9 bg-mist-300/80 dark:bg-mist-600/80 rounded-t-none rounded-b-2xl flex flex-col">
                    <div className="navbar-items w-full h-auto flex items-center justify-between px-2 pt-1 shrink-0">
                        <Menu size={12} className="text-text-primary navbar-item" strokeWidth={3}/>
                        <Logo width={12} height={12} className="scale-x-[-1] navbar-item" />
                    </div>
                    <div className="w-full flex-1 flex-center">
                        <h3 className="dashboard-title navbar-item text-[10px] text-center font-semibold tracking-wider text-text-primary mb-1">
                            Dashboard
                        </h3>
                    </div>
                </div>
                {/* dashboard */}
                <div className="dashboard w-15/16 h-22 bg-bg-secondary rounded-lg flex flex-col items-start justify-start px-2 py-1 mt-1 gap-1">
                    <div className="w-full flex-between px-2">
                        <h3 className="dashboard-title dashboard-header-item text-[10px] font-medium text-text-primary/80">

                        </h3>
                        <Ellipsis size={12} className="dashboard-header-item text-text-secondary/80" strokeWidth={2}/>
                    </div>
                    <div className="w-full h-full">
                        <div className="w-full flex items-center gap-1">
                            <div className={cn("w-full", jobDataCols)}>
                                {visibleJobFields.map((field) => (
                                    <h3
                                        key={field.key}
                                        className="min-w-0 text-[8px] text-text-secondary font-medium uppercase tracking-wide truncate text-left"
                                    >
                                        {field.label}
                                    </h3>
                                ))}
                            </div>
                            <div className="w-2" />
                        </div>
                        <div className="w-full h-auto flex flex-col items-center justify-start gap-1 mt-1">
                            {jobs.map((job, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-full rounded px-1 py-0.5",
                                        index === 0 ? "bg-bg-tertiary/50" : ""
                                    )}
                                >
                                    <div className="job-items w-full flex items-center gap-1">
                                        <div className={cn("w-full", jobDataCols)}>
                                            {visibleJobFields.map((field) => {
                                                if (field.key === "status") {
                                                    return (
                                                        <div key={field.key} className="justify-self-start">
                                                            <div
                                                                className={cn(
                                                                    "job-item-field flex-center w-4 h-1.5 px-1 rounded-md ml-2",
                                                                    job.status === "submitted" ? "dark:bg-neutral-500/80 bg-neutral-300/80" :
                                                                    job.status === "running" ? "dark:bg-yellow-500/80 bg-yellow-300/80" :
                                                                    job.status === "complete" ? "dark:bg-green-500/80 bg-green-300/80" : ""
                                                                )}
                                                            />
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <h3
                                                        key={field.key}
                                                        className={cn(
                                                            "job-item-field min-w-0 text-text-secondary/90 font-normal truncate",
                                                            field.key === "name"
                                                                ? "text-[7px]"
                                                                : "text-[6px] tabular-nums",
                                                        )}
                                                    >
                                                        {job[field.key]}
                                                    </h3>
                                                );
                                            })}
                                        </div>
                                        <div className="w-2 flex justify-end">
                                            <Ellipsis size={8} className="text-text-tertiary/80" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default PQCThumbnail