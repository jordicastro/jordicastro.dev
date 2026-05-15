"use client";

import { storyFilterLabels, storyFilterOptions, storySortLabels } from "@/constants/constants";
import { useStoriesOptions } from "@/hooks/useStoriesOptions";
import { DropdownOption } from "@/types/types";

export const useStoriesDropdownOptions = (): {
    filterOptions: DropdownOption[];
    sortOptions: DropdownOption[];
} => {
    const { activeFilters, setActiveFilters, setActiveSort } = useStoriesOptions();

    const filterOptions = storyFilterOptions.map((option) => ({
        id: option,
        label: storyFilterLabels[option], // convert from "projects" to "Projects" for display
        onClick: () => {
            const nextActiveFilters = activeFilters.includes(option)
                ? activeFilters.filter((activeFilter) => activeFilter !== option)
                : [...activeFilters, option];

            setActiveFilters(nextActiveFilters);
        },
    }));

    const sortOptions = storySortLabels.map((label) => ({
        id: label,
        label,
        onClick: () => {
            setActiveSort(label);
        },
    }));

    return { filterOptions, sortOptions };
};
