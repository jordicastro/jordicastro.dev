import { create } from "zustand";
import { homeSections } from "@/constants/constants";

type directionType = "up" | "down" | null;

type ScrollMaskStore = {
    isAnimating: boolean;
    setIsAnimating: (animating: boolean, thisDirection?: directionType, thisDuration?: number) => void;
    direction: directionType;
    setDirection: (direction: "up" | "down") => void;
    duration: number;
    setDuration: (duration: number) => void;
    activeSectionId: string;
    setActiveSection: (sectionId: string) => void;
};

export const useScrollMask = create<ScrollMaskStore>( (set, get) => ({
    isAnimating: false,
    direction: null,
    activeSection: 0,
    activeSectionId: "home",
    duration: 1,
    setIsAnimating: (animating: boolean, thisDirection="down", thisDuration?: number) => {set({ isAnimating: animating}); thisDirection && set({ direction: thisDirection}); thisDuration !== undefined && set({ duration: thisDuration })},
    setDirection: (direction: "up" | "down") => set({ direction }),
    setDuration: (duration: number) => set({ duration }),
    setActiveSection: (sectionId: string) => {
        set({ activeSectionId: sectionId });
    },

}))