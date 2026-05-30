"use client"

import { StoryThumbnailProps } from "@/types/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from 'react';
import AndroidWrapper from "@/components/AndroidWrapper";
import { Compass, HogSpotLogo } from "@/components/svgs/svgs";
import { useTheme } from "next-themes";
import { Monomaniac_One } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Search, Map } from "lucide-react"; 

const monomaniacOne = Monomaniac_One({
    subsets: ["latin"],
    weight: "400",
});

gsap.registerPlugin(useGSAP);

const HogSpotThumbnail = ({ isHovered, shouldPlayThumbnail }: StoryThumbnailProps) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const hoveredPreviewTlRef = useRef<gsap.core.Timeline | null>(null);
    const fakeLeaderboardUsers = [
        { name: "Justin Mach", color: "blue", xp: 375 },
        { name: "Lizzie Howell", color: "purple", xp: 212},
        { name: "(You)", color: "rose", xp: 154},
    ]
    const navItems = [
        { name: "Explore", active: true, icon: Compass },
        { name: "Search", active: false, icon: Search },
        { name: "Profile", active: false, icon: Map },
    ]

    useEffect(() => {
        if (shouldPlayThumbnail) {
            tlRef.current?.play();
        } else {
            tlRef.current?.pause();
            tlRef.current?.seek(0);
        }
    }, [shouldPlayThumbnail])

    useEffect(() => {
        if (tlRef.current?.progress() !== 1) return;

        if (isHovered && shouldPlayThumbnail) {
            hoveredPreviewTlRef.current?.play();
        } else {
            hoveredPreviewTlRef.current?.reverse();
        }
    }, [isHovered])

    useGSAP(
        () => {
            const root = scopeRef.current;
            if (!root) return;

            // home screen els
            const logo = gsap.utils.toArray<HTMLElement>(".hogspot-logo", root)[0];
            const title = gsap.utils.toArray<HTMLElement>(".hogspot-title", root)[0];
            const description = gsap.utils.toArray<HTMLElement>(".hogspot-description", root)[0];
            const signupBtn = gsap.utils.toArray<HTMLElement>(".signup-btn", root)[0];
            const loginBtn = gsap.utils.toArray<HTMLElement>(".login-btn", root)[0];
            const loginContent = gsap.utils.toArray<HTMLElement>(".login-content", root)[0];

            if (!logo || !title || !description || !signupBtn || !loginBtn || !loginContent ) return;

            // explore screen els
            const exploreContent = gsap.utils.toArray<HTMLElement>(".explore-content", root)[0];
            const header = gsap.utils.toArray<HTMLElement>(".header", root)[0];
            const trendingSpotsTitle = gsap.utils.toArray<HTMLElement>(".trending-spots-title", root)[0];
            const trendingSpotsBg = gsap.utils.toArray<HTMLElement>(".trending-spots-bg", root)[0];
            const trendingSpots = gsap.utils.toArray<HTMLElement>(".fake-spot-card", root);
            const leaderboardSection = gsap.utils.toArray<HTMLElement>(".leaderboard-section", root)[0];
            const leaderboardTitle = gsap.utils.toArray<HTMLElement>(".leaderboard-title", root)[0];
            const leaderboardBg = gsap.utils.toArray<HTMLElement>(".leaderboard-bg", root)[0];
            const fakeLeaderboardUsers = gsap.utils.toArray<HTMLElement>(".fake-leaderboard-user", root);
            const navItems = gsap.utils.toArray<HTMLElement>(".nav-item", root);

            if (!exploreContent || !header ||!trendingSpotsTitle || !trendingSpotsBg || !leaderboardSection || !leaderboardTitle || !leaderboardBg || !fakeLeaderboardUsers.length || !navItems) return;


            gsap.set(exploreContent, { autoAlpha: 0, scale: 0.8 });

            tlRef.current = gsap.timeline({ paused: true, defaults: {  }})
            .fromTo(root, {
                autoAlpha: 0,
                scale: 0.9,
            }, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(2)",
            }, "0.5")
            .fromTo([title, description], {
                autoAlpha: 0,
                y: 30,
            }, {
                autoAlpha: 1,
                y: 0,
                stagger: {
                    each: 0.1,
                    from: "start",
                },
                ease: "circ.inOut",
                duration: 1.2,
            }, "<")
            .fromTo(logo, {
                autoAlpha: 0,
                scale: 0.8
            }, {
                autoAlpha: 1,
                scale: 1,
                ease: "back.out(2)",
                duration: 0.8,
            }, "<=0.2")
            .fromTo([signupBtn, loginBtn], {
                autoAlpha: 0,
                scale: 0.9,
            }, {
                autoAlpha: 1,
                scale: 1,
                ease: "back.out(2)",
                stagger: 0.2,
                duration: 1,
            }, ">");

            hoveredPreviewTlRef.current = gsap.timeline({ paused: true, defaults: { duration: 0.4 } })

            .to(loginContent, {
                autoAlpha: 0,
                scale: 0.8,
                stagger: {
                    each: 0.05,
                    from: "end",
                },
                ease: "back.in(1.7)",
                duration: 0.5,
            })
            .to(exploreContent, {
                autoAlpha: 1,
                scale: 1,
                stagger: {
                    each: 0.05,
                    from: "start",
                },
                ease: "back.out(1.7)",
                duration: 0.5,
            }, "-=0.1")
            .fromTo(trendingSpots, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                stagger: 0.1,
            }, "<=0.2")
            .fromTo(fakeLeaderboardUsers, {
                autoAlpha: 0,
                y: 10,
            }, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.05
            }, "<=0.05")
            .fromTo(navItems, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                stagger: 0.05,
            }, "<=0.05")


            return () => {
                tlRef.current?.kill();
                tlRef.current = null;
                hoveredPreviewTlRef.current?.kill();
                hoveredPreviewTlRef.current = null;
                gsap.set([root, logo, title, description, signupBtn, loginBtn], { clearProps: "all" });
            }
        },
        {scope: scopeRef, dependencies: [], revertOnUpdate: true}
    )
    return (
        <AndroidWrapper ref={scopeRef}>
            {/* loginContent */}
            <div className="login-content absolute inset-0 select-none">
                {/* logo */}
                <HogSpotLogo className="abs-x-center top-15 w-20 h-auto" />
                {/* title */}
                <div className="abs-x-center top-37 w-auto h-fit overflow-hidden text-nowrap">
                    <h3 className={cn(
                        "hogspot-title text-2xl text-center text-neutral-800 dark:text-neutral-200 tracking-[5%]",
                        monomaniacOne.className,
                    )}>
                        HogSpot
                    </h3>
                </div>
                {/* subtitle */}
                <div className="abs-x-center top-47 w-25 h-fit overflow-hidden text-nowrap">
                    <p className={cn(
                        "hogspot-description text-xs text-center text-neutral-600 dark:text-neutral-400 tracking-[5%]",
                        monomaniacOne.className,
                    )}>
                        UARK geogussr.
                    </p>
                </div>
                {/* started btn */}
                <div className="signup-btn absolute bottom-10 w-full h-8 bg-rose-500 rounded-lg flex-center tracking-[5%]">
                    <p className={cn("text-xs text-white dark:text-[#141D21]", monomaniacOne.className)}>
                        get started
                    </p>
                </div>
                {/* login btn */}
                <div className="login-btn absolute bottom-0 w-full h-8 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg flex-center tracking-[5%]">
                    <p className={cn("text-xs text-rose-500", monomaniacOne.className)}>
                        log in
                    </p>
                </div>
            </div>
            {/* exploreContent */}
            <div className="explore-content absolute inset-0 select-none">
                {/* header */}
                <div className="header w-24.75 absolute top-px right-0 h-5 flex items-center justify-between">
                    <h5 className={cn(
                        "text-xs text-center text-neutral-800 dark:text-neutral-200 tracking-[5%]",
                        monomaniacOne.className,
                    )}>
                        Explore
                    </h5>
                    <div className="w-4 h-4 rounded-full bg-rose-500 flex-center">
                        <span className={cn("text-xs mb-px text-white dark:text-[#141D21]", monomaniacOne.className)}>
                            J
                        </span>
                    </div>
                </div>
                {/* trending spots */}
                <div className="trending-spots-section absolute left-0 top-12 w-full flex flex-col items-start gap-2">
                    <h3 className={cn(
                        "trending-spots-title text-sm text-center text-neutral-800 dark:text-neutral-200 tracking-[5%]",
                        monomaniacOne.className,
                    )}>
                        Trending Spots
                    </h3>
                    <div className="trending-spots-bg w-full h-25 rounded-2xl bg-neutral-100 dark:bg-[#1D292F] flex items-center justify-start gap-1">
                        <FakeSpotCard title="Old Main" difficulty="Hard" stars={3} src="/images/stories/hogspot-oldmain.png"/>
                        <FakeSpotCard title="Greek Theatre" difficulty="Easy" stars={3} src="/images/stories/hogspot-greektheatre.png" />
                    </div>
                </div>
                {/* Leaderboard */}
                <div className="leaderboard-section absolute left-0 top-48 w-full flex flex-col items-start gap-2">
                    <h3 className={cn(
                        "leaderboard-title text-sm text-center text-neutral-800 dark:text-neutral-200 tracking-[5%]",
                        monomaniacOne.className,
                    )}>
                        Leaderboard
                    </h3>
                    <div
                        className="leaderboard-bg w-full h-25 bg-neutral-100 dark:bg-[#1D292F] rounded-xl flex flex-col items-center justify-start gap-2 p-2"
                    >
                        {fakeLeaderboardUsers.map((user, index) => (
                            <FakeLeaderboardUser
                                key={index}
                                place={index + 1}
                                name={user.name}
                                color={user.color}
                                xp={user.xp}
                            />
                        ))}
                    </div>
                </div>
                {/* navigation */}
                <div className="navigation absolute bottom-0 w-full h-10 bg-white dark:bg-[#141D21] z-10 flex items-stretch justify-between">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "nav-item flex flex-1 h-full flex-col items-center justify-evenly px-2 py-0.5 rounded-md",
                                )}
                            >
                                <item.icon className={cn("w-3.5 h-3.5 shrink-0", item.name === "Explore" ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400")} />
                                <p className={cn(
                                    "text-[8px] leading-none",
                                    monomaniacOne.className,
                                    item.name === "Explore" ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400"
                                )}>
                                    {item.name}
                                </p>
                            </div>
                        ))}
                </div>
            </div>

        </AndroidWrapper>
    )
}

