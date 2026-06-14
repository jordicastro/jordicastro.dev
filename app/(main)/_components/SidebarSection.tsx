"use client";

import { useScrollMask } from "@/hooks/useScrollMask";
import { NavSectionItem } from "@/types/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface SidebarSectionProps {
    title: string;
    items: NavSectionItem[];
}

const SidebarSection = ({ title, items }: SidebarSectionProps) => {
    const { activeSectionId } = useScrollMask();
    const pathname = usePathname();

    // home should be exclusively highlighted on '/' unless the '#stories' section is active
    const adjustedActiveSectionId = pathname === "/" ? (
        activeSectionId === "stories" ? "stories": "home"
    ) : pathname.startsWith("/stories") ? "stories" : undefined;

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
                            `hoverable`,
                            adjustedActiveSectionId === item.id ? "" :  "hoverable-sidebar-items",
                            item.label === "Cursor" && "hidden md:block"
                        )}
                        onClick={item.onClick}
                        data-cursor='pointer'
                    >
                        {/* abs to fix items-center discrepancy */}
                        <span className={twMerge(
                            `abs-y-center text-inherit`,
                            adjustedActiveSectionId === item.id ? "transition-all duration-1000 ease-in-out text-blue dark:text-lavender " : "",
                        )}>
                            {item.icon}
                        </span>
                        <span className={twMerge(
                            "text-sm text-inherit ml-11",
                            adjustedActiveSectionId === item.id ? "transition-all duration-1000 ease-in-out text-gradient-b dark:text-gradient-p" : "",
                        )}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SidebarSection