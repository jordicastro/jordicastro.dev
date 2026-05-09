"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCursor } from "@/hooks/useCursor";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";
import CustomCursor from "./_components/CustomCursor";
import ScrollMask from "@/components/ScrollMask";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useAuth(); // replace this with the server Auth when db is set up
    const { cursor } = useCursor();

    // if (isLoading) { // show spinning logo or something
    //     return (
    //         <div className="h-svh w-full flex-center">
    //             Loading...
    //         </div>
    //     )
    // }

    // if (!isAuthenticated) {
    //     return redirect("/maintenance");
    // }

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