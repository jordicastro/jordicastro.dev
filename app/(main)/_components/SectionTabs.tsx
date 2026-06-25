"use client"

import { cn } from "@/lib/utils";
import { StoryTheme, TabSection } from "@/types/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {  } from 'gsap/all';
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

interface SectionTabsProps {
    sections: TabSection[];
    storyTheme?: StoryTheme;
    onSectionChange?: (sectionId: string) => void;
}

const SectionTabs = ({ sections, storyTheme, onSectionChange }: SectionTabsProps) => {
    const scope = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

    // move the active underline to the active section tab after the useState changes
    const { contextSafe } = useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const activeUnderline = gsap.utils.selector(root)(".active-underline");
            const activeSectionTab = gsap.utils.selector(root)('.active-section')[0];

            if (!activeUnderline || !activeSectionTab) return;

            const xDistance = activeSectionTab.offsetLeft;
            const width = activeSectionTab.offsetWidth;

            gsap.to(activeUnderline, {
                x: xDistance,
                width: width,
                duration: 0.3,
                ease: "power2.out"
            });
        },
        {scope, dependencies: [activeSection]}
    )

    const handleClick = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
        // gsap.set clickedTab's className to have 'active-section' and remove it from the other sections
        const clickedTab = e.currentTarget;
        const allTabs = scope.current?.querySelectorAll('.section-tab');
        if (!clickedTab || !allTabs) return;

        allTabs.forEach((tab, i) => {
            if (tab === clickedTab) {
                tab.classList.add('active-section');
                setActiveSection(sections[i].id);
                onSectionChange?.(sections[i].id);
            } else {
                tab.classList.remove('active-section');
            }
        })
    });

    return (
        <div ref={scope} className="section-tabs relative w-auto h-auto flex items-center justify-start gap-4">
            {sections.map((section) => (
                <div
                    key={section.id}
                    className={cn("section-tab cursor-pointer")}
                    role="button"
                    data-cursor="pointer"
                    onClick={handleClick}
                >
                    <p className={cn(
                        "text-[13px] uppercase transition-colors duration-300 ease-out",
                        activeSection === section.id ? "font-extrabold" : "font-bold"
                        )}
                        style={{
                            fontFamily: storyTheme?.font,
                            color: activeSection === section.id
                                ? (storyTheme?.textPrimary ? `var(${storyTheme.textPrimary})` : undefined)
                                : (storyTheme?.pText ? `var(${storyTheme.pText})` : undefined),
                        }}
                    >
                        {section.title}
                    </p>
                </div>
            ))}
            {/* active underline */}
            <div className={cn(
                "active-underline absolute left-0 bottom-0 w-30.5 h-0.5 rounded-full",
                storyTheme?.textPrimary ? 
                    `bg-(${storyTheme.textPrimary})` :
                    "bg-(--sp-blue)",
            )}/>
        </div>
    )
}

export default SectionTabs