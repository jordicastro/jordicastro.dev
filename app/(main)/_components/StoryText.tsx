"use client"

import { cn } from "@/lib/utils";
import { StoryTheme } from "@/types/types";

interface StoryTextProps {
    className?: string;
    title?: string;
    cols?: number;
    children: React.ReactNode;
    storyTheme: StoryTheme;
}

const StoryText = ({ className, title, cols, children, storyTheme }: StoryTextProps) => {
    return (
        <div className={cn("w-full flex flex-col items-start justify-start gap-10", className)}>
            {title && (
                <p className={cn(
                    "uppercase tracking-widest text-sm font-extrabold",
                    "text-(" + storyTheme.textPrimary + ")",
                    title + "-title"
                )}
                    style={{ fontFamily: storyTheme.font }}
                >
                    {title}
                </p>
            )}
            <div className={cn("story-text-wrapper w-full h-auto", cols === 2 ? "columns-2" : "columns-1")}>
                <div className={cn("story-text w-full h-auto text-md font-semibold", "text-(" + storyTheme.pText + ")", "font-mono")} style={{ fontFamily: storyTheme.font }}>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default StoryText