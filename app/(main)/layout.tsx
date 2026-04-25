"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import Navigation from "./_components/Navigation";

const MainLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useAuth(); // replace this with the server Auth when db is set up

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
        <div className="w-full h-full flex">
            <Navigation />
            <main className="w-full pt-4 px-4">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;