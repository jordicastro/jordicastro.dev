"use client"

import { cn } from "@/lib/utils";
import { StoryTheme } from "@/types/types";

interface StoryTextProps {
    className?: string;
    title?: string;
    cols?: number;
    columnFill?: "auto" | "balance";
    children: React.ReactNode;
    storyTheme: StoryTheme;
}

const StoryText = ({ className, title, cols = 1, columnFill = "balance", children, storyTheme }: StoryTextProps) => {
    return (
        <div className={cn("w-full h-full flex flex-col items-start justify-start 3xl:gap-10 gap-8", className)}>
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
            <div
                className={cn("story-text-wrapper w-full min-h-0", title && "flex-1", cols === 2 && "lg:columns-2")}
                style={cols > 1 ? { columnFill } : undefined}
            >
                <div className={cn("story-text w-full text-md font-semibold", "text-(" + storyTheme.pText + ")", "font-mono")} style={{ fontFamily: storyTheme.font }}>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default StoryText