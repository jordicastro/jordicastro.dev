"use client"

import { cn } from "@/lib/utils";

interface CodeBlockProps {
    children: React.ReactNode;
    description?: string;
    absolute?: string;
    className?: string;
}

const CodeBlock = ({ children, description, absolute, className }: CodeBlockProps) => {
    return (
        <div className={cn("w-full min-w-0 flex flex-col items-center gap-2", absolute)}>
            <div className={cn("min-w-0 h-auto bg-bg-secondary/50 border border-bg-secondary rounded-md p-4", className, "w-full max-w-130")}>
                <code className="block w-max min-w-130 h-auto font-medium text-sm text-text-secondary">
                    {children}
                </code>
            </div>

            {description && (
                <div className="max-w-130 w-full h-auto">
                    <p className="text-sm italic text-text-tertiary">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )
}

export default CodeBlock