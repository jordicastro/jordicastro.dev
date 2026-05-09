import { directionType } from "@/types/types";
import { create } from "zustand";

type ScrollMaskStore = {
    isAnimating: boolean;
    setIsAnimating: (animating: boolean, thisDirection?: directionType, thisDuration?: number) => void;
    direction: directionType;
    setDirection: (direction: directionType) => void;
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
    setDirection: (direction: directionType) => set({ direction }),
    setDuration: (duration: number) => set({ duration }),
    setActiveSection: (sectionId: string) => {
        set({ activeSectionId: sectionId });
    },

}))