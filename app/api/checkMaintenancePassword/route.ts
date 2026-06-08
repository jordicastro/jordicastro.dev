import "server-only";

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';
import {
    issueMaintenanceAccessToken,
    MAINTENANCE_COOKIE_MAX_AGE_SECONDS,
    MAINTENANCE_COOKIE_NAME,
} from '@/lib/cookies';
import argon2 from 'argon2';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // get maintenance_pasword and expires_at
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('maintenance_password_hash, expires_at')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching maintenance password from Supabase:', error);
            return NextResponse.json(
                { error: error.message, isCorrect: false },
                { status: 500 }
            );
        }
        if (!data) {
            console.warn('No rows found in settings table. Falling back to maintenance disabled.');
            return NextResponse.json({ isCorrect: false });
        }

        // compare the password to the hashed password in the database
        // ensure the current time is before expires_at
        const now = new Date();
        if (data.expires_at && new Date(data.expires_at) < now) {
            console.warn('Maintenance password has expired.');
            return NextResponse.json({ isCorrect: false });
        }

        try {
            if (await argon2.verify(data.maintenance_password_hash, password)) {
                const signedToken = await issueMaintenanceAccessToken();

                if (!signedToken) {
                    console.error('MAINTENANCE_COOKIE_SECRET is missing; cannot issue maintenance access cookie.');
                    return NextResponse.json(
                        { error: 'Server cookie secret is not configured', isCorrect: false },
                        { status: 500 }
                    );
                }

                const response = NextResponse.json({ isCorrect: true });
                response.cookies.set({
                    name: MAINTENANCE_COOKIE_NAME,
                    value: signedToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: MAINTENANCE_COOKIE_MAX_AGE_SECONDS,
                });

                return response;
            } else {
                return NextResponse.json({ isCorrect: false });
            }
        } catch (error) {
            console.error('Error verifying password:', error);
            return NextResponse.json({ error: 'Error verifying password', isCorrect: false }, { status: 500 });
        }

    } catch (error) {
        console.error('Error checking maintenance password:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage, isCorrect: false }, { status: 500 });
    }
}