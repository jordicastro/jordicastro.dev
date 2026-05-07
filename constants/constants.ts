import { Section, timelineCardDataType } from "@/types/types";

export const homeSections: Section[] = [
    { id: "home", label: "Home", activeColor: "#155dfc"}, // bg-blue-600
    { id: "marathon", label: "Marathon" },
    { id: "timeline", label: "Timeline" },
]

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