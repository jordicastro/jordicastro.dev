"use client";

import { useRouter } from 'next/navigation';
import React from 'react'
import LogoBounce from './_components/LogoBounce';
import { useMaintenance } from '@/hooks/useMaintenance';

const MaintenancePage = () => {
    const router = useRouter();
    const { checkPassword } = useMaintenance();

    const isCorrectPassword = async (password: string): Promise<boolean> => {
        // check password calls the /api route, which sets a signed cookie if the password is correct. Preventing future access related db calls for the remainder of the user's visit
        return checkPassword(password);
    }
    const onComplete = () => {
        router.push("/");
    }

    return (
        <main id="maintenance" className="h-svh w-full overflow-hidden">
            <LogoBounce onComplete={onComplete} isCorrectPassword={isCorrectPassword} />
        </main>
    )
}

export default MaintenancePage