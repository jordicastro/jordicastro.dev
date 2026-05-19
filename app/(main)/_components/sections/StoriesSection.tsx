"use client"

import DropdownButton from '@/components/DropdownButton'
import { shapeClasses } from '@/constants/constants'
import { useStoriesDropdownOptions } from '@/hooks/useStoriesDropdownOptions'
import { cn } from '@/lib/utils'
import { FilterOption, storyCard } from '@/types/types'
import { ArrowDownUp, ListFilter } from 'lucide-react'
import { useGSAP } from "@gsap/react";
import gsap from "gsap"
import { useRef } from 'react'
import { useStoriesOptions } from '@/hooks/useStoriesOptions'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

gsap.registerPlugin(useGSAP);

const StoriesSection = ({ id }: { id?: string }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const { activeFilters, activeSort } = useStoriesOptions();
    const visibleStories = getVisibleStories(activeFilters, activeSort);

    useGSAP(
        () => {
            const cards = scopeRef.current?.querySelectorAll(".story-card");
            if (!cards || cards.length === 0) return;

            gsap.killTweensOf(cards);
            gsap.fromTo(
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

            return () => {
                gsap.killTweensOf(cards);
                gsap.set(cards, { clearProps: "opacity,transform" });
            };
        },
        { scope: scopeRef, dependencies: [activeFilters, activeSort] }
    )

    return (
        <div ref={scopeRef} id={id} className="w-full min-h-screen flex flex-col gap-15 border-debug-p pt-20 px-5 sm:px-10 lg:px-20">
            <StoriesHeader />
            <Stories visibleStories={visibleStories} />
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

const Stories = ({ visibleStories }: { visibleStories: storyCard[] }) => {
    console.log('visibleStories: ', visibleStories);
    return (
        <div className="stories-container w-full min-h-svh">
            <div className="masonic-wrapper w-full">
                <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 2, 1150: 3}}
                    gutterBreakPoints={{350: 12, 750: 16, 1150: 24}}
                >
                    <Masonry>
                        {visibleStories.map((story) => (
                            <StoryCard key={story.id} storyData={story} />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </div>
    )
}

const StoryCard = ({ storyData }: { storyData: storyCard }) => {
    const { subtitle, year, shape, className, type } = storyData;
    return (
        <div className={cn("story-card relative self-start flex max-w-full flex-col gap-4 border-debug-p p-4", shapeClasses[shape], className)}>
            <div className="thumbnail-wrapper flex-center min-h-0 flex-1">
                {shape}
            </div>
            <div
                className={cn(
                    "abs-x-center w-full text-text-tertiary flex flex-col gap-2 px-4",
                    shape === "landscape" ? "h-37.5 -bottom-20" : shape === "portrait" ? "h-37.5 -bottom-20" : "h-37.5 -bottom-20",
                )}
            >
                {type}
                <div className="flex items-center justify-between text-text-tertiary">
                    <p className="text-inherit text-sm">{subtitle}</p>
                    <p className="text-inherit text-sm">{year}</p>
                </div>
            </div>
        </div>
    )
}

const TempThumbnail = () => (
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
        title: "SupplyPike (SPS Commerece)",
        subtitle: " Software Engineer Intern",
        year: "2025",
        description: "Features I implemented as a software engineer intern at SP.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked SupplyPike card"),
        type: "industry",
        shape: "landscape"
    },
    {
        id: "veggievision",
        title: "Walmart AI Workshop",
        subtitle: "Veggie Vision",
        year: "2025",
        description: "A computer vision model that classifies bagged produce.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked Veggie Vision card"),
        type: "projects",
        notAllowed: true,
        shape: "portrait"
    },
    {
        id: "shakespeare",
        title: "",
        icon: <TempIcon />,
        subtitle: "Shakespearean Text Inference",
        year: "2025",
        description: "Natural language processing research to create a predictive model.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked Shakespeare card"),
        type: "research",
        shape: "landscape",
    },
    {
        id: "running",
        title: "Running",
        subtitle: "Training for the Little Rock Marathon",
        year: "2025",
        description: "Dedicating a year to training to see how fast I can run 26.2 miles.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked Running card"),
        type: "projects",
        shape: "landscape",
    },
    {
        id: "hogspot",
        title: "Mobile Development",
        subtitle: "HogSpot Mobile",
        year: "2024",
        description: "An Android app for students to find landmarks at the University of Arkansas.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked HogSpot card"),
        type: "projects",
        shape: "portrait",
    },
    {
        id: "licenseplate",
        title: "Machine Learning",
        subtitle: "License Plate Detection",
        year: "2025",
        description: "Training a robust computer vision model to detect license plates in various conditions.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked License Plate card"),
        type: "research",
        shape: "landscape"
    },
    {
        id: "pqc",
        title: "University of Arkansas",
        subtitle: "Post-Quantum Cryptography App",
        year: "2024",
        description: "A POC app that allows users to utilize the university's cryptography equipment remotely",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked PQC card"),
        type: "research",
        shape: "landscape",
    },
    {
        id: "spotify",
        title: "Spotify App",
        subtitle: "Redesigning the Spotify UI",
        year: "2023",
        description: "Learning Figma and React with Tailwind by redesigning the Spotify interface",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked Spotify card"),
        type: "projects",
        shape: "landscape",
    },
    {
        id: "portfoliov1",
        title: "Portfolio Website v1",
        subtitle: "My first portfolio website",
        year: "2023",
        description: "Built with Vite and vanilla css, this was my first personal website.",
        thumbnail: <TempThumbnail />,
        onClick: () => console.log("Clicked Portfolio v1 card"),
        type: "projects",
        shape: "landscape",
    },
]

export default StoriesSection