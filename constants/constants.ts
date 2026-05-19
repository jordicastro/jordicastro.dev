import { FilterOption, Section, ShapeType, SortOption, storyCard, timelineCardDataType } from "@/types/types";
import { ChevronLeftSquareIcon } from "lucide-react";

export const homeSections: Section[] = [
    { id: "home", label: "Home", activeColor: "#155dfc"}, // bg-blue-600
    { id: "marathon", label: "Marathon" },
    { id: "timeline", label: "Timeline" },
    { id: "identity", label: "Identity" },
    { id: "stories", label: "Stories" },
]

export const optionHoverCn = "w-full rounded-lg px-2 py-1 text-start text-sm hover:bg-neutral-100/90 dark:hover:bg-neutral-800/90 hover:cursor-pointer transition-all duration-250 ease-out"

export const timelineCardsData: timelineCardDataType[] = [
    {
        title: "First Line of Code",
        company: "High School",
        year: "2018"
    },
    {
        title: "Research Assistant",
        subtitle: "Side Channel Analysis",
        company: "UofA",
        year: "2021"
    },
    {
        title: "ACM Vice President",
        company: "UofA",
        year: "2023"
    },
    {
        title: "Veggie Vision iOS",
        company: "Walmart",
        year: "2025"
    },
    {
        title: "Software Engineer Intern",
        company: "SupplyPike",
        year: "2025"
    },
    {
        title: "Portfolio Website v2",
        company: "jordicastro.dev",
        year: "2026"
    }
]

export const cursorThemeCn = "text-neutral-800 dark:text-neutral-200"

export const codeTextStyling = "p-2 bg-neutral-100 dark:bg-neutral-900 rounded-[10px] font-mono text-sm sm:text-[16px] lg:text-[18px] text-red-code"

export const storyFilterOptions: FilterOption[] = ["projects", "industry", "research"];

export const storyFilterLabels: Record<FilterOption, string> = {
    projects: "Projects",
    industry: "Industry",
    research: "Research"
}

export const storySortLabels: SortOption[] = ["Newest", "Oldest", "A-Z"] as const;

export const shapeClasses: Record<ShapeType, string> = {
    landscape: "h-58 w-full",
    portrait:  "h-128 w-full",
}