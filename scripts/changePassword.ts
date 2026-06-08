import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import argon2 from 'argon2';
import crypto from 'crypto';
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

async function changeMaintenancePassword() {
    const password = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await argon2.hash(password);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // expires in 24 hours

    const { data, error } = await supabaseAdmin
        .from('settings')
        .update({
            maintenance_password_hash: hashedPassword,
            expires_at: expiresAt.toISOString(),
            updated_at: now.toISOString(),
        })
        .eq('id', 1);

    if (error) {
        console.error('Error updating maintenance password in Supabase:', error);
    } else {
        console.log('Successfully updated maintenance password in Supabase');
    }
    console.log('New maintenance password:', password)
    console.log('the hash is:', hashedPassword)
}

changeMaintenancePassword();