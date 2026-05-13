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
    prevSectionId?: string;
};

export const useScrollMask = create<ScrollMaskStore>( (set, get) => ({
    isAnimating: false,
    direction: null,
    activeSectionId: "home",
    prevSectionId: undefined,
    duration: 1,
    setIsAnimating: (animating: boolean, thisDirection="down", thisDuration?: number) => {set({ isAnimating: animating}); thisDirection && set({ direction: thisDirection}); thisDuration !== undefined && set({ duration: thisDuration })},
    setDirection: (direction: directionType) => set({ direction }),
    setDuration: (duration: number) => set({ duration }),
    setActiveSection: (sectionId: string) => {
        const prevSectionId = get().activeSectionId;
        set({ prevSectionId });
        set({ activeSectionId: sectionId });

    },

}))