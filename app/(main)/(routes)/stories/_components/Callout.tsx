"use client"

import { cn } from "@/lib/utils";
import { StoryTheme } from "@/types/types";
import { LucideIcon } from "lucide-react";

interface CalloutProps {
    icon: string;
    text: string;
    className?: string;
    textCN?: string;
    theme: StoryTheme;
}

const Callout = ({ icon, text, className, textCN, theme}: CalloutProps) => {
  return (
    <div className={cn("callout w-full h-20 bg-bg-secondary rounded-lg flex items-center justify-start gap-8 px-6 py-2", className)}>
        <span
            className={cn(
                "text-3xl sm:text-4xl"
            )}
        >
            {icon}
        </span>
        <p
            className={cn(
                "text-xl xs:text-2xl sm:text-3xl font-semibold tracking-wide text-text-primary/90",
                textCN
            )}
            style={{ fontFamily: theme.font }}
        >
            {text}
        </p>
    </div>
  )
}

export default Callout