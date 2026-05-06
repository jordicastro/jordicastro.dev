import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import gsap from "gsap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollTo = (id: string ) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: "power4.inOut" });
};
