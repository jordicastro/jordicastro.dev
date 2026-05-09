import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import gsap from "gsap";
import { directionType } from "@/types/types";
import { homeSections } from "@/constants/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollTo = (id: string ) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: "power4.inOut" });
};

export const getNextSectionId = (currentSectionId: string, direction: directionType) => {
  const currentIndex = homeSections.findIndex(s => s.id === currentSectionId);
  if (currentIndex === -1) return null;

  return direction === "down" ?
    homeSections[Math.min(currentIndex + 1, homeSections.length - 1)].id :
    homeSections[Math.max(currentIndex - 1, 0)].id; 
}