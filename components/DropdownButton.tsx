"use client";

import { optionHoverCn } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { DropdownOption, FilterOption } from "@/types/types";
import { LucideIcon, Square, SquareCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useStoriesOptions } from "@/hooks/useStoriesOptions";


interface DropdownButtonProps {
    label: string;
    icon: LucideIcon;
    options: DropdownOption[];
    checkBoxes?: boolean;
    className?: string;
}

const DropdownButton = ({ label, icon: Icon, options, checkBoxes=false, className }: DropdownButtonProps) => {
    const dropdownPositionCn = "abs-x-center -bottom-42 sm:-bottom-52"
    const scopeRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isPinnedOpen, setIsPinnedOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const isOpen = isPinnedOpen || isHovering;

    gsap.registerPlugin(useGSAP);

    useGSAP(
        () => {
            gsap.set(dropdownRef.current, { autoAlpha: 0, y: -10 });
        },
        []
    );

    useEffect(() => {
        gsap.to(dropdownRef.current, {
            autoAlpha: isOpen ? 1 : 0,
            y: isOpen ? 0 : -10,
            duration: 0.2,
            ease: isOpen ? "power1.out" : "power1.in",
            overwrite: true,
        });
    }, [isOpen]);

    useEffect(() => {
        if (!isPinnedOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!scopeRef.current?.contains(event.target as Node)) {
                setIsPinnedOpen(false);
                setIsHovering(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isPinnedOpen]);

    const handleClick = () => {
        setIsPinnedOpen((prevIsPinnedOpen) => !prevIsPinnedOpen);
        setIsHovering(true);
    };

    return (
        <div
            className="relative w-auto h-auto"
            ref={scopeRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div
                className={cn(
                    "w-auto h-auto flex-center gap-5 cursor-pointer transition-colors ease-in-out duration-400",
                    className,
                    isOpen ? "text-text-primary" : "text-text-secondary"
                )}
                role="button"
                onClick={handleClick}
                data-cursor="pointer"
            >
                <Icon className="w-5 h-5" />
                <p className="text-inherit">
                    {label}
                </p>
            </div>
            <DropdownMenu options={options} className={dropdownPositionCn} checkBoxes={checkBoxes} dropdownRef={dropdownRef} label={label} />
        </div>
    )
}

interface DropdownMenuProps {
    options: DropdownOption[];
    checkBoxes?: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    label: "Filter" | "Sort" | string;
    className?: string;
}

const DropdownMenu = ({ options, checkBoxes, dropdownRef, label, className }: DropdownMenuProps ) => {
    const { activeFilters, activeSort } = useStoriesOptions();
    const checkBoxCn = "w-5 h-5"

    const isSort = label === "Sort";
    const activeOption = isSort ? activeSort : null;
    const activeCheckBoxes = isSort ? [] : activeFilters;
    const isChecked = (optionId: DropdownOption["id"]) => {
        return !isSort && activeCheckBoxes.includes(optionId as FilterOption);
    };

    return (
        <div ref={dropdownRef} className={cn(
            "w-[150px] h-[133px] sm:w-[150px] sm:h-[200px] dropdownMenu-wrapper rounded-lg bg-bg-secondary flex flex-col items-start justify-start gap-0 px-2 py-3 backdrop-blur shadow-lg z-80",
            "border border-neutral-300 bg-white/85 dark:border-neutral-800 dark:bg-neutral-900/85",
            className
        )}>
            {options.map((option) => (
                <button
                    key={option.id}
                    className={cn(
                        "dropdown-option w-full h-9 text-left text-sm text-text-secondary flex flex-row items-center justify-start gap-3",
                        optionHoverCn,
                        "group/option"
                        
                    )}
                    onClick={option.onClick}
                    data-cursor="pointer"
                >
                    {checkBoxes && (
                        <div className="check-box-wrapper shrink-0 group-hover/option:text-neutral-600 transition-all duration-250 ease-out">
                            <Square className={cn(
                                checkBoxCn,
                                isChecked(option.id) ? "hidden" : "block"
                            )}/>
                            <SquareCheck className={cn(
                                checkBoxCn,
                                isChecked(option.id) ? "block" : "hidden"
                            )}/>
                        </div>
                    )}  
                    <p className={cn(
                        "min-w-0 flex-1 truncate text-sm transition-all duration-250 ease-out",
                        activeOption === option.id ? "text-blue-600" : "text-text-secondary group-hover/option:text-neutral-600 "
                    )}>
                        {option.label}
                    </p>
                </button>
            ))}
        </div>
    )
}

export default DropdownButton