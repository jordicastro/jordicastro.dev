"use client";

import { useCursor } from "@/hooks/useCursor";
import Navigation from "./_components/Navigation";
import CustomCursor from "./_components/CustomCursor";
import { useEffect, useRef } from "react";
import { useAnonUser } from "@/hooks/useAnonUser";
import LoadingScreen from "@/components/LoadingScreen";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { cursor } = useCursor();
    const { isLoading, getAnonId, isResolved } = useAnonUser();
    const loadingScope = useRef<HTMLDivElement>(null);

    useEffect(
        () => { // get anonId from http only cookie, setting local storage just for client visibility
            getAnonId();
        },
        []
    )

    if (!isResolved) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <div
            className="flex min-h-svh w-full"
            data-custom-cursor={cursor ? "true" : "false"}
        >
            <CustomCursor />
            <Navigation />
            <main className="w-full min-w-0 overflow-x-clip overflow-y-visible pt-4 px-0 sm:px-4" id="main-content">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;