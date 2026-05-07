import { useEffect, useState } from "react";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const SIDEBAR_TRANSITION_MS = 300;
 
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
    const [isCollapsedSettled, setIsCollapsedSettled] = useState(resolvedIsCollapsed);

    // isCollapsedSettled sets a 300ms timeout when isCollapsed changes to account for the sidebar transition.
        // This is used to trigger a recalculation of the Timeline points
    useEffect(() => {
        if (!hasHydrated) {
            setIsCollapsedSettled(true);
            return;
        }

        setIsCollapsedSettled(false);
        // when isCollapsed is toggled, after the timeout isCollapsedSettled is trueCollapse
        const timeoutId = window.setTimeout(() => {
            setIsCollapsedSettled(true);
        }, SIDEBAR_TRANSITION_MS);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [resolvedIsCollapsed, hasHydrated]);

    return {
        isCollapsed: resolvedIsCollapsed,
        isCollapsedSettled,
        setIsCollapsed,
        hasHydrated,
    }
}