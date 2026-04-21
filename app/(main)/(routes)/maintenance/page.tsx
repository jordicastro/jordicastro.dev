"use client";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React from 'react'

const MaintenancePage = () => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated, isLoading, setIsLoading } = useAuth();

    return (
        <div>
            Maintenance Page
        </div>
    )
}

export default MaintenancePage