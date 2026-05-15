"use client";

import { storyFilterLabels, storySortLabels } from "@/constants/constants";
import { useStoriesOptions } from "@/hooks/useStoriesOptions";
import { DropdownOptions } from "@/types/types";

export const useStoriesDropdownOptions = (): {
    filterOptions: DropdownOptions[];
    sortOptions: DropdownOptions[];
} => {
    const { activeFilters, setActiveFilters, setActiveSort } = useStoriesOptions();

    const filterOptions = storyFilterLabels.map((label) => ({
        label,
        onClick: () => {
            const nextActiveFilters = activeFilters.includes(label)
                ? activeFilters.filter((activeFilter) => activeFilter !== label)
                : [...activeFilters, label];

            setActiveFilters(nextActiveFilters);
        },
    }));

    const sortOptions = storySortLabels.map((label) => ({
        label,
        onClick: () => {
            setActiveSort(label);
        },
    }));

    return { filterOptions, sortOptions };
};
