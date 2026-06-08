"use client";

import { useCursor } from "@/hooks/useCursor";
import Navigation from "./_components/Navigation";
import CustomCursor from "./_components/CustomCursor";
import { useEffect } from "react";
import { useAnonUser } from "@/hooks/useAnonUser";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { cursor } = useCursor();
    const { isLoading, getAnonId } = useAnonUser();

    useEffect(
        () => {
            // get anonId from http only cookie, setting local storage just for client visibility
            getAnonId();
        },
        []
    )

    return (
        <div
            className="flex min-h-svh w-full"
            data-custom-cursor={cursor ? "true" : "false"}
        >
            <CustomCursor />
            <Navigation />
            <main className="w-full min-w-0 overflow-x-clip overflow-y-visible pt-4 px-4" id="main-content">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;