"use client";

import { NavSectionItem } from "@/types/types";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface SidebarSectionProps {
    title: string;
    items: NavSectionItem[];
    activeItem?: string;
}

const SidebarSection = ({ title, items, activeItem }: SidebarSectionProps) => {
    const hoverClass = "text-text-gradient-p";
    return (
        <div className="w-full mt-5">
            {/* top divider */}
            <div className="w-full h-0.5 bg-bg-tertiary" />
            {/* section title */}
            <p className="text-xs text-neutral-400 dark:text-neutral-300 font-medium my-5 tracking-wide">
                {title}
            </p>
            {/* section items */}
            <div className="flex flex-col gap-0">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={twMerge(
                            "group/navItem relative flex w-full h-9 items-center gap-x-7 select-none",
                            `hover:cursor-pointer transition-all duration-200`,
                            activeItem === item.label ? "text-gradient-b dark:text-gradient-p" :  "hover:dark:text-neutral-400 hover:text-neutral-500",
                        )}
                    >
                        {/* abs to fix items-center discrepancy */}
                        <span className={twMerge(
                            `abs-y-center text-inherit`,
                            activeItem === item.label ? "text-[#3b82f6] dark:text-[#c084fc]" : "",
                        )}>
                            {item.icon}
                        </span>
                        <span className="text-sm text-inherit ml-11">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SidebarSection