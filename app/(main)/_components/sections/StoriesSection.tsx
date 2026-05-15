"use client"

import DropdownButton from '@/components/DropdownButton'
import { shapeClasses } from '@/constants/constants'
import { useStoriesDropdownOptions } from '@/hooks/useStoriesDropdownOptions'
import { cn, getVisibleStories } from '@/lib/utils'
import { storyCard } from '@/types/types'
import { ArrowDownUp, ListFilter } from 'lucide-react'

const StoriesSection = ({ id }: { id?: string }) => {

    return (
        <div id={id} className="w-full min-h-screen flex flex-col gap-15 border-debug-p pt-20 px-10 lg:px-20">
            <StoriesHeader />
            <Stories />
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

const Stories = () => {

    const visibleStories: storyCard[] = getVisibleStories();

    return (
        <div className="grid w-full min-h-svh grid-cols-1 gap-5 sm:auto-rows-[8px] sm:grid-cols-2 lg:justify-center lg:grid-cols-[350px_275px_350px] xl:grid-cols-[400px_300px_400px] 2xl:grid-cols-[500px_300px_500px]">
            {visibleStories.map((story) => (
                <StoryCard
                    key={story.id}
                    storyData={story}
                />
            ))}
        </div>
    )
}

const StoryCard = ({ storyData }: { storyData: storyCard }) => {
    const { title, subtitle, description, year, thumbnail, onClick, notAllowed, shape, className, type } = storyData;

    return (
        <div className={cn("relative w-full justify-self-center border-debug-p", shapeClasses[shape], className )}>
            <div className="thumbnail-wrapper flex-center">
                {shape}
            </div>
            <div
                className={cn(
                    "absolute w-full text-text-tertiary flex flex-col gap-2 px-4",
                    shape === "landscape" ? "h-[150px] -bottom-20" : shape === "portrait" ? "h-[150px] -bottom-20" : "h-[150px] -bottom-15",
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
        // override the default widths so its slightly smaller and aligned to the right: adds a cool asymmetry to the layout
        className: "lg:max-w-[300px] xl:max-w-[350px] 2xl:max-w-[400px] justify-self-end"
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
        className: "justify-self-start"
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
        shape: "square"
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
        shape: "square",
        // make the card bigger square 1:1 ratio
        className: "lg:max-w-[260px] lg:h-[260px] lg:row-span-10 xl:max-w-[300px] xl:h-[300px] xl:row-span-11 2xl:max-w-[300px] 2xl:h-[300px] 2xl:row-span-11 justify-self-end"
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
        className: "lg:col-span-2 justify-self-start"
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
        shape: "square",
        className: "justify-self-end sm:col-span-2 lg:col-span-1 xl:mt-2"
    },
]

export default StoriesSection