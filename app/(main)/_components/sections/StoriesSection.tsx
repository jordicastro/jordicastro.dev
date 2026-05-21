"use client"

import DropdownButton from '@/components/DropdownButton'
import { shapeClasses } from '@/constants/constants'
import { useStoriesDropdownOptions } from '@/hooks/useStoriesDropdownOptions'
import { cn } from '@/lib/utils'
import { FilterOption, storyCard, StoryThumbnailProps } from '@/types/types'
import { ArrowDownUp, ListFilter } from 'lucide-react'
import { useGSAP } from "@gsap/react";
import { Observer, ScrollTrigger } from "gsap/all";
import gsap from "gsap"
import { useEffect, useRef, useState } from 'react'
import { useStoriesOptions } from '@/hooks/useStoriesOptions'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import SPThumbnail from '../storythumbnails/SPThumbnail'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useScrollMask } from '@/hooks/useScrollMask'

gsap.registerPlugin(useGSAP, Observer, ScrollTrigger);

const StoriesSection = ({ id: thisSectionId }: { id?: string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { activeFilters, activeSort } = useStoriesOptions();
    const visibleStories = getVisibleStories(activeFilters, activeSort);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const preventScrollRef = useRef<Observer | null>(null);
    const { isAnimating, activeSectionId, setIsAnimating } = useScrollMask();
    const scrollDirection = useRef<"up" | "down" | null>("down");
    const isFirstScroll = useRef<boolean>(true);
    const isAnimatingRef = useRef<boolean>(isAnimating);
    const [handedOff, setHandedOff] = useState<boolean>(false);
    const handedOffRef = useRef<boolean>(false);
    const downDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousBodyOverflowRef = useRef("");
    const isScrollLockedRef = useRef(false);
    // flag to determine whether to play or pause the thumbnail timeline refs
    const shouldPlayThumbnails = activeSectionId === thisSectionId && !isAnimating;

    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    useEffect(() => {
        handedOffRef.current = handedOff;
    }, [handedOff]);


    useGSAP(() => {
        if (!tlRef.current) return;

        if (activeSectionId === thisSectionId && isAnimating) {
            tlRef.current.pause();
            gsap.delayedCall(0.5, () => { // pause in place, reset when the mask hides the section
                tlRef.current?.pause(0);
            })
            return;
        }

        if (activeSectionId === thisSectionId && !isAnimating) {
            tlRef.current.play();
            lockScroll();
            return;
        }

        tlRef.current.pause(0);
        unlockScroll();
    }, [activeSectionId, isAnimating])


    const { contextSafe } = useGSAP(
        () => {},
        { scope: scopeRef, dependencies: []}
    );

    const clearDownAction = () => {
        if (downDebounceTimerRef.current !== null) {
            clearTimeout(downDebounceTimerRef.current);
            downDebounceTimerRef.current = null;
        }
    };

    const lockScroll = contextSafe(() => {
        if (isScrollLockedRef.current) return;

        clearDownAction();
        previousBodyOverflowRef.current = document.body.style.overflow;
        preventScrollRef.current?.enable();
        document.body.style.overflow = "hidden";
        isScrollLockedRef.current = true;
    });
    const unlockScroll = contextSafe(() => {
        if (!isScrollLockedRef.current) return;

        clearDownAction();
        preventScrollRef.current?.disable();
        document.body.style.overflow = previousBodyOverflowRef.current;
        isScrollLockedRef.current = false;
    });

    useGSAP(
        () => {
            const cards = scopeRef.current?.querySelectorAll(".story-card");
            if (!cards || cards.length === 0) return;

            tlRef.current?.kill();
            gsap.killTweensOf(cards);
            tlRef.current = gsap.timeline({ paused: true })
            .fromTo(
                cards,
                {
                    opacity: 0,
                    scale: 0.96,
                    y: 14,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.45,
                    ease: "power2.out",
                    stagger: {
                        each: 0.04,
                        from: "start",
                    },
                    overwrite: "auto",
                    clearProps: "opacity,transform",
                }
            );

            const thresholdTl = gsap.timeline({
                scrollTrigger: {
                    trigger: scopeRef.current,
                    start: "top-=1 top",
                    end: "top+=10 top",
                    // markers: true,
                    onEnter: (self) => {
                        lockScroll();
                        if (self.getVelocity() > 0) {
                            isFirstScroll.current = false;
                        }
                    },
                    onLeave: () => {
                        unlockScroll();
                    },
                    onEnterBack: (self) => {
                        const v = Math.abs(self.getVelocity());
                        
                        if (v > 3000) {
                            console.log('very fast scroll, skipping mask: ', v)
                            tlRef.current?.pause(0);
                        } else if (v > 2000) {
                            console.log('fast scroll, animating mask in: ', v)
                            handedOffRef.current = false;
                            !isAnimatingRef.current && setIsAnimating(true, "up", 0.75);
                        } else {
                            console.log('entering back, locking scroll')
                            lockScroll();
                        }
                    },
                    onLeaveBack: () => {
                        console.log('unlockScroll')
                        unlockScroll();
                    },
                }
            })

            if (activeSectionId === thisSectionId && !isAnimating) {
                tlRef.current.play(0);
            }
            const updateHandedOff = (value: boolean) => {
                handedOffRef.current = value;
                setHandedOff(value);
            };

            preventScrollRef.current = ScrollTrigger.observe({
                target: scopeRef.current,
                type: "wheel,touch",
                preventDefault: true,
                allowClicks: true,
                onToggleY: (self) => { // determine the scroll direction for onStop
                    if (self.deltaY > 0) scrollDirection.current = "down";
                    else if (self.deltaY < 0) scrollDirection.current = "up";
                },
                onUp: () => { // continue to the prev section after the "first" scroll lock
                    if (isFirstScroll.current) return; 
                    !isAnimatingRef.current && setIsAnimating(true, "up");
                    isFirstScroll.current = true;
                    updateHandedOff(true);
                },
                onDown: () => { // break free from the scroll lock to view more stories
                    clearDownAction();
                    isFirstScroll.current = true;
                    unlockScroll();
                },
                onStop: () => { // wait for momentum from first scroll to end before allowing the next scroll in onDown

                    if (scrollDirection.current === "up") {
                        isFirstScroll.current = false;
                    }
                },
                onStopDelay: 0, // allow the user to continue as soon as possible after momentum ends
            })

            return () => {
                tlRef.current?.kill();
                tlRef.current = null;
                gsap.killTweensOf(cards);
                gsap.set(cards, { clearProps: "opacity,transform" });
                clearDownAction();
                unlockScroll();
                preventScrollRef.current?.kill();
                preventScrollRef.current = null;
            };
        },
        { scope: scopeRef, dependencies: [activeFilters, activeSort] }
    )

    return (
        <div ref={scopeRef} id={thisSectionId} className="w-full min-h-screen flex flex-col gap-15 border-debug-l pt-20 px-5 sm:px-10 lg:px-20">
            <StoriesHeader />
            <Stories visibleStories={visibleStories} shouldPlayThumbnails={shouldPlayThumbnails} />
        </div>
    )
}

const StoriesHeader = () => {
    const { filterOptions, sortOptions } = useStoriesDropdownOptions();

    return (
        <div className="w-full h-auto flex items-center justify-between">
            <h4 className="mb-0">STORIES</h4>
            <div className="w-auto h-auto flex items-center justify-end gap-11">
                <DropdownButton label="Filter" icon={ListFilter} options={filterOptions} checkBoxes />
                <DropdownButton label="Sort" icon={ArrowDownUp} options={sortOptions} />
            </div>
        </div>
    )
}

const Stories = ({ visibleStories, shouldPlayThumbnails }: { visibleStories: storyCard[], shouldPlayThumbnails: boolean }) => {
    return (
        <div className="stories-container w-full min-h-svh">
            <div className="masonic-wrapper w-full">
                <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 2, 1150: 3}}
                    gutterBreakPoints={{350: 12, 750: 16, 1150: 24}}
                >
                    <Masonry>
                        {visibleStories.map((story) => (
                            <StoryCard key={story.id} storyData={story} shouldPlayThumbnail={shouldPlayThumbnails} />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </div>
    )
}

const StoryCard = ({ storyData, shouldPlayThumbnail }: { storyData: storyCard, shouldPlayThumbnail: boolean }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const expandDescriptionTl = useRef<gsap.core.Timeline | null>(null);
    const notAllowedTl = useRef<gsap.core.Timeline | null>(null);
    const hoverCardTl = useRef<gsap.core.Timeline | null>(null);
    const { slug, title, icon, subtitle, year, description, thumbnail: Thumbnail, shape, className, onHover, onHoverEnd, notAllowed } = storyData;
    const [isHovered, setIsHovered] = useState(false);
    const notAllowedWords = ["SOON", "COMING", "SOON", "COMING"];
    const { resolvedTheme } = useTheme();
    const router = useRouter();

    gsap.registerPlugin(useGSAP);

    

    // sets up the timeline refs and initial gsap states
    const { contextSafe } = useGSAP(
        () => {
            if (!resolvedTheme) return;
            const descriptionWrapper = scopeRef.current?.querySelector(".description-wrapper");
            const descriptionBg = descriptionWrapper?.querySelector(".description-bg");
            if (!descriptionWrapper || !descriptionBg) return;

            gsap.set(descriptionBg, { opacity: 0.25 });

            hoverCardTl.current = gsap.timeline({ paused: true })
            .to(scopeRef.current, {
                y: -4,
                scale: 1.02,
                duration: 0.3,
                ease: "power1.out",
            });

            if (description) {
                expandDescriptionTl.current = gsap.timeline({ paused: true})
                .to(descriptionWrapper, {
                    y: -46,
                    duration: 0.3,
                    ease: "power1.out",
                })
                .to(descriptionBg, {
                    opacity: 0.5,
                    duration: 0.3,
                    ease: "power1.out",
                }, "<");
            }
            if (notAllowed) {
                const notAllowedWrapper = scopeRef.current?.querySelector(".not-allowed-wrapper");
                const notAllowedTrack = notAllowedWrapper?.querySelector(".not-allowed-track");
                const randomColors = gsap.utils.shuffle([
                    "var(--color-rose-400)",
                    "var(--color-orange-400)",
                    "var(--color-yellow-400)",
                    "var(--color-green-400)",
                    "var(--color-teal-400)",
                    "var(--color-cyan-400)",
                    "var(--color-blue-400)",
                    "var(--color-indigo-400)",
                    "var(--color-purple-400)",
                    "var(--color-fuchsia-400)",
                    "var(--color-pink-400)"
                ])
                if (!notAllowedWrapper || !notAllowedTrack) return;

                const notAllowedLoopWidth = notAllowedTrack.scrollWidth / 2;
                if (!notAllowedLoopWidth) return;

                gsap.set(notAllowedWrapper, {
                    autoAlpha: 0,
                    borderColor: gsap.utils.random(randomColors),
                });
                gsap.set(notAllowedTrack, { x: -notAllowedLoopWidth });

                notAllowedTl.current?.kill();

                notAllowedTl.current = gsap.timeline({ paused: true })

                .set(notAllowedWrapper, {
                    autoAlpha: 1,
                })
                .to(notAllowedTrack, {
                    x: `+=${notAllowedLoopWidth}`,
                    duration: 5,
                    ease: "none",
                    repeat: -1,
                    modifiers: {
                        x: gsap.utils.unitize((x) => gsap.utils.wrap(-notAllowedLoopWidth, 0, parseFloat(x))),
                    },
                });

            }

            return () => {
                expandDescriptionTl.current?.kill();
                notAllowedTl.current?.kill();
            }
        },
        { scope: scopeRef, dependencies: [resolvedTheme] }
    );

    const onHoverDesc = contextSafe(() => {
        expandDescriptionTl.current?.play();
    });
    const onHoverEndDesc = contextSafe(() => {
        expandDescriptionTl.current?.reverse();
    });

    const handlePointerEnter = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
        // update state
        setIsHovered(true);
        onHover && onHover();

        // play the hover animation
        hoverCardTl.current?.play();

        if (notAllowed) { // animate the coming soon carousel in
            const notAllowedWrapper = scopeRef.current?.querySelector(".not-allowed-wrapper");
            if (!notAllowedWrapper) return;

            gsap.to(notAllowedWrapper, {
                autoAlpha: 1,
                duration: 0.2,
                ease: "power1.out",
                overwrite: true,
            });
            notAllowedTl.current?.restart();
        }

    });

    const handlePointerLeave = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
        // update state
        setIsHovered(false);
        onHoverEnd && onHoverEnd();

        // reverse the hover animation
        hoverCardTl.current?.reverse();

        if (notAllowed) { // fade out coming soon carousel
            const notAllowedWrapper = scopeRef.current?.querySelector(".not-allowed-wrapper");
            if (!notAllowedWrapper) return;
            gsap.to(notAllowedWrapper, {
                autoAlpha: 0,
                duration: 0.2,
                ease: "power1.in",
                onComplete: () => {
                    notAllowedTl.current?.pause(0);
                }
            })
        }
    });

    const handleClick = () => {
        if (notAllowed) return;
        if (slug) {
            router.push(`/stories/${slug}`);
            return;
        }
    }

    return (
        <div
            ref={scopeRef}
            className={cn(
                "story-card-shell relative self-start max-w-full",
                shapeClasses[shape],
                notAllowed ? "cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={handleClick}
            onPointerEnter={(event) => {
                handlePointerEnter(event);
            }}
            onPointerLeave={(event) => {
                handlePointerLeave(event);
            }}
            data-cursor={storyData.notAllowed ? "not-allowed" : "pointer"}
        >
            <div
                className={cn(
                    "story-card relative flex h-full max-w-full flex-col gap-4 overflow-hidden rounded-lg border-2 border-neutral-300 p-4 dark:border-neutral-800",
                    className,
                )}
            >
                <div className="thumbnail-wrapper flex-center min-h-0 flex-1">
                    <Thumbnail isHovered={isHovered} shouldPlayThumbnail={shouldPlayThumbnail} />
                </div>
                {notAllowed && (
                    <div className="not-allowed-wrapper absolute -left-20 top-10 flex h-7 w-60 items-center overflow-hidden -rotate-45 border border-red-500">
                        <div className="not-allowed-track flex h-full w-max items-center whitespace-nowrap">
                            {[...notAllowedWords, ...notAllowedWords].map((word, index) => (
                                <span key={index} className="not-word shrink-0 px-1.5 text-[10px] font-bold tracking-[0.15rem] text-text-primary">
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <div
                    className={cn(
                        "description-wrapper abs-x-center w-full text-text-secondary flex flex-col items-start justify-start gap-4 px-4 py-4",
                        shape === "landscape" ? "h-30.5 -bottom-11.5" : shape === "portrait" ? "h-30.5 -bottom-11.5" : "h-30.5 -bottom-11.5",
                    )}
                    onPointerEnter={onHoverDesc}
                    onPointerLeave={onHoverEndDesc}
                >
                    <div className="description-bg bg-bg-secondary backdrop-blur-3xl absolute inset-0 z-0" />
                    <div className={cn("z-10 w-full flex flex-col", icon ? "gap-0.5": "gap-2")}>
                        {icon && <span className="">{icon}</span>}
                        <span className="line-clamp-1 text-sm">
                            {title}
                        </span>
                        <div className="flex items-center justify-between text-text-tertiary">
                            <p className="text-inherit text-xs line-clamp-1">{subtitle}</p>
                            <p className="text-inherit text-xs">{year}</p>
                        </div>
                    </div>
                    <div className="z-10 line-clamp-2">
                        <p className="text-xs line-clamp-3 text-text-tertiary">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TempThumbnail = ({}: StoryThumbnailProps) => (
    <div className="">
        temp ReactNode
    </div>
)
const TempIcon = TempThumbnail;

const getVisibleStories = (activeFilters: FilterOption[], activeSort: string): storyCard[] => {
    const visibleStories = (activeFilters.length > 0
        ? storyCards.filter((story) => activeFilters.includes(story.type))
        : storyCards
    ).slice();

    if (activeSort === "Newest") {
        visibleStories.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (activeSort === "Oldest") {
        visibleStories.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } else if (activeSort === "A-Z") {
        visibleStories.sort((a, b) => a.title.localeCompare(b.title));
    }

    return visibleStories;
}

export const storyCards:storyCard[] = [
    {
        id: "supplypike",
        slug: "supplypike-internship",
        title: "SupplyPike (SPS Commerece)",
        subtitle: " Software Engineer Intern",
        year: "2025",
        description: "Features I implemented as a software engineer intern at SP.",
        thumbnail: SPThumbnail,
        type: "industry",
        shape: "landscape",
        onHover: () => { },
        onHoverEnd: () => { },
    },
    {
        id: "veggievision",
        slug: "veggie-vision-ai",
        title: "Walmart AI Workshop",
        subtitle: "Veggie Vision",
        year: "2025",
        description: "A computer vision model that classifies bagged produce.",
        thumbnail: TempThumbnail,
        type: "projects",
        shape: "portrait",
        notAllowed: true,
    },
    {
        id: "shakespeare",
        slug: "shakespearean-text-inference",
        title: "",
        icon: <img src="/images/shakey.png" alt="Shakey Icon" className="h-6 w-6" />,
        subtitle: "Shakespearean Text Inference",
        year: "2025",
        description: "Natural language processing research to create a predictive model.",
        thumbnail: TempThumbnail,
        type: "research",
        shape: "landscape",
        notAllowed: true,
    },
    {
        id: "running",
        slug: "marathon-training",
        title: "Running",
        subtitle: "Training for the Little Rock Marathon",
        year: "2025",
        description: "Dedicating a year to training to see how fast I can run 26.2 miles.",
        thumbnail: TempThumbnail,
        type: "projects",
        shape: "landscape",
        notAllowed: true,
    },
    {
        id: "hogspot",
        slug: "hogspot-mobile",
        title: "Mobile Development",
        subtitle: "HogSpot Mobile",
        year: "2024",
        description: "An Android app for students to find landmarks at the University of Arkansas.",
        thumbnail: TempThumbnail,
        type: "projects",
        shape: "portrait",
        notAllowed: true,
    },
    {
        id: "licenseplate",
        slug: "license-plate-detection",
        title: "Machine Learning",
        subtitle: "License Plate Detection",
        year: "2025",
        description: "Training a robust computer vision model to detect license plates in various conditions.",
        thumbnail: TempThumbnail,
        type: "research",
        shape: "landscape",
        notAllowed: true,
    },
    {
        id: "pqc",
        title: "University of Arkansas",
        subtitle: "Post-Quantum Cryptography App",
        year: "2024",
        description: "A POC app that allows users to utilize the university's cryptography equipment remotely",
        thumbnail: TempThumbnail,
        type: "research",
        shape: "landscape",
        notAllowed: true,
    },
    {
        id: "spotify",
        title: "Spotify App",
        subtitle: "Redesigning the Spotify UI",
        year: "2023",
        description: "Learning Figma and React with Tailwind by redesigning the Spotify interface",
        thumbnail: TempThumbnail,
        type: "projects",
        shape: "landscape",
        notAllowed: true,
    },
    {
        id: "portfoliov1",
        title: "Portfolio Website v1",
        subtitle: "My first portfolio website",
        year: "2023",
        description: "Built with Vite and vanilla css, this was my first personal website.",
        thumbnail: TempThumbnail,
        type: "projects",
        shape: "landscape",
        notAllowed: true,
    },
]

export default StoriesSection