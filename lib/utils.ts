import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import gsap from "gsap";
import { directionType } from "@/types/types";
import { homeSections } from "@/constants/constants";
import { storyCards } from "@/app/(main)/_components/sections/StoriesSection";
import { useStoriesOptions } from "@/hooks/useStoriesOptions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollTo = (id: string, offsetY?: number) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    gsap.to(window, { scrollTo: { y: el, offsetY: offsetY ?? 10 }, duration: 1, ease: "power4.inOut" });
};

export const getNextSectionId = (currentSectionId: string, direction: directionType) => {
  const currentIndex = homeSections.findIndex(s => s.id === currentSectionId);
  if (currentIndex === -1) return null;

  return direction === "down" ?
    homeSections[Math.min(currentIndex + 1, homeSections.length - 1)].id :
    homeSections[Math.max(currentIndex - 1, 0)].id; 
}

export const getElCenter = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
    };
}

export const getVisibleStories = () => {
    const { activeFilters, activeSort } = useStoriesOptions(); // get active filters from the dropdown options hook
    // if no filters are active, show all stories
    if (activeFilters.length === 0) return storyCards;

    // else filter stories based on active filters
    let filteredStories = storyCards.filter((story) => {
        if (activeFilters.includes("projects") && story.type === "projects") return true;
        if (activeFilters.includes("industry") && story.type === "industry") return true;
        if (activeFilters.includes("research") && story.type === "research") return true;
        return false;
    });

    // 2nd filter for active sort option
    if (activeSort === "Newest") {
        filteredStories.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (activeSort === "Oldest") {
        filteredStories.sort((a, b) => parseInt(a.year) - parseInt(b.year));
    } else if (activeSort === "A-Z") {
        filteredStories.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filteredStories;
}
