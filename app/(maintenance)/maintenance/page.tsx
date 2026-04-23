"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import LogoBounce from './_components/LogoBounce';
import { useMount } from '@/hooks/useMount';

const MaintenancePage = () => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } = useAuth();

    useEffect(() => {
        // check if user is authenticated
        const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
        if (storedIsAuthenticated && storedIsAuthenticated === "true") {
            setIsAuthenticated(true);
            router.replace("/");
        }
    }, []);

    const onComplete = () => {
        // update auth state
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("authenticatedAt", new Date().getTime().toString());
        setIsAuthenticated(true);
        // navigate to home page
        router.replace("/");
    }

    return (
        <main id="maintenance" className="h-svh w-full overflow-hidden">
            <LogoBounce onComplete={onComplete}/>
        </main>
    )
}

export default MaintenancePage