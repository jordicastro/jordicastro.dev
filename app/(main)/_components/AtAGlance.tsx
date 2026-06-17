"use client";

import { cn } from "@/lib/utils";
import { GlanceData } from "@/types/types";
import { WheelEvent } from "react";

interface AtAGlanceProps {
    glanceData: GlanceData;
}

const AtAGlance = ({ glanceData }: AtAGlanceProps) => {
    const handleWheelScroll = (e: WheelEvent<HTMLDivElement>) => {
        // Map vertical wheel movement into horizontal scroll for desktop mice.
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className="glance-wrapper w-full h-auto md:h-50 flex flex-col items-start gap-10 overflow-visible">
            <div className="glance-title-wrapper w-auto h-auto overflow-hidden">
                <p
                    className="glance-title uppercase tracking-widest text-sm font-extrabold text-(--sp-blue)"
                    style={{ fontFamily: glanceData.theme.font }}
                >
                    at a glance
                </p>
            </div>
            <div
                className="w-full max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 md:overflow-x-visible [touch-action:pan-x] [-webkit-overflow-scrolling:touch]"
                onWheel={handleWheelScroll}
            >
                <div className="inline-flex min-w-max h-auto lg:mx-10 items-start justify-start gap-10 md:gap-15 pr-8 md:pr-0 snap-x snap-mandatory md:snap-none">
                    {glanceData.items.map( (item, i) => (
                        <div
                            key={i}
                            className="glance-item relative min-w-50 max-w-50 h-25 flex flex-col items-start gap-5 shrink-0 snap-start ml-4 md:ml-0"
                        >
                            <p
                                className={cn("uppercase text-sm tracking-wide font-bold text-text-tertiary", item.titleCN)}
                                style={{ fontFamily: glanceData.theme.font }}
                            >
                                {item.title}
                            </p>
                            {typeof item.description === "string" ? (
                                <p className={cn("text-md font-semibold", item.descriptionCN)} style={{ fontFamily: glanceData.theme.font }}>
                                    {item.description}
                                </p>
                            ) : (
                                <div className={cn("w-full", item.descriptionCN)} style={{ fontFamily: glanceData.theme.font }}>
                                    {item.description}
                                </div>
                            )}
                            { i !== glanceData.items.length - 1 && (
                                <div className="glance-item-divider abs-y-center -right-8.25 w-0.75 h-35 bg-bg-tertiary"/>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default AtAGlance