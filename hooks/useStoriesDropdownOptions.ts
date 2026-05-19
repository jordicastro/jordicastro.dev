"use client";

import { storyFilterLabels, storyFilterOptions, storySortLabels } from "@/constants/constants";
import { useStoriesOptions } from "@/hooks/useStoriesOptions";
import { DropdownOption } from "@/types/types";

type UseStoriesDropdownOptionsProps = {
    onBeforeOptionsChange?: () => void;
};

export const useStoriesDropdownOptions = ({ onBeforeOptionsChange }: UseStoriesDropdownOptionsProps = {}): {
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

            onBeforeOptionsChange?.();
            setActiveFilters(nextActiveFilters);
        },
    }));

    const sortOptions = storySortLabels.map((label) => ({
        id: label,
        label,
        onClick: () => {
            onBeforeOptionsChange?.();
            setActiveSort(label);
        },
    }));

    return { filterOptions, sortOptions };
};
