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
        <div className={cn("flex flex-col gap-2", absolute)}>
            <div className={cn("w-full h-auto bg-bg-secondary/50 border border-bg-secondary rounded-md p-4", className)}>
                <code className="w-full h-auto font-medium text-sm text-text-secondary">
                    {children}
                </code>
            </div>

            {description && (
                <div className="w-full h-auto">
                    <p className="text-sm italic text-text-tertiary">
                        {description}
                    </p>
                </div>
            )}
        </div>
    )
}

export default CodeBlock