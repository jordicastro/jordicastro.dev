"use client";

import { useCursor } from "@/hooks/useCursor";
import Navigation from "./_components/Navigation";
import CustomCursor from "./_components/CustomCursor";
import { useEffect, useRef } from "react";
import { useAnonUser } from "@/hooks/useAnonUser";
import LoadingScreen from "@/components/LoadingScreen";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScreenMask from "@/components/ScreenMask";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { cursor } = useCursor();
    const { getAnonId, isResolved } = useAnonUser();
    const mainLayoutScope = useRef<HTMLDivElement>(null);

    useEffect(
        () => { // get anonId from http only cookie, setting local storage just for client visibility
            getAnonId();
        },
        []
    )

    useGSAP( 
        () => {
            if (!isResolved) return;

            const mainLayout = mainLayoutScope.current;
            if (!mainLayout) return;

            gsap.fromTo(mainLayout, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                duration: 0.8,
                ease: "power2.inOut"
            })
        },
        { scope: mainLayoutScope, dependencies: [isResolved]}
    )

    if (!isResolved) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <div
            className="relative flex min-h-svh w-full main-layout"
            ref={mainLayoutScope}
            data-custom-cursor={cursor ? "true" : "false"}
        >
            <CustomCursor />
            <Navigation />
            <main className="w-full min-w-0 overflow-x-clip overflow-y-visible pt-4 px-0 sm:px-4" id="main-content">
                {children}
            </main>
            <ScreenMask />
        </div>
    )
}

export default MainLayout;