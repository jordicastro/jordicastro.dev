import { useEffect, useState } from "react";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type StoriesOptionsStore = {
    activeFilters: string[];
    activeSort: string;
    hasHydrated: boolean;
    setActiveFilters: (filters: string[]) => void;
    setActiveSort: (sort: string) => void;
    setHasHydrated: (value: boolean) => void;
};

export const useStoriesOptions = create<StoriesOptionsStore>()(
    persist(
        (set) => ({
            activeFilters: [],
            activeSort: "Newest",
            hasHydrated: false,
            setActiveFilters: (filters) => {
                set({ activeFilters: filters });
            },
            setActiveSort: (sort) => {
                set({ activeSort: sort });
            },
            setHasHydrated: (value) => {
                set({ hasHydrated: value });
            }
        }),
        {
            name: "stories-options",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);