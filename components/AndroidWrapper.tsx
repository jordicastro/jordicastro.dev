"use client"

import { ReactNode, Ref } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface AndroidWrapperProps {
    children: ReactNode;
    ref?: Ref<HTMLDivElement>;
}

const AndroidWrapper = ({ children, ref }: AndroidWrapperProps) => {
    const { resolvedTheme } = useTheme();

    const androidScreenFrameSrc = resolvedTheme === "dark" ? "/images/stories/android-dark-background.png" : "/images/stories/android-light-background.png";

    return (
            <div ref={ref} className="android-wrapper relative w-full h-full flex-center pb-5 overflow-hidden">
                <div className="relative mt-4 h-100 aspect-189/398 max-w-full shrink-0">
                    {/* android frame + screen*/}
                        <Image
                            src={androidScreenFrameSrc}
                            alt="android screen background"
                            fill
                            sizes="200px"
                            className="object-contain pointer-events-none select-none z-5"
                            draggable={false}
                        />
                    {/* screen content */}
                    <div className="absolute inset-0 px-4 py-8 z-10">
                        <div className="relative w-full h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default AndroidWrapper