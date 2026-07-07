
import { cn } from "@/lib/utils";

interface CodeTextProps {
    text: string;
    className?: string;
}

const CodeText = ({ text, className }: CodeTextProps) => {
    return (
        <code className={cn("bg-bg-secondary px-1.5 py-1 rounded-md font-medium text-sm text-red-code", className)}>
            {text}
        </code>
    )
}

export default CodeText