const FakeSpotCard = ({ title, difficulty, stars, src }: { title: string; difficulty: string; stars: number; src: string }) => {

    return (
        <div
            className={cn(
                "fake-spot-card h-full w-20 bg-neutral-200 dark:bg-[#131b1f] rounded-md px-2 py-1 flex flex-col items-start gap-1 select-none",
            )}
        >
            <Image
                src={src}
                alt={`${name} thumbnail`}
                width={60}
                height={50}
                className="object-cover rounded-sm select-none"
                draggable={false}
            />
            <h3 className={cn(
                "hogspot-title text-[10px] text-neutral-800 dark:text-neutral-200 line-clamp-1 text-start",
                monomaniacOne.className,
            )}>
                {title}
            </h3>
            <div className="w-full h-4 flex gap-1 items-center justify-start">
                <div className={cn(
                    "w-5 h-full flex-center rounded-sm",
                    difficulty === "Easy" ? "bg-green-500" : "bg-rose-500"
                )}>
                    <p className={cn("text-[8px] text-white", monomaniacOne.className)}>
                        {difficulty}
                    </p>
                </div>

            </div>
        </div>
    )
}

const FakeLeaderboardUser = ({ place, name, color, xp }: { place: number; name: string; color: string; xp: number }) => {
    return (
        <div className="fake-leaderboard-user w-full h-5 flex items-center justify-between px-1">
            <div className="flex items-center justify-start gap-2">
                <p
                    className={cn(
                        "text-[10px]",
                        place === 1 ? "text-[#FBBF24]" : place === 2 ? "text-stone-400" : place === 3 ? "text-[#A16207]" : "text-neutral-800 dark:text-neutral-200",
                        monomaniacOne.className,
                    )}
                >
                    {place}
                </p>
                <div className={cn(
                    "w-4 h-4 rounded-full flex-center",
                    color === "blue" ? "bg-blue-500" : color === "purple" ? "bg-purple-500" : color === "rose" ? "bg-rose-500" : "bg-neutral-500",
                )}>
                    <span className={cn("text-xs mb-px text-white dark:text-[#141D21]", monomaniacOne.className)}>
                        {name === "(You)" ? "J" : name.split(" ")[0][0]}
                    </span>
                </div>
                <p className={cn("text-[11px] text-neutral-800 dark:text-neutral-200", monomaniacOne.className)}>
                    {name}
                </p>

            </div>
            <p className={cn("text-[10px] text-neutral-800 dark:text-neutral-200", monomaniacOne.className)}>
                    {xp} XP
            </p>
        </div>
    )
}

export default HogSpotThumbnail