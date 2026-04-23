"use client";

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

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
        <div>
            sidebar
            {children}
        </div>
    )
}

export default MainLayout;