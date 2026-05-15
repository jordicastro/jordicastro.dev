import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FilterOption, SortOption } from "@/types/types";

type StoriesOptionsStore = {
    activeFilters: FilterOption[];
    activeSort: SortOption;
    hasHydrated: boolean;
    setActiveFilters: (filters: FilterOption[]) => void;
    setActiveSort: (sort: SortOption) => void;
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