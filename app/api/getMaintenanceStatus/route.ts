import "server-only";
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('maintenance_enabled')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching maintenance status from Supabase:', error);
            return NextResponse.json(
                { error: error.message, maintenanceEnabled: false },
                { status: 500 }
            );
        }

        if (!data) {
            console.warn('No rows found in settings table. Falling back to maintenance disabled.');
            return NextResponse.json({ maintenanceEnabled: false });
        }

        console.log('Fetched maintenance status from Supabase:', data);

        return NextResponse.json({
            maintenanceEnabled: data?.maintenance_enabled || false
        })

    } catch (error) {
        console.error('Error fetching maintenance status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}