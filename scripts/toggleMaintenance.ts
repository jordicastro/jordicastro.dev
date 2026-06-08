import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
            'Missing env vars. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY'
    );
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    realtime: {
        transport: WebSocket,
    },
});

async function toggleMaintenance() {
    const currentStatus = await getMaintenanceStatus();

    const { data, error } = await supabaseAdmin
        .from('settings')
        .update({ maintenance_enabled: !currentStatus })
        .eq('id', 1)
        .select('maintenance_enabled')
        .single();

    if (error) {
        console.error('Error toggling maintenance mode in Supabase:', error);
    } else {
        console.log('Successfully toggled maintenance mode in Supabase. New status:', data?.maintenance_enabled);
    }
}

async function getMaintenanceStatus(): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('settings')
        .select('maintenance_enabled')
        .eq('id', 1)
        .single();
        
    if (error) {
        console.error('Error fetching maintenance status from Supabase:', error);
        return false;
    }
    if (!data) {
        console.warn('No rows found in settings table. Falling back to maintenance disabled.');
        return false;
    }

    return data.maintenance_enabled || false;
}

toggleMaintenance();