import { create } from "zustand";

type ScreenMaskStore = {
    isVisible: boolean;
    duration: number;
    setIsVisible: (visible: boolean, duration?: number) => void;
    showMask: (duration?: number) => void;
    hideMask: (duration?: number) => void;
};

export const useScreenMask = create<ScreenMaskStore>((set) => ({
    isVisible: false,
    duration: 0.3,
    setIsVisible: (visible, duration) => set((state) => ({
        isVisible: visible,
        duration: duration ?? state.duration,
    })),
    showMask: (duration) => set((state) => ({
        isVisible: true,
        duration: duration ?? state.duration,
    })),
    hideMask: (duration) => set((state) => ({
        isVisible: false,
        duration: duration ?? state.duration,
    })),
}));