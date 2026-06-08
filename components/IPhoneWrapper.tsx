"use client"

import { ReactNode, Ref, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface IPhoneWrapperProps {
    children: ReactNode;
    ref?: Ref<HTMLDivElement>;
}

const IPhoneWrapper = ({ children, ref }: IPhoneWrapperProps) => {
    const { resolvedTheme } = useTheme();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const effectiveTheme = hasMounted ? resolvedTheme : "light";

    const iphoneSkeletonSrc = effectiveTheme === "dark" ? "/images/stories/iphone-dark-skeleton.png" : "/images/stories/iphone-light-skeleton.png";
    const iphoneScreenSrc = effectiveTheme === "dark" ? "/images/stories/iphone-dark-background.png" : "/images/stories/iphone-light-background.png";

    return (
            <div ref={ref} className="iphone-wrapper relative w-full h-full flex-center pb-5 overflow-hidden">
                <div className="relative mt-4 h-100 w-50 max-w-full shrink-0">
                    {/* iphone skeleton outline */}
                    <Image
                        src={iphoneSkeletonSrc}
                        alt="iphone-skeleton"
                        fill
                        sizes="200px"
                        className="object-contain pointer-events-none select-none"
                        draggable={false}
                    />
                    {/* iphone screen (time, wifi, battery, bottom bar) */}
                    <div className="absolute inset-2.75 overflow-hidden rounded-3xl">
                        <Image
                            src={iphoneScreenSrc}
                            alt="iphone screen background"
                            fill
                            sizes="200px"
                            className="object-cover pointer-events-none select-none z-5"
                            draggable={false}
                        />
                    </div>
                    {/* screen content */}
                    <div className="absolute inset-0 p-4 z-10">
                        <div className="relative w-full h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default IPhoneWrapper