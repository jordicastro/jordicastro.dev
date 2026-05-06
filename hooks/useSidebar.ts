import { create } from "zustand";
import { persist } from "zustand/middleware";
 
type SidebarStore = {
    isCollapsed: boolean;
    hasHydrated: boolean;
    setIsCollapsed: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
};

// use persist to save the sidebar state in local storage, so it can be restored on page reload
export const useSidebar = create<SidebarStore>()(
    persist(
        (set) => ({
            isCollapsed: false,
            hasHydrated: false,
            setIsCollapsed: (value) => {
                set({ isCollapsed: value });
            },
            setHasHydrated: (value) => {
                set({ hasHydrated: value });
            },

        }),
        { // name of the local storage key
            name: "sidebar",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);

export const useResolvedSidebar = () => {
    const { isCollapsed, hasHydrated, setIsCollapsed } = useSidebar();
    const resolvedIsCollapsed = hasHydrated ? isCollapsed : true;

    return {
        isCollapsed: resolvedIsCollapsed,
        setIsCollapsed,
        hasHydrated,
    }
